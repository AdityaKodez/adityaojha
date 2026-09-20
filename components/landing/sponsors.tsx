"use client";

import Avvvatars from "avvvatars-react";
import BitBlob from "@/components/landing/bit";
import {
  getAllSponsors,
  getEnabledSponsors,
  sponsorTiers,
  sponsorsSectionConfig,
} from "@/config/sponsors";
import type { Sponsor } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";

const OPEN_SEAT_HINT = "this could be you";

/** Seat price label comes from the cheapest enabled tier. */
const SEAT_PRICE_LABEL = `$${sponsorTiers.find((tier) => tier.enabled !== false)?.price ?? sponsorTiers[0]?.price ?? 5}`;

/**
 * Append utm params so sponsor analytics can attribute orbit clicks back
 * here. Done at render time, so it also covers hand-edited entries.
 */
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

/** Categorical flag colors, one per sponsor, cycling in authored order. */
const FLAG_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
] as const;

/** Seat position on the ellipse, in % of the container. */
function seatPosition(index: number, seats: number) {
  const angle = (index / seats) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + 40 * Math.cos(angle),
    y: 50 + 36 * Math.sin(angle),
  };
}

/**
 * Short sketchy rays radiating off Bit, like a doodled sun. Static by
 * design; the only motion on the center is Bit's own idle animation.
 * Exported for the /sponsor hero, which puts Bit in the same spotlight.
 */
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

interface SponsorOrbitProps {
  seats: number;
  sponsors: Sponsor[];
}

/**
 * Sponsors orbit Bit: claimed seats carry the sponsor's logo (or a
 * deterministic generated avatar until one is uploaded), open seats stay
 * dashed with a plus and lead to the checkout. One shared tooltip
 * glides between seats instead of one tooltip portal per seat, and seats
 * bob gently on staggered phases (transform only, disabled for reduced motion).
 */
