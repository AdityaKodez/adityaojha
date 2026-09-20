// Server-only reader for the registry catalog at the project root.
//
// The component detail page uses this to show the real source of a registry
// item instead of telling readers to go find the file on GitHub. Sources are
// read from disk rather than from `public/r/*.json` so the page never lags
// behind an edit that has not been through `npm run registry:build` yet.

import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { highlightCode } from "@/lib/highlight";

type RegistryFileEntry = {
  path: string;
  target?: string;
  type?: string;
};

type RegistryItem = {
  name: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFileEntry[];
};

type RegistryCatalog = {
  items?: RegistryItem[];
};

export type RegistrySourceFile = {
  /** Path in this repository, also the suggested destination in a consumer project. */
  path: string;
  /** Language passed to Shiki. */
  lang: string;
  /** Raw source, used for clipboard copy. */
  raw: string;
  /** Pre-rendered highlighted markup. */
  html: string;
};

export type RegistrySource = {
  dependencies: string[];
  registryDependencies: string[];
  /** Code files, highlighted and ready to paste. */
  files: RegistrySourceFile[];
  /** Non-code files an item ships (icons, images) — listed by path only. */
  assets: string[];
};

const CODE_LANGS: Record<string, string> = {
  ".tsx": "tsx",
  ".ts": "ts",
  ".jsx": "jsx",
  ".js": "js",
  ".css": "css",
  ".json": "json",
};

// The catalog is cached for the life of the process in production only. In dev
// every call re-reads it, because the module-level cache would otherwise pin a
// registry.json from before the server started and no HMR event clears it.
let catalogPromise: Promise<RegistryCatalog> | null = null;
const cacheCatalog = process.env.NODE_ENV === "production";

function readCatalog(): Promise<RegistryCatalog> {
  if (catalogPromise) return catalogPromise;

  const request = readFile(
    path.join(/*turbopackIgnore: true*/ process.cwd(), "registry.json"),
    "utf8",
  ).then((raw) => JSON.parse(raw) as RegistryCatalog);

  if (cacheCatalog) catalogPromise = request;
  return request;
}

/**
 * Source of one registry item, or null when the id is not published. Callers
 * render nothing in that case: a component can exist in the showcase without
 * being installable.
 */
export async function getRegistrySource(
  id: string,
): Promise<RegistrySource | null> {
  const catalog = await readCatalog();
  const item = catalog.items?.find((entry) => entry.name === id);
  if (!item) return null;

  const entries = item.files ?? [];
  const assets: string[] = [];
  const codeEntries: Array<{ entry: RegistryFileEntry; lang: string }> = [];

  for (const entry of entries) {
    const lang = CODE_LANGS[path.extname(entry.path).toLowerCase()];
    if (lang) {
      codeEntries.push({ entry, lang });
    } else {
      assets.push(entry.target ?? entry.path);
    }
  }

  const files = await Promise.all(
    codeEntries.map(async ({ entry, lang }) => {
      const raw = await readFile(
        path.join(/*turbopackIgnore: true*/ process.cwd(), entry.path),
        "utf8",
      );
      return {
        path: entry.target ?? entry.path,
        lang,
        raw,
        html: await highlightCode(raw, lang),
      } satisfies RegistrySourceFile;
    }),
  );

  return {
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
    assets,
  };
}
