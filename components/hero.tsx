"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { heroConfig } from "@/config/hero";
import { siteConfig } from "@/config/site";
import { Globe2Icon } from "lucide-react";
import { motion } from "motion/react";
import DiscordStatus from "./discord-status";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { WritingUnderline } from "./writing-underline";

export function Hero() {
  const [beforeHighlight, afterHighlight] = heroConfig.description.split(
    heroConfig.descriptionHighlight,
  );

  return (
    <motion.section
      className="no-js-visible relative z-20 -mt-24 space-y-4 px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-start flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.1, delay: 0.1 }}
          className="no-js-visible relative"
        >
          <Avatar className="size-24 shrink-0 border-2 border-dashed border-foreground/50 bg-background shadow-xl">
            <AvatarImage
              src={siteConfig.personal.avatar.src}
              alt={siteConfig.personal.avatar.alt}
            />
            <AvatarFallback>
              {siteConfig.personal.avatar.fallback}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="space-y-2">
          <motion.p
            className="no-js-visible text-lg font-pixel font-semibold mb-3 flex items-center gap-2 tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {heroConfig.greeting}
            <span
              className="text-2xl hover:animate-wave inline-block"
              style={{ transformOrigin: "70% 70%" }}
            >
              {heroConfig.waveEmoji}
            </span>
          </motion.p>
          <motion.h1
            className="no-js-visible text-3xl font-bold tracking-tight max-sm:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            {heroConfig.headlineBefore}{" "}
            <WritingUnderline delay={0.8}>
              {heroConfig.highlightedPhrases[0]}
            </WritingUnderline>{" "}
            in{" "}
            <WritingUnderline delay={1.2}>
              {heroConfig.highlightedPhrases[1]}
            </WritingUnderline>{" "}
            {heroConfig.headlineAfter}
          </motion.h1>
          <motion.p
            className="no-js-visible mt-4 text-md max-sm:text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            {afterHighlight === undefined ? (
              heroConfig.description
            ) : (
              <>
                {beforeHighlight}
                <span className="underline underline-offset-4 decoration-border/50">
                  {heroConfig.descriptionHighlight}
                </span>
                {afterHighlight}
              </>
            )}
          </motion.p>
          <motion.div
            className="no-js-visible flex mt-6 items-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
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
