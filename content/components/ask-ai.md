## Usage

```tsx
import { AskAI } from "@/components/ui/ask-ai";

export function Hero() {
  return (
    <AskAI
      prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he is looking for."
      title="ask an ai about me"
      description="a fresh perspective, from your favorite assistant."
      label="ask an ai"
    />
  );
}

// Minimal floating blob trigger with tooltip
export function FloatingAI() {
  return (
    <AskAI
      blobOnly
      size="default"
      side="top"
      align="end"
      tooltip="ask an ai"
      prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he is looking for."
    />
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `prompt` | `string` | required | The query or prompt passed to the selected AI provider or copied to clipboard. |
| `title` | `string` | `"Ask an AI about me"` | Heading text rendered at the top of the popover card. |
| `description` | `string` | `"A fresh perspective, from your favorite assistant."` | Subtitle description rendered below the popover title. |
| `label` | `string` | `"Ask an AI"` | Button label displayed inside the trigger next to the mascot. |
| `tooltip` | `string` | - | Tooltip text displayed when hovering the trigger. Defaults to label or "ask an ai" when blobOnly is enabled. |
| `blobOnly` | `boolean` | `false` | When true, renders only the animated mascot inside a circular trigger without the label text. |
| `providers` | `readonly AIProvider[]` | `defaultAIProviders` | Array of AI provider definitions with brand colors, URL patterns, and query params. |
| `size` | `"default" \| "compact"` | `"default"` | Sizing preset for the trigger pill and mascot. Compact uses tighter padding and a smaller blob mascot. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Placement side for the popover relative to the trigger. The mascot gaze automatically turns toward this side when awake. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment of the popover content along the trigger edge. |
| `open` | `boolean` | - | Controlled open state for the popover. |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when the open state changes. |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled. |
| `className` | `string` | - | Extra class names forwarded to the trigger button. |

## Notes & Features

- **Animated mascot.** Squishy organic blob animation with blinking eyes. When the popover opens, the mascot eyes track the direction of the popover card.
- **Blob-only mode.** Set `blobOnly` to render a clean circular floating action button with only the mascot, paired with an accessible tooltip.
- **Provider shortcuts.** Direct URL launcher for ChatGPT, Claude, Gemini, and Perplexity. Providers with query parameter support open with the prompt pre-filled; providers without URL parameters copy the prompt to the clipboard and open the provider app.
- **Clipboard fallback.** Dedicated copy button with copied confirmation feedback. If clipboard write access is blocked by the browser, an accessible textarea fallback appears so the user can manually copy the prompt.
- **Accessible.** Built on Radix UI popover and tooltip primitives with complete keyboard navigation, focus management, and descriptive aria attributes.
- **Two size presets.** Supports default (56px trigger height) for hero sections and callout banners, and compact (44px trigger height) for navbars and toolbars.

## Manual installation

Copy `components/ui/ask-ai.tsx` and `components/ui/popover.tsx` into your project, then install the required dependencies:

```bash
npm i radix-ui lucide-react
```

Ensure your project includes the standard shadcn `tooltip` primitive (or copy `components/ui/tooltip.tsx`).
