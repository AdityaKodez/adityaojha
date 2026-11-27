"use client";

import { SiteSticker } from "@/components/shared/site-sticker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VerseText } from "@/components/verse-text";
import { heroConfig } from "@/config/hero";
import { personalClientConfig } from "@/config/site-client";
import { trackEvent } from "@/lib/analytics";
import { MOTION_EASE } from "@/lib/motion";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useHaptic } from "react-haptic";

// Keep blur on the text itself, so the banner and section shell stay sharp.
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(3px)",
    y: 10,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.46,
      ease: MOTION_EASE,
      delay,
      opacity: { duration: 0.24, ease: MOTION_EASE, delay },
    },
  }),
};

const badgeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 5,
    scale: 0.88,
    rotate: -10,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.38,
      ease: MOTION_EASE,
      delay,
      opacity: { duration: 0.2, ease: MOTION_EASE, delay },
    },
  }),
};

const dotVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: MOTION_EASE,
      delay,
    },
  }),
};

const locationTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: personalClientConfig.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function Hero() {
  const { vibrate } = useHaptic();
  const vibrateAudio = useRef<HTMLAudioElement>(null);
  const lastWaveTrackRef = useRef<number>(0);
  const [isLocationTooltipOpen, setIsLocationTooltipOpen] = useState(false);
  const [locationTime, setLocationTime] = useState<string | null>(null);

  const [beforeHighlight, afterHighlight] = heroConfig.description.split(
    heroConfig.descriptionHighlight,
  );
  const headlineAfter = heroConfig.headlineAfter
    ? /^[.,!?;:]/.test(heroConfig.headlineAfter)
      ? heroConfig.headlineAfter
      : ` ${heroConfig.headlineAfter}`
    : "";

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
      className="relative z-20 space-y-4 px-6 pt-0"
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="w-full min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 max-sm:justify-between">
            <div className="flex min-w-0 items-center gap-1 text-xl  font-mono font-semibold tracking-wide sm:text-2xl">
            <VerseText
              text={heroConfig.greeting}
              className="font-serif"
              style={
                {
                  "--vt-ink": "var(--foreground)",
                  "--vt-blend": "var(--verse-text-blend, multiply)",
                  "--vt-leading": "inherit",
                } as CSSProperties
              }
            />
            <motion.span
              data-reveal=""
              variants={badgeVariants}
              custom={0.12}
              className="no-js-visible flex items-center"
            >
              <span
                className="inline-block text-xl leading-none"
                onMouseEnter={() => {
                  vibrate();
                  handleWaveAudio(true, "hover");
                }}
                onMouseLeave={() => handleWaveAudio(false)}
                onFocus={() => handleWaveAudio(true, "hover")}
                onBlur={() => handleWaveAudio(false)}
                onTouchStart={() => handleWaveAudio(true, "touch")}
                onTouchEnd={() => handleWaveAudio(false)}
              >
                {typeof heroConfig.waveEmoji === "string" ? (
                  <span
                    className="inline-block hover:animate-wave"
                    style={{ transformOrigin: "70% 70%" }}
                  >
                    {heroConfig.waveEmoji}
                  </span>
                ) : (
                  <heroConfig.waveEmoji
                    size="1em"
                    loading="eager"
                    style={{ display: "block" }}
                    className="transition-transform duration-200 ease-out motion-safe:hover:scale-110 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                )}
              </span>
            </motion.span>
            </div>
            <motion.span
              data-reveal=""
              variants={dotVariants}
              custom={0.14}
              aria-hidden="true"
              className="no-js-visible size-2 rounded-full bg-muted ring-1 ring-inset ring-muted max-sm:hidden"
            />
            <Tooltip onOpenChange={setIsLocationTooltipOpen}>
              <TooltipTrigger
                className="group micro-transition flex min-h-4 shrink-0 items-center whitespace-nowrap rounded-sm text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 hover:text-foreground sm:text-sm"
              >
                <motion.span
                  data-reveal=""
                  className="no-js-visible flex items-center gap-1.5"
                  variants={textVariants}
                  custom={0.16}
                >
                  <SiteSticker
                    name="earth"
                    size={18}
                    loading="eager"
                    style={{ display: "block" }}
                    className="shrink-0 transition-transform duration-300 ease-out motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:rotate-12 motion-safe:group-focus-visible:scale-110 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  <span className="inline-block font-sans">
                    {personalClientConfig.location.label}
                  </span>
                </motion.span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-sans text-xs tracking-wider">
                  {locationTime ?? "--:--:--"}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>

          <motion.h1
            data-reveal=""
            className="no-js-visible text-lg sm:text-sm md:text-lg font-semibold leading-[1.05] tracking-tight text-balance"
            variants={textVariants}
            custom={0.22}
          >
            <span className="whitespace-nowrap">
              {heroConfig.headlineBefore} {heroConfig.highlightedPhrases[0]}
            </span>{" "}
            <span className="whitespace-nowrap">
              in {heroConfig.highlightedPhrases[1]}
            </span>
            {headlineAfter}
          </motion.h1>

          <motion.p
            data-reveal=""
            className="no-js-visible mt-2 text-sm text-muted-foreground max-sm:text-xs"
            variants={textVariants}
            custom={0.3}
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

        </div>
      </div>

      <audio src="/vibration.mp3" ref={vibrateAudio} loop preload="none" />
    </motion.section>
  );
}
