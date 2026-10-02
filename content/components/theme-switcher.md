## Usage

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function AppearanceSettings() {
  return <ThemeSwitcher />;
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `className` | `string` | None | Extra classes on the responsive three-column selector. |
| `disabled` | `boolean` | `false` | Disables all three options and their interactions. |

## Setup

Wrap your app in the `next-themes` provider. If your app already has a provider, reuse it.

```tsx
// components/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

Use that client provider in your root layout and add `suppressHydrationWarning` to `<html>`:

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Interaction

- Click a preview to select Light, Dark, or System. The selection outline slides to the new option and the site theme changes immediately.
- Tab enters the selected option. Arrow keys move focus and selection, wrapping at either end. Home and End select the first and last options. Space or Enter selects the focused option. Tab then leaves the group.
- A focused preview lifts slightly and shows a visible keyboard focus outline. Reduced motion removes movement.
- System follows the device color preference while keeping System selected. `next-themes` saves the choice and synchronizes it across tabs.
- The preview artwork stays fixed in every theme. Multiple instances have independent animation and SVG identifiers.
- Options stay disabled until hydration completes, without changing the selector's size. A provider's `forcedTheme` also disables switching.
