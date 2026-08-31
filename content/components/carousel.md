## Usage

```tsx
import { Carousel, type CarouselItem } from "@/components/ui/carousel";

const updates: CarouselItem[] = [
  {
    id: "release-checklist",
    title: "Release checklist",
    description: "Keep the final handoff focused on the checks that prevent regressions.",
    content: (
      <ul className="rounded-md border divide-y divide-dashed">
        <li className="p-3">Database migration reviewed</li>
        <li className="p-3">Error states verified on mobile</li>
        <li className="p-3">Release notes shared with support</li>
      </ul>
    ),
  },
  {
    id: "handoff-brief",
    title: "Team handoff",
    description: "Package context, ownership, and the next action in one review card.",
    content: <div className="rounded-md border p-4">Design QA handoff</div>,
  },
];

export function ProductOperationsCarousel() {
  return <Carousel items={updates} ariaLabel="Product operations updates" />;
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `CarouselItem[]` | _required_ | Array of slides (`id`, `title`, `description?`, `content`). |
| `ariaLabel` | `string` | `"Carousel"` | Accessible name for screen readers. |
| `className` | `string` | — | Additional styles applied to outer container. |

### `CarouselItem` Schema

```ts
export type CarouselItem = {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
};
```

## Notes & Features

- **Directional PopLayout Transitions.** Slides enter and exit along the vector of navigation (left/right) inside a stable CSS grid container to prevent height collapse.
- **Keyboard Navigation.** Supports standard WAI-ARIA keys: `ArrowLeft`, `ArrowRight`, `Home` (first slide), and `End` (last slide).
- **Touch Gesture Safety.** Threshold angle checks distinguish between intentional horizontal swipes and vertical page scrolling.
- **Pagination Controls.** Includes interactive progress pill dots and a padded tabular count display (`01 / 04`).

## Manual installation

Copy `components/ui/carousel.tsx` into your project. Ensure `motion` is installed.
