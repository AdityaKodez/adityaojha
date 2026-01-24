"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import X from "@/public/x-icon";
import { Check, Copy, Moon, PinIcon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Peerlist from "@/public/peerlist";

export function Hero() {
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyDiscordId = () => {
    navigator.clipboard.writeText("t1x_faker");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      className="space-y-4 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <div className="flex items-start max-sm:flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src="/profile.png" alt="@akcll" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="space-y-2">
          <motion.h2
            className="text-xl font-semibold mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Hello, I&apos;m Aditya 👋
          </motion.h2>
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            I ship{" "}
            <span className="underline underline-offset-4 decoration-border">
              production-ready SaaS MVPs
            </span>{" "}
            in{" "}
            <span className="underline underline-offset-4 decoration-border">
              2–4 weeks
            </span>{" "}
            using Next.js and Prisma.
          </motion.h1>
          <motion.p
            className="text-md text-muted-foreground"
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
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://x.com/AdiKodez"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size="20" color="currentColor" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>X (Twitter)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://peerlist.io/faker"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Peerlist size="20" />
                </Link>
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
                <p>{copied ? "Copied!" : "Click to copy"}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
