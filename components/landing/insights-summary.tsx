import { insightsConfig } from "@/config/insights";
import type { InsightSummary } from "@/config/types";
import { cn } from "@/lib/utils";

const number = new Intl.NumberFormat("en-GB");
const percentage = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

function duration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return minutes
    ? `${number.format(minutes)}m ${seconds % 60}s`
    : `${seconds}s`;
}

function compare(current: number | null, before: number | null) {
  let change: number | null = null;
  if (current !== null && before !== null) {
    if (before > 0) change = ((current - before) / before) * 100;
    else if (current === 0) change = 0;
  }
  const isNew = current !== null && current > 0 && before === 0;
  const positive = isNew || (change !== null && change > 0);
  const negative = change !== null && change < 0;
  let label: string | null = null;
  if (isNew) label = insightsConfig.newActivity;
  else if (change !== null) label = `${percentage.format(Math.abs(change))}%`;
  return { label, positive, negative };
}

function Trend({
  current,
  before,
  className,
}: {
  current: number | null;
  before: number | null;
  className?: string;
}) {
  const { label, positive, negative } = compare(current, before);
  if (!label) return null;

  return (
    <span
      title={insightsConfig.comparisonLabel}
      className={cn(
        "inline-flex items-center gap-0.5 font-mono tabular-nums text-muted-foreground",
        positive && "text-success",
        negative && "text-destructive",
        className,
      )}
    >
      {(positive || negative) && (
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className={cn("size-2 fill-current", negative && "rotate-180")}
        >
          <path d="M5 1.5 9 8H1z" />
        </svg>
      )}
      <span className="sr-only">
        {positive ? "Up " : negative ? "Down " : ""}
      </span>
      {label}
    </span>
  );
}

function format(key: keyof InsightSummary, value: number | null) {
  if (value === null) return insightsConfig.noData;
  return key === "averageEngagedSeconds"
    ? duration(value)
    : number.format(value);
}

type Metric = (typeof insightsConfig.metrics)[number];

function MetricCard({
  metric,
  summary,
  previous,
}: {
  metric: Metric;
  summary: InsightSummary;
  previous: InsightSummary;
}) {
  const value = summary[metric.key];

  return (
    <div className="group relative min-w-0 px-4.5 py-3.5 transition-colors hover:bg-muted/10">
      <div
        aria-hidden="true"
        className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100"
      />
      <div className="relative z-10">
        <p className="text-xs text-muted-foreground">{metric.label}</p>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span
            className={cn(
              "text-[22px]/7 font-medium tracking-tight tabular-nums text-foreground",
              value === null && "text-sm text-muted-foreground",
            )}
          >
            {format(metric.key, value)}
          </span>
          <Trend
            current={value}
            before={previous[metric.key]}
            className="text-[11px]"
          />
        </p>
      </div>
    </div>
  );
}

export function InsightsSummary({
  summary,
  previous,
}: {
  summary: InsightSummary;
  previous: InsightSummary;
}) {
  const rows = [
    insightsConfig.metrics.slice(0, 2),
    insightsConfig.metrics.slice(2, 4),
  ];

  return (
    <div
      role="group"
      aria-label={insightsConfig.periodLabel}
      className="relative mt-2.5 flex flex-col gap-[15px] sm:grid sm:grid-cols-4 sm:border-y sm:border-border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[15px] -translate-x-1/2 border-x border-border"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[calc(25%-11.25px)] hidden w-[15px] border-x border-border sm:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[calc(75%-3.75px)] hidden w-[15px] border-x border-border sm:block"
      />
      {rows.map((row) => (
        <div
          key={row[0].key}
          className="grid grid-cols-2 gap-[15px] border-y border-border sm:contents"
        >
          {row.map((metric) => (
            <MetricCard
              key={metric.key}
              metric={metric}
              summary={summary}
              previous={previous}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
