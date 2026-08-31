## Usage

```tsx
import { ContactChannels } from "@/components/ui/contact-channels";
import { Github, Mail } from "lucide-react";

const channels = [
  {
    id: "github",
    platform: "github",
    handle: "@octocat",
    href: "https://github.com",
    action: "external",
    icon: <Github className="size-4" />,
  },
  {
    id: "email",
    platform: "email",
    handle: "hi@example.com",
    action: "copy",
    copyValue: "hi@example.com",
    tooltip: "copy email",
    shortcutKey: "e",
    icon: <Mail className="size-4" />,
  },
];

export function Contact() {
  return <ContactChannels items={channels} columns={2} />;
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `ContactChannelItem[]` | _required_ | Each item: `id`, `platform`, `handle`, `href`, `action` (`"copy"` or `"external"`), `copyValue`, `tooltip`, `shortcutKey`, `icon` (a `ReactNode`). |
| `columns` | `1 \| 2 \| 3` | `2` | Grid column count. Collapses to a single column on small screens. |
| `className` | `string` | — | Extra styling classes forwarded to the grid. |

## Notes & Features

- **Copy or link per cell.** Cells with `action: "copy"` write `copyValue` to the clipboard and flip the trailing icon to a check for two seconds; cells with `action: "external"` open `href` in a new tab with a rotating arrow.
- **Single-key shortcuts.** Copy cells may declare a `shortcutKey`; a window-level listener triggers the copy while no input, textarea, or contenteditable element has focus.
- **Icons as nodes.** Icons are plain `ReactNode`s, so any icon set works — lucide, react-icons, or local SVG components. Nothing is imported on your behalf.
- **Hairline grid.** The wrapper draws the top and left rules, each cell draws its bottom and right rule — one border per edge, dashed to match the blueprint language.
- **Accessible.** Every cell is a real `<button>` or `<a>` with visible focus rings and tooltip labels.

## Manual installation

Copy `components/ui/contact-channels.tsx` into your project. Ensure `lucide-react` is installed and that the shadcn `tooltip` primitive is available (install it with `npx shadcn@latest add tooltip`).
