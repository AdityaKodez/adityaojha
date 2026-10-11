## Usage

```tsx
import { FluidTestimonialCard } from "@/components/ui/fluid-testimonial-card";

export function CustomerQuote() {
  return (
    <FluidTestimonialCard
      quote="Small details, thoughtfully done."
      description="The whole experience feels clear and effortless."
      author="Maya Chen"
      role="Product designer"
    />
  );
}
```

`quote` and `author` are required. All other props are optional, so you can render just the quote and its attribution. Without an avatar, the footer shows the author's initials.

```tsx
<FluidTestimonialCard
  quote="Exactly what our team needed."
  author="Alex Rivera"
/>
```

All testimonial text comes from your props. The component renders one card, so you can place it in your existing layout.

## Props

The component exports `FluidTestimonialCardProps` for typed wrappers and testimonial data.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `quote` | `string` | required | Main quote, rendered in a serif face. |
| `author` | `string` | required | Author name in the footer. Also supplies initials for the avatar fallback. |
| `description` | `string` | - | Smaller supporting text beneath the quote. |
| `role` | `string` | - | Muted attribution line beneath the author name. |
| `avatarSrc` | `string` | - | Decorative portrait URL. Missing or failed images fall back to the author's initials. |
| `avatar` | `ReactNode` | - | Custom decorative avatar. Takes precedence over `avatarSrc` and the initials fallback. |
| `colors` | `readonly [string, string, string]` | Yellow, orange, cream | CSS colors for the first glow, second accent, and third highlight. Dark mode derives deeper shades. |
| `liftAmount` | `number` | `14` | Upward lift in pixels, clamped to 0 through 32. Invalid or nonfinite values use 14. |
| `className` | `string` | - | Extra classes for the root card. |

## Palette and lift

Pass three CSS colors to customize the wash and use `liftAmount` to control how far the card rises on hover or focus:

```tsx
<FluidTestimonialCard
  quote="A calmer way to work."
  author="Sam Patel"
  colors={["var(--chart-1)", "var(--chart-2)", "var(--chart-4)"]}
  liftAmount={8}
/>
```

Omit `colors` to retain the default warm palette. Set `liftAmount={0}` to keep the card in place while the wash still flows. Reduced motion always disables lift and gradient drift.

The showcase's Props panel lets you select a palette and adjust lift from 0 to 32px in the live preview. The default Ember selection preserves the component's built-in colors. Use Reset to restore the default palette and 14px lift.

## Custom avatars

Pass an avatar component or inline SVG through `avatar` to replace the portrait or initials. This example uses your theme's semantic colors and needs no avatar dependency.

```tsx
import { FluidTestimonialCard } from "@/components/ui/fluid-testimonial-card";

export function CustomerQuote() {
  return (
    <FluidTestimonialCard
      quote="Small details, thoughtfully done."
      author="Maya Chen"
      avatar={
        <svg viewBox="0 0 32 32" className="size-full" aria-hidden="true">
          <rect width="32" height="32" fill="var(--accent)" />
          <circle cx="16" cy="12" r="6" fill="var(--foreground)" />
          <path d="M4 32a12 12 0 0 1 24 0Z" fill="var(--foreground)" />
        </svg>
      }
    />
  );
}
```

Custom avatars render inside the same 32px decorative container and are hidden from screen readers. Keep this slot to visual content without interactive controls.

## Interaction and accessibility

The card rests on a neutral background. Pointer hover and keyboard focus lift it slightly and reveal a moving gradient across its lower half. The default palette uses warm yellow and orange in light mode and deeper copper and ember tones in dark mode. The text stays still and readable above the decorative wash.

The gradient drifts only while the card is hovered or focused. When neither state is active, the card settles back to its resting position and the wash fades out.

Touching the card focuses it and reveals the effect without scrolling it into view. The effect stays active while the card has focus and releases when focus moves away.

Keyboard users can reach the card with Tab and see a visible focus indicator. Focusing the card reveals the same visual treatment as hovering; it does not trigger navigation or an action.

The portrait and gradient are decorative. The visible quote and author provide the testimonial's content and attribution, so the portrait does not repeat the author's name to screen readers.

With reduced motion enabled, interaction reveals a static warm wash without lifting the card or drifting the gradient.

## Styling

The card defaults to 256px wide with a minimum height of 360px. It shrinks to fit narrower containers and grows vertically for longer content. Long quotes and attribution text wrap naturally.

Use `className` to adapt the width or spacing to your layout:

```tsx
<FluidTestimonialCard
  quote="A calmer way to work."
  author="Sam Patel"
  className="w-full max-w-sm"
/>
```

The quote uses Tailwind's `font-serif` utility, so it inherits your project's configured serif stack. The component does not load a font or require a provider. Its animation uses `motion`, and class overrides merge through the conventional `@/lib/utils` helper.
