"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Answer shapes returned by TypeSafe System One models (Jev). They are declared
 * structurally rather than imported so this file stays dependency free: an
 * answer straight off `@typesafe-ai/sdk` satisfies these without a cast.
 */

/** One option out of a defined set. */
export interface ChoiceAnswer {
  choice: string;
  /** Probability per option. Doubles as a ranking over every option. */
  probabilities: Record<string, number>;
  /** How concentrated `probabilities` is, from 0 to 1. */
  confidence: number;
}

/** A position along ordered levels, which can land between two of them. */
export interface ScoreAnswer {
  score: number;
  /** Probability per level, keyed by level index or given in level order. */
  probabilities: Record<string, number> | number[];
  confidence: number;
  /** Level descriptions, keyed by level index or given in level order. */
  legend?: Record<string, string> | string[];
}

/** The probability that a yes/no statement is true. Carries no confidence. */
export interface NoulAnswer {
  noul: number;
}

export type DecisionAnswer = ChoiceAnswer | ScoreAnswer | NoulAnswer;

/** Confidence cutoffs, in the "act, confirm, escalate" shape. */
export interface ConfidenceBands {
  /** At or above this, act automatically. */
  high: number;
  /** At or above this, proceed but confirm. Below it, escalate. */
  medium: number;
}

export interface DecisionMeterProps {
  /** Question name, shown in the header. */
  label: string;
  answer?: DecisionAnswer | null;
  /**
   * Probability your code requires before it acts. Drawn as a gate line, and
   * used to decide whether a Choice reads as answered or abstained.
   */
  threshold?: number;
  /** Rows shown before the tail collapses behind a toggle. Choice only. */
  maxRows?: number;
  /** Model id, shown in the header. Pass `response.model`. */
  model?: string;
  state?: "loading" | "ready" | "unconfigured";
  /** Human readable names for option keys or score levels. */
  optionLabels?: Record<string, string>;
  confidenceBands?: ConfidenceBands;
  formatProbability?: (probability: number) => string;
  animate?: boolean;
  className?: string;
}

const DEFAULT_BANDS: ConfidenceBands = { high: 0.75, medium: 0.5 };

const EASE = [0.22, 1, 0.36, 1] as const;

const CONFIDENCE_PIPS = 10;

function defaultFormatProbability(probability: number) {
  return probability.toFixed(2);
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

function isNoul(answer: DecisionAnswer): answer is NoulAnswer {
  return "noul" in answer;
}

function isChoice(answer: DecisionAnswer): answer is ChoiceAnswer {
  return "choice" in answer;
}

function isScore(answer: DecisionAnswer): answer is ScoreAnswer {
  return "score" in answer;
}

/** Accepts either an array in level order or a record keyed by level index. */
function toLevelArray<T>(input: Record<string, T> | T[] | undefined): T[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return Object.keys(input)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => input[key]);
}

function confidenceBand(confidence: number, bands: ConfidenceBands) {
  if (confidence >= bands.high) return { key: "high", note: "high, safe to apply" };
  if (confidence >= bands.medium) return { key: "medium", note: "medium, confirm first" };
  return { key: "low", note: "low, send to a human" };
}

/* ---------------------------------------------------------------- chrome --- */

function Shell({
  label,
  model,
  children,
  footer,
  className,
}: {
  label: string;
  model?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "w-full rounded-lg border border-border/70 bg-background font-mono text-xs",
        className,
      )}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-border/70 px-3 py-2">
        <h3 className="truncate text-[11px] tracking-wide text-foreground">{label}</h3>
        {model ? (
          <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{model}</span>
        ) : null}
      </header>
      <div className="px-3 py-3">{children}</div>
      {footer ? (
        <div className="border-t border-border/70 px-3 py-2">{footer}</div>
      ) : null}
    </section>
  );
}

