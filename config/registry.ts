/**
 * Single source of truth for the shadcn registry published by this site.
 *
 * `registry.json` (project root) is the build input; `npm run registry:build`
 * compiles it into `public/r/*.json`, which is what `npx shadcn add` fetches.
 *
 * Kept free of any React imports so client components can use it without
 * pulling the icon sets that `config/site.ts` depends on.
 */

export const siteUrl = "https://akoder.xyz";

export const registryConfig = {
  /** Namespace users configure in their own `components.json`. */
  namespace: "@akoder",
  /** `name` field of `registry.json`. */
  name: "akoder",
  /** Index consumed by `shadcn search` / `shadcn view`. */
  indexUrl: `${siteUrl}/r/registry.json`,
  /** Direct-item URL pattern. */
  itemUrlPattern: `${siteUrl}/r/{name}.json`,
} as const;

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
];

/** Runner prefix per package manager for `shadcn` CLI invocations. */
const RUNNERS: Record<PackageManager, string> = {
  npm: "npx shadcn@latest",
  pnpm: "pnpm dlx shadcn@latest",
  yarn: "yarn dlx shadcn@latest",
  bun: "bunx --bun shadcn@latest",
};

/** Install prefix per package manager for plain npm dependencies. */
const INSTALLERS: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

/**
 * Per-package-manager install commands for a registry item's npm dependencies.
 * Returns null when the item has none, so callers can skip the block entirely.
 */
export function getDependencyCommands(
  dependencies: readonly string[],
): Record<PackageManager, string> | null {
  if (dependencies.length === 0) return null;
  const packages = dependencies.join(" ");
  return {
    npm: `${INSTALLERS.npm} ${packages}`,
    pnpm: `${INSTALLERS.pnpm} ${packages}`,
    yarn: `${INSTALLERS.yarn} ${packages}`,
    bun: `${INSTALLERS.bun} ${packages}`,
  };
}

/**
 * Per-package-manager `shadcn add` commands for the shadcn primitives an item
 * depends on (`registryDependencies`). Returns null when there are none.
 */
export function getPrimitiveCommands(
  registryDependencies: readonly string[],
): Record<PackageManager, string> | null {
  if (registryDependencies.length === 0) return null;
  const items = registryDependencies.join(" ");
  return {
    npm: `${RUNNERS.npm} add ${items}`,
    pnpm: `${RUNNERS.pnpm} add ${items}`,
    yarn: `${RUNNERS.yarn} add ${items}`,
    bun: `${RUNNERS.bun} add ${items}`,
  };
}

/** Direct item URL. Kept for the published registry docs and as the no-index fallback. */
export function getItemUrl(id: string): string {
  return `${siteUrl}/r/${id}.json`;
}

/**
 * Per-package-manager `shadcn add` commands for one registry item.
 *
 * Uses the namespace form, `@akoder/<id>`. The namespace is published in the
 * official shadcn directory, so the CLI resolves it with no `components.json`
 * setup and no URL to paste.
 */
export function getAddCommands(id: string): Record<PackageManager, string> {
  const target = `${registryConfig.namespace}/${id}`;
  return {
    npm: `${RUNNERS.npm} add ${target}`,
    pnpm: `${RUNNERS.pnpm} add ${target}`,
    yarn: `${RUNNERS.yarn} add ${target}`,
    bun: `${RUNNERS.bun} add ${target}`,
  };
}
