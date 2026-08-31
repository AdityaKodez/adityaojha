## Usage

```tsx
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export function FixedBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <ProgressiveBlur
        position="bottom"
        height="120px"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `position` | `"top" \| "bottom" \| "both"` | `"bottom"` | Edge alignment and gradient direction for the blur falloff mask. |
| `height` | `string` | `"30%"` | Height of the progressive blur overlay (e.g. `"100px"` or `"calc(100px + env(safe-area-inset-bottom))"`). |
| `blurLevels` | `number[]` | `[0.5, 1, 2, 4, 8, 16, 32, 64]` | Exponential blur radii (in pixels) across the segmented mask layers. |
| `className` | `string` | — | Additional styling classes applied to the container div. |
| `children` | `React.ReactNode` | — | Optional child content rendered within the blurred overlay layer. |

## Notes & Features

- **No Harsh Edge Artifacts.** Standard CSS `backdrop-filter: blur(16px)` produces a rigid bounding box. `ProgressiveBlur` stacks multiple sliced sub-layers with gradient alpha masks to create an organic, optical glass fade.
- **Pointer-Events Safe.** Pre-configured with `pointer-events-none` so underlying buttons and links remain fully clickable.
- **Mobile Safe-Area Ready.** Ideal for bottom navbars and floating CTAs combined with CSS `env(safe-area-inset-bottom)`.

## Manual installation

Copy `components/ui/progressive-blur.tsx` into your project.
