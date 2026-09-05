"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Contrast,
  Home,
  Layers,
  Link,
  Monitor,
  Moon,
  Search,
  Sun,
  Terminal,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useCallback, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import {
  CommandPalette,
  type CommandPaletteGroup,
  type CommandPalettePage,
} from "@/components/ui/command-palette";

const INSTALL_COMMAND =
  "npx shadcn@latest add https://akoder.xyz/r/command-palette.json";

export function CommandPaletteDemo() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const report = useCallback((label: string) => {
    setLastAction(label);
  }, []);

  const copy = useCallback(
    (value: string, label: string) => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(value).catch(() => {});
      }
      report(label);
    },
    [report],
  );

  const groups: CommandPaletteGroup[] = [
    {
      label: "Navigate",
      items: [
        {
          id: "go-home",
          label: "Go home",
          icon: <Home />,
          keywords: ["landing", "start", "hero"],
          onSelect: () => {
            report("Navigating home…");
            router.push("/");
          },
        },
        {
          id: "go-components",
          label: "Browse components",
          icon: <Layers />,
          keywords: ["registry", "catalog", "showcase"],
          onSelect: () => {
            report("Opening the component catalog…");
            router.push("/components");
          },
        },
        {
          id: "open-github",
          label: "Open GitHub",
          icon: <FaGithub />,
          badge: "external",
          keywords: ["repo", "source", "code", "repository"],
          onSelect: () => {
            report("Opening GitHub…");
            window.open("https://github.com/AdityaKodez/adityaojha", "_blank");
          },
        },
      ],
    },
    {
      label: "Actions",
      items: [
        {
          id: "copy-install",
          label: "Copy install command",
          icon: <Terminal />,
          keywords: ["shadcn", "cli", "npx", "registry"],
          onSelect: () =>
            copy(INSTALL_COMMAND, "Install command copied to clipboard"),
        },
        {
          id: "copy-url",
          label: "Copy site URL",
          icon: <Link />,
          keywords: ["link", "share", "address"],
          onSelect: () => copy("https://akoder.xyz", "Site URL copied to clipboard"),
        },
        {
          id: "change-theme",
          label: "Change theme…",
          icon: <Contrast />,
          keywords: ["dark", "light", "system", "appearance", "mode"],
          page: "theme",
        },
      ],
    },
  ];

  const pages: CommandPalettePage[] = [
    {
      id: "theme",
      label: "Theme",
      placeholder: "Search themes…",
      items: [
        {
          id: "theme-light",
          label: "Light",
          icon: <Sun />,
          onSelect: () => {
            report("Theme set to light");
            setTheme("light");
          },
        },
        {
          id: "theme-dark",
          label: "Dark",
          icon: <Moon />,
          onSelect: () => {
            report("Theme set to dark");
            setTheme("dark");
          },
        },
        {
          id: "theme-system",
          label: "System",
          icon: <Monitor />,
          onSelect: () => {
            report("Theme set to system");
            setTheme("system");
          },
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="inline-flex h-9 items-center gap-2.5 rounded-md bg-muted/30 px-3.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Search className="size-3.5" />
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <p
        aria-live="polite"
        className="min-h-4 font-mono text-xs text-muted-foreground"
      >
        {lastAction ?? "Press ⌘K or click to open"}
      </p>

      {/* the site header owns ⌘K site-wide — the demo stays click-only to avoid
          double-toggling when both instances are mounted */}
      <CommandPalette
        groups={groups}
        pages={pages}
        open={open}
        onOpenChange={setOpen}
        recents
        hotkey={false}
      />
    </div>
  );
}
