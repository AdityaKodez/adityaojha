"use client";

import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { revealOnMount } from "@/lib/motion";
import dynamic from "next/dynamic";
import { bannerClientConfig } from "@/config/site-client";
import { trackEvent } from "@/lib/analytics";
import { Moon, Search, Sun } from "@/components/shared/site-icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigationConfig } from "@/config/navigation";
import { FaGithub } from "react-icons/fa6";
import { SiteSticker } from "@/components/shared/site-sticker";
import styles from "./site-header.module.css";

const SiteCommandPalette = dynamic(
  () =>
    import("@/components/shared/site-command-palette").then(
      (mod) => mod.SiteCommandPalette,
    ),
  { ssr: false },
);

function GitHubStarIcon() {
  return (
    <span aria-hidden="true" className="relative block size-[16.2px] shrink-0 perspective-near">
      <span className="relative block size-full transform-3d motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:pointer-fine:group-hover:rotate-x-12 motion-safe:pointer-fine:group-hover:rotate-y-180 motion-safe:group-focus-visible:rotate-x-12 motion-safe:group-focus-visible:rotate-y-180">
        <span className="absolute inset-0 backface-hidden">
          <FaGithub className="block size-full" focusable="false" />
        </span>
        <span className="absolute inset-0 rotate-y-180 backface-hidden">
          <SiteSticker
            name="starfish"
            size={16.2}
            loading="eager"
            style={{ display: "block" }}
          />
        </span>
      </span>
    </span>
  );
}

function GitHubNavLink() {
  const [starCount, setStarCount] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    try {
      const path = new URL(bannerClientConfig.openSourceUrl).pathname
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={bannerClientConfig.openSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={navigationConfig.githubLabel}
          onClick={() => {
            trackEvent("github_repo_clicked", {
              repo_url: bannerClientConfig.openSourceUrl,
              star_count: starCount,
            });
          }}
          className={`group ${styles.githubLink} outline-none`}
        >
          <span className={styles.githubFace}>
            <GitHubStarIcon />
            {starCount !== null && <span className="font-mono text-[10px]">{starCount}</span>}
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent><p>{bannerClientConfig.openSourceTooltip}</p></TooltipContent>
    </Tooltip>
  );
}

export function HeaderActions() {
  const { setTheme, resolvedTheme } = useTheme();
  const themeAudioRef = useRef<HTMLAudioElement>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteMounted, setPaletteMounted] = useState(false);

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
        setPaletteMounted(true);
        setPaletteOpen((prev) => !prev);
        return;
      }

      if (
        e.key.toLowerCase() === bannerClientConfig.themeShortcut.toLowerCase()
      ) {
        e.preventDefault();
        toggleTheme("shortcut_key");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [toggleTheme]);

  useEffect(() => {
    const themeAudio = themeAudioRef.current;
    return () => {
      themeAudio?.pause();
    };
  }, []);

  return (
    <>
      <motion.div
        {...revealOnMount({ y: -10 })}
        className="pointer-events-auto flex shrink-0 items-center"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={navigationConfig.search}
              onClick={() => {
                setPaletteMounted(true);
                setPaletteOpen(true);
              }}
              className={`${styles.utility} ${styles.searchUtility} cursor-pointer`}
            >
              <span className={styles.utilityFace}><Search className="size-[14.4px]" /></span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center gap-1">{navigationConfig.search} <Kbd>Ctrl / ⌘</Kbd> <Kbd>K</Kbd></p>
          </TooltipContent>
        </Tooltip>
        <GitHubNavLink />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={bannerClientConfig.themeToggleLabel}
              className={`${styles.utility} cursor-pointer`}
              onClick={() => toggleTheme("button")}
            >
              <span className={styles.utilityFace}>
                <Sun className="size-[14.4px] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 motion-reduce:transition-none" />
                <Moon className="absolute size-[14.4px] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 motion-reduce:transition-none" />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{bannerClientConfig.themeTooltip} <Kbd>{bannerClientConfig.themeShortcut}</Kbd></p>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      <audio
        ref={themeAudioRef}
        src={bannerClientConfig.switchAudioSrc}
        preload="none"
      />

      {paletteMounted && (
        <SiteCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      )}
    </>
  );
}
