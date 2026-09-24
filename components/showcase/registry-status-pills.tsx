"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import {
  HEALTH_BREAKDOWN_LABEL,
  HEALTH_BREAKDOWN_MAX,
  HEALTH_BREAKDOWN_ORDER,
  HEALTH_STATUS_DOT,
  HEALTH_STATUS_LABEL,
  REGISTRY_HEALTH_SOURCE_LABEL,
  REGISTRY_HEALTH_SOURCE_URL,
  TRUSTED_REGISTRY_TOOLTIP,
  type RegistryHealth,
  type RegistryHealthBreakdown,
} from "@/config/registry-health";
import { registryConfig } from "@/config/registry";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface RegistryStatusPillsProps {
  health: RegistryHealth;
}

/**
 * The registry's credential pair, pinned to the bottom of `/components`.
 *
 * The left pill is a statement of fact anyone can check: the namespace is
 * listed in the shadcn directory. The right one is a number shadcn owns, so
 * it is interactive, and the hover card shows where the number comes from
 * instead of asking for trust.
 */
export function RegistryStatusPills({ health }: RegistryStatusPillsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span
        title={TRUSTED_REGISTRY_TOOLTIP}
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3",
          "bg-foreground text-xs font-medium tracking-tight text-background",
          "ring-1 ring-inset ring-foreground/10"
        )}
      >
        <ShieldCheck className="size-3.5" aria-hidden />
        Trusted Registry
      </span>

      <HoverCard openDelay={120} closeDelay={80}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-3",
              "bg-card text-xs font-medium tracking-tight text-card-foreground",
              "ring-1 ring-inset ring-border",
              "micro-transition hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full",
                HEALTH_STATUS_DOT[health.status]
              )}
            />
            {HEALTH_STATUS_LABEL[health.status]}
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {health.score.toFixed(1)}
            </span>
          </button>
        </HoverCardTrigger>

        <HoverCardContent align="center" side="top" className="w-60 gap-2.5 p-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-medium tracking-tight">Registry health</h3>
            <code className="font-mono text-[10px] text-muted-foreground">
              {registryConfig.namespace}
            </code>
          </div>

          <div className="flex items-end justify-between gap-2">
            <p className="flex items-baseline gap-1">
              <span className="font-mono text-xl leading-none tabular-nums">
                {health.score.toFixed(1)}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                / 100
              </span>
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  HEALTH_STATUS_DOT[health.status]
                )}
              />
              {HEALTH_STATUS_LABEL[health.status]}
            </span>
          </div>

          <dl className="flex flex-col gap-1.5 bg-background p-2 rounded-lg">
            {HEALTH_BREAKDOWN_ORDER.map((key) => (
              <BreakdownRow
                key={key}
                label={HEALTH_BREAKDOWN_LABEL[key]}
                value={health.breakdown[key]}
                max={HEALTH_BREAKDOWN_MAX[key]}
              />
            ))}
          </dl>

          {health.monitoringLimited ? (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              shadcn&rsquo;s last index check was blocked by a CDN challenge, so it
              does not count against the score.
            </p>
          ) : null}

          <Link
            href={REGISTRY_HEALTH_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-transition w-fit rounded-sm font-mono text-xs text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {REGISTRY_HEALTH_SOURCE_LABEL}
          </Link>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  max,
}: {
  label: string;
  value: RegistryHealthBreakdown[keyof RegistryHealthBreakdown];
  max: number;
}) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {value.toFixed(1)} / {max}
        </dd>
      </div>
      <div
        aria-hidden
        className="h-1 w-full overflow-hidden rounded-full bg-foreground/10"
      >
        <div
          className="h-full rounded-full bg-foreground/50"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
