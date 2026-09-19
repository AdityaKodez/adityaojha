"use client";

import { useState } from "react";

import {
  DecisionMeter,
  type ChoiceAnswer,
  type NoulAnswer,
  type ScoreAnswer,
} from "@/components/ui/decision-meter";
import { cn } from "@/lib/utils";

/**
 * Fixtures shaped exactly like answers from a TypeSafe System One model, so the
 * demo runs without a key. Each query stands in for one request whose Choice
 * ranked the whole component catalog in a single question.
 */
const CATALOG_LABELS: Record<string, string> = {
  "progress-bars": "progress bars",
  "command-palette": "command palette",
  "project-explorer": "project explorer",
  "dotted-world-map": "dotted world map",
  carousel: "carousel",
  "glyph-card": "glyph card",
  none: "none of these",
};

interface DemoQuery {
  id: string;
  prompt: string;
  match: ChoiceAnswer;
}

const QUERIES: DemoQuery[] = [
  {
    id: "chart",
    prompt: "a small chart for milestone progress",
    match: {
      choice: "progress-bars",
      confidence: 0.86,
      probabilities: {
        "progress-bars": 0.74,
        "dotted-world-map": 0.11,
        "glyph-card": 0.06,
        carousel: 0.04,
        "project-explorer": 0.03,
        "command-palette": 0.01,
        none: 0.01,
      },
    },
  },
  {
    id: "shortcuts",
    prompt: "keyboard driven navigation menu",
    match: {
      choice: "command-palette",
      confidence: 0.91,
      probabilities: {
        "command-palette": 0.83,
        "project-explorer": 0.07,
        "progress-bars": 0.03,
        carousel: 0.03,
        "glyph-card": 0.02,
        "dotted-world-map": 0.01,
        none: 0.01,
      },
    },
  },
  {
    id: "unmatched",
    prompt: "a stripe checkout flow",
    match: {
      choice: "none",
      confidence: 0.44,
      probabilities: {
        none: 0.31,
        "command-palette": 0.19,
        "project-explorer": 0.18,
        carousel: 0.13,
        "progress-bars": 0.09,
        "glyph-card": 0.06,
        "dotted-world-map": 0.04,
      },
    },
  },
];

const FINISH_RATE: ScoreAnswer = {
  score: 2.05,
  confidence: 0.61,
  legend: [
    "abandoned stubs",
    "few look complete",
    "mostly usable",
    "polished, shipped",
  ],
  probabilities: [0.09, 0.17, 0.44, 0.3],
};

const WOULD_STAR: NoulAnswer = { noul: 0.63 };

export function DecisionMeterDemo() {
  const [active, setActive] = useState(QUERIES[0]);

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {QUERIES.map((query) => (
          <button
            key={query.id}
            type="button"
            onClick={() => setActive(query)}
            aria-pressed={active.id === query.id}
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors",
              active.id === query.id
                ? "border-foreground/40 text-foreground"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {query.prompt}
          </button>
        ))}
      </div>

      <DecisionMeter
        label="best match"
        answer={active.match}
        threshold={0.6}
        maxRows={5}
        model="jev-1.13.0"
        optionLabels={CATALOG_LABELS}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <DecisionMeter label="finish rate" answer={FINISH_RATE} model="jev-1.13.0" />
        <DecisionMeter label="would star" answer={WOULD_STAR} model="jev-1.13.0" />
      </div>
    </div>
  );
}

/** Choice with the gate drawn, for the examples carousel. */
export function DecisionMeterChoiceExample() {
  return (
    <DecisionMeter
      label="best match"
      answer={QUERIES[1].match}
      threshold={0.6}
      model="jev-1.13.0"
      optionLabels={CATALOG_LABELS}
    />
  );
}

/** The abstain state, where the winner never clears the gate. */
export function DecisionMeterAbstainExample() {
  return (
    <DecisionMeter
      label="best match"
      answer={QUERIES[2].match}
      threshold={0.6}
      model="jev-1.13.0"
      optionLabels={CATALOG_LABELS}
    />
  );
}

/** Score levels, read from the top down. */
export function DecisionMeterScoreExample() {
  return <DecisionMeter label="finish rate" answer={FINISH_RATE} model="jev-1.13.0" />;
}

/** A Noul, which deliberately renders no confidence readout. */
export function DecisionMeterNoulExample() {
  return <DecisionMeter label="would star" answer={WOULD_STAR} model="jev-1.13.0" />;
}

/** Loading and unconfigured states side by side. */
export function DecisionMeterStatesExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DecisionMeter label="best match" state="loading" model="jev-1.13.0" />
      <DecisionMeter label="best match" state="unconfigured" />
    </div>
  );
}
