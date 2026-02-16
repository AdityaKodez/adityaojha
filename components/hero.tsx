"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import OpenSrc from "@/public/stacks/open-src";
import { Moon, PinIcon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./ui/kbd";
import { WritingUnderline } from "./writing-underline";
import DiscordStatus from "./discord-status";

export function Hero() {
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

      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <motion.section
      className="no-js-visible space-y-4 px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center justify-end">
        <div className="flex items-center overflow-hidden rounded-md border border-border/60 divide-x divide-border/60">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://github.com/AdityaKodez/adityaojha"
                target="_blank"
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <OpenSrc size="20" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>This project is open source !</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer rounded-none border-0"
                onClick={() => {
                  toggleTheme();
                }}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Toggle theme <Kbd>D</Kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <audio ref={audioRef} src="/switch.mp3" preload="auto" />
      <div className="flex items-start max-sm:flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="no-js-visible"
        >
          <Avatar className="h-20 w-20 shrink-0 border border-dashed hover:border-foreground/50 transition-colors ring-0">
            <AvatarImage src="/profile.png" alt="@akcll" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="space-y-2">
          <motion.p
            className="no-js-visible text-lg font-semibold mb-3 flex items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Hello, I&apos;m Aditya Ojha
          </motion.p>
          <motion.h1
            className="no-js-visible text-3xl font-bold tracking-tight max-sm:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            I ship{" "}
            <WritingUnderline delay={0.8}>
              production-ready SaaS MVPs
            </WritingUnderline>{" "}
            in <WritingUnderline delay={1.2}>2–4 weeks</WritingUnderline> using
            Next.js and Prisma.
          </motion.h1>
          <motion.p
            className="no-js-visible mt-4 text-md max-sm:text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            Built and shipped full-stack products with{" "}
            <span className="underline underline-offset-4 decoration-border/50">
              real users
            </span>
            . Strong focus on auth, data models, and iteration speed.
          </motion.p>
          <motion.div
            className="no-js-visible flex items-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <PinIcon className="h-4 w-4" />
                <span>New Delhi, India</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>UTC +5:30</span>
              </TooltipContent>
            </Tooltip>

            <DiscordStatus />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
