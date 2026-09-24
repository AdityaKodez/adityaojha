/**
 * Registry Health data layer and presentation metadata.
 *
 * The shadcn directory publishes a `health` object for every listed registry
 * at `ui.shadcn.com/r/registries.json`. `@akoder` is listed there, so the
 * status pill at the bottom of `/components` reads this registry's own entry
 * back instead of asserting a badge nobody can verify.
 *
 * Lives in `config/` because the client pill group needs the labels, not just
 * the fetcher: `lib/registry-health.ts` is `server-only` and cannot be
 * imported for runtime values.
 */

/** Revalidate window for the directory index, in seconds. shadcn refreshes hourly. */
export const REGISTRY_INDEX_REVALIDATE_SECONDS = 3600;

export type RegistryHealthStatus =
  | "healthy"
  | "degraded"
  | "observing"
  | "unavailable";

export type RegistryHealthBreakdown = {
  /** Up to 45 points: 65% availability over 7 days, 35% over 30 days. */
  reliability: number;
  /** Up to 25 points: index schema validity plus sampled item validity. */
  correctness: number;
  /** Up to 20 points: CLI `shadcn add` dry runs. */
  installability: number;
  /** Up to 10 points. */
  hygiene: number;
};

export type RegistryHealth = {
  status: RegistryHealthStatus;
  statusReason: string;
  /** 0 to 100. */
  score: number;
  breakdown: RegistryHealthBreakdown;
  /** Smoothed success rates from 0 to 1. */
  availability7d: number;
  availability30d: number;
  /** True when the last index check was blocked by a CDN or WAF challenge. */
  monitoringLimited: boolean;
  checkedAt: string;
};

/** Upper bound of each score component, used for the hover card bars. */
export const HEALTH_BREAKDOWN_MAX = {
  reliability: 45,
  correctness: 25,
  installability: 20,
  hygiene: 10,
} as const;

export type HealthBreakdownKey = keyof RegistryHealthBreakdown;

/** Hover card order, highest points first. */
export const HEALTH_BREAKDOWN_ORDER: readonly HealthBreakdownKey[] = [
  "reliability",
  "correctness",
  "installability",
  "hygiene",
];

/** Sentence-case label per score component. */
export const HEALTH_BREAKDOWN_LABEL: Record<HealthBreakdownKey, string> = {
  reliability: "Reliability",
  correctness: "Correctness",
  installability: "Installability",
  hygiene: "Hygiene",
};

/** Sentence-case label per status, for the pill and the hover card. */
export const HEALTH_STATUS_LABEL: Record<RegistryHealthStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  observing: "Observing",
  unavailable: "Unavailable",
};

/** Status dot colour per status. */
export const HEALTH_STATUS_DOT: Record<RegistryHealthStatus, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  observing: "bg-sky-500",
  unavailable: "bg-rose-500",
};

/** Where the number comes from, so a visitor can check it themselves. */
export const REGISTRY_HEALTH_SOURCE_URL =
  "https://ui.shadcn.com/docs/registry/health";

export const REGISTRY_HEALTH_SOURCE_LABEL = "How shadcn scores registries";

export const TRUSTED_REGISTRY_TOOLTIP =
  "Listed in the shadcn directory, so the CLI resolves it with no components.json setup";
