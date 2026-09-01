## Usage

Give each rail item the `id` of its target section. Without an `href`, the rail follows the reading position and scrolls to sections when selected.

```tsx
"use client";

import { SectionRail, type RailItem } from "@/components/section-rail";

const items: RailItem[] = [
  { id: "overview", label: "overview" },
  { id: "installation", label: "installation" },
  { id: "api", label: "api" },
];

export function Article() {
  return (
    <>
      <SectionRail items={items} />
      <article>
        <section id="overview">...</section>
        <section id="installation">...</section>
        <section id="api">...</section>
      </article>
    </>
  );
}
```

### Contained scroll areas

Use the contained variant for a dialog, drawer, or overflow panel. The rail stays attached to the surrounding relative container while observing and scrolling the referenced element.

```tsx
"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { SectionRail } from "@/components/section-rail";

const sections = [
  { id: "intro", label: "intro", body: "## Introduction\n\nStart here." },
  { id: "details", label: "details", body: "## Details\n\nKeep reading." },
];

export function MarkdownGuide() {
  const scrollRootRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <SectionRail
        items={sections}
        variant="contained"
        scrollRootRef={scrollRootRef}
      />
      <div ref={scrollRootRef} className="h-96 overflow-y-auto pl-20">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="min-h-96">
            <ReactMarkdown>{section.body}</ReactMarkdown>
          </section>
        ))}
      </div>
    </div>
  );
}
```

### Link rail

Items with an `href` navigate instead of scrolling. Pass `activeId` to pin the current page.

```tsx
<SectionRail
  activeId="guides"
  items={[
    { id: "home", label: "home", href: "/" },
    { id: "guides", label: "guides", href: "/guides" },
  ]}
/>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `RailItem[]` | _required_ | Ordered marks. Each item needs `id` and `label`; add `href` for navigation or `card` for a rich tooltip. |
| `activeId` | `string` | — | Pins the active mark. Most useful for link rails. |
| `variant` | `"viewport" \| "contained"` | `"viewport"` | Viewport rails are fixed and appear at the `lg` breakpoint; contained rails are absolutely positioned and always visible. |
| `scrollRootRef` | `RefObject<HTMLElement \| null>` | — | Overflow element that owns the target sections in contained mode. |
| `className` | `string` | — | Additional classes for positioning or styling the rail. |

### `RailItem`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Unique item key and the target element ID for scroll items. |
| `label` | `string` | Accessible name and default tooltip copy. |
| `href` | `string` | Turns the mark into a Next.js link. |
| `card` | `{ title; description?; icon? }` | Replaces the plain tooltip with a rich preview card. |

## Notes & features

- **Scroll tracking.** An intersection observer selects the target nearest the center reading band.
- **Reliable final section.** Reaching the bottom of the viewport or contained scroller activates the last item even when it is short.
- **Reduced motion.** Section jumps honor `prefers-reduced-motion`.
- **Accessible controls.** Scroll marks are buttons, links stay links, and `aria-current` identifies the active destination.
- **Stable targets.** IDs must be unique in the document. When `scrollRootRef` is provided, targets outside that element are ignored.
- **Tooltip setup.** Mount shadcn's `TooltipProvider` once near the root of your application.

## Manual installation

Copy `components/section-rail.tsx` into your project. Install the shadcn `tooltip` primitive and ensure the standard `@/lib/utils` `cn` helper is available. The link mode uses Next.js `Link`; replace it with an anchor or your router's link component outside Next.js.
