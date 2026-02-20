"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import OpenSrc from "@/public/stacks/open-src";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { Kbd } from "./ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function Banner() {
  const { setTheme, resolvedTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const toggleTheme = useCallback(() => {
    playAudio();
    setTimeout(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, 200);
  }, [resolvedTheme, setTheme]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === siteConfig.banner.themeShortcut.toLowerCase()) {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <motion.div
      className="relative h-40 w-full overflow-hidden  border-dashed border-b-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Image src={siteConfig.banner.imageSrc} alt={siteConfig.banner.imageAlt} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />

      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center overflow-hidden rounded-md border border-white/15 bg-black/40 backdrop-blur-md divide-x divide-white/15">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={siteConfig.banner.openSourceUrl}
                target="_blank"
                className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white"
              >
                <OpenSrc size="20" />
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
                className="h-8 w-8 cursor-pointer rounded-none border-0 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => {
                  toggleTheme();
                }}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{siteConfig.banner.themeToggleLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {siteConfig.banner.themeTooltip} <Kbd>{siteConfig.banner.themeShortcut}</Kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <audio ref={audioRef} src={siteConfig.banner.switchAudioSrc} preload="auto" />
    </motion.div>
  );
}
