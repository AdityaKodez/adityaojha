## Usage

```tsx
import { ModeToggler } from "@/components/ui/mode-toggler";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 h-12">
      <span>my app</span>
      <ModeToggler />
    </header>
  );
}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `className` | `string` | — | Extra classes forwarded to the `<Button>`. Useful for sizing, rounding, or colour overrides when embedding inside a nav strip. |
| `audioSrc` | `string` | — | URL of an audio clip that plays on each toggle. Lazy-instantiated — no network request until the prop is first provided. |
| `audioDelay` | `number` | `200` | ms between the audio starting and the theme switching. Only active when `audioSrc` is set. |

## Notes & Features

- **next-themes integration.** Uses `resolvedTheme` so the correct icon renders on first paint — no flash with OS dark mode.
- **Accessible.** `aria-label` updates dynamically: "switch to light mode" in dark, "switch to dark mode" in light.
- **Composable.** Pass `className` to strip the border/rounding for embedding in a pill group or navbar strip.
- **Audio optional.** Omit `audioSrc` for a silent toggle; pass a `.mp3` or `.ogg` URL to match the site's own click sound.

## Manual installation

Copy `components/ui/mode-toggler.tsx` into your project. Ensure `next-themes` and `lucide-react` are installed, and that your root layout wraps children with `ThemeProvider`:

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```