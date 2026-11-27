import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  asteriskDef,
  earthDef,
  flowerRedDef,
  flowerYellowDef,
  lightningBoltDef,
  pinkDinoDef,
  redCrabDef,
  sixStarDef,
  solidStarDef,
  spiralDef,
  starOutlineDef,
  starfishDef,
  sunBurstDef,
  toSvgString,
} from "trazo-stickers/svg";
import {
  AppBadgeSticker,
  CoffeeSticker,
  PeaceHandSticker,
} from "stick-it-up";

const OUTPUT_DIR = path.resolve(process.cwd(), "public/images/stickers");

const TRAZO_STICKERS = [
  sunBurstDef,
  solidStarDef,
  starfishDef,
  lightningBoltDef,
  flowerRedDef,
  sixStarDef,
  pinkDinoDef,
  flowerYellowDef,
  redCrabDef,
  spiralDef,
  asteriskDef,
  starOutlineDef,
  earthDef,
];

const STICK_IT_UP_STICKERS = [
  { id: "peace-hand", Component: PeaceHandSticker, width: 289, height: 301 },
  { id: "coffee", Component: CoffeeSticker, width: 464, height: 464 },
  { id: "app-badge", Component: AppBadgeSticker, width: 505, height: 246 },
];

function cleanTrazoSvg(def) {
  const raw = toSvgString(def, { size: 256 });
  return raw.replace(/\s+aria-hidden="true"/, "");
}

function cleanStickItUpSvg({ Component, width, height }) {
  const rendered = renderToStaticMarkup(
    React.createElement(Component, { width, height }),
  );

  // Normalize React useId() suffixes on SVG filter definitions so output is deterministic.
  let svg = rendered.replace(/filter0_d_43_72_[^"')]+/g, "filter0_d_43_72");

  // Strip React wrapper attributes from the root <svg> element while preserving viewBox, width, height, fill, xmlns.
  svg = svg.replace(/^<svg\b[^>]*>/, (openTag) =>
    openTag
      .replace(/\s+class="[^"]*"/g, "")
      .replace(/\s+style="[^"]*"/g, "")
      .replace(/\s+aria-label="[^"]*"/g, "")
      .replace(/\s+role="[^"]*"/g, ""),
  );

  return svg;
}

function validateSvg(id, svg) {
  if (!svg.startsWith("<svg ") || !svg.endsWith("</svg>")) {
    throw new Error(`Invalid SVG envelope for ${id}`);
  }
  if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    throw new Error(`Missing xmlns attribute for ${id}`);
  }
  if (!svg.includes("viewBox=")) {
    throw new Error(`Missing viewBox attribute for ${id}`);
  }
  if (/currentColor/i.test(svg)) {
    throw new Error(`Unexpected currentColor found in ${id}`);
  }
  if (/var\(/i.test(svg)) {
    throw new Error(`Unexpected CSS variable found in ${id}`);
  }
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const results = [];

for (const def of TRAZO_STICKERS) {
  const svg = cleanTrazoSvg(def);
  validateSvg(def.id, svg);
  const outPath = path.join(OUTPUT_DIR, `${def.id}.svg`);
  fs.writeFileSync(outPath, `${svg}\n`, "utf8");
  const rawBytes = Buffer.byteLength(svg + "\n", "utf8");
  const gzBytes = zlib.gzipSync(svg + "\n", { level: 9 }).length;
  results.push({ id: def.id, source: "trazo-stickers", rawBytes, gzBytes });
}

for (const entry of STICK_IT_UP_STICKERS) {
  const svg = cleanStickItUpSvg(entry);
  validateSvg(entry.id, svg);
  const outPath = path.join(OUTPUT_DIR, `${entry.id}.svg`);
  fs.writeFileSync(outPath, `${svg}\n`, "utf8");
  const rawBytes = Buffer.byteLength(svg + "\n", "utf8");
  const gzBytes = zlib.gzipSync(svg + "\n", { level: 9 }).length;
  results.push({ id: entry.id, source: "stick-it-up", rawBytes, gzBytes });
}

let totalRaw = 0;
let totalGz = 0;
for (const row of results) {
  totalRaw += row.rawBytes;
  totalGz += row.gzBytes;
  console.log(
    `${row.id.padEnd(16)} (${row.source.padEnd(14)})  raw: ${String(row.rawBytes).padStart(6)} B  gz: ${String(row.gzBytes).padStart(6)} B`,
  );
}
console.log(
  `TOTAL (${results.length} SVGs)                   raw: ${String(totalRaw).padStart(6)} B  gz: ${String(totalGz).padStart(6)} B`,
);
