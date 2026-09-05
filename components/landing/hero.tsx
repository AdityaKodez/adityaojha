"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WritingUnderline } from "./writing-underline";
import DiscordStatus from "./discord-status";
import { heroConfig } from "@/config/hero";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { Globe2Icon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useHaptic } from "react-haptic";

const entryTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function Hero() {
  const { vibrate } = useHaptic();
  const vibrateAudio = useRef<HTMLAudioElement>(null);
  const lastWaveTrackRef = useRef<number>(0);

  const [beforeHighlight, afterHighlight] = heroConfig.description.split(
    heroConfig.descriptionHighlight,
  );

  const handleWaveAudio = (play: boolean, interactionType: "hover" | "touch" = "hover") => {
    const audio = vibrateAudio.current;
    if (!audio) {
      return;
    }

    if (play) {
      const now = Date.now();
      if (now - lastWaveTrackRef.current > 5000) {
        trackEvent("hero_wave_hovered", { interaction_type: interactionType });
        lastWaveTrackRef.current = now;
      }
      audio.currentTime = 0;
      audio.playbackRate = 1;
      audio.volume = 0.6;
      audio.play().catch(() => {});
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  };

  useEffect(() => {
    const vibrate = vibrateAudio.current;

    return () => {
      vibrate?.pause();
    };
  }, []);

  return (
    <motion.section
      className="no-js-visible relative z-20 space-y-4 px-6 pt-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={entryTransition}
    >
      <div className="flex flex-col items-start gap-6">
        <div className="space-y-2">
          <motion.p
            className="no-js-visible mb-4 flex items-center gap-2 text-lg font-mono font-semibold tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.1 }}
          >
            <span className="font-serif">{heroConfig.greeting}</span>
            <span
              className="inline-block text-2xl hover:animate-wave"
              onMouseEnter={() => {
                vibrate();
                handleWaveAudio(true, "hover");
              }}
              onMouseLeave={() => handleWaveAudio(false)}
              onFocus={() => handleWaveAudio(true, "hover")}
              onBlur={() => handleWaveAudio(false)}
              onTouchStart={() => handleWaveAudio(true, "touch")}
              onTouchEnd={() => handleWaveAudio(false)}
              style={{ transformOrigin: "70% 70%" }}
            >
              {typeof heroConfig.waveEmoji === "string" ? (
                heroConfig.waveEmoji
              ) : (
                <heroConfig.waveEmoji className="fill-current" />
              )}
            </span>
          </motion.p>

          <motion.h1
            className="no-js-visible text-lg sm:text-xl md:text-2xl font-semibold leading-[1.05] tracking-tight text-balance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.18 }}
          >
            <span className="block">{heroConfig.headlineBefore}</span>
            <span className="underline decoration-border/50 underline-offset-4 sm:hidden">
              {heroConfig.highlightedPhrases[0]}
            </span>
            <span className="hidden sm:inline">
              <WritingUnderline delay={0.8}>
                {heroConfig.highlightedPhrases[0]}
              </WritingUnderline>
            </span>{" "}
            <span className="whitespace-nowrap">
              in{" "}
              <WritingUnderline delay={1.2}>
                {heroConfig.highlightedPhrases[1]}
              </WritingUnderline>
            </span>{" "}
            {heroConfig.headlineAfter}
          </motion.h1>

          <motion.p
            className="no-js-visible mt-4 text-sm text-muted-foreground max-sm:text-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.24 }}
          >
            {afterHighlight === undefined ? (
              heroConfig.description
            ) : (
              <>
                {beforeHighlight}
                <span className="underline decoration-border/50 underline-offset-4">
                  {heroConfig.descriptionHighlight}
                </span>
                {afterHighlight}
              </>
            )}
          </motion.p>

          <motion.div
            className="no-js-visible mt-4 flex items-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.32 }}
          >
            <Tooltip>
              <TooltipTrigger className="micro-transition flex items-center gap-1.5 rounded-sm px-1 py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20">
                <Globe2Icon className="h-4 w-4" />
                <span className="font-sans">
                  {siteConfig.personal.location.label}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>{siteConfig.personal.location.timezone}</span>
              </TooltipContent>
            </Tooltip>

            <DiscordStatus />
          </motion.div>
        </div>
      </div>

      <audio src="/vibration.mp3" ref={vibrateAudio} loop preload="none" />
    </motion.section>
  );
}
