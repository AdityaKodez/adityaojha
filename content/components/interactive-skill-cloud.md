## Usage

```tsx
import { InteractiveSkillCloud } from "@/components/ui/interactive-skill-cloud";
import { Code2, Zap } from "lucide-react";

const items = [
  { id: "react", name: "React", icon: <Code2 className="size-4" /> },
  { id: "zap", name: "tRPC", icon: <Zap className="size-4" /> },
];

export function TechStack() {
  return (
    <InteractiveSkillCloud
      items={items}
      height={360}
    />
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `SkillCloudItem[]` | _required_ | Array of `{ id, name, icon? }`. The `icon` is any React node, so lucide, react-icons, or local SVGs all work. |
| `height` | `number` | `360` | Height of the physics arena in px. |
| `gravity` | `number` | `1` | `1` drops the pills into a pile at the bottom of the arena. Set it to `0` for a float-and-throw playground where pills keep their momentum. |
| `className` | `string` | — | Extra classes forwarded to the container. |
| `children` | `ReactNode` | — | Optional overlay or background content rendered inside the arena. |

## Notes & Features

- **Real physics.** Pills are rigid bodies via [matter.js](https://github.com/liabru/matter-js). On load they rain down and settle into a pile at the bottom; grab one with the mouse and fling it — it collides with the other pills and bounces off all four walls.
- **DOM stay crisp.** Matter drives positions, angles, and velocities, but each pill is a real DOM node (rounded-full capsule with a solid border, inline icon + label). Transforms sync every engine tick, so text never rasterizes. Bodies are plain rectangles sized to each pill — stable for stacking — and the engine sleeps once the pile settles, so it rests fully still.
- **Alive on load.** Pills get a small random shove and a slight initial rotation, so they tumble and bump as they fall, even before you touch them.
- **Reduced-motion safe.** Under `prefers-reduced-motion`, and on the server, it renders a static wrapped cloud instead of running the physics loop.
- **Self-contained.** Icons are passed as props — the component only imports matter.js and your icons.

## Manual installation

Copy `components/ui/interactive-skill-cloud.tsx` into your project. Ensure `matter-js` is installed:

```bash
npm install matter-js
```

The component uses `@types/matter-js` for TypeScript projects. It requires a client component (`"use client"`); there is no server-side physics.
