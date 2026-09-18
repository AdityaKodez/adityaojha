"use client";

import BitBlob from "@/components/landing/bit";
import { EmitRays, SponsorOrbit } from "@/components/landing/sponsors";
import { socialsConfig } from "@/config/socials";
import {
    getAllSponsors,
    getEnabledSponsors,
    sponsorPageConfig,
    sponsorsSectionConfig,
    sponsorTiers,
} from "@/config/sponsors";
import { trackEvent } from "@/lib/analytics";
import { reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

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

const actionClass =
  "micro-transition inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const primaryActionClass = cn(
  actionClass,
  "bg-primary text-primary-foreground hover:bg-primary/90",
);
const secondaryActionClass = cn(
  actionClass,
  "bg-background ring-1 ring-inset ring-border hover:bg-muted",
);
const quietLinkClass =
  "micro-transition rounded-sm text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

function trackCta(surface: "hero" | "tier" | "footer", cta: "checkout" | "claim") {
  trackEvent("sponsor_cta_clicked", { location: "/sponsor", surface, cta });
}

/** The dashed heading band every content section shares. */
function SectionBand({ children }: { children: string }) {
  return (
    <motion.h2
      {...reveal({ y: 8, margin: "-80px" })}
      className="no-js-visible section-heading"
    >
      {children}
    </motion.h2>
  );
}

/**
 * The full sponsor pitch. The home page keeps the teaser (heading, orbit,
 * Details link); this page owns the story: hero with Bit, the live orbit,
 * what a seat does, the tier, the claiming steps, and the closing ask.
 */
export function SponsorPage() {
  const {
    title,
    tagline,
    description,
    mascotCaption,
    whyHeading,
    why,

    stepsHeading,
    steps,
    ctaHeading,
    ctaDescription,
  } = sponsorPageConfig;

  // Same growth rule as the home section: the orbit grows past the
  // configured seat count when paid sponsors overflow it.
  const seats = Math.max(
    sponsorsSectionConfig.seats,
    getAllSponsors().filter((sponsor) => sponsor.enabled !== false).length,
  );

  return (
    <>
      {/* Hero: the pitch on the left, Bit hosting on the right. The visual
          stays side by side on mobile, same as the claim page, so the page
          keeps its vertical rhythm on narrow screens. */}
      <section className="border-t border-dashed pt-4">
        <p className="px-6 pb-4 text-xs">Sponsor</p>
        <h1 className="section-heading">{title}</h1>
        <div className="flex items-start gap-5 px-6 py-8 sm:py-10">
          <div className="min-w-0 flex-1">
            <p className="text-balance text-base font-medium tracking-tight">
              {tagline}
            </p>
            <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-3">
              <a
                href={CHECKOUT_HREF}
                className={primaryActionClass}
                onClick={() => trackCta("hero", "checkout")}
              >
                Take a seat, ${seatPrice}
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <Link
                href={CLAIM_HREF}
                className={cn(quietLinkClass, "text-muted-foreground text-sm")}
                onClick={() => trackCta("hero", "claim")}
              >
                Already paid? Claim it
              </Link>
            </div>
          </div>
          <div className="w-24 shrink-0 sm:w-28">
            <div
              aria-hidden="true"
              className="relative flex size-24 items-center justify-center sm:size-28"
            >
              <EmitRays className="absolute size-28 text-[oklch(0.9_0.13_92)] sm:size-32" />
              <BitBlob
                awake
                gaze="left"
                className="relative size-14 -rotate-6 sm:size-16"
              />
            </div>
            <p
              aria-hidden="true"
              className="mt-1.5 text-center font-serif text-xs italic leading-tight text-muted-foreground"
            >
              {mascotCaption}
            </p>
          </div>
        </div>
      </section>

      {/* The live orbit, the same piece the home page renders. Open seats
          lead straight to checkout from here too. */}
      <section aria-labelledby="orbit-heading" className="border-t border-dashed">
        <h2 id="orbit-heading" className="sr-only">
          The orbit
        </h2>
        <SponsorOrbit seats={seats} sponsors={getEnabledSponsors(seats)} />
      </section>

      <section className="border-t border-dashed pt-8">
        <SectionBand>{whyHeading}</SectionBand>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5 divide-x">
          {why.map((point, index) => (
            <div key={point.label} className="px-6 py-6 ">
              <p className="flex items-baseline gap-2.5">
                <span
                  aria-hidden
                  className="font-mono text-[11px] tabular-nums text-muted-foreground"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium tracking-tight">
                  {point.label}
                </span>
              </p>
              <p className="mt-2 text-pretty text-xs leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      <section className="border-t border-dashed pt-8">
        <SectionBand>{stepsHeading}</SectionBand>
        <ol className="divide-y divide-dashed ">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-start gap-4 px-6 py-4">
              <span
                aria-hidden
                className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium tracking-tight">
                  {step.label}
                </p>
                <p className="mt-1 max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* mt-auto pins the band to the bottom of the min-h-dvh frame, so a
          short viewport never leaves the page hanging mid-column. */}
      <section className="mt-auto border-t border-dashed bg-muted/15">
        <div className="mx-auto max-w-md px-6 py-10 text-center sm:py-12">
          <h2 className="text-balance text-base font-medium tracking-tight">
            {ctaHeading}
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {ctaDescription}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={CHECKOUT_HREF}
              className={cn(primaryActionClass, "w-full sm:w-auto")}
              onClick={() => trackCta("footer", "checkout")}
            >
              Take a seat, ${seatPrice}
              <ArrowRight aria-hidden className="size-4" />
            </a>
            <Link
              href={CLAIM_HREF}
              className={cn(secondaryActionClass, "w-full sm:w-auto")}
              onClick={() => trackCta("footer", "claim")}
            >
              Already paid? Claim it
            </Link>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Questions?{" "}
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
      </section>
    </>
  );
}
