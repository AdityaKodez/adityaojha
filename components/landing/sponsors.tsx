"use client";

import Avvvatars from "avvvatars-react";
import {
  getAllSponsors,
  getEnabledSponsors,
  getEnabledSupportLinks,
  sponsorTiers,
  sponsorsSectionConfig,
} from "@/config/sponsors";
import type { Sponsor } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Message, Plus } from "@/components/shared/site-icons";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { SiBuymeacoffee } from "react-icons/si";
import { CursorTagItem } from "./cursor-tag";
import { Signature } from "./signature";

const badgeSpring = { type: "spring", duration: 0.35, bounce: 0.3 } as const;
const SEAT_PRICE_LABEL = `$${sponsorTiers.find((tier) => tier.enabled !== false)?.price ?? sponsorTiers[0]?.price ?? 5}`;
const tileClass =
  "relative flex size-14 shrink-0 items-center justify-center rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const badgeClass = `${tileClass} overflow-hidden`;

const supportTiles = {
  coffee: {
    Icon: SiBuymeacoffee,
    BadgeIcon: Plus,
    tile: "bg-[color:var(--logo-wax-light)] text-[color:var(--logo-wick)] ring-[color:var(--logo-wax-gold)]",
    badge: "bg-[color:var(--logo-flame)] text-[color:var(--logo-flame-core)]",
  },
  x: {
    Icon: FaXTwitter,
    BadgeIcon: Message,
    tile: "bg-secondary text-foreground ring-foreground/10",
    badge: "bg-foreground text-background",
  },
} as const;

function useTileGestures() {
  const reduceMotion = useReducedMotion();
  return {
    initial: false,
    whileHover: reduceMotion ? { opacity: 0.8 } : { y: -4, scale: 1.08, rotate: -5 },
    whileFocus: reduceMotion ? { opacity: 0.8 } : { y: -4, scale: 1.08, rotate: -5 },
    whileTap: reduceMotion ? { opacity: 0.65 } : { scale: 0.94, rotate: 3 },
    transition: badgeSpring,
  } as const;
}

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
  const gestures = useTileGestures();
  const { supportLabel, supportNote } = sponsorsSectionConfig;

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {sponsors.map((sponsor) => {
        const url = sponsor.url;
        const logo = (
          <span className="block size-full [&>div]:!size-full">
            {sponsor.logo ? (
              <Image
                src={sponsor.logo}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <Avvvatars value={sponsor.id} style="shape" size={56} radius={1} />
            )}
          </span>
        );
        const className = cn(
          badgeClass,
          "bg-card shadow-xs shadow-foreground/10 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-foreground/10",
        );

        return (
          <CursorTagItem key={sponsor.id} label={sponsor.name}>
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
          </CursorTagItem>
        );
      })}
      <CursorTagItem
        label={supportLabel}
        note={`${SEAT_PRICE_LABEL} · ${supportNote}`}
      >
        <motion.a
          href="/api/sponsor-checkout"
          aria-label={supportLabel}
          className={cn(
            badgeClass,
            "bg-background text-muted-foreground ring-1 ring-inset ring-border transition-colors hover:bg-secondary hover:text-secondary-foreground",
          )}
          {...gestures}
        >
          <Plus className="size-5" aria-hidden />
        </motion.a>
      </CursorTagItem>
    </ul>
  );
}

function SupportLinks() {
  const gestures = useTileGestures();

  return (
    <ul aria-label="Support links" className="flex flex-wrap items-center gap-3">
      {getEnabledSupportLinks().map((link) => {
        const { Icon, BadgeIcon, tile, badge } = supportTiles[link.icon];

        return (
          <CursorTagItem key={link.id} label={link.label}>
            <motion.a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={tileClass}
              {...gestures}
              onClick={() =>
                trackEvent("sponsor_support_link_clicked", {
                  link_id: link.id,
                  url: link.href,
                  location: window.location.pathname,
                })
              }
            >
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center overflow-hidden rounded-[inherit] shadow-xs shadow-foreground/10 ring-1 ring-inset",
                  tile,
                )}
              >
                <Icon className="size-6" aria-hidden />
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full ring-2 ring-background",
                  badge,
                )}
              >
                <BadgeIcon className="size-3" strokeWidth={2.4} />
              </span>
            </motion.a>
          </CursorTagItem>
        );
      })}
    </ul>
  );
}

export function SponsorsSection() {
  const {
    seats: configuredSeats,
    heading,
    description,
  } = sponsorsSectionConfig;
  const seats = Math.max(
    configuredSeats,
    getAllSponsors().filter((sponsor) => sponsor.enabled !== false).length,
  );

  return (
    <section className="relative border-t border-dashed pt-6">
      <h2 className="no-js-visible section-heading px-[21px] py-px font-serif text-[25px] leading-8 font-medium italic">
        {heading}
      </h2>
      <div className="flex flex-col gap-6 px-6 py-6">
        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="flex flex-col gap-3">
          <SponsorList sponsors={getEnabledSponsors(seats)} />
          <SupportLinks />
        </div>
      </div>
      <Signature
        className="pointer-events-none absolute right-6 top-1/2 h-12 w-auto -translate-y-1/2 text-foreground/80 max-sm:hidden"
        viewport={{ amount: 0.1 }}
      />
    </section>
  );
}