/** The vertical gate line, drawn over a probability track. */
function Gate({ threshold }: { threshold: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 w-px border-l border-dashed border-foreground/45"
      style={{ left: `${clamp01(threshold) * 100}%` }}
    />
  );
}

function Track({
  probability,
  emphasis,
  threshold,
  shouldAnimate,
  delay,
}: {
  probability: number;
  emphasis: boolean;
  threshold?: number;
  shouldAnimate: boolean;
  delay: number;
}) {
  return (
    <div className="relative h-4 overflow-hidden rounded-sm ring-1 ring-inset ring-border/70">
      <motion.span
        className={cn(
          "absolute inset-y-0 left-0 block",
          emphasis ? "bg-foreground" : "bg-foreground/30",
        )}
        initial={shouldAnimate ? { width: "0%" } : false}
        animate={{ width: `${clamp01(probability) * 100}%` }}
        transition={{ duration: shouldAnimate ? 0.34 : 0, delay, ease: EASE }}
      />
      {threshold === undefined ? null : <Gate threshold={threshold} />}
    </div>
  );
}

function ConfidenceFooter({
  confidence,
  bands,
  formatProbability,
}: {
  confidence: number;
  bands: ConfidenceBands;
  formatProbability: (probability: number) => string;
}) {
  const filled = Math.round(clamp01(confidence) * CONFIDENCE_PIPS);
  const band = confidenceBand(confidence, bands);

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="text-foreground">confidence</span>
      <span aria-hidden="true" className="tracking-[0.15em]">
        {"\u25CF".repeat(filled)}
        <span className="text-muted-foreground/40">{"\u25CB".repeat(CONFIDENCE_PIPS - filled)}</span>
      </span>
      <span className="tabular-nums text-foreground">{formatProbability(confidence)}</span>
      <span className="truncate">{band.note}</span>
    </div>
  );
}

/* ----------------------------------------------------------------- states --- */

function Placeholder({ label, model, children }: { label: string; model?: string; children: React.ReactNode }) {
  return (
    <Shell label={label} model={model}>
      <p className="flex items-center gap-2 text-[11px] text-muted-foreground">{children}</p>
    </Shell>
  );
}

