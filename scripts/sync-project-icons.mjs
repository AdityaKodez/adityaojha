import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { parse } from "parse5";
import sharp from "sharp";

import { projectsConfig } from "../config/projects.ts";

const iconDirectory = new URL("../public/images/project-favicons/", import.meta.url);
const manifestFile = new URL("../config/project-favicons.generated.json", import.meta.url);
const previous = JSON.parse(await readFile(manifestFile, "utf8"));
const maxResponseBytes = 2 * 1024 * 1024;

async function replaceFile(target, contents) {
  const temporary = new URL(`${target.href}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, contents, { flag: "wx" });
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function fetchAsset(url) {
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error(`Unsupported URL protocol ${url.protocol}`);
  }

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`${response.status} at ${response.url}`);
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > maxResponseBytes) {
      throw new Error(`Response exceeds ${maxResponseBytes} bytes at ${response.url}`);
    }
    chunks.push(chunk);
  }

  return { url: response.url, bytes: Buffer.concat(chunks, size) };
}

async function findIconUrls(liveUrl) {
  const urls = [];
  let pageUrl = liveUrl;

  try {
    const page = await fetchAsset(new URL(liveUrl));
    pageUrl = page.url;
    const document = parse(page.bytes.toString("utf8"));
    const html = document.childNodes.find((node) => node.nodeName === "html");
    const head = html.childNodes.find((node) => node.nodeName === "head");
    const baseHref = head.childNodes
      .filter((node) => node.nodeName === "base")
      .flatMap((node) => node.attrs)
      .find((attr) => attr.name === "href")?.value;
    const baseUrl = URL.parse(baseHref ?? "", pageUrl) ?? pageUrl;

    const links = head.childNodes
      .filter((node) => node.nodeName === "link")
      .map((node) => Object.fromEntries(node.attrs.map(({ name, value }) => [name, value])))
      .reverse();

    for (const relation of ["icon", "apple-touch-icon"]) {
      for (const { rel, href } of links) {
        if (!href || !rel?.toLowerCase().split(/\s+/).includes(relation)) continue;
        const url = URL.parse(href, baseUrl);
        if (url && ["https:", "http:"].includes(url.protocol)) urls.push(url.href);
      }
    }
  } catch (error) {
    console.warn(`Could not read icon declarations for ${liveUrl}. ${error.message}`);
  }

  urls.push(new URL("/favicon.ico", pageUrl).href);
  return [...new Set(urls)];
}

async function syncIcon(project) {
  const failures = [];

  for (const href of await findIconUrls(project.liveUrl)) {
    try {
      const { bytes } = await fetchAsset(new URL(href));
      const isIco = bytes.length >= 22 &&
        bytes.readUInt32LE(0) === 0x00010000 && bytes.readUInt16LE(4) > 0;
      const icon = isIco
        ? bytes
        : await sharp(bytes, { limitInputPixels: 4_194_304 })
          .resize(48, 48, { fit: "contain", background: "transparent" })
          .png()
          .toBuffer();
      const filename = `${project.id}.${isIco ? "ico" : "png"}`;
      await replaceFile(new URL(filename, iconDirectory), icon);
      console.log(`${project.title}: ${href} → ${filename}`);
      return [project.id, `/images/project-favicons/${filename}`];
    } catch (error) {
      failures.push(error.message);
    }
  }

  process.exitCode = 1;
  const existing = previous[project.id];
  console.warn(`${project.title}: ${existing ? "Keeping the saved icon" : "Using the folder icon"}. ${failures.join(". ")}`);
  return [project.id, existing];
}

await mkdir(iconDirectory, { recursive: true });
const entries = await Promise.all(projectsConfig.map(syncIcon));
const manifest = Object.fromEntries(entries.filter(([, src]) => src));
await replaceFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
