"use client";

import { socialSectionConfig, socialsConfig } from "@/config/socials";
import type { SocialIcon, SocialLink } from "@/config/types";
import Peerlist from "@/public/peerlist";
import Gmail from "@/public/stacks/gmail";
import X from "@/public/x-icon";
import { ArrowRightIcon, Check, Coffee, Copy } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Kbd } from "./ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const sortedSocials = socialsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

function SocialIconNode({
  icon,
  size = 18,
}: {
  icon: SocialIcon;
  size?: number;
}) {
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
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyEnabled = useMemo(
    () =>
      sortedSocials.filter((item) => item.action === "copy" && item.copyValue),
    [],
  );

  const handleCopy = (social: SocialLink) => {
    if (!social.copyValue) {
      return;
    }
    navigator.clipboard.writeText(social.copyValue);
    setCopied((prev) => ({ ...prev, [social.id]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [social.id]: false }));
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const target = copyEnabled.find(
        (item) => item.shortcutKey?.toLowerCase() === e.key.toLowerCase(),
      );

      if (target) {
        e.preventDefault();
        handleCopy(target);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyEnabled]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.5 }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="section-heading">{socialSectionConfig.title}</h2>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 overflow-hidden -mb-px">
        {sortedSocials.map((social, idx) => {
          const isCopyAction = social.action === "copy";

          const cellContent = (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.55 + idx * 0.05 }}
              className="relative no-js-visible group flex items-center gap-3 p-4 max-sm:border-r-0 transition-colors hover:bg-muted/10 overflow-hidden"
            >
              {/* Blueprint Texture on Hover */}
              <div className="absolute inset-0 blueprint-bg opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Shimmer Line */}
              <div className="absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 group-hover:ring-muted-foreground/10 transition-colors pointer-events-none" />

              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground relative group-hover:text-foreground transition-colors bg-background">
                  <SocialIconNode icon={social.icon} size={18} />
                  <div className="absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 pointer-events-none rounded-sm"></div>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-none">
                    {social.platform}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 truncate font-mono">
                    {social.handle}
                  </span>
                </div>
                {isCopyAction ? (
                  <div className="ml-auto">
                    {copied[social.id] ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                ) : (
                  <ArrowRightIcon
                    className="ml-auto size-3.5 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-rotate-45 group-hover:translate-y-0.5"
                  />
                )}
              </div>
            </motion.div>
          );

          if (isCopyAction) {
            return (
              <Tooltip key={social.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleCopy(social)}
                    className="text-left cursor-pointer"
                  >
                    {cellContent}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {copied[social.id] ? "Copied!" : social.tooltipDefault}
                    {social.shortcutKey ? (
                      <Kbd>{social.shortcutKey}</Kbd>
                    ) : null}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Tooltip key={social.id}>
              <TooltipTrigger asChild>
                <Link
                  href={social.href ?? "#"}
                  target={social.action === "external" ? "_blank" : undefined}
                  className="focus-visible:outline-none"
                >
                  {cellContent}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.tooltipDefault ?? social.platform}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </motion.section>
  );
};

export default Social;