function LoadingBody() {
  return (
    <div aria-hidden="true" className="space-y-2">
      {[0, 1, 2].map((row) => (
        <div key={row} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-3">
          <span className="h-2 rounded-sm bg-foreground/10" />
          <span className="h-4 animate-pulse rounded-sm bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- choice --- */

function ChoiceBody({
  answer,
  threshold,
  maxRows,
  optionLabels,
  formatProbability,
  shouldAnimate,
}: {
  answer: ChoiceAnswer;
  threshold?: number;
  maxRows: number;
  optionLabels?: Record<string, string>;
  formatProbability: (probability: number) => string;
  shouldAnimate: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const ranked = useMemo(
    () =>
      Object.entries(answer.probabilities)
        .map(([key, probability]) => ({ key, probability }))
        .sort((a, b) => b.probability - a.probability),
    [answer.probabilities],
  );

  const top = ranked[0];
  const cleared = threshold === undefined || (top?.probability ?? 0) >= threshold;
  const visible = expanded ? ranked : ranked.slice(0, maxRows);
  const hidden = ranked.length - visible.length;

  if (!cleared && top) {
    return (
      <div className="space-y-2">
        <p className="text-[11px] text-foreground">nothing here clears the gate</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          closest was{" "}
          <span className="text-foreground">{optionLabels?.[top.key] ?? top.key}</span> at{" "}
          <span className="tabular-nums text-foreground">{formatProbability(top.probability)}</span>,
          gate is{" "}
          <span className="tabular-nums text-foreground">{formatProbability(threshold)}</span>.
        </p>
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="text-[11px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {expanded ? "hide options" : `show all ${ranked.length}`}
        </button>
        {expanded ? (
          <ChoiceRows
            rows={ranked}
            winner={answer.choice}
            threshold={threshold}
            optionLabels={optionLabels}
            formatProbability={formatProbability}
            shouldAnimate={shouldAnimate}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ChoiceRows
        rows={visible}
        winner={answer.choice}
        threshold={threshold}
        optionLabels={optionLabels}
        formatProbability={formatProbability}
        shouldAnimate={shouldAnimate}
      />
      {hidden > 0 || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="text-[11px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {expanded ? "show fewer" : `show all ${ranked.length}`}
        </button>
      ) : null}
    </div>
  );
}

function ChoiceRows({
  rows,
  winner,
  threshold,
  optionLabels,
  formatProbability,
  shouldAnimate,
}: {
  rows: Array<{ key: string; probability: number }>;
  winner: string;
  threshold?: number;
  optionLabels?: Record<string, string>;
  formatProbability: (probability: number) => string;
  shouldAnimate: boolean;
}) {
  return (
    <ul className="space-y-1.5">
      {rows.map((row, index) => {
        const isWinner = row.key === winner;
        const name = optionLabels?.[row.key] ?? row.key;
        const formatted = formatProbability(row.probability);

        return (
          <li
            key={row.key}
            className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_2.5rem_0.75rem] items-center gap-x-2"
          >
            <span
              className={cn(
                "truncate text-[11px]",
                isWinner ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {name}
            </span>
            <div
              role="progressbar"
              aria-valuenow={row.probability}
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuetext={formatted}
              aria-label={name}
            >
              <Track
                probability={row.probability}
                emphasis={isWinner}
                threshold={threshold}
                shouldAnimate={shouldAnimate}
                delay={shouldAnimate ? index * 0.04 : 0}
              />
            </div>
            <span className="text-right text-[11px] tabular-nums text-foreground">{formatted}</span>
            <span aria-hidden="true" className="text-center text-[11px] text-foreground">
              {isWinner ? "\u2713" : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ score --- */

function ScoreBody({
  answer,
  optionLabels,
  formatProbability,
  shouldAnimate,
}: {
  answer: ScoreAnswer;
  optionLabels?: Record<string, string>;
  formatProbability: (probability: number) => string;
  shouldAnimate: boolean;
}) {
  const probabilities = toLevelArray(answer.probabilities);
  const legend = toLevelArray(answer.legend);
  const nearest = Math.round(answer.score);

  // Highest level first, so that reading downward matches the numbers falling.
  const rows = probabilities
    .map((probability, index) => ({ index, probability }))
    .reverse();

  return (
    <ul className="space-y-1.5">
      {rows.map((row, position) => {
        const name = optionLabels?.[String(row.index)] ?? legend[row.index] ?? `level ${row.index}`;
        const formatted = formatProbability(row.probability);
        const isNearest = row.index === nearest;

        return (
          <li
            key={row.index}
            className="grid grid-cols-[0.75rem_minmax(0,8rem)_minmax(0,1fr)_2.5rem_0.75rem] items-center gap-x-2"
          >
            <span aria-hidden="true" className="text-[10px] tabular-nums text-muted-foreground/70">
              {row.index}
            </span>
            <span
              className={cn(
                "truncate text-[11px]",
                isNearest ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {name}
            </span>
            <div
              role="progressbar"
              aria-valuenow={row.probability}
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuetext={formatted}
              aria-label={name}
            >
              <Track
                probability={row.probability}
                emphasis={isNearest}
                shouldAnimate={shouldAnimate}
                delay={shouldAnimate ? position * 0.04 : 0}
              />
            </div>
            <span className="text-right text-[11px] tabular-nums text-foreground">{formatted}</span>
            <span aria-hidden="true" className="text-center text-[11px] text-foreground">
              {isNearest ? "\u25C4" : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------- noul --- */

/**
 * A Noul near 0.5 means yes and no are close to equally likely, so anything
 * within 0.1 of even odds reads as uncertain rather than as a weak lean.
 */
function noulReading(noul: number) {
  if (noul >= 0.6) return "leaning yes";
  if (noul <= 0.4) return "leaning no";
  return "uncertain";
}

function NoulBody({
  answer,
  threshold,
  formatProbability,
  shouldAnimate,
}: {
  answer: NoulAnswer;
  threshold: number;
  formatProbability: (probability: number) => string;
  shouldAnimate: boolean;
}) {
  const noul = clamp01(answer.noul);
  const formatted = formatProbability(noul);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">no</span>
        <div
          role="progressbar"
          aria-valuenow={noul}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuetext={formatted}
          aria-label="probability of yes"
          className="relative h-4 flex-1 rounded-sm ring-1 ring-inset ring-border/70"
        >
          <Gate threshold={threshold} />
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 block size-2.5 rounded-full bg-foreground"
            initial={shouldAnimate ? { left: "50%" } : false}
            animate={{ left: `${noul * 100}%` }}
            transition={{ duration: shouldAnimate ? 0.34 : 0, ease: EASE }}
            style={{ translateX: "-50%", translateY: "-50%" }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground">yes</span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        <span className="tabular-nums text-foreground">{formatted}</span> {noulReading(noul)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------- root --- */

/**
 * Renders one TypeSafe System One answer: a Choice, a Score, or a Noul. The
 * variant is inferred from the answer's own shape, so a Noul can never be given
 * a confidence readout it does not have.
 */
export function DecisionMeter({
  label,
  answer,
  threshold,
  maxRows = 5,
  model,
  state = "ready",
  optionLabels,
  confidenceBands = DEFAULT_BANDS,
  formatProbability = defaultFormatProbability,
  animate = true,
  className,
}: DecisionMeterProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;

  if (state === "unconfigured") {
    return (
      <Placeholder label={label}>
        <span aria-hidden="true">{"\u25CB"}</span>
        decisions are not configured yet
      </Placeholder>
    );
  }

  if (state === "loading") {
    return (
      <Shell label={label} model={model} className={className}>
        <LoadingBody />
      </Shell>
    );
  }

  if (!answer) {
    return (
      <Placeholder label={label} model={model}>
        <span aria-hidden="true">{"\u25CB"}</span>
        no answer yet
      </Placeholder>
    );
  }

  if (isNoul(answer)) {
    return (
      <Shell label={label} model={model} className={className}>
        <NoulBody
          answer={answer}
          threshold={threshold ?? 0.5}
          formatProbability={formatProbability}
          shouldAnimate={shouldAnimate}
        />
      </Shell>
    );
  }

  if (isChoice(answer)) {
    return (
      <Shell
        label={label}
        model={model}
        className={className}
        footer={
          <ConfidenceFooter
            confidence={answer.confidence}
            bands={confidenceBands}
            formatProbability={formatProbability}
          />
        }
      >
        <ChoiceBody
          answer={answer}
          threshold={threshold}
          maxRows={maxRows}
          optionLabels={optionLabels}
          formatProbability={formatProbability}
          shouldAnimate={shouldAnimate}
        />
      </Shell>
    );
  }

  if (isScore(answer)) {
    const levels = toLevelArray(answer.probabilities).length;

    return (
      <Shell
        label={label}
        model={model}
        className={className}
        footer={
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">
              score <span className="tabular-nums text-foreground">{answer.score.toFixed(2)}</span> of{" "}
              <span className="tabular-nums text-foreground">{Math.max(levels - 1, 0)}</span>
            </p>
            <ConfidenceFooter
              confidence={answer.confidence}
              bands={confidenceBands}
              formatProbability={formatProbability}
            />
          </div>
        }
      >
        <ScoreBody
          answer={answer}
          optionLabels={optionLabels}
          formatProbability={formatProbability}
          shouldAnimate={shouldAnimate}
        />
      </Shell>
    );
  }

  return null;
}
