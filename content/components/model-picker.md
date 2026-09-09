## Usage

```tsx
import { useState } from "react";
import {
  ModelPicker,
  defaultModelProviders,
} from "@/components/ui/model-picker";

export function ChatComposer() {
  const [model, setModel] = useState("grok-4.6");

  return (
    <ModelPicker
      providers={defaultModelProviders}
      value={model}
      onValueChange={setModel}
      side="top"
    />
  );
}
```

Picking a row keeps the popover open so the thinking track in the footer can be dialled in for the model that was just chosen. Pass `closeOnSelect` when the popover should dismiss on the first click instead.

Pass your own `providers` to swap the catalog. Each provider is an `id`, a `name`, an optional `icon`, and a `models` array. Set `available: false` on a model to hide it from that provider's list. Providers with no available models are omitted from the rail.

```tsx
<ModelPicker
  providers={[
    {
      id: "openai",
      name: "OpenAI",
      models: [
        { id: "gpt-5.6-sol", name: "GPT-5.6 Sol", capabilities: ["reasoning", "image"], thinking: ["low", "medium", "high", "max"] },
        { id: "gpt-5.6-luna", name: "GPT-5.6 Luna", capabilities: ["image"] },
      ],
    },
  ]}
  placeholder="Select a model"
/>
```

Unknown provider ids without an `icon` fall back to the first letter of the provider name. Built-in marks use the brand files in `public/ai/` for `openai`, `anthropic`, and `google`. `xai` uses the Grok mark already in `ask-ai`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `providers` | `readonly ModelPickerProvider[]` | required | Provider catalog. Models with `available: false` are omitted. |
| `value` | `string` | - | Controlled selected model id. |
| `defaultValue` | `string` | - | Initial model id when uncontrolled. |
| `onValueChange` | `(modelId: string, providerId: string, thinking?: ThinkingEffort) => void` | - | Fires when a model row or a thinking level is committed. |
| `thinking` | `ThinkingEffort` | - | Controlled thinking effort for the selected model. |
| `defaultThinking` | `ThinkingEffort` | - | Initial thinking effort when uncontrolled. |
| `closeOnSelect` | `boolean` | `false` | Close the popover as soon as a model row is picked. Off by default so the thinking track stays reachable. |
| `open` | `boolean` | - | Controlled open state for the popover. |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when the open state changes. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Placement side for the popover relative to the trigger. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment of the popover along the trigger edge. |
| `placeholder` | `string` | `"Select a model"` | Trigger text when nothing is selected. |
| `className` | `string` | - | Extra class names forwarded to the trigger. |

## Notes & Features

- **Search.** A search field sits above the two panes and takes focus when the popover opens. It matches on model name, model id, description, and provider name, and it searches across every provider at once, so results are not limited to the active rail. Matching rows carry the provider mark, the header switches to a result count, and a clear button plus Escape reset the query. Clicking a provider icon also clears it.
- **Two-pane popover.** A vertical provider rail on the left, the available models for that provider on the right. Click a provider icon to switch the list without closing.
- **Availability filtering.** Only models with `available !== false` are listed. Providers that have none left drop off the rail.
- **Capability chips.** Each row can show a brain (reasoning) and an image mark in the corner. Hover for the label.
- **One thinking track.** Effort lives in a single footer segmented control instead of repeating on every row. The indicator slides to the picked level and the track only lists the levels the selected model supports. Models without a thinking control read "Not available for this model".
- **Effort meter.** Stepped bars fill up to the current level, in the footer and on the trigger chip.
- **Chat-style trigger.** Compact chip with the provider mark, the current model name, the effort meter with its label, and a chevron. The effort chip is hidden on the narrowest screens.
- **Responsive.** The popover clamps to `min(26rem, 100vw - 24px)`. The rail, chips, and footer tighten on small screens, and the footer stacks its label above the track.
- **Keyboard.** Typing filters straight away, then Down moves into the list and Enter takes the first result. Arrow keys move inside the active pane. Left and right jump between the rail and the list. Enter commits a model. Tab reaches the thinking track, where arrows change the level. Escape clears the query first, then closes.
- **Accessible.** Built on Radix UI popover and tooltip primitives. The rail is a `tablist`, the models are a `listbox`, and each icon has a name tooltip.

## Manual installation

Copy `components/ui/model-picker.tsx` and `components/ui/popover.tsx` into your project, then install the required dependencies:

```bash
npm i radix-ui lucide-react
```

Ensure your project includes the standard shadcn `tooltip` primitive (or copy `components/ui/tooltip.tsx`).
