"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./ui/kbd";
import { Check, Copy } from "lucide-react";
import Peerlist from "@/public/peerlist";
import X from "@/public/x-icon";

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
    default:
      return null;
  }
}

const Social = () => {
  const [copied, setCopied] = useState(false);

  const copyDiscordId = useCallback(() => {
    navigator.clipboard.writeText("t1x_faker");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.5 }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="text-xl font-semibold border-y px-6 py-2">Connect</h2>

      <div className="grid grid-cols-2  max-sm:grid-cols-1">
        {socials.map((social, idx) => {
          const isDiscord = social.icon === "discord";

          const content = (
            <motion.div
              key={social.platform}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.55 + idx * 0.05 }}
              className={`
                no-js-visible group flex items-center gap-3 p-4
                border border-dashed
                transition-colors hover:bg-muted/50
                ${idx === 0 && "border-b-0 border-l-0"}
                ${idx % 2 === 0 ? "max-sm:border-r-0 sm:border-r-0" : ""}
                ${idx < 2 ? "max-sm:border-b-0 sm:border-b-0" : ""} 
                ${idx === 2 && "border-l-0"}
                max-sm:border-r max-sm:${idx < 3 ? "border-b-0" : ""}
              `}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-dashed text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
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
              {isDiscord && (
                <div className="ml-auto">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              )}
            </motion.div>
          );

          if (isDiscord) {
            return (
              <Tooltip key={social.platform}>
                <TooltipTrigger asChild>
                  <button
                    onClick={copyDiscordId}
                    className="text-left cursor-pointer"
                  >
                    {content}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {copied ? "Copied!" : "Click to copy"} <Kbd>C</Kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Tooltip key={social.platform}>
              <TooltipTrigger asChild>
                <Link
                  href={social.href!}
                  target="_blank"
                  className="focus-visible:outline-none"
                >
                  {content}
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
