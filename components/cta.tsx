"use client";

import { siteConfig } from "@/config/site";
import type { SocialIcon, SocialLink } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import Gmail from "@/public/stacks/gmail";
import X from "@/public/x-icon";
import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

const contactChannels = siteConfig.contact.channels
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

function ContactIcon({ icon }: { icon: SocialIcon }) {
  if (icon === "gmail") {
    return <Gmail size="18" />;
  }
  if (icon === "discord") {
    return <Image src="/discord.svg" alt="Discord" width={18} height={18} />;
  }
  return <X size={18} />;
}

export function CTA() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyValue = (channel: SocialLink) => {
    if (!channel.copyValue || typeof navigator === "undefined") {
      return;
    }
    navigator.clipboard
      .writeText(channel.copyValue)
      .then(() => {
        trackEvent("social_handle_copied", {
          platform: channel.platform,
          handle: channel.handle,
          method: "click",
          location: "contact_section",
        });
        setCopiedField(channel.id);
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch(() => {});
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="no-js-visible border-t border-dashed pt-6 pb-6"
      id="contact"
    >
      <h2 className="section-heading mb-3">{siteConfig.contact.title}</h2>
      <div>
        <p className="px-6 text-md text-muted-foreground mb-4">{siteConfig.contact.description}</p>
        <div className="px-6 mb-6">
          <Button asChild size="lg" className="w-fit">
            <Link
              href="https://x.com/AdiKodez"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("social_link_clicked", {
                  platform: "x",
                  url: "https://x.com/AdiKodez",
                  location: "contact_section",
                });
              }}
            >
              <X data-icon="inline-start" />
              follow @AdiKodez
            </Link>
          </Button>
        </div>

        <div className="grid border-t border-b border-dashed grid-cols-3 max-sm:grid-cols-1 overflow-hidden">
          {contactChannels.map((channel) => {
            const content = (
              <div className="group relative flex items-center gap-3 p-4 border-b border-r border-dashed max-sm:border-r-0 transition-colors hover:bg-muted/10 overflow-hidden">
                <div className="absolute inset-0 blueprint-bg opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 group-hover:ring-muted-foreground/10 transition-colors pointer-events-none" />

                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground group-hover:text-foreground transition-colors bg-background">
                  <ContactIcon icon={channel.icon} />
                  <div className="absolute inset-0 ring-1 ring-inset ring-muted-foreground/5 pointer-events-none rounded-sm"></div>
                </div>
                <div className="relative z-10 flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-none">{channel.platform}</span>
                  <span className="text-xs text-muted-foreground mt-1 truncate">{channel.handle}</span>
                </div>
                {channel.action === "copy" ? (
                  <div className="relative z-10 ml-auto">
                    {copiedField === channel.id ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                ) : null}
              </div>
            );

            if (channel.action === "copy") {
              return (
                <Tooltip key={channel.id}>
                  <TooltipTrigger asChild>
                    <button onClick={() => copyValue(channel)} className="text-left cursor-pointer">
                      {content}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copiedField === channel.id ? "copied!" : channel.tooltipDefault}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Tooltip key={channel.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={channel.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent("social_link_clicked", {
                        platform: channel.platform,
                        url: channel.href ?? "",
                        location: "contact_section",
                      });
                    }}
                    className="focus-visible:outline-none"
                  >
                    {content}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{channel.tooltipDefault}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
