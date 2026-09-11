## Usage

```tsx
import { GlyphCard } from "@/components/ui/glyph-card";

const NEXTJS_GLYPH =
  "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z";

export function Stack() {
  return (
    <GlyphCard
      eyebrow="Framework"
      title="Next.js"
      subtitle="The React framework"
      href="https://nextjs.org"
      glyph={NEXTJS_GLYPH}
    />
  );
}
```

The only required props are `eyebrow`, `title`, and `glyph`. Everything else is
optional.

## The glyph

`glyph` is SVG path data authored on a **24x24 grid**. Drop in any single-path
brand mark and it lands centered in the card.

Omit `href` and the card renders as a static `div` instead of a link.

```tsx
<GlyphCard eyebrow="Framework" title="Next.js" glyph={NEXTJS_GLYPH} />
```

## Accent

`accent` tints the plus marks and the link arrow. It accepts any CSS color and
defaults to `var(--primary, #1447E6)`. Omitting it gives you the primary token,
which reads black on white in most setups.

```tsx
<GlyphCard
  eyebrow="Styling"
  title="Tailwind CSS"
  subtitle="Utility-first CSS"
  href="https://tailwindcss.com"
  glyph={TAILWIND_GLYPH}
  accent="#38BDF8"
/>
```

## Recentering an off-grid mark

Most brand marks are already centered on the 24x24 grid and need nothing. A mark
that is not, for example one whose art only occupies the bottom-right quadrant,
renders off-center. Rather than rewriting the path coordinates, pass the offset
that recenters it in **grid units**.

A mark whose bounding box runs x 10..22 and y 8..24 has a center of (16, 16), so
it wants `glyphOffset={[-4, -4]}` to land on (12, 12).

```tsx
<GlyphCard
  eyebrow="Monogram"
  title="Off-center mark"
  glyph={MONOGRAM_GLYPH}
  glyphOffset={[-4, -4]}
/>
```

## Glyph size

`glyphSize` sets the size of the glyph viewport inside the card's 100x100 field.
The reserved vertical space scales with it, so a larger glyph cannot outgrow its
own card.

```tsx
<GlyphCard
  glyphSize={78}
  eyebrow="Monogram"
  title="Larger glyph"
  glyph={MONOGRAM_GLYPH}
  glyphOffset={[-4, -4]}
/>
```

## Props

`GlyphCard`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `eyebrow` | `string` | _required_ | Small mono label in the top-left. |
| `title` | `string` | _required_ | Rendered as an `h3` in the card footer. |
| `subtitle` | `string` | - | Muted second line under the title. |
| `glyph` | `string` | _required_ | SVG path data authored on a 24x24 grid. |
| `href` | `string` | - | Makes the whole card a link. Omit for a static card. |
| `glyphOffset` | `readonly [number, number]` | - | Shifts the glyph inside the viewBox, in grid units. |
| `glyphSize` | `number` | `62` | Glyph viewport size inside the 100x100 field. |
| `accent` | `string` | `var(--primary, #1447E6)` | Accent for the artwork and link arrow. |
| `className` | `string` | - | Extra classes for the root. |

## Notes & features

- **One path, no icon dependency.** The card takes raw SVG path data rather than
  a React component, so it works with any icon set, including ones you do not
  want to install.
- **Hover and focus are the same state.** Hovering, focusing, or tabbing to a card
  rotates the tiny plus marks 45 degrees, fades them, and gathers a brighter tint
  inside the glyph. The two are wired to one flag so a keyboard user sees exactly
  what a mouse user sees.
- **The tint is masked by the glyph.** Two masks are generated from your path,
  one inverted, so the resting pattern is excluded from the glyph's shape and the
  hover tint is confined to it. Every card gets its own generated ids, so several
  cards can share a page.
- **Reduced motion.** When the operating system asks for reduced motion, the
  transitions collapse and the plus marks hold at their resting angle and
  opacity. State changes still happen, they just stop animating.
- **Self-contained colors.** `accent` and the pattern's mixing color read theme
  tokens with literal fallbacks, so the card renders correctly in a project that
  has neither this site's tokens nor a shadcn setup.
- **Sizing.** The card fills its container's height (`h-full`) and reserves
  vertical space proportional to `glyphSize`. Put it in a grid cell or give the
  wrapper an explicit height.

## Manual installation

Copy `components/ui/glyph-card.tsx` into your project and install `motion` and
`lucide-react`. The component is a client component and needs no provider.
