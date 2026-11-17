import { siteConfig } from "@/config/site";
import { handwriting } from "@/components/shared/doodles";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClaimForm } from "./claim-form";

export const metadata: Metadata = {
  title: "claim your seat",
  description:
    "You paid for a supporter spot. Add your display name, link, and logo.",
  robots: { index: false },
};

const PAGE_URL = `${siteConfig.meta.url}/sponsor/claim`;

/** Keep in sync with COLUMN in claim-form.tsx. */
const COLUMN = "mx-auto w-full max-w-[30.5rem]";

export default function SponsorClaimPage() {
  return (
    <main
      id="sponsor-claim"
      data-project-page=""
      className="relative flex min-h-dvh flex-col justify-center overflow-x-clip bg-background px-5 pt-16 pb-24 md:pb-12"
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

      <header className={COLUMN}>
        <Link
          href="/sponsor"
          className="mb-8 inline-flex min-h-11 items-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span className={cn(handwriting.className, "text-xl leading-none")}>
            Sponsor
          </span>
        </Link>
        <h1 className="text-[15px] font-medium leading-6 text-foreground">
          Claim your seat
        </h1>
        <p className="pb-8 text-pretty text-[15px] leading-6 text-muted-foreground">
          Add your name, a link and a logo so people know who helps keep the
          work independent.
        </p>
      </header>

      {/* Keep the search-param reader behind Suspense for static rendering. */}
      <Suspense fallback={
        <div role="status" className={COLUMN}>
          <div aria-hidden className="flex flex-col gap-5">
            <div className="h-5 w-40 rounded-full bg-muted" />
            <div className="h-11 rounded-full bg-muted/60" />
            <div className="h-11 rounded-full bg-muted/60" />
            <div className="h-14 rounded-full bg-muted/40" />
          </div>
          <span className="sr-only">Loading your seat details…</span>
        </div>
      }>
        <ClaimForm />
      </Suspense>
    </main>
  );
}
