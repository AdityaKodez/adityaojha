## Usage

`DecisionMeter` renders one answer from a [TypeSafe](https://typesafe.ai) System One model. Pass the answer straight through, no mapping step.

```tsx
import { DecisionMeter } from "@/components/ui/decision-meter";
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

const response = await client.systemOne({
  state: { query, catalog },
  questions: {
    best_match: choice("Which component in `catalog` best fits `query`?", options),
  },
});

<DecisionMeter
  label="best match"
  answer={response.answers.best_match}
  threshold={0.6}
  model={response.model}
/>;
```

The variant is inferred from the answer's own shape, so there is no `variant` prop to get wrong.

| Answer contains | Renders |
| --- | --- |
| `choice` | Ranked probability bars, one per option, with a gate line |
| `score` | Ordered levels, highest first, with the landed position marked |
| `noul` | A single yes/no gauge, and no confidence readout |

## The gate line

`threshold` is the probability your code requires before it acts. Passing it draws a dashed vertical line across every track, so the gap between the answer and your own cutoff is visible rather than implied.

```tsx
<DecisionMeter label="intent" answer={answers.intent} threshold={0.85} />
```

When a Choice winner does not clear the gate, the meter says so instead of presenting the least bad option:

```
nothing here clears the gate
closest was carousel at 0.13, gate is 0.60.
```

That state is the point of the component. Leave `threshold` off and it is never shown.

## Long option lists

A Choice can carry up to 255 options. Only the top `maxRows` are drawn, sorted by probability, and the tail collapses behind a toggle.

```tsx
<DecisionMeter label="industry" answer={answers.industry} maxRows={3} />
```

## Readable option names

Option keys and score levels are usually snake_case ids. Map them to display names without touching the answer:

```tsx
<DecisionMeter
  label="department"
  answer={answers.department}
  optionLabels={{ billing: "billing", tech: "technical support" }}
/>
```

Score levels fall back to the answer's own `legend`, so they usually need no mapping at all.

## Confidence bands

Confidence is split into act, confirm, and escalate. The cutoffs are yours, because the right values depend on what being wrong costs.

```tsx
<DecisionMeter
  label="approve transfer"
  answer={answers.action}
  confidenceBands={{ high: 0.95, medium: 0.8 }}
/>
```

## States

```tsx
<DecisionMeter label="best match" state="loading" />
<DecisionMeter label="best match" state="unconfigured" />
```

Use `unconfigured` when the API key is missing, so the interface degrades quietly instead of erroring.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | _required_ | Question name, shown in the header. |
| `answer` | `ChoiceAnswer \| ScoreAnswer \| NoulAnswer` | — | Pass `response.answers.<id>` directly. |
| `threshold` | `number` | — | Draws the gate line. Also gates the Choice abstain state. Defaults to `0.5` for a Noul. |
| `maxRows` | `number` | `5` | Choice rows shown before the tail collapses. |
| `model` | `string` | — | Model id in the header. Pass `response.model`. |
| `state` | `"loading" \| "ready" \| "unconfigured"` | `"ready"` | Placeholder states. |
| `optionLabels` | `Record<string, string>` | — | Display names, keyed by option id or level index. |
| `confidenceBands` | `{ high: number; medium: number }` | `{ high: 0.75, medium: 0.5 }` | Act, confirm, and escalate cutoffs. |
| `formatProbability` | `(p: number) => string` | two decimals | Formats every probability and the confidence value. |
| `animate` | `boolean` | `true` | Grows the bars on mount and on answer change. |
| `className` | `string` | — | Extra classes for the root. |

## Notes & features

- **A Noul gets no confidence readout.** Noul answers carry no `confidence` field, because the probability already is the belief. The component switches on answer shape, so it cannot render a number the model never returned.
- **A Noul near even odds reads as uncertain.** Anything within `0.1` of `0.5` is captioned `uncertain` rather than given a direction, because a Noul of `0.5` means yes and no are close to equally likely, not that the answer is medium.
- **Score keeps its fraction.** A `score` of `2.05` renders as `2.05`, not `2`. The position between levels is real signal and rounding it away throws most of it out.
- **Score reads top down.** Levels are drawn highest first so that scanning downward matches the numbers falling, while the level index stays visible on the left because `legend` counts up from zero.
- **One Choice is a whole ranking.** `probabilities` covers every option, not just the winner, so a single question produces the full sorted list. No follow-up calls.
- **Structural answer types.** `ChoiceAnswer`, `ScoreAnswer`, and `NoulAnswer` are declared by shape rather than imported, so the component has no dependency on the TypeSafe SDK and an SDK answer satisfies them without a cast. `probabilities` and `legend` accept an array in level order or a record keyed by level index.
- **Reduced motion.** Bars render at their final width immediately when the operating system asks for reduced motion.
- **Accessibility.** Every track is a `progressbar` carrying its own label and formatted value.

## Setup notes

No provider and no wrapper needed. To fetch real answers, install the SDK and keep the key server side, because the browser should never hold it:

```bash
npm install @typesafe-ai/sdk
```

Pin the model when you have tuned thresholds against it. `jev-latest` moves, which can shift answers underneath your cutoffs:

```ts
const client = new TypeSafeClient({ model: "jev-1.13.0" });
```
