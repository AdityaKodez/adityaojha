import { siteConfig } from "@/config/site";
import { Metadata } from "next";
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
      className="relative min-h-dvh flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-14 pb-12"
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

      <section className="border-t border-dashed pt-4">
        <p className="px-6 pb-4 text-xs">Sponsor</p>
        <h1 className="section-heading">claim your seat.</h1>
        <p className="px-6 py-2 font-mono text-xs text-muted-foreground">
          Payment received? Drop in your name, a link, and an optional logo.
          The seat is already live with a generated avatar in the meantime.
        </p>
      </section>

      <section className="border-t border-dashed pt-6">
        <ClaimForm />
      </section>
    </main>
  );
}
