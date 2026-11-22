## Usage

```tsx
import {
  GitHubCalendar,
  type ContributionDay,
} from "@/components/ui/github-map";

const contributions: ContributionDay[] = [
  { date: "2025-01-01", count: 3 },
  {
    date: "2025-01-02",
    count: 8,
    newRepositories: [{ name: "trazo-stickers", stars: 142 }],
  },
  { date: "2025-01-03", count: 0 },
  // ... up to a full year of UTC YYYY-MM-DD entries
];

export function ActivitySection() {
  return <GitHubCalendar data={contributions} minWeeks={57} />;
}
```

Pass daily contribution entries keyed by `YYYY-MM-DD` UTC dates. Weeks are constructed Sunday-first from the supplied date range without relying on the client clock or `date-fns`.

## Props

The component exports `GitHubCalendarProps`, `ContributionDay`, `NewRepository`, `GitHubCalendarLabels`, `defaultRepoStickers`, and `buildActivityCalendar`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `data` | `readonly ContributionDay[]` | required | Daily UTC `YYYY-MM-DD` entries with non-negative integer counts. An empty array renders nothing. |
| `colors` | `readonly string[]` | 5 `--heatmap-level-*` tokens with `oklch` fallbacks | Five-stop intensity ramp for levels 0 through 4+. |
| `minWeeks` | `number` | `0` | Minimum week columns to render. Pads forward with faint outlined upcoming circles to fill a wider frame. |
| `showCounts` | `boolean` | `true` | Displays the daily contribution count directly inside non-zero circular dots. |
| `showLegend` | `boolean` | `true` | Renders the Less to More scale below the grid, plus the `New repo` sticker key when repository markers are present. |
| `animateOnScroll` | `boolean` | `true` | Plays a once-only left-to-right dot pop-in wave when the grid scrolls into view. |
| `stickers` | `readonly StickerDef[]` | `defaultRepoStickers` (12 curated `trazo-stickers`) | Stickers cycled across days that include `newRepositories`. Pass `[]` to disable stickers. |
| `labels` | `GitHubCalendarLabels` | English defaults | Overrides accessible labels, keyboard hint text, weekday names, and legend copy. |
| `className` | `string` | - | Extra classes for the root wrapper. |

## Contribution fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `date` | `string` | required | Unique UTC calendar date in `YYYY-MM-DD` format. |
| `count` | `number` | required | Non-negative safe integer contribution count for that day. |
| `newRepositories` | `Array<{ name: string; stars: number }>` | - | Optional public repositories launched on that date. Replaces the dot with a `trazo-stickers` marker and shows repository names with star counts in the tooltip. |

## Interaction and accessibility

- **Gliding shared tooltip.** One `pointer-events-none` tooltip glides smoothly between hovered cells with GPU-composited transforms, flips below near the top edge, pins on tap for touch devices, and dismisses on scroll, blur, outside pointer press, or `Escape`.
- **Keyboard grid navigation.** Implements an ARIA `grid` with roving `tabIndex`. Arrow keys move across days and weeks, `Home` and `End` jump to the first and last week in the row, and `Ctrl+Home` and `Ctrl+End` jump to the first and last day.
- **Scroll-wave reveal.** When the calendar first enters the viewport, dots pop in from left to right using opacity and scale only. Reduced motion, no JavaScript, and calendars already visible on load render immediately.
- **Responsive horizontal rail.** Narrow containers scroll horizontally without moving the page and open scrolled to the most recent week.

## Styling

- **Theme-aware defaults.** Uses `--heatmap-level-0` through `--heatmap-level-4` with built-in `oklch` fallbacks, adapting automatically to light mode, dark mode, or custom hex palettes.
- **Automatic ink contrast.** Inline dot numbers adapt to theme tokens for CSS variable ramps and switch between dark ink and white text based on luminance for custom hex ramps.
