## Usage

```tsx
import { EmojiReactions } from "@/components/ui/emoji-reactions";

export function Message() {
  return (
    <div className="relative max-w-72 rounded-2xl bg-muted p-4">
      <p>A little bounce makes everything better.</p>
      <EmojiReactions className="absolute -bottom-4 right-3" />
    </div>
  );
}
```

The reaction badge opens a compact picker below the message. Selecting an emoji swaps the reaction on the badge with a short spring bounce. The picker stays open until you click outside, click the badge, or press Escape. Hover only highlights an option. The defaults use native emoji: ❤️ Love, 😂 Laugh, 🔥 Fire, 👑 Crown, and 👍 Like. Emoji appearance follows the device and operating system.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `reactions` | `EmojiReaction[]` | Love, Laugh, Fire, Crown, Like | Custom emoji strings and accessible labels. An empty array disables opening. |
| `value` | `string \| null` | Uncontrolled | Selected reaction id. Null means no reaction. Pair with `onValueChange`; without it, a controlled picker is disabled. |
| `defaultValue` | `string \| null` | `null` | Initial selection for local state. Later changes do not reset it. |
| `onValueChange` | `(value: string) => void` | None | Called when a different reaction is selected. Selection does not dismiss the picker. |
| `disabled` | `boolean` | `false` | Disables the trigger and closes an open picker. |
| `className` | `string` | None | Extra classes on the trigger, useful for positioning on a message. |

### Reaction fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique, stable, non-empty identifier. |
| `emoji` | `string` | Yes | Non-empty emoji displayed in the picker and selected badge. |
| `label` | `string` | Yes | Non-empty accessible name, such as Love. |

Duplicate ids, missing or empty emoji strings, empty ids or labels, and selected ids missing from the list throw descriptive errors. Without a selection, the trigger shows a 🙂 emoji with an Add reaction accessible label. Selecting the current reaction does nothing; reactions are replaced, not toggled off.

## Controlled selection

```tsx
"use client";

import { useState } from "react";
import { EmojiReactions, type EmojiReaction } from "@/components/ui/emoji-reactions";

const reactions: EmojiReaction[] = [
  { id: "love", emoji: "❤️", label: "Love" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "like", emoji: "👍", label: "Like" },
];

export function MessageReaction() {
  const [reaction, setReaction] = useState<string | null>(null);
  return <EmojiReactions reactions={reactions} value={reaction} onValueChange={setReaction} />;
}
```

The owner controls the displayed value. External updates, including clearing to null, are reflected immediately. The component stores no messages, counts, or server data. Custom reactions are plain objects with emoji strings.

## Keyboard and motion

- Enter or Space opens the picker and focuses the selected option, or the first option when none is selected.
- Arrow keys move focus with wrapping; Home and End focus the first and last options. Focus alone does not change the selection. Enter or Space selects.
- Tab or Escape dismisses the picker and returns focus to the trigger. Clicking another focusable element outside preserves that element's focus.
- Pointer selection gives the message's reaction badge a short spring bounce. Rapid selection immediately shows the latest reaction.
- Keyboard selection updates without movement. Reduced motion replaces movement and bounce with brief fades.
- The popover is portaled and adjusts near viewport edges. Multiple instances have independent state and animation identifiers.
