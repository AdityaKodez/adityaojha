"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WritingUnderline } from "./writing-underline";
import { heroConfig } from "@/config/hero";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { MOTION_EASE } from "@/lib/motion";
import { RotatingGlobe } from "./rotating-globe";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useHaptic } from "react-haptic";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};
// Keep blur on the text itself, so the banner and section shell stay sharp.
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(3px)",
    y: 8,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: MOTION_EASE,
      delay,
      opacity: { duration: 0.28, ease: MOTION_EASE, delay },
    },
  }),
};

const locationTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: siteConfig.personal.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function Hero() {
  const { vibrate } = useHaptic();
  const vibrateAudio = useRef<HTMLAudioElement>(null);
  const lastWaveTrackRef = useRef<number>(0);
  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [isLocationTooltipOpen, setIsLocationTooltipOpen] = useState(false);
  const [locationTime, setLocationTime] = useState<string | null>(null);

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
    if (!isLocationTooltipOpen) return;

    const updateLocationTime = () => {
      setLocationTime(locationTimeFormatter.format(new Date()));
    };

    updateLocationTime();
    const intervalId = window.setInterval(updateLocationTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [isLocationTooltipOpen]);

  useEffect(() => {
    const vibrate = vibrateAudio.current;

    return () => {
      vibrate?.pause();
    };
  }, []);

  return (
    <motion.section
      className="relative z-20 space-y-4 px-6 pt-4"
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-start gap-6">
        <div className="space-y-2">
          <motion.p
            className="no-js-visible mb-4 flex flex-wrap gap-x-1.5 gap-y-1 items-center text-lg font-mono font-semibold tracking-wide"
            variants={containerVariants}
          >
            {heroConfig.greeting.split(" ").map((word, index) => (
              <motion.span
                key={index}
                data-reveal=""
                variants={textVariants}
                className="no-js-visible font-serif inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              data-reveal=""
              variants={textVariants}
              className="no-js-visible inline-block"
            >
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
            </motion.span>
          </motion.p>

          <motion.h1
            data-reveal=""
            className="no-js-visible text-lg sm:text-xl md:text-2xl font-semibold leading-[1.05] tracking-tight text-balance"
            variants={textVariants}
            custom={0.1}
          >
            <span className="whitespace-nowrap">
              {heroConfig.headlineBefore}{" "}
              <span className="underline decoration-border/50 underline-offset-4 sm:hidden">
                {heroConfig.highlightedPhrases[0]}
              </span>
              <span className="hidden sm:inline">
                <WritingUnderline delay={0.22}>
                  {heroConfig.highlightedPhrases[0]}
                </WritingUnderline>
              </span>
            </span>{" "}
            <span className="whitespace-nowrap">
              in{" "}
              <WritingUnderline delay={0.36}>
                {heroConfig.highlightedPhrases[1]}
              </WritingUnderline>
            </span>{" "}
            {heroConfig.headlineAfter}
          </motion.h1>

          <motion.p
            data-reveal=""
            className="no-js-visible mt-4 text-sm text-muted-foreground max-sm:text-sm"
            variants={textVariants}
            custom={0.18}
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

          <div
            className="mt-4 flex items-center gap-3 text-sm text-muted-foreground"
          >
            <Tooltip onOpenChange={setIsLocationTooltipOpen}>
              <TooltipTrigger
                className="micro-transition flex items-center gap-1.5 rounded-sm py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 hover:text-foreground"
                onMouseEnter={() => setIsLocationHovered(true)}
                onMouseLeave={() => setIsLocationHovered(false)}
                onFocus={() => setIsLocationHovered(true)}
                onBlur={() => setIsLocationHovered(false)}
              >
                <RotatingGlobe isHovered={isLocationHovered} />
                <motion.span
                  data-reveal=""
                  className="no-js-visible inline-block font-sans"
                  variants={textVariants}
                  custom={0.26}
                >
                  {siteConfig.personal.location.label}
                </motion.span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-sans text-xs tracking-wider">
                  {locationTime ?? "--:--:--"}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <audio src="/vibration.mp3" ref={vibrateAudio} loop preload="none" />
    </motion.section>
  );
}