export function SponsorOrbit({ seats, sponsors }: SponsorOrbitProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  // The checkout route round-trips to Dodo before redirecting, so the
  // clicked seat spins until the browser leaves for the hosted checkout.
  const [claimingSeat, setClaimingSeat] = useState<number | null>(null);

  const claimedBySeat = new Map(
    sponsors.map((sponsor) => [sponsor.seat, sponsor]),
  );

  let tooltipLeft = 50;
  let tooltipTop = 50;
  let tooltipAbove = true;
  if (hovered !== null) {
    const pos = seatPosition(hovered, seats);
    // Clamp horizontally so the pill never runs off the orbit edges.
    tooltipLeft = Math.min(Math.max(pos.x, 14), 86);
    tooltipTop = pos.y;
    tooltipAbove = pos.y > 30;
  }

  const hoveredSponsor = hovered === null ? undefined : claimedBySeat.get(hovered);

  return (
    <div className="px-6 pb-6 pt-4">
      <div className="relative aspect-[5/4] sm:aspect-[5/2]">
        <div
          aria-hidden
          className="orbit-dot-ring absolute rounded-[50%]"
          style={{
            left: "10%",
            right: "10%",
            top: "14%",
            bottom: "14%",
          }}
        />

        {/* Bit floats at the center without a containing card, sketch rays
            radiating outward in the blob's own yellow. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <EmitRays className="absolute size-36 text-[oklch(0.9_0.13_92)] sm:size-44" />
            <BitBlob className="size-14 sm:size-16" aria-hidden />
          </div>
        </div>

        {Array.from({ length: seats }, (_, i) => {
          const sponsor = claimedBySeat.get(i);
          const pos = seatPosition(i, seats);
          // One distinct flag color per sponsor, cycling the categorical
          // chart tokens by the sponsor's authored order.
          const flagClass =
            sponsor && FLAG_COLORS[(sponsor.order - 1) % FLAG_COLORS.length];

          const inner = sponsor ? (
            sponsor.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={sponsor.logo}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              /* Deterministic generated avatar from the sponsor id: every
                 paid seat gets one until a logo is claimed. */
              <span className="block size-full [&>div]:!size-full">
                <Avvvatars value={sponsor.id} style="shape" size={56} />
              </span>
            )
          ) : claimingSeat === i ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          );

          const circle = cn(
            "micro-transition size-11 cursor-pointer rounded-full sm:size-14",
            "flex items-center justify-center bg-background",
            sponsor
              ? cn(
                  "overflow-hidden ring-1 ring-inset ring-border",
                  "hover:ring-primary/60 hover:bg-primary/10",
                )
              : cn(
                  "border border-dashed border-muted-foreground/30",
                  "text-muted-foreground/50",
                  "hover:border-muted-foreground/60 hover:bg-background hover:text-foreground/80",
                ),
          );

          const handlers = {
            onMouseEnter: () => setHovered(i),
            onFocus: () => setHovered(i),
            onBlur: () => setHovered(null),
          };

          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div
                className={cn(
                  "relative animate-[seat-bob_6s_ease-in-out_infinite]",
                  "motion-reduce:animate-none",
                )}
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                {sponsor && (
                  /* Claim flag: a pole planted into the top of the circle
                     with a small rectangular pennant, unique per sponsor. */
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-[calc(100%-3px)] left-1/2 -translate-x-1/2"
                  >
                    <span className="relative block h-4 w-px bg-muted-foreground/70">
                      <span
                        className={cn(
                          "absolute -left-px top-0 block h-2 w-3 rounded-[1px]",
                          flagClass,
                        )}
                      />
                    </span>
                  </span>
                )}
                {sponsor?.url ? (
                  <a
                    href={withReferral(sponsor.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${sponsor.name}, sponsor`}
                    className={circle}
                    onClick={() =>
                      trackEvent("sponsor_link_clicked", {
                        sponsor_name: sponsor.name,
                        seat: i,
                        url: sponsor.url!,
                        location: window.location.pathname,
                      })
                    }
                    {...handlers}
                  >
                    {inner}
                  </a>
                ) : sponsor ? (
                  <div className={circle} {...handlers}>
                    {inner}
                  </div>
                ) : (
                  <a
                    href="/api/sponsor-checkout"
                    aria-label="Claim a sponsor seat"
                    aria-busy={claimingSeat === i}
                    className={cn(
                      circle,
                      claimingSeat === i && "cursor-wait",
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      if (claimingSeat !== null) return;
                      setClaimingSeat(i);
                      trackEvent("sponsor_seat_claim_clicked", {
                        seat: i,
                        location: window.location.pathname,
                      });
                      // Full-page navigation on purpose: the route 302s to
                      // Dodo's hosted checkout, which a client router would
                      // try to render instead of following.
                      window.location.assign(
                        new URL("/api/sponsor-checkout", window.location.origin),
                      );
                    }}
                    {...handlers}
                  >
                    {inner}
                  </a>
                )}
              </div>
            </div>
          );
        })}

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10 font-mono text-[11px] whitespace-nowrap",
            "rounded-md bg-popover px-2 py-1 text-popover-foreground ring-1 ring-inset ring-border",
            "micro-transition",
            hovered === null && "opacity-0",
          )}
          style={{
            left: `${tooltipLeft}%`,
            top: `${tooltipTop}%`,
            transform: `translate(-50%, ${
              tooltipAbove ? "calc(-100% - 12px)" : "16px"
            })`,
          }}
        >
          {hoveredSponsor
            ? [hoveredSponsor.name, hoveredSponsor.date]
                .filter(Boolean)
                .join(" · ")
            : [OPEN_SEAT_HINT, SEAT_PRICE_LABEL]
                .filter(Boolean)
                .join(" · ")}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-foreground">{sponsors.length}</span> of {seats}{" "}
          seats taken
        </p>
      </div>
    </div>
  );
}

/**
 * The home and /components section: heading, pitch, orbit. The /sponsor
 * route renders the page chrome itself and uses SponsorOrbit directly.
 */
export function SponsorsSection() {
  const { seats: configuredSeats, heading, description } = sponsorsSectionConfig;
  // The orbit grows past the configured seat count when paid sponsors
  // overflow it, instead of hiding anyone.
  const seats = Math.max(
    configuredSeats,
    getAllSponsors().filter((sponsor) => sponsor.enabled !== false).length,
  );

  return (
    <section className="border-t border-dashed pt-8">
      <motion.h2
        {...reveal({ y: 8, margin: "-80px" })}
        className="no-js-visible section-heading mb-3"
      >
        {heading}
      </motion.h2>

      <div className="flex items-center justify-between gap-4 px-6 py-2">
        <p className="truncate font-mono text-xs text-muted-foreground">
          {description}
        </p>
        <Link
          href="/sponsor"
          className="micro-transition flex shrink-0 items-center gap-1.5 rounded-sm font-mono text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Details
          <BsArrowUpRightCircle aria-hidden className="size-3.5" />
        </Link>
      </div>

      <SponsorOrbit seats={seats} sponsors={getEnabledSponsors(seats)} />
    </section>
  );
}
