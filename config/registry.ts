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

export function getRegistryItemUrl(id: string): string {
  return `${siteUrl}/r/${id}.json`;
}

/** Per-package-manager `shadcn add` commands for one registry item. */
export function getAddCommands(id: string): Record<PackageManager, string> {
  const url = getRegistryItemUrl(id);
  return {
    npm: `${RUNNERS.npm} add ${url}`,
    pnpm: `${RUNNERS.pnpm} add ${url}`,
    yarn: `${RUNNERS.yarn} add ${url}`,
    bun: `${RUNNERS.bun} add ${url}`,
  };
}

/** Snippet users paste into `components.json` to alias the namespace. */
export function getRegistrySetupSnippet(): string {
  return `"registries": {
  "${registryConfig.namespace}": "${registryConfig.itemUrlPattern}"
}`;
}

/** Short-form add command, available once the namespace is configured. */
export function getNamespacedAddCommand(id: string): string {
  return `npx shadcn@latest add ${registryConfig.namespace}/${id}`;
}
