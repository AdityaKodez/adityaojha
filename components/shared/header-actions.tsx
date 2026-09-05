"use client";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import OpenSrc from "@/public/stacks/open-src";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SiteCommandPalette = dynamic(
  () =>
    import("@/components/shared/site-command-palette").then(
      (mod) => mod.SiteCommandPalette,
    ),
  { ssr: false },
);

export function HeaderActions() {
  const { setTheme, resolvedTheme } = useTheme();
  const themeAudioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [starCount, setStarCount] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const playThemeAudio = () => {
    if (themeAudioRef.current) {
      themeAudioRef.current.currentTime = 0;
      themeAudioRef.current.play().catch(() => {});
    }
  };

  const toggleTheme = useCallback((method: "button" | "shortcut_key" = "button") => {
    playThemeAudio();
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    trackEvent("theme_toggled", {
      theme: nextTheme,
      method,
    });
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      if (
        e.key.toLowerCase() === siteConfig.banner.themeShortcut.toLowerCase()
      ) {
        e.preventDefault();
        toggleTheme("shortcut_key");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [toggleTheme]);

  useEffect(() => {
    const controller = new AbortController();
    try {
      const path = new URL(siteConfig.banner.openSourceUrl).pathname
        .split("/")
        .filter(Boolean);
      const [owner, repo] = path;

      if (!owner || !repo) return;

      const fetchStarCount = async () => {
        try {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            { signal: controller.signal },
          );
          if (!response.ok) return;

          const data = (await response.json()) as { stargazers_count?: number };
          if (typeof data.stargazers_count !== "number") return;

          setStarCount(
            new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(data.stargazers_count),
          );
        } catch {
          // silently fail to keep UI stable
        }
      };

      fetchStarCount();
    } catch {
      // silently fail if URL parsing fails
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const themeAudio = themeAudioRef.current;
    return () => {
      themeAudio?.pause();
    };
  }, []);

  return (
    <>
      <div className="pointer-events-auto flex items-center overflow-hidden rounded-md border border-border/60 bg-background/60 backdrop-blur-md divide-x divide-border/60 shadow-xs transition-colors hover:border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="open command palette"
              onClick={() => setPaletteOpen(true)}
              className="flex h-8 items-center justify-center gap-1.5 px-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Search className="h-4 w-4" />
              <span className="max-sm:hidden flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center gap-1">
              command palette <Kbd>⌘</Kbd> <Kbd>K</Kbd>
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={siteConfig.banner.openSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("github_repo_clicked", {
                  repo_url: siteConfig.banner.openSourceUrl,
                  star_count: starCount,
                });
              }}
              className="flex h-8 items-center justify-center gap-1.5 px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <OpenSrc size="18" />
              {starCount ? (
                <span className="text-[10px] leading-none font-mono font-medium">
                  {starCount}
                </span>
              ) : null}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{siteConfig.banner.openSourceTooltip}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer rounded-none border-0 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={() => toggleTheme("button")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">
                {siteConfig.banner.themeToggleLabel}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {siteConfig.banner.themeTooltip}{" "}
              <Kbd>{siteConfig.banner.themeShortcut}</Kbd>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <audio
        ref={themeAudioRef}
        src={siteConfig.banner.switchAudioSrc}
        preload="auto"
      />

      <SiteCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
