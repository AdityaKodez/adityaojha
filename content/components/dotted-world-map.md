## Installation

The component is part of this site. If you are using it elsewhere, copy `components/ui/dotted-world-map.tsx` into your project — it has no runtime dependencies beyond React and `lucide-react` (icons are optional and only used elsewhere).

## Usage

```tsx
import { DottedWorldMap } from "@/components/ui/dotted-world-map";

const visitors = [
  { name: "London",  lat: 51.5074, lng: -0.1278,  value: 0.92 },
  { name: "Tokyo",   lat: 35.6762, lng: 139.6503, value: 0.85 },
  { name: "Seattle", lat: 47.6062, lng: -122.3321, value: 0.7 },
];

export function HeroMap() {
  return (
    <div className="rounded-md border border-dashed p-2">
      <DottedWorldMap points={visitors} dotRadius={1.6} spacing={5} />
    </div>
  );
}
```

## Props

| Prop            | Type                                       | Default                | Notes                                                          |
|-----------------|--------------------------------------------|------------------------|----------------------------------------------------------------|
| `points`        | `Array<{ lat: number; lng: number; value: number }>` | _required_             | `value` is normalized `0..1`. Dots with `value < 0.02` are skipped. |
| `colors`        | `string[]`                                 | `--heatmap-level-0..4` | Color scale interpolated by `value`. CSS variables adapt to light/dark automatically. |
| `dotRadius`     | `number`                                   | `1.4`                  | Radius of an individual dot in SVG units.                      |
| `spacing`       | `number`                                   | `5`                    | Distance between dot centers. Smaller = denser.               |
| `cols`          | `number`                                   | `120`                  | Grid resolution — width in dots.                              |
| `rows`          | `number`                                   | `60`                   | Grid resolution — height in dots. Defaults to a 2:1 aspect ratio. |
| `className`     | `string`                                   | —                      | Classes applied to the `<svg>` element.                       |
| `baseOpacity`   | `number`                                   | `0.55`                 | Opacity of the base field of background dots.                 |

## Notes

- **Server-friendly.** The component is a server component by default; no `"use client"` required to render.
- **DOM-light.** The base field is rendered through an SVG `<pattern>` so even a 120×60 grid adds only two DOM nodes for the inactive dots.
- **Theming.** The default color scale is the same `--heatmap-level-*` CSS variables used by `components/ui/github-map.tsx`. Override per theme by passing a custom `colors` array.
- **Custom projections.** The component uses an equirectangular projection. If you need a different projection (Mercator, orthographic globe, Robinson), fork the projection function — it's a single ~10-line helper inside the file.
