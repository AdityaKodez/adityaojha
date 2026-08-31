## Usage

```tsx
import { CopyCommandBlock } from "@/components/ui/copy-command-block";

export function InstallationGuide() {
  return (
    <CopyCommandBlock
      commands={{
        npm: "npm install @tanstack/react-query",
        pnpm: "pnpm add @tanstack/react-query",
        yarn: "yarn add @tanstack/react-query",
        bun: "bun add @tanstack/react-query",
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `commands` | `Record<"npm" \| "pnpm" \| "yarn" \| "bun", string> \| string` | `undefined` | Per-package-manager command mapping or template string with `{pm}`, `{runner}`, or `{add}`. |
| `command` | `string` | `undefined` | Single fixed command string (disables tabs). |
| `storageKey` | `string` | `"akoder:package-manager"` | LocalStorage key used to synchronize the user's preferred package manager across the entire site. |
| `showTabs` | `boolean` | `true` | When true and multiple commands provided, displays package manager switcher tabs. |
| `showPrompt` | `boolean` | `true` | Renders terminal prompt indicator (`$`). |
| `className` | `string` | — | Extra CSS classes for wrapper container. |

## Notes & Features

- **Global Package Preference Sync.** Remembers the selected package manager in `localStorage` so switching from npm to pnpm on one card updates all command blocks across the site.
- **Copy Feedback State.** Provides visual icon feedback (Check / Error / Copy) accompanied by a tooltip.
- **Blueprint Styling.** Features dashed border outlines, subtle inner rings, and blueprint grid background.

## Manual installation

Copy `components/ui/copy-command-block.tsx` into your project. Ensure `lucide-react`, `motion`, and the shadcn `tooltip` component are present.
