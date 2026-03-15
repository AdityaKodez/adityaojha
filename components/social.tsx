"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, Check, Coffee, Copy } from "lucide-react";
import { socialSectionConfig, socialsConfig } from "@/config/socials";
import type { SocialIcon, SocialLink } from "@/config/types";
import Peerlist from "@/public/peerlist";
import Gmail from "@/public/stacks/gmail";
import X from "@/public/x-icon";
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

      if (!target) {
        return;
      }

      e.preventDefault();
      handleCopy(target);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyEnabled]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="section-heading">{socialSectionConfig.title}</h2>

      <div className="grid grid-cols-2 -mb-px overflow-hidden max-sm:grid-cols-1">
        {sortedSocials.map((social, idx) => {
          const isCopyAction = social.action === "copy";

          const cellContent = (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.5 + idx * 0.045 }}
              className="micro-transition relative no-js-visible flex items-center gap-3 overflow-hidden p-4 max-sm:border-r-0 group-hover:bg-muted/10 group-focus-visible:bg-muted/10 "
            >
              <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-45 micro-transition group-hover:opacity-100 group-focus-visible:opacity-100" />

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 micro-transition group-hover:ring-muted-foreground/10 group-focus-visible:ring-muted-foreground/10" />

              <div className="relative z-10 flex w-full items-center gap-3">
                <div className="micro-transition relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
                  <SocialIconNode icon={social.icon} size={18} />
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                </div>

                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium leading-none">
                    {social.platform}
                  </span>
                  <span className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    {social.handle}
                  </span>
                </div>

                {isCopyAction ? (
                  <div className="ml-auto">
                    {copied[social.id] ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground micro-transition group-hover:text-foreground group-focus-visible:text-foreground" />
                    )}
                  </div>
                ) : (
                  <ArrowRightIcon className="ml-auto size-3.5 text-muted-foreground/30 micro-transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:-rotate-45 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:translate-y-0.5 group-focus-visible:-rotate-45 group-focus-visible:text-primary" />
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
                    className="group micro-press block w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
                  >
                    {cellContent}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {copied[social.id] ? "Copied!" : social.tooltipDefault}
                    {social.shortcutKey ? <Kbd>{social.shortcutKey}</Kbd> : null}
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
                  rel={social.action === "external" ? "noopener noreferrer" : undefined}
                  className="group micro-press block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
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

