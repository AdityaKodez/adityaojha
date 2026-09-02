"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface ProgressBarItem {
  id: string;
  /** Optional caption rendered next to the bar. */
  label?: string;
  value: number;
  /** Extra detail line shown inside the tooltip. */
  tooltip?: ReactNode;
}

export interface ProgressBarsProps {
  items: ProgressBarItem[];
  orientation?: "vertical" | "horizontal";
  /** Largest possible item value. */
  max?: number;
  /** Show the scale and guide lines in vertical orientation. */
  showScale?: boolean;
  showValues?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number, max: number) => string;
  /** Vertical plot height in pixels. */
  height?: number;
  animate?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Fill textures. Both are anchored to the bottom left so the pattern stays put
 * while a bar grows, and both fall back to a literal color outside this site.
 */
const LINE_FILL: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, var(--foreground, #111111) 0, var(--foreground, #111111) 1px, transparent 1px, transparent 3px)",
  backgroundPosition: "bottom left",
};

const DOT_FILL: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at center, var(--foreground, #111111) 1px, transparent 1.3px)",
  backgroundSize: "5px 5px",
  backgroundPosition: "bottom left",
};

const SCALE_STEPS = [0, 25, 50, 75, 100];

const EASE = [0.22, 1, 0.36, 1] as const;

const PERCENT_FORMATTER = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 0,
});

function defaultFormatValue(value: number, max: number) {
  return PERCENT_FORMATTER.format(value / max);
}

function clampValue(value: number, max: number) {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.min(Math.max(value, 0), max);
}

