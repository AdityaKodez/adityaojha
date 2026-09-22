## Usage

```tsx
import { StackRolodex } from "@/components/ui/stack-rolodex";
import { SiGithub, SiPrisma, SiSupabase, SiVercel } from "react-icons/si";

const STACK = [
  { id: "vercel", name: "Vercel", icon: SiVercel },
  { id: "github", name: "GitHub", icon: SiGithub },
  { id: "supabase", name: "Supabase", icon: SiSupabase },
  { id: "prisma", name: "Prisma", icon: SiPrisma },
];

export function StackSection() {
  return <StackRolodex items={STACK} label="in my stack" />;
}
```

The only required prop is `items`. Each item needs an `id`, a `name`, and an
`icon`, which is any component that accepts a `className`: react-icons,
lucide-react, or your own SVG components all work.

## Label

`label` renders a static line beside the stack. Omit it to render the stack on
its own.

```tsx
<StackRolodex items={STACK} />
```

## Brand colors

An item can carry its brand `color`. When that item reaches the active slot,
its icon takes the color, settled with a CSS transition in step with the
motion. The pill itself keeps the same neutral styling in every slot.

```tsx
const STACK = [
  { id: "supabase", name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { id: "stripe", name: "Stripe", icon: SiStripe, color: "#635BFF" },
];
```

Items without a `color` keep the default neutral styling, which suits
monochrome brands like Vercel or GitHub.

## Timing and depth

`interval` sets the milliseconds between rotations and `step` the vertical
distance between neighbouring pills in pixels. Three pills stay visible on
each side of the active one; anything further out fades to nothing, and the
stack itself dissolves at both ends through a mask.

```tsx
<StackRolodex items={STACK} label="in my stack" interval={1500} step={56} />
```

## Props

`StackRolodex`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `StackRolodexItem[]` | _required_ | Pills to cycle through. Needs at least two items to rotate. |
| `label` | `string` | - | Static line rendered beside the stack. Omit to render the stack alone. |
| `interval` | `number` | `2000` | Milliseconds between rotations. |
| `step` | `number` | `50` | Vertical distance between neighbouring pills, in pixels. |
| `className` | `string` | - | Extra classes for the root. |

`StackRolodexItem`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | `string` | _required_ | Stable key for the pill. |
| `name` | `string` | _required_ | Text inside the pill. |
| `icon` | `ComponentType<{ className?: string }>` | _required_ | Any icon component, sized by the pill. |
| `color` | `string` | - | Brand color the icon takes while the pill is active. |

## Notes & features

- **Continuous wraparound.** The active index grows forever and each pill's
  offset wraps into a centred window, so the rotation never hits an edge or
  snaps back to the start. Pills that cross the wrap point teleport with a
  zero-duration transition instead of sweeping across the stack.
- **Depth by distance.** Pills shrink and fade the further they sit from the
  active slot, and the stack is masked at both ends so the top and bottom
  pills dissolve instead of clipping.
- **Brand colors on the active pill.** An optional per-item `color` tints the
  active pill's icon while the pill keeps its neutral styling. The color
  change rides a CSS transition, so only `transform` and `opacity` run through
  Motion.
- **Reduced motion.** When the operating system asks for reduced motion, the
  transitions collapse to zero duration. The rotation still steps, it just
  stops animating.
- **Any icon set.** Items take icon components rather than image URLs, so
  brand icons from react-icons, glyphs from lucide-react, or hand-drawn SVG
  components all drop in.
