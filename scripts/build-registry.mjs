import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "registry.json");
const publicRDir = path.join(root, "public", "r");

mkdirSync(publicRDir, { recursive: true });

const registry = JSON.parse(readFileSync(registryPath, "utf-8"));

// 1. Output public/r/registry.json
writeFileSync(
  path.join(publicRDir, "registry.json"),
  JSON.stringify(registry, null, 2),
  "utf-8"
);

console.log("Emitted public/r/registry.json");

// 2. Output each item to public/r/<name>.json
for (const item of registry.items) {
  const itemWithContent = {
    ...item,
    files: item.files.map((file) => {
      const filePath = path.join(root, file.path);
      const content = readFileSync(filePath, "utf-8");
      return {
        path: file.path,
        content,
        type: file.type || "registry:ui",
      };
    }),
  };

  const itemOutput = path.join(publicRDir, `${item.name}.json`);
  writeFileSync(itemOutput, JSON.stringify(itemWithContent, null, 2), "utf-8");
  console.log(`Emitted public/r/${item.name}.json`);
}

console.log(`Successfully built ${registry.items.length} registry items.`);
