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

/** Direct item URL. */
export function getItemUrl(id: string): string {
  return `${siteUrl}/r/${id}.json`;
}

/** Per-package-manager `shadcn add` commands for one registry item using direct URL style. */
export function getAddCommands(id: string): Record<PackageManager, string> {
  const target = getItemUrl(id);
  return {
    npm: `${RUNNERS.npm} add ${target}`,
    pnpm: `${RUNNERS.pnpm} add ${target}`,
    yarn: `${RUNNERS.yarn} add ${target}`,
    bun: `${RUNNERS.bun} add ${target}`,
  };
}

/** Snippet users paste into `components.json` to alias the namespace. */
export function getRegistrySetupSnippet(): string {
  return `"registries": {\n  "${registryConfig.namespace}": "${registryConfig.itemUrlPattern}"\n}`;
}
