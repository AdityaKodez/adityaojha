"use client";

import { useEffect, useRef, useState } from "react";
import { useHaptic } from "react-haptic";
import { motion } from "motion/react";
import { Globe2Icon, MailIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { heroConfig } from "@/config/hero";
import { siteConfig } from "@/config/site";
import DiscordStatus from "./discord-status";
import ElectricBorder from "./react-bits/ElectricBorder";
import { HiMail } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { WritingUnderline } from "./writing-underline";

const entryTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1] as const,
};

const interactionSpring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.45,
};

export function Hero() {
  const { vibrate } = useHaptic();
  const [beforeHighlight, afterHighlight] = heroConfig.description.split(
    heroConfig.descriptionHighlight,
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const vibrateAudio = useRef<HTMLAudioElement>(null);
  const stopAudioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [isHovered, setIsHovered] = useState(false);

  const clearAudioStopTimeout = () => {
    if (!stopAudioTimeoutRef.current) {
      return;
    }

    clearTimeout(stopAudioTimeoutRef.current);
    stopAudioTimeoutRef.current = null;
  };

  const handleAudio = (play: boolean) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    clearAudioStopTimeout();

    if (play) {
      audio.playbackRate = 1.12;
      audio.volume = 0.45;
      audio.play().catch(() => {});
      return;
    }

    // A slight delay avoids harsh stop/start jitter during quick pointer moves.
    stopAudioTimeoutRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 120);
  };

  const handleWaveAudio = (play: boolean) => {
    const audio = vibrateAudio.current;
    if (!audio) {
      return;
    }

    if (play) {
      audio.currentTime = 0;
      audio.playbackRate = 1;
      audio.volume = 0.6;
      audio.play().catch(() => {});
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  };

  const startInteractiveState = () => {
    setIsHovered(true);
    handleAudio(true);
  };

  const stopInteractiveState = () => {
    setIsHovered(false);
    handleAudio(false);
  };

  useEffect(() => {
  const audio = audioRef.current;
  const vibrate = vibrateAudio.current;

    return () => {
      clearAudioStopTimeout();
      audio?.pause();
      vibrate?.pause();
    };
  }, []);

  return (
    <motion.section
      className="no-js-visible relative z-20 -mt-14 space-y-4 px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={entryTransition}
    >
      <div className="flex flex-col items-start gap-6">
        <motion.button
          type="button"
          aria-label="Play avatar interaction"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -1.5, scale: 1.015 }}
          whileFocus={{ y: -1.5, scale: 1.015 }}
          whileTap={{ y: 0, scale: 0.995 }}
          transition={interactionSpring}
          onMouseEnter={startInteractiveState}
          onMouseLeave={stopInteractiveState}
          onFocus={startInteractiveState}
          onBlur={stopInteractiveState}
          onClick={() => {
            const audio = audioRef.current;
            if (!audio) {
              return;
            }

            clearAudioStopTimeout();
            audio.currentTime = 0;
            audio.playbackRate = 1.12;
            audio.volume = 0.45;
            audio.play().catch(() => {});
          }}
          className="no-js-visible micro-press micro-transition-slow relative cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ElectricBorder
            color="#FF9644"
            speed={0.2}
            chaos={0.1}
            style={{ borderRadius: "50%" }}
            className={`micro-transition-slow ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <Avatar className="size-24 shrink-0 border-foreground/50 bg-background shadow-xl">
              <AvatarImage
                src={siteConfig.personal.avatar.src}
                alt={siteConfig.personal.avatar.alt}
              />
              <AvatarFallback>
                {siteConfig.personal.avatar.fallback}
              </AvatarFallback>
            </Avatar>
          </ElectricBorder>

          <Avatar
            className={`micro-transition-slow absolute inset-0 size-24 shrink-0 ring-1 ring-border/50 ring-offset-1 ring-offset-background bg-background shadow-xl ${isHovered ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <AvatarImage
              src={siteConfig.personal.avatar.src}
              alt={siteConfig.personal.avatar.alt}
            />
            <AvatarFallback>{siteConfig.personal.avatar.fallback}</AvatarFallback>
          </Avatar>
        </motion.button>

        <audio src="/electric.mp3" ref={audioRef} loop preload="auto" />
        <audio src="/vibration.mp3" ref={vibrateAudio} loop preload="auto" />
        <div className="space-y-2">
          <motion.p
            className="no-js-visible mb-4 flex items-center gap-2 text-lg font-pixel font-semibold tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.1 }}
          >
            {heroConfig.greeting}
            <span
              className="inline-block text-2xl hover:animate-wave"
              onMouseEnter={() => {
                vibrate();
                handleWaveAudio(true);
              }}
              onMouseLeave={() => handleWaveAudio(false)}
              onFocus={() => handleWaveAudio(true)}
              onBlur={() => handleWaveAudio(false)}
              onTouchStart={() => handleWaveAudio(true)}
              onTouchEnd={() => handleWaveAudio(false)}
              style={{ transformOrigin: "70% 70%" }}
            >
              {heroConfig.waveEmoji}
            </span>
          </motion.p>

          <motion.h1
            className="no-js-visible text-3xl font-bold leading-[1.05] tracking-tight text-balance max-sm:text-2xl"
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
            className="no-js-visible mt-4 text-md text-muted-foreground max-sm:text-sm"
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
            className="no-js-visible mt-6 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.28 }}
          >
            <Button asChild size="lg">
              <Link href="mailto:adityakodez@gmail.com">
               <HiMail className="size-5" />
              <span className="text-sm">Discuss your MVP</span>
             
              </Link>
            </Button>
          
          </motion.div>

          <motion.div
            className="no-js-visible mt-4 flex items-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...entryTransition, delay: 0.32 }}
          >
            <Tooltip>
              <TooltipTrigger className="micro-transition flex items-center gap-1.5 rounded-sm px-1 py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20">
                <Globe2Icon className="h-4 w-4" />
                <span className="font-pixel">
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
    </motion.section>
  );
}




