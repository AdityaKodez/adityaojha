## Usage

```tsx
import { Snake } from "@/components/ui/snake";

export function Game() {
  return <Snake />;
}
```

Steer with the arrow keys, WASD, or a swipe on touch.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `gridSize` | `number` | `20` | Cells per side. The field is square, so 20 means 20x20. |
| `speed` | `number` | `80` | Milliseconds per step. |
| `initialLength` | `number` | `3` | Segments the snake starts with. |
| `fieldColor` | `string` | `"var(--background, #000000)"` | Play field background. |
| `dotColor` | `string` | `"var(--muted-foreground, #525252)"` | Lattice dots at the cell corners. |
| `snakeColor` | `string` | `"var(--primary, #2563eb)"` | Snake and food. |
| `className` | `string` | None | Additional styling classes applied to the field. |

## Notes & Features

- **Theme tokens by default.** The colors are `var(--token, literal)` references resolved against the computed style of the field, so the game follows the active theme and still renders in a project that lacks the tokens. Pass a literal color to any of the three props to opt out.
- **Walls wrap, bites kill.** The snake re-enters the opposite edge, so the only way to lose is biting your own body. The overlay restarts the run, and the score stays in the header above the field.
- **Grows by exactly one.** Food spawns on a uniformly random free cell, never on the snake, and each eat adds a single segment.
- **No click needed to play.** Keys are captured while the field is on screen, hovered, or focused, so the game responds the moment it scrolls into view. The snake holds still while the field is off screen, and the page keeps its normal arrow-key scrolling then too.
- **One canvas, no dependencies.** The lattice is painted once into an offscreen canvas and blitted each frame, so a frame costs the field fill plus the tokens. Device pixels are respected up to 2x.
- **Background-tab safe.** A hidden tab stops the simulation clock, so returning to the page never fast-forwards the snake into a wall.
