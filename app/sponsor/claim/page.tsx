import { siteConfig } from "@/config/site";
import BitBlob from "@/components/landing/bit";
import { Metadata } from "next";
import { Suspense } from "react";
import { ClaimForm } from "./claim-form";

export const metadata: Metadata = {
  title: "claim your seat",
  description:
    "You paid for an orbit seat. Add your display name, link, and logo.",
  robots: { index: false },
};

const PAGE_URL = `${siteConfig.meta.url}/sponsor/claim`;

/**
 * The page column. The heading band, the intro, the form and the footer all
 * use this exact string so their left edges line up. Keep it in sync with
 * COLUMN in claim-form.tsx.
 */
const COLUMN = "mx-auto w-full max-w-2xl px-4";

export default function SponsorClaimPage() {
  return (
    <main
      id="sponsor-claim"
      className="relative min-h-dvh flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-14"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: PAGE_URL,
            name: "Claim your seat",
            isPartOf: { "@id": `${siteConfig.meta.url}/#website` },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <header>
        {/* .section-heading owns the full-bleed dashed band, so its own px-6 is
            cancelled and the text sits in the page column instead. */}
        <h1 className="section-heading px-0">
          <span className={`${COLUMN} block`}>Claim your seat.</span>
        </h1>
        <div className={`${COLUMN} flex items-start gap-5 pb-8 pt-6`}>
          <div className="min-w-0 flex-1">
            <p className="text-balance text-base font-medium tracking-tight">Make yourself at home.</p>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              A little spot beside Bit, with your name on it. Add a link and a
              logo so people know who’s keeping the orbit going.
            </p>
          </div>
          {/* Bit on a dotted ring with one satellite dot. The caption is a
              normal line under the block, not an overlay, so it cannot
              collide with the copy on narrow screens. */}
          <div className="w-24 shrink-0 sm:w-28">
            <div aria-hidden="true" className="relative flex size-24 items-center justify-center sm:size-28">
              <div className="orbit-dot-ring absolute inset-0 rounded-[50%]" />
              <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-background" />
              <BitBlob
                awake
                gaze="left"
                className="relative size-14 -rotate-6 [&_.bit-body]:[animation:none] [&_.bit-eye]:[animation:none] sm:size-16"
              />
            </div>
            <p aria-hidden="true" className="mt-1.5 text-center font-serif text-xs italic leading-tight text-muted-foreground">
              Your neighbor
            </p>
          </div>
        </div>
      </header>

      {/* Keep the search-param reader behind Suspense for static rendering. */}
      <Suspense fallback={
        <div role="status" className={`${COLUMN} pb-8`}>
          <div aria-hidden className="space-y-5">
            <div className="h-5 w-40 rounded-md bg-muted" />
            <div className="h-11 rounded-md bg-muted/60" />
            <div className="h-11 rounded-md bg-muted/60" />
            <div className="h-72 rounded-md bg-muted/40" />
          </div>
          <span className="sr-only">Loading your seat details…</span>
        </div>
      }>
        <ClaimForm />
      </Suspense>
    </main>
  );
}
