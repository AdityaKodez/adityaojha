## Usage

```tsx
import { GitHubCalendar } from "@/components/ui/github-map";

const contributions = [
  { date: "2025-01-01", count: 3 },
  { date: "2025-01-02", count: 8 },
  { date: "2025-01-03", count: 0 },
  // ... 365 days of activity
];

export function ActivitySection() {
  return (
    <GitHubCalendar
      data={contributions}
      colors={[
        "var(--heatmap-level-0)",
        "var(--heatmap-level-1)",
        "var(--heatmap-level-2)",
        "var(--heatmap-level-3)",
        "var(--heatmap-level-4)",
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `data` | `Array<{ date: string; count: number }>` | _required_ | Array of ISO date strings (`YYYY-MM-DD`) and integer contribution counts over a 12-month interval. |
| `colors` | `string[]` | 5 CSS variables (`--heatmap-level-0` through `--heatmap-level-4`) | Array of 5 color values mapping to activity intensity levels 0 through 4+. |

## Notes & Features

- **Interval Auto-Calculation.** Computes the start and end of week boundaries over the past 12 months using `date-fns`, preventing 30-day month drift.
- **Accessible Tooltips.** Each individual day cell wraps a floating Shadcn tooltip displaying the formatted date (e.g. `Sep 13, 2025: 5 contributions`) for hover and screen readers.
- **Theme-Aware Color Palettes.** Uses CSS custom variables (`--heatmap-level-*`) by default, seamlessly adapting to light, dark, and custom themes.
- **Legend Included.** Renders a "Less &rarr; More" intensity swatch legend below the calendar grid.

## Manual installation

Copy `components/ui/github-map.tsx` into your project. Ensure `date-fns`, `motion`, and the shadcn `tooltip` primitive are installed.
