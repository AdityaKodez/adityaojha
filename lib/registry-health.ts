import "server-only";

import { registryConfig } from "@/config/registry";
import {
  REGISTRY_INDEX_REVALIDATE_SECONDS,
  type RegistryHealth,
  type RegistryHealthBreakdown,
  type RegistryHealthStatus,
} from "@/config/registry-health";

/**
 * Reads this registry's health entry out of the shadcn directory index.
 *
 * One cached request serves the whole page: the index is ~280 kB of JSON
 * covering a few hundred registries, and shadcn only refreshes it hourly, so
 * a request per visitor would buy nothing.
 */

const SHADCN_REGISTRY_INDEX = "https://ui.shadcn.com/r/registries.json";

const HEALTH_STATUSES: readonly RegistryHealthStatus[] = [
  "healthy",
  "degraded",
  "observing",
  "unavailable",
];

function isKnownStatus(value: string): value is RegistryHealthStatus {
  return (HEALTH_STATUSES as readonly string[]).includes(value);
}

function toNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toBreakdown(value: unknown): RegistryHealthBreakdown | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Partial<RegistryHealthBreakdown>;
  const reliability = toNumber(raw.reliability);
  const correctness = toNumber(raw.correctness);
  const installability = toNumber(raw.installability);
  const hygiene = toNumber(raw.hygiene);
  if (
    reliability === null ||
    correctness === null ||
    installability === null ||
    hygiene === null
  ) {
    return null;
  }
  return { reliability, correctness, installability, hygiene };
}

type ShadcnRegistryEntry = {
  name?: string;
  health?: {
    score?: number;
    status?: string;
    statusReason?: { message?: string } | null;
    breakdown?: unknown;
    availability7d?: number;
    availability30d?: number;
    monitoringLimited?: boolean;
    checkedAt?: string;
  } | null;
};

/**
 * Returns this registry's health as published by shadcn, or null when the
 * answer cannot be trusted: the index is unreachable, our namespace is
 * absent, or the entry is too partial to render. The pill is a claim about
 * shadcn's own data, so it either reflects that data or it does not render.
 */
export async function fetchRegistryHealth(): Promise<RegistryHealth | null> {
  try {
    const response = await fetch(SHADCN_REGISTRY_INDEX, {
      next: { revalidate: REGISTRY_INDEX_REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;

    const index: unknown = await response.json();
    if (!Array.isArray(index)) return null;

    const entry = (index as ShadcnRegistryEntry[]).find(
      (candidate) => candidate?.name === registryConfig.namespace,
    );

    const health = entry?.health;
    if (!health) return null;

    const score = toNumber(health.score);
    const status = health.status;
    const breakdown = toBreakdown(health.breakdown);
    if (score === null || !status || !isKnownStatus(status) || !breakdown) {
      return null;
    }

    return {
      status,
      statusReason: health.statusReason?.message ?? "",
      score,
      breakdown,
      availability7d: toNumber(health.availability7d) ?? 0,
      availability30d: toNumber(health.availability30d) ?? 0,
      monitoringLimited: health.monitoringLimited === true,
      checkedAt: health.checkedAt ?? "",
    };
  } catch {
    // An unreachable or unparseable index must never take the page down with
    // it: this section is a badge, not a dependency.
    return null;
  }
}
