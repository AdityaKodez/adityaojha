## Usage
  
```tsx
import { DottedWorldMap } from "@/components/ui/dotted-world-map";

const weeklyVisitors = [
  {
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    value: 0.9,
    radius: 12,
    tooltip: "London — 1,120 visitors this week",
  },
  {
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    value: 0.8,
    radius: 12,
    tooltip: "Tokyo — 980 visitors this week",
  },
  {
    name: "New York",
    lat: 40.7128,
    lng: -74.006,
    value: 0.95,
    radius: 13,
    tooltip: "New York — 1,240 visitors this week",
  },
];

export function VisitorsMap() {
  return (
    <DottedWorldMap
      points={weeklyVisitors}
      dotRadius={1.6}
      spacing={5}
      legendLabels={{ low: "Fewer visitors", high: "More visitors" }}
    />
  );
}
```

## Props

| Prop           | Type                                                                                             | Default                          | Notes                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `points`       | `Array<{ name: string; lat: number; lng: number; value: number; radius?: number; tooltip?: string }>` | _required_                       | `value` (0–1) controls heat and marker color. `tooltip` supplies the hover and keyboard detail. Points with `value < 0.02` are skipped. |
| `colors`       | `string[]`                                                                                        | green → red scale                | Color scale interpolated by `value`. Pass CSS variables (e.g. `--heatmap-level-*`) to adapt to light/dark automatically.            |
| `baseColor`    | `string`                                                                                          | `colors[0]`                      | Color for the low-intensity land dots.                                                                                              |
| `dotRadius`    | `number`                                                                                          | `1.7`                            | Radius of an individual land dot in SVG units. Point markers are drawn larger for reliable hover and focus.                          |
| `spacing`      | `number`                                                                                          | `6`                              | Distance between land-dot centers. Smaller = denser.                                                                                 |
| `cols`         | `number`                                                                                          | `120`                            | Grid resolution — width in dots.                                                                                                     |
| `rows`         | `number`                                                                                          | `60`                             | Grid resolution — height in dots. Defaults to a 2:1 aspect ratio.                                                                    |
| `baseOpacity`  | `number`                                                                                          | `0.2`                            | Opacity of the land dots.                                                                                                            |
| `showMarkers`  | `boolean`                                                                                         | `true`                           | Renders an interactive marker per point. Set `false` for a pure heatmap (e.g. density illustration).                                 |
| `showLegend`   | `boolean`                                                                                         | `true`                           | Shows a GitHub-style color scale legend below the map.                                                                               |
| `legendLabels` | `{ low?: string; high?: string }`                                                                 | `{ low: "Less", high: "More" }`  | Labels at the two ends of the legend.                                                                                                |
| `className`    | `string`                                                                                          | —                                | Classes applied to the `<svg>` element.                                                                                              |

## Notes

- **Interactive point data.** Each point gets a large hover and keyboard-focus target. Its tooltip defaults to the location name and activity score when `tooltip` is omitted.
- **Built-in legend.** The legend explains what the colors mean, much like the GitHub contribution graph — swatches run from the low end of the scale to the high end, with configurable labels.
- **Land-only dots.** The background uses a compact Natural Earth land mask, so oceans remain clear instead of forming a rectangular dot field.
- **Theming.** The default color scale is a green → red heat ramp. For theme-aware colors, pass the same `--heatmap-level-*` CSS variables used by `components/ui/github-map.tsx` via the `colors` prop.
- **Custom projections.** The component uses an equirectangular projection. If you need a different projection (Mercator, orthographic globe, Robinson), fork the projection math — lat/lng → x/y happens in two small spots inside the file.

## Manual installation

The CLI is the supported path. If you would rather not use it, copy `components/ui/dotted-world-map.tsx` into your project. It is self-contained: the only imports are `cn` from `@/lib/utils` and the shadcn `tooltip` primitive, so make sure both exist before dropping the file in.
