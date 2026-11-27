"use client";

import { ArrowRight } from "@/components/shared/site-icons";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

/**
 * Plain anchors to the checkout route on purpose: it 302s to Dodo's hosted
 * checkout, which a client-side router would try to render instead of
 * following.
 */
const CHECKOUT_HREF = "/api/sponsor-checkout";
const CLAIM_HREF = "/sponsor/claim";

const pillClass =
  "micro-transition inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const primaryClass = `${pillClass} bg-foreground text-background hover:bg-foreground/85`;
const secondaryClass = `${pillClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;

function trackCta(cta: "checkout" | "claim") {
  trackEvent("sponsor_cta_clicked", {
    location: "/sponsor",
    surface: "hero",
    cta,
  });
}

export function SponsorCta({ seatPrice }: { seatPrice: number }) {
  return (
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
  );
}
