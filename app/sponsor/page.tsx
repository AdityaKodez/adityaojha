import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { SponsorPage } from "./sponsor-page";

const PAGE_URL = `${siteConfig.meta.url}/sponsor`;

const PAGE_DESCRIPTION =
  "A $5 seat on the orbit, paid once and kept for good. Your name, link, and logo beside Bit.";

export const metadata: Metadata = {
  title: "sponsor",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    title: "sponsor — aditya ojha",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: siteConfig.meta.shortTitle,
    images: [siteConfig.meta.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "sponsor — aditya ojha",
    description: PAGE_DESCRIPTION,
    images: [siteConfig.meta.ogImage.url],
  },
};

/**
 * WebPage plus a breadcrumb, wired into the WebSite and Person nodes the
 * root layout already publishes. No Offer markup: the single $5 seat is a
 * tip jar, not a product catalog, and self-hosted offers read as
 * self-serving to search engines.
 */
function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.meta.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Sponsor",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Sponsor — Aditya Ojha",
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${siteConfig.meta.url}/#website` },
        about: { "@id": `${siteConfig.meta.url}/#person` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      },
    ],
  };
}

export default function SponsorRoute() {
  return (
    <main
      id="sponsor"
      className="relative min-h-dvh flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-14"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <SponsorPage />
    </main>
  );
}
