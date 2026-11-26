import { AlertTriangle, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import {
  WorkflowStatusBadge,
  type WorkflowStatus,
} from "@/components/ui/workflow-status";
import { cn } from "@/lib/utils";

export const usageCardStatuses = ["good", "warning", "action-required"] as const;

export type UsageCardStatus = (typeof usageCardStatuses)[number];

export interface UsageCardProps extends Omit<ComponentProps<"div">, "children"> {
  /** Metric heading shown in the top-left of the inner card. */
  label: string;
  /** Current usage amount. Negative or nonfinite values clamp to 0. */
  value: number;
  /** Maximum quota or allowance. Nonfinite or nonpositive values render 0%. */
  limit: number;
  /** Optional unit suffix shown after the limit (for example, "gb"). */
  unit?: string;
  /** Optional decorative icon shown before the label. */
  icon?: ReactNode;
  /** Explicit semantic status. Omit to derive automatically from thresholds. */
  status?: UsageCardStatus;
  /** Overrides the default status badge label. */
  statusLabel?: string;
  /** Overrides the icon passed to WorkflowStatusBadge. */
  statusIcon?: LucideIcon;
  /** Hides the status pill when false. Defaults to true. */
  showStatus?: boolean;
  /** Percentage (0 to 100) at or above which status becomes "action-required". Defaults to 80. */
  dangerThreshold?: number;
  /** Optional percentage (0 to 100) at or above which status becomes "warning". */
  warningThreshold?: number;
  /** Custom formatter for numeric value and limit readouts. */
  formatValue?: (amount: number) => string;
  /** Custom formatter for the inline percentage label. Defaults to "${percent}% used". */
  formatPercentage?: (percent: number) => string;
}

type UsageStatusPresentation = {
  badgeStatus: WorkflowStatus;
  badgeLabel: string;
  badgeIcon?: LucideIcon;
  badgeRingClassName: string;
  barClassName: string;
  percentClassName: string;
};

const STATUS_PRESENTATIONS: Record<UsageCardStatus, UsageStatusPresentation> = {
  good: {
    badgeStatus: "success",
    badgeLabel: "Good",
    badgeRingClassName: "ring-emerald-500/20 dark:ring-emerald-500/25",
    barClassName: "bg-zinc-600 dark:bg-zinc-300",
    percentClassName: "text-muted-foreground",
  },
  warning: {
    badgeStatus: "pending",
    badgeLabel: "Warning",
    badgeRingClassName: "ring-amber-500/25 dark:ring-amber-500/30",
    barClassName: "bg-amber-500 dark:bg-amber-400",
    percentClassName: "text-amber-700 dark:text-amber-300",
  },
  "action-required": {
    badgeStatus: "failed",
    badgeLabel: "Action required",
    badgeIcon: AlertTriangle,
    badgeRingClassName: "ring-rose-500/20 dark:ring-rose-500/25",
    barClassName: "bg-rose-500 dark:bg-rose-400",
    percentClassName: "text-rose-600 dark:text-rose-400",
  },
};

/**
 * Deterministic number formatter that groups integers with five or more digits
 * using spaces (for example, 82540 -> "82 540") while keeping four-digit values
 * compact ("1000"). Safe across SSR and client locales.
 */
export function formatUsageNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const negative = value < 0;
  const abs = Math.abs(value);
  const [integerPart, fractionalPart] = String(abs).split(".");
  const groupedInteger =
    integerPart.length >= 5
      ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      : integerPart;
  const sign = negative ? "-" : "";
  return fractionalPart
    ? `${sign}${groupedInteger}.${fractionalPart}`
    : `${sign}${groupedInteger}`;
}

function clampPercentage(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(100, Math.max(0, value));
}

function resolveStatus(
  percent: number,
  explicitStatus: UsageCardStatus | undefined,
  dangerThreshold: number,
  warningThreshold: number | undefined,
): UsageCardStatus {
  if (explicitStatus) return explicitStatus;
  if (percent >= dangerThreshold) return "action-required";
  if (warningThreshold !== undefined && percent >= warningThreshold) {
    return "warning";
  }
  return "good";
}

