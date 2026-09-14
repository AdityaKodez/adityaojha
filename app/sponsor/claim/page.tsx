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
        <h1 className="section-heading text-balance">Claim your seat.</h1>
        <div className="mx-auto flex w-full max-w-2xl items-center gap-5 px-4 pb-8 pt-6 sm:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-balance text-base font-medium tracking-tight">Make yourself at home.</p>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              A little spot beside Bit, with your name on it. Add a link and a
              logo so people know who’s keeping the orbit going.
            </p>
          </div>
          <div aria-hidden="true" className="relative flex h-32 w-24 shrink-0 items-center justify-center sm:w-28">
            <div className="orbit-dot-ring absolute inset-x-0 top-7 h-20 -rotate-[22deg] rounded-[50%]" />
            <span className="absolute right-0 top-8 size-2 rounded-full bg-primary ring-4 ring-background" />
            <BitBlob
              awake
              gaze="left"
              className="relative size-20 -rotate-6 [&_.bit-body]:[animation:none] [&_.bit-eye]:[animation:none] sm:size-24"
            />
            <span className="absolute bottom-0 -rotate-6 font-serif text-base italic text-muted-foreground">Your new neighbor</span>
          </div>
        </div>
      </header>

      {/* Keep the search-param reader behind Suspense for static rendering. */}
      <Suspense fallback={
        <div role="status" className="mx-auto w-full max-w-2xl px-4 pb-8">
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
