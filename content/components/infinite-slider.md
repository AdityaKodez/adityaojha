## Usage

```tsx
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";

export function TechMarquee() {
  return (
    <InfiniteSlider gap={24} speed={70} speedOnHover={20}>
      <span className="text-sm font-medium">Next.js</span>
      <span className="text-sm font-medium">React</span>
      <span className="text-sm font-medium">TypeScript</span>
      <span className="text-sm font-medium">Tailwind CSS</span>
      <span className="text-sm font-medium">Prisma</span>
    </InfiniteSlider>
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | _required_ | Items to loop seamlessly. Duplicated internally for seamless infinite cycling. |
| `gap` | `number` | `16` | Spacing in pixels between children. |
| `speed` | `number` | `100` | Travel speed in pixels per second. |
| `speedOnHover` | `number` | `undefined` | Optional decelerated speed when hovering over the slider container. |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Axis of movement. |
| `reverse` | `boolean` | `false` | Inverts the translation travel direction. |
| `className` | `string` | — | Extra CSS classes on the outer wrapper. |

## Notes & Features

- **Auto-Measuring & Responsive.** Uses `react-use-measure` to dynamically calculate the exact width/height of child content across screen resizes without jumps.
- **Smooth Hover Deceleration.** Transition gracefully between standard scroll speed and hover speed using Motion animations instead of abrupt CSS pauses.
- **Bi-Directional.** Supports left-to-right, right-to-left, and vertical column marquee scrolling.

## Manual installation

Copy `components/motion-primitives/infinite-slider.tsx` into your project. Ensure `motion` and `react-use-measure` are installed.
