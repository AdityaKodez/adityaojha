"use client";

import Peerlist from "@/public/peerlist";
import Gmail from "@/public/stacks/gmail";
import X from "@/public/x-icon";
import { Check, Coffee, Copy } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Kbd } from "./ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const socials = [
  {
    platform: "GitHub",
    handle: "@AdityaKodez",
    href: "https://github.com/AdityaKodez",
    icon: "github",
  },
  {
    platform: "X (Twitter)",
    handle: "@AdiKodez",
    href: "https://x.com/AdiKodez",
    icon: "x",
  },
  {
    platform: "Peerlist",
    handle: "@faker",
    href: "https://peerlist.io/faker",
    icon: "peerlist",
  },
  {
    platform: "Discord",
    handle: "@t1x_faker",
    href: null,
    icon: "discord",
  },
  {
    platform: "Email",
    handle: "adityakodez@gmail.com",
    href: "mailto:adityakodez@gmail.com",
    icon: "gmail",
  },
  {
    platform: "Buy me a coffee",
    handle: "@adiKodez",
    href: "https://buymeacoffee.com/adiKodez",
    icon: "coffee",
  },
] as const;

function SocialIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  switch (icon) {
    case "github":
      return (
        <Image src="/github.svg" alt="GitHub" width={size} height={size} />
      );
    case "x":
      return <X size={String(size)} color="currentColor" />;
    case "peerlist":
      return <Peerlist size={String(size)} />;
    case "discord":
      return (
        <Image src="/discord.svg" alt="Discord" width={size} height={size} />
      );
    case "gmail":
      return <Gmail size={String(size)} />;
    case "coffee":
      return <Coffee size={size} className="fill-yellow-200" />;
    default:
      return null;
  }
}

const Social = () => {
  const [discordCopied, setDiscordCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const copyDiscordId = useCallback(() => {
    navigator.clipboard.writeText("t1x_faker");
    setDiscordCopied(true);
    setTimeout(() => setDiscordCopied(false), 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyDiscordId();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyDiscordId]);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("adityakodez@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        copyEmail();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyEmail]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.5 }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="text-xl font-semibold border-y px-6 py-2">Connect</h2>

      {/* 2×3 grid — each cell gets all 4 borders, negative margin collapses them into single lines */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 overflow-hidden -mb-px">
        {socials.map((social, idx) => {
          const isDiscord = social.icon === "discord";
          const isEmail = social.icon === "gmail";

          const cellContent = (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.55 + idx * 0.05 }}
              className="no-js-visible group flex items-center gap-3 p-4 border-b border-r border-dashed max-sm:border-r-0 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                <SocialIcon icon={social.icon} size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium leading-none">
                  {social.platform}
                </span>
                <span className="text-xs text-muted-foreground mt-1 truncate">
                  {social.handle}
                </span>
              </div>
              {(isDiscord || isEmail) && (
                <div className="ml-auto">
                  {isDiscord ? (
                    discordCopied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )
                  ) : emailCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              )}
            </motion.div>
          );

          // Discord = copy to clipboard action
          if (isDiscord) {
            return (
              <Tooltip key={social.platform}>
                <TooltipTrigger asChild>
                  <button
                    onClick={copyDiscordId}
                    className="text-left cursor-pointer"
                  >
                    {cellContent}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {discordCopied ? "Copied!" : "Click to copy"} <Kbd>C</Kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }

          // Email = mailto link (no target _blank needed)
          if (isEmail) {
            return (
              <Tooltip key={social.platform}>
                <TooltipTrigger asChild>
                  <Link
                    href={social.href}
                    className="focus-visible:outline-none"
                  >
                    {cellContent}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {emailCopied ? "Copied!" : "Click to copy"} <Kbd>E</Kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }

          // Everything else = external link
          return (
            <Tooltip key={social.platform}>
              <TooltipTrigger asChild>
                <Link
                  href={social.href!}
                  target="_blank"
                  className="focus-visible:outline-none"
                >
                  {cellContent}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.platform}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </motion.section>
  );
};

export default Social;