function ItemTooltip({
  item,
  value,
  enabled,
  children,
}: {
  item: ProgressBarItem;
  value: string;
  enabled: boolean;
  children: ReactNode;
}) {
  if (!enabled) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={8} className="max-w-56">
        <div className="space-y-0.5">
          <p className="font-medium">{item.label ? `${item.label} · ${value}` : value}</p>
          {item.tooltip ? <div className="text-muted-foreground">{item.tooltip}</div> : null}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function BarChart({
  fill,
  items,
  orientation = "vertical",
  max = 100,
  showScale = true,
  showValues = true,
  showTooltip = true,
  formatValue = defaultFormatValue,
  height = 240,
  animate = true,
  ariaLabel,
  className,
}: ProgressBarsProps & { fill: CSSProperties; ariaLabel: string }) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;
  const range = max > 0 ? max : 100;

  if (items.length === 0) return null;

  const fillClassName =
    "transition-opacity group-hover:opacity-70 group-focus-visible:opacity-70";
  const trackClassName = "overflow-hidden ring-1 ring-inset ring-border/70 rounded-lg";

  if (orientation === "horizontal") {
    return (
      <section aria-label={ariaLabel} className={cn("w-full space-y-3", className)} role="list">
        {items.map((item, index) => {
          const percentage = (clampValue(item.value, range) / range) * 100;
          const formatted = formatValue(item.value, range);

          return (
            <ItemTooltip key={item.id} item={item} value={formatted} enabled={showTooltip}>
              <div
                role="listitem"
                tabIndex={0}
                aria-label={item.label ? `${item.label}, ${formatted}` : formatted}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 outline-none focus-visible:ring-1 focus-visible:ring-ring sm:grid-cols-[minmax(6rem,0.5fr)_minmax(0,1fr)_3rem]"
              >
                {item.label ? <p className="truncate text-sm leading-tight">{item.label}</p> : <span />}
                {showValues ? (
                  <span className="col-start-2 row-start-1 text-right text-xs tabular-nums sm:col-start-3">
                    {formatted}
                  </span>
                ) : null}
                <div
                  role="progressbar"
                  aria-valuenow={clampValue(item.value, range)}
                  aria-valuemin={0}
                  aria-valuemax={range}
                  aria-valuetext={formatted}
                  aria-label={item.label || ariaLabel}
                  className={cn("col-span-2 h-7 sm:col-span-1 sm:col-start-2 sm:row-start-1", trackClassName)}
                >
                  <motion.span
                    className={cn("block h-full", fillClassName)}
                    style={fill}
                    initial={shouldAnimate ? { width: "0%" } : false}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: shouldAnimate ? 0.3 : 0,
                      delay: shouldAnimate ? index * 0.05 : 0,
                      ease: EASE,
                    }}
                  />
                </div>
              </div>
            </ItemTooltip>
          );
        })}
      </section>
    );
  }

  return (
    <section aria-label={ariaLabel} className={cn("w-full", className)}>
      <div className={cn("grid min-w-0 gap-x-3", showScale ? "grid-cols-[2.5rem_minmax(0,1fr)]" : "grid-cols-1")}>
        {showScale ? (
          <div
            aria-hidden="true"
            className="relative mt-7 text-right font-mono text-[10px] tabular-nums text-muted-foreground"
            style={{ height }}
          >
            {SCALE_STEPS.map((step) => (
              <span
                key={step}
                className={cn("absolute right-0 leading-none", step === 0 ? "translate-y-1/2" : "-translate-y-1/2")}
                style={{ bottom: `${step}%` }}
              >
                {formatValue((step / 100) * range, range)}
              </span>
            ))}
          </div>
        ) : null}

        {/* Value labels sit above each fill. The plot uses fractional grid tracks
            instead of fixed-width bars so it always fits its container. */}
        <div className="min-w-0 pt-7 pb-1">
          <div className="relative min-w-0">
            <div aria-hidden="true" className="absolute inset-x-0 top-0" style={{ height }}>
              {SCALE_STEPS.filter((step) => step > 0).map((step) => (
                <span
                  key={step}
                  className="absolute inset-x-0  border-dashed border-border/80"
                  style={{ bottom: `${step}%` }}
                />
              ))}
            </div>

            <div
              className="relative grid min-w-0 gap-x-1.5 sm:gap-x-3"
              role="list"
              style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
            >
              {items.map((item, index) => {
                const percentage = (clampValue(item.value, range) / range) * 100;
                const formatted = formatValue(item.value, range);

                return (
                  <ItemTooltip key={item.id} item={item} value={formatted} enabled={showTooltip}>
                    <div
                      role="listitem"
                      tabIndex={0}
                      aria-label={item.label ? `${item.label}, ${formatted}` : formatted}
                      className="group min-w-0 outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <div className="relative" style={{ height }}>
                        {showValues ? (
                          <span
                            className="absolute inset-x-0 -translate-y-1.5 truncate text-center text-[10px] tabular-nums sm:text-xs"
                            style={{ bottom: `${percentage}%` }}
                          >
                            {formatted}
                          </span>
                        ) : null}
                        <div
                          role="progressbar"
                          aria-valuenow={clampValue(item.value, range)}
                          aria-valuemin={0}
                          aria-valuemax={range}
                          aria-valuetext={formatted}
                          aria-label={item.label || ariaLabel}
                          className={cn("absolute inset-x-px bottom-0 top-0 sm:inset-x-1.5", trackClassName)}
                        >
                          <motion.span
                            className={cn("absolute inset-x-0 bottom-0", fillClassName)}
                            style={fill}
                            initial={shouldAnimate ? { height: "0%" } : false}
                            whileInView={{ height: `${percentage}%` }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{
                              duration: shouldAnimate ? 0.3 : 0,
                              delay: shouldAnimate ? index * 0.05 : 0,
                              ease: EASE,
                            }}
                          />
                        </div>
                      </div>
                      {item.label ? (
                        <p className="mt-3 truncate pt-3 text-center text-xs leading-tight">
                          {item.label}
                        </p>
                      ) : null}
                    </div>
                  </ItemTooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Bars filled with etched horizontal rules. */
export function ProgressBars({ ariaLabel = "progress bars", ...props }: ProgressBarsProps) {
  return <BarChart {...props} fill={LINE_FILL} ariaLabel={ariaLabel} />;
}

/** The same bars filled with a matrix of dots instead of rules. */
export function DotProgress({ ariaLabel = "dot progress", ...props }: ProgressBarsProps) {
  return <BarChart {...props} fill={DOT_FILL} ariaLabel={ariaLabel} />;
}
