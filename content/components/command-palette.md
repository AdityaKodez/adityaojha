## Usage

```tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { House, Moon, SunMoon } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";

export function AppShell() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>open palette</button>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        recents
        groups={[
          {
            label: "Navigate",
            items: [
              {
                id: "go-home",
                label: "Go home",
                icon: <House className="size-4" />,
                onSelect: () => router.push("/"),
              },
              {
                id: "theme",
                label: "Change theme…",
                icon: <SunMoon className="size-4" />,
                page: "theme",
              },
            ],
          },
        ]}
        pages={[
          {
            id: "theme",
            label: "Theme",
            items: [
              {
                id: "theme-dark",
                label: "Dark",
                icon: <Moon className="size-4" />,
                onSelect: () => setTheme("dark"),
              },
            ],
          },
        ]}
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `groups` | `CommandPaletteGroup[]` | `[]` | Top-level groups rendered in order. Each item needs a unique `id` and `label`; `icon`, `shortcut`, `badge`, and `keywords` are optional dressing. |
| `pages` | `CommandPalettePage[]` | `[]` | Drill-down pages. An item with `page: "<id>"` slides into that page instead of closing the palette; the header grows a back button. |
| `open` / `onOpenChange` | `boolean` | uncontrolled | Fully controlled or self-managed — omit both and the palette drives itself from the hotkey. |
| `hotkey` | `string \| false` | `"k"` | Registers a global ⌘/Ctrl + key toggle. `false` disables the listener entirely. |
| `recents` | `boolean` | `false` | Remembers the last picked items in `localStorage` and offers them in a `recent` group while the search is empty. |
| `storageKey` | `string` | `"command-palette:recents"` | Where recents persist. Change it to keep multiple palettes isolated. |
| `maxRecents` | `number` | `3` | How many recents to keep and show. |
| `disableOnMobile` | `boolean` | `false` | Blocks the palette from opening on viewports under 640px — the trigger, hotkey, and outside events all no-op there. |
| `placeholder` | `string` | `"Type a command or search…"` | Search placeholder on the root page. |
| `emptyLabel` | `string` | `"No matching commands"` | Empty-state text when there is no query. |
| `className` | `string` | — | Extra classes for the floating panel. |

## Notes & Features

- **Keyboard first.** Arrow keys cycle (and wrap), `enter` runs the active row, `esc` clears the query, backs out of a drill-down page, or closes. `backspace` on an empty search also steps back from drill-down pages. ⌘K / Ctrl+K toggles the palette from anywhere on the page.
- **Drill-down pages.** Items can point at a sub-page (`change theme…` → `light / dark / system`). Page transitions slide directionally — forward on drill, back on return — and the search resets between pages.
- **Recents.** Picked items are recorded per `storageKey`; stale ids that no longer exist are simply skipped, and drill items are never recorded.
- **Search is multi-token match over label + keywords.** Every word in the query must match the item's label or keywords in any order, so discovery remains flexible while results stay predictable without fuzzy score surprises.
- **Accessible.** Radix dialog semantics with a visually hidden title, a labelled search input, `aria-live`-friendly feedback left to the host page, and `role="option"` rows from cmdk.
- **No visible scrollbar.** The list scrolls with the scrollbar fully hidden — `scrollbar-width: none` inline (so it wins over aggressive global resets), plus a `::-webkit-scrollbar` fallback for older engines.
- **Motion with restraint.** A quick 150ms panel entrance on the site's standard ease — the content itself appears instantly; only page changes slide — and opacity-only when the OS prefers reduced motion.
- **Mobile.** On large screens the panel is centered in the viewport; below the `sm` breakpoint it docks to the bottom edge as a sheet with rounded top corners.

## Manual installation

Copy `components/ui/command-palette.tsx` into your project and install the dependencies:

```bash
npm i cmdk motion radix-ui lucide-react
```

The dialog shell is built directly on `radix-ui`. The row shortcut chips use the shadcn `kbd` primitive — the CLI adds it via `registryDependencies`, or copy `components/ui/kbd.tsx` from a default shadcn setup.
