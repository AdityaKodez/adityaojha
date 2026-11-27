import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const iconsDir = path.join(root, "node_modules", "scribbles-icons", "dist", "icons");
const outDir = path.join(root, "public", "icons");

// Split sprites by surface so `/` only preloads the 14 icons it actually uses
// (~35 KB gz instead of ~173 KB gz). 14 unused legacy glyphs were pruned.
const SPRITES = {
  "site-icons": [
    { name: "ArrowBigDown", weight: "fill" },
    { name: "ArrowBigUp", weight: "fill" },
    { name: "ArrowUpRight", weight: "fill" },
    { name: "BookmarkCheck", weight: "fill" },
    { name: "Copy", weight: "fill" },
    { name: "MessageCircle", weight: "fill" },
    { name: "Moon", weight: "fill" },
    { name: "Plus", weight: "fill" },
    { name: "Search", weight: "bold" },
    { name: "Star", weight: "fill" },
    { name: "Sun", weight: "fill" },
    { name: "TrendingDown", weight: "fill" },
    { name: "TrendingUp", weight: "fill" },
    { name: "X", weight: "fill" },
  ],
  "sponsor-icons": [
    { name: "Armchair", weight: "fill" },
    { name: "ArrowRight", weight: "fill" },
    { name: "Check", weight: "fill" },
    { name: "CircleAlert", weight: "fill" },
    { name: "Coffee", weight: "fill" },
    { name: "FlaskConical", weight: "fill" },
    { name: "HandHeart", weight: "fill" },
    { name: "Heart", weight: "fill" },
    { name: "LoaderCircle", weight: "fill" },
    { name: "LockKeyhole", weight: "fill" },
    { name: "PartyPopper", weight: "fill" },
    { name: "PenLine", weight: "fill" },
    { name: "Receipt", weight: "fill" },
    { name: "Sparkles", weight: "fill" },
    { name: "Upload", weight: "fill" },
  ],
  "extra-icons": [
    { name: "ArrowLeft", weight: "fill" },
    { name: "ChevronDown", weight: "fill" },
    { name: "Code", weight: "fill" },
    { name: "CodeXml", weight: "fill" },
    { name: "Contrast", weight: "fill" },
    { name: "FolderOpen", weight: "fill" },
    { name: "HeartHandshake", weight: "fill" },
    { name: "House", weight: "fill" },
    { name: "ImagePlus", weight: "fill" },
    { name: "Layers", weight: "fill" },
    { name: "Link", weight: "fill" },
    { name: "MessageSquareQuote", weight: "fill" },
    { name: "Monitor", weight: "fill" },
    { name: "RotateCcw", weight: "fill" },
    { name: "Send", weight: "fill" },
    { name: "ShieldCheck", weight: "fill" },
    { name: "Sparkle", weight: "fill" },
    { name: "Terminal", weight: "fill" },
  ],
};

function toKebabId(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
    .toLowerCase();
}

function extractWeightPath(source, iconName, weight) {
  const match = source.match(new RegExp(`"${weight}"\\s*:\\s*"([^"]+)"`));
  if (!match) {
    throw new Error(`Could not find weight "${weight}" in ${iconName}.js`);
  }
  return match[1];
}

function formatTenths(tenths) {
  const neg = tenths < 0;
  const abs = Math.abs(tenths);
  const whole = Math.floor(abs / 10);
  const frac = abs % 10;
  if (frac === 0) return `${neg ? "-" : ""}${whole}`;
  if (whole === 0) return `${neg ? "-." : "."}${frac}`;
  return `${neg ? "-" : ""}${whole}.${frac}`;
}

function joinNumbers(nums) {
  let out = "";
  for (let i = 0; i < nums.length; i++) {
    const str = formatTenths(nums[i]);
    if (i > 0 && !str.startsWith("-")) {
      out += " ";
    }
    out += str;
  }
  return out;
}

// Round absolute coordinates to 1 decimal place (integer tenths on 256x256,
// < 0.05px max delta) and encode consecutive segments as relative commands in
// exact tenths so there is zero accumulated drift while shrinking gzip size ~3x.
function compactPathData(d, iconName) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+/g);
  if (!tokens) {
    throw new Error(`Empty path data in ${iconName}.js`);
  }

  let i = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let prevCmd = "";
  let out = "";

  const readTenths = () => {
    const val = Number(tokens[i++]);
    if (!Number.isFinite(val)) {
      throw new Error(`Invalid coordinate in ${iconName}.js at token ${i}`);
    }
    return Math.round(val * 10);
  };

  while (i < tokens.length) {
    let cmd = tokens[i];
    if (/^[A-Za-z]$/.test(cmd)) {
      i++;
    } else {
      cmd = prevCmd === "M" ? "L" : prevCmd;
    }

    if (cmd === "M") {
      const x = readTenths();
      const y = readTenths();
      out += `M${joinNumbers([x, y])}`;
      cx = x;
      cy = y;
      sx = x;
      sy = y;
      prevCmd = "M";
    } else if (cmd === "C") {
      const x1 = readTenths();
      const y1 = readTenths();
      const x2 = readTenths();
      const y2 = readTenths();
      const x = readTenths();
      const y = readTenths();
      const rel = [x1 - cx, y1 - cy, x2 - cx, y2 - cy, x - cx, y - cy];
      const prefix = prevCmd === "C" ? (rel[0] < 0 ? "" : " ") : "c";
      out += `${prefix}${joinNumbers(rel)}`;
      cx = x;
      cy = y;
      prevCmd = "C";
    } else if (cmd === "L") {
      const x = readTenths();
      const y = readTenths();
      const rel = [x - cx, y - cy];
      const prefix = prevCmd === "L" ? (rel[0] < 0 ? "" : " ") : "l";
      out += `${prefix}${joinNumbers(rel)}`;
      cx = x;
      cy = y;
      prevCmd = "L";
    } else if (cmd === "Z" || cmd === "z") {
      out += "Z";
      cx = sx;
      cy = sy;
      prevCmd = "Z";
    } else {
      throw new Error(`Unsupported SVG command "${cmd}" in ${iconName}.js`);
    }
  }

  return out;
}

mkdirSync(outDir, { recursive: true });

for (const [spriteName, icons] of Object.entries(SPRITES)) {
  const symbols = icons.map(({ name, weight }) => {
    const filePath = path.join(iconsDir, `${name}.js`);
    const source = readFileSync(filePath, "utf-8");
    const rawPath = extractWeightPath(source, name, weight);
    const d = compactPathData(rawPath, name);
    const id = toKebabId(name);
    return `<symbol id="${id}" viewBox="0 0 256 256"><path d="${d}"/></symbol>`;
  });

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>\n`;
  const outputPath = path.join(outDir, `${spriteName}.svg`);
  writeFileSync(outputPath, sprite, "utf-8");

  const rawBytes = Buffer.byteLength(sprite, "utf-8");
  const gzBytes = gzipSync(sprite, { level: 9 }).byteLength;

  console.log(
    `Emitted public/icons/${spriteName}.svg (${icons.length} icons, ${(rawBytes / 1024).toFixed(1)} KB raw, ${(gzBytes / 1024).toFixed(1)} KB gz)`,
  );
}
