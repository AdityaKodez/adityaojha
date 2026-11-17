"use client";

import { SponsorsSection } from "@/components/landing/sponsors";
import { socialsConfig } from "@/config/socials";
import { sponsorPageConfig, sponsorTiers } from "@/config/sponsors";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, ArrowUpRight } from "@/components/shared/site-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  Armchair,
  Coffee,
  FlaskConical,
  HandHeart,
  Heart,
  PartyPopper,
  PenLine,
  Receipt,
  Sparkles,
  type IconProps,
} from "scribbles-icons";

/**
 * Plain anchors to the checkout route on purpose: it 302s to Dodo's hosted
 * checkout, which a client-side router would try to render instead of
 * following.
 */
const CHECKOUT_HREF = "/api/sponsor-checkout";
const CLAIM_HREF = "/sponsor/claim";

const enabledTiers = sponsorTiers.filter((tier) => tier.enabled !== false);
const seatPrice = enabledTiers[0]?.price ?? 5;

const X_URL =
  socialsConfig.find((social) => social.id === "x")?.href ??
  "https://x.com/AdiKodez";

const pillClass =
  "micro-transition inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const primaryClass = `${pillClass} bg-foreground text-background hover:bg-foreground/85`;
const secondaryClass = `${pillClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
const quietLinkClass =
  "micro-transition rounded-sm text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

function trackCta(cta: "checkout" | "claim") {
  trackEvent("sponsor_cta_clicked", {
    location: "/sponsor",
    surface: "hero",
    cta,
  });
}

type Scribble = ComponentType<IconProps>;

const WHY_ICONS: Scribble[] = [Heart, Receipt, FlaskConical];
const STEP_ICONS: Scribble[] = [Armchair, PenLine, PartyPopper];

/** Decorative hand-drawn cluster beside the hero copy. */
function HeroScribbles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden size-40 shrink-0 text-foreground sm:block"
    >
      <HandHeart
        size={96}
        weight="fill"
        className="absolute left-6 top-8 -rotate-6"
      />
      <Coffee
        size={40}
        weight="fill"
        className="absolute right-0 top-0 rotate-12 text-muted-foreground"
      />
      <Sparkles
        size={28}
        weight="fill"
        className="absolute left-0 top-2 -rotate-12 text-muted-foreground"
      />
      <Heart
        size={22}
        weight="fill"
        className="absolute bottom-2 right-4 rotate-6 text-primary"
      />
    </div>
  );
}

function NumberedList({
  heading,
  items,
  icons,
  className,
}: {
  heading: string;
  items: { label: string; description: string }[];
  icons: Scribble[];
  className?: string;
}) {
  return (
    <section className={cn("border-t border-dashed pt-6", className)}>
      <h2 className="section-heading">{heading}</h2>
      <ol className="flex flex-col gap-5 px-6 py-6">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li key={item.label} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center text-foreground",
                  index % 2 === 0 ? "-rotate-6" : "rotate-6",
                )}
              >
                <Icon size={30} weight="fill" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="flex items-baseline gap-2 text-sm font-medium tracking-tight">
                  <span className="font-mono text-[11px] font-normal tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </p>
                <p className="mt-1 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function SponsorPage() {
  const { title, tagline, description, whyHeading, why, stepsHeading, steps } =
    sponsorPageConfig;

  return (
    <>
      <section className="pt-4">
        <p className="px-6 pb-4 text-xs">Sponsor</p>
        <h1 className="section-heading">{title}</h1>
        <div className="flex items-center gap-8 px-6 py-8">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div>
              <p className="text-balance text-base font-medium tracking-tight">
                {tagline}
              </p>
              <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={CHECKOUT_HREF}
                className={primaryClass}
                onClick={() => trackCta("checkout")}
              >
                Take a seat, ${seatPrice}
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <Link
                href={CLAIM_HREF}
                className={secondaryClass}
                onClick={() => trackCta("claim")}
              >
                Already paid? Claim it
              </Link>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              One payment, no subscription. Questions?{" "}
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={quietLinkClass}
              >
                DM me on X
                <ArrowUpRight aria-hidden className="ml-0.5 inline size-3" />
                <span className="sr-only">, opens in a new tab</span>
              </a>
            </p>
          </div>
          <HeroScribbles />
        </div>
      </section>

      <SponsorsSection />
      <NumberedList heading={whyHeading} items={why} icons={WHY_ICONS} />
      <NumberedList
        heading={stepsHeading}
        items={steps}
        icons={STEP_ICONS}
        className="border-b"
      />
    </>
  );
}