/**
 * A nested usage and quota meter card with a semantic status pill and an
 * inline-labeled progress track.
 */
export function UsageCard({
  label,
  value,
  limit,
  unit,
  icon,
  status,
  statusLabel,
  statusIcon,
  showStatus = true,
  dangerThreshold = 80,
  warningThreshold,
  formatValue = formatUsageNumber,
  formatPercentage = (percent) => `${percent}% used`,
  className,
  ...props
}: UsageCardProps) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 0;
  const rawPercent = safeLimit > 0 ? (safeValue / safeLimit) * 100 : 0;
  const displayPercent = Math.round(rawPercent);
  const barPercent = Math.min(100, Math.max(0, rawPercent));

  const resolvedDanger = clampPercentage(dangerThreshold, 80);
  const resolvedWarning =
    warningThreshold !== undefined && Number.isFinite(warningThreshold)
      ? clampPercentage(warningThreshold, resolvedDanger)
      : undefined;

  const resolvedStatus = resolveStatus(
    displayPercent,
    status,
    resolvedDanger,
    resolvedWarning,
  );
  const presentation = STATUS_PRESENTATIONS[resolvedStatus];
  const percentageText = formatPercentage(displayPercent);

  return (
    <div
      data-slot="usage-card"
      data-status={resolvedStatus}
      className={cn(
        "w-full rounded-2xl bg-muted/55 p-1.5 ring-1 ring-inset ring-border/80 dark:bg-muted/30",
        className,
      )}
      {...props}
    >
      <div className="rounded-[calc(1rem-0.375rem)] bg-card px-4 py-3.5 ring-1 ring-inset ring-border/75 shadow-[0_1px_2px_0_rgb(0_0_0/0.03)] dark:shadow-none">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {icon ? (
              <span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4"
              >
                {icon}
              </span>
            ) : null}
            <span className="truncate text-sm font-medium tracking-tight text-foreground">
              {label}
            </span>
          </div>

          {showStatus ? (
            <WorkflowStatusBadge
              status={presentation.badgeStatus}
              label={statusLabel ?? presentation.badgeLabel}
              icon={statusIcon ?? presentation.badgeIcon}
              size="sm"
              className={cn(
                "rounded-full px-2.5 py-0.5 ring-1 ring-inset",
                presentation.badgeRingClassName,
              )}
            />
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5 leading-none tracking-tight tabular-nums">
          <span className="text-[1.75rem] font-normal text-foreground">
            {formatValue(safeValue)}
          </span>
          <span
            aria-hidden="true"
            className="text-2xl font-light text-muted-foreground/45"
          >
            /
          </span>
          <span className="text-[1.75rem] font-normal text-muted-foreground/65">
            {formatValue(safeLimit)}
          </span>
          {unit ? (
            <span className="text-sm font-normal text-muted-foreground/65">
              {unit}
            </span>
          ) : null}
        </div>
      </div>

      <div
        role="progressbar"
        aria-label={`${label} usage`}
        aria-valuemin={0}
        aria-valuemax={safeLimit}
        aria-valuenow={safeValue}
        aria-valuetext={percentageText}
        className="flex items-center gap-2.5 px-2 pt-2.5 pb-1"
      >
        {barPercent > 0 ? (
          <div
            aria-hidden="true"
            className={cn(
              "h-1 min-w-1.5 rounded-full transition-[flex-grow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              presentation.barClassName,
            )}
            style={{ flexGrow: barPercent, flexShrink: 1, flexBasis: 0 }}
          />
        ) : null}

        <span
          className={cn(
            "shrink-0 whitespace-nowrap text-xs font-medium tabular-nums",
            presentation.percentClassName,
          )}
        >
          {percentageText}
        </span>

        {barPercent < 100 ? (
          <div
            aria-hidden="true"
            className="h-1 min-w-1.5 rounded-full bg-zinc-300/80 transition-[flex-grow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:bg-zinc-700/80"
            style={{ flexGrow: 100 - barPercent, flexShrink: 1, flexBasis: 0 }}
          />
        ) : null}
      </div>
    </div>
  );
}
