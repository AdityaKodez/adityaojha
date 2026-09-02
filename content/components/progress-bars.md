## Usage

```tsx
import { ProgressBars } from "@/components/ui/progress-bars";

const milestones = [
  { id: "dashboard", label: "dashboard", value: 82 },
  { id: "api", label: "api", value: 64 },
  { id: "launch", label: "launch", value: 49 },
];

export function MilestoneProgress() {
  return <ProgressBars items={milestones} />;
}
```

An item only needs a `value`. `label` and `tooltip` are optional.

## Horizontal rows

```tsx
<ProgressBars items={milestones} orientation="horizontal" />
```

## Dot variant

`DotProgress` takes exactly the same props and draws the same bars, except the completed portion is filled with a matrix of dots instead of etched rules.

```tsx
import { DotProgress } from "@/components/ui/progress-bars";

<DotProgress items={milestones} />
<DotProgress items={milestones} orientation="horizontal" />
```

## Props

`ProgressBars`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `ProgressBarItem[]` | _required_ | Each item has `id` and `value`, plus optional `label` and `tooltip`. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Vertical draws a scaled chart; horizontal draws compact rows. |
| `max` | `number` | `100` | Largest possible value. Values outside `0..max` are clipped. |
| `showScale` | `boolean` | `true` | Scale and guide lines, vertical orientation only. |
| `showValues` | `boolean` | `true` | Formatted value beside or above each bar. |
| `showTooltip` | `boolean` | `true` | Hover and keyboard-focus tooltips. |
| `formatValue` | `(value, max) => string` | percentage | Formats values and scale labels. |
| `height` | `number` | `240` | Vertical plot height in pixels. |
| `animate` | `boolean` | `true` | Grows bars once when they enter the viewport. |
| `ariaLabel` | `string` | `"progress bars"` | Accessible name for the chart. |
| `className` | `string` | — | Extra classes for the root. |

`DotProgress` accepts the identical prop set; only the fill texture differs.

## Notes & features

- **Chart only.** No card, heading, or summary strip is included. Compose those around it.
- **Textured fill, outlined remainder.** Only the completed portion carries the fill — rules for `ProgressBars`, dots for `DotProgress`. The rest of the track stays empty behind a hairline outline. Both textures are anchored to the bottom left so the pattern holds still as a bar grows, and both use a token color with a literal fallback so they render outside this site.
- **Keyboard and tooltips.** Each bar or dot row takes focus and exposes its label and formatted value to assistive technology.
- **Reduced motion.** Motion is skipped and final sizes render immediately when the operating system asks for reduced motion.
- **Responsive.** Vertical columns keep a readable width and scroll horizontally rather than collapsing.

## Manual installation

Copy `components/ui/progress-bars.tsx` into your project. Install `motion`, add the shadcn tooltip primitive with `npx shadcn@latest add tooltip`, and mount `TooltipProvider` once near your application root.
