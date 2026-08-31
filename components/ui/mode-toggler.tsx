"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ModeTogglerProps {
  /** Extra classes applied to the button wrapper. */
  className?: string;
  /** Play an audio clip when the theme switches. Pass a public URL. */
  audioSrc?: string;
  /** Delay (ms) between the audio playing and the theme switching. Default 200. */
  audioDelay?: number;
}

/**
 * A minimal Sun <-> Moon theme toggle button.
 * Reads and writes next-themes resolved theme. Works with class-based dark mode.
 */
export function ModeToggler({
  className,
  audioSrc,
  audioDelay = 200,
}: ModeTogglerProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioSrc) {
      audioRef.current = new Audio(audioSrc);
    }
  }, [audioSrc]);

  const toggle = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    const next = resolvedTheme === "dark" ? "light" : "dark";
    if (audioRef.current) {
      setTimeout(() => setTheme(next), audioDelay);
    } else {
      setTheme(next);
    }
  }, [resolvedTheme, setTheme, audioDelay]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={toggle}
      aria-label={
        resolvedTheme === "dark" ? "switch to light mode" : "switch to dark mode"
      }
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
