"use client";

import Avvvatars from "avvvatars-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getAllSponsors,
  getEnabledSponsors,
  sponsorTiers,
  sponsorsSectionConfig,
} from "@/config/sponsors";
import type { Sponsor } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Plus } from "@/components/shared/site-icons";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const MotionLink = motion.create(Link);
const badgeSpring = { type: "spring", duration: 0.35, bounce: 0.3 } as const;
const SEAT_PRICE_LABEL = `$${sponsorTiers.find((tier) => tier.enabled !== false)?.price ?? sponsorTiers[0]?.price ?? 5}`;

function withReferral(url: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "akoder.xyz");
    parsed.searchParams.set("utm_medium", "sponsor");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function EmitRays({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden
      className={className}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="3">
        <line x1="59.4" y1="50.5" x2="52.5" y2="40.7" opacity="0.7" />
        <line x1="89.8" y1="43.3" x2="94" y2="27.8" opacity="1" />
        <line x1="117.6" y1="66.3" x2="132.6" y2="60.8" opacity="0.7" />
        <line x1="112.9" y1="99" x2="123.3" y2="105" opacity="1" />
        <line x1="70.7" y1="114.8" x2="68.1" y2="124.4" opacity="0.7" />
        <line x1="45.6" y1="96.1" x2="32.9" y2="102" opacity="1" />
      </g>
    </svg>
  );
}

function SponsorList({ sponsors }: { sponsors: Sponsor[] }) {
  const reduceMotion = useReducedMotion();
  const { supportLabel, supportNote } = sponsorsSectionConfig;
  const gestures = {
    initial: false,
    whileHover: reduceMotion ? { opacity: 0.8 } : { y: -4, scale: 1.08, rotate: -5 },
    whileFocus: reduceMotion ? { opacity: 0.8 } : { y: -4, scale: 1.08, rotate: -5 },
    whileTap: reduceMotion ? { opacity: 0.65 } : { scale: 0.94, rotate: 3 },
    transition: badgeSpring,
  } as const;
  const badgeClass =
    "relative flex size-10 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <TooltipProvider delayDuration={100} disableHoverableContent>
      <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-2.5">
        {sponsors.map((sponsor) => {
          const url = sponsor.url;
          const logo = (
            <span className="block size-9 overflow-hidden rounded-md [&>div]:!size-full">
              {sponsor.logo ? (
                <Image
                  src={sponsor.logo}
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <Avvvatars value={sponsor.id} style="shape" size={36} />
              )}
            </span>
          );
          const className = cn(
            badgeClass,
            "bg-card p-0.5 shadow-xs shadow-foreground/10 ring-1 ring-inset ring-border/70",
          );

          return (
            <li key={sponsor.id} className="shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  {url ? (
                    <motion.a
                      href={withReferral(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={sponsor.name}
                      className={className}
                      {...gestures}
                      onClick={() =>
                        trackEvent("sponsor_link_clicked", {
                          sponsor_name: sponsor.name,
                          seat: sponsor.seat,
                          url,
                          location: window.location.pathname,
                        })
                      }
                    >
                      {logo}
                    </motion.a>
                  ) : (
                    <motion.span
                      role="img"
                      tabIndex={0}
                      aria-label={sponsor.name}
                      className={className}
                      {...gestures}
                    >
                      {logo}
                    </motion.span>
                  )}
                </TooltipTrigger>
                <TooltipContent sideOffset={8} className="font-mono text-[11px] font-normal">
                  {sponsor.name}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
        <li className="shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <MotionLink
                href="/sponsor"
                aria-label={supportLabel}
                className={cn(
                  badgeClass,
                  "border border-muted-foreground/30 bg-background/60 text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-secondary-foreground",
                )}
                {...gestures}
              >
                <Plus className="size-4" aria-hidden />
              </MotionLink>
            </TooltipTrigger>
            <TooltipContent sideOffset={8} className="flex-col gap-0.5 font-mono text-[11px] font-normal">
              <span>{supportLabel}</span>
              <span className="opacity-70">{SEAT_PRICE_LABEL} · {supportNote}</span>
            </TooltipContent>
          </Tooltip>
        </li>
      </ul>
    </TooltipProvider>
  );
}

export function SponsorsSection() {
  const { seats: configuredSeats, heading } = sponsorsSectionConfig;
  const seats = Math.max(
    configuredSeats,
    getAllSponsors().filter((sponsor) => sponsor.enabled !== false).length,
  );

  return (
    <section className="border-t border-dashed pt-6">
      <div className="section-heading flex items-center bg-transparent px-0 py-0 pr-[17px]">
        <h2 className="no-js-visible shrink-0 px-[21px] py-px font-serif text-[25px] leading-8 font-medium italic">
          {heading}
        </h2>
        <SponsorList sponsors={getEnabledSponsors(seats)} />
      </div>
    </section>
  );
}
