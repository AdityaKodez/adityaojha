"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Peerlist from "@/public/peerlist";
import OpenSrc from "@/public/stacks/open-src";
import X from "@/public/x-icon";
import { Check, Copy, Moon, PinIcon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./ui/kbd";
import { WritingUnderline } from "./writing-underline";

export function Hero() {
  const { setTheme, resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const copyDiscordId = useCallback(() => {
    navigator.clipboard.writeText("t1x_faker");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
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

      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyDiscordId();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [copyDiscordId]);

  return (
    <motion.section
      className="space-y-4 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex justify-end items-center">
        <div className="border-r pr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://github.com/AdityaKodez/adityaojha"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <OpenSrc size="20" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>This project is open source !</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer border-r"
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

      <audio ref={audioRef} src="/switch.mp3" preload="auto" />
      <div className="flex items-start max-sm:flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Avatar className="h-20 w-20 shrink-0 border border-dashed hover:border-foreground/50 transition-colors ring-0">
            <AvatarImage src="/profile.png" alt="@akcll" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="space-y-2">
          <motion.h2
            className="text-xl font-semibold mb-3 flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Hello, I&apos;m Aditya Ojha
          </motion.h2>
          <motion.h1
            className="text-3xl font-bold tracking-tight max-sm:text-2xl"
            initial={{ opacity: 0, y: 10 }}
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
            className="text-md max-sm:text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            Built and shipped 2 full-stack products with{" "}
            <span className="underline underline-offset-4 decoration-border/50">
              real users
            </span>
            . Strong focus on auth, data models, and iteration speed.
          </motion.p>
          <motion.div
            className="flex items-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
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

            <Badge variant="outline" className="gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Open to work
            </Badge>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 pt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="https://github.com/AdityaKodez"
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={24}
                      height={24}
                    />
                  </Link>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="https://x.com/AdiKodez"
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size="20" color="currentColor" />
                  </Link>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>X (Twitter)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="https://peerlist.io/faker"
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Peerlist size="20" />
                  </Link>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Peerlist</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={copyDiscordId}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Image
                    src="/discord.svg"
                    alt="Discord"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm">@t1x_faker</span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {copied ? "Copied!" : "Click to copy"} <Kbd>C</Kbd>
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
