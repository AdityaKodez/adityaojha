import { TestimonialsGrid } from "@/components/landing/testimonials-grid";
import { getAllTestimonials } from "@/config/testimonials";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

const PAGE_URL = `${siteConfig.meta.url}/testimonials`;

const PAGE_DESCRIPTION =
  "Unedited, in their own words. From designers, developers, and founders who took a look at the work.";

export const metadata: Metadata = {
  title: "testimonials",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    title: "testimonials — aditya ojha",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: siteConfig.meta.shortTitle,
    images: [siteConfig.meta.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "testimonials — aditya ojha",
    description: PAGE_DESCRIPTION,
    images: [siteConfig.meta.ogImage.url],
  },
};

/**
 * Collection page plus a breadcrumb, wired into the WebSite and Person nodes
 * the root layout already publishes. The quotes are typed as Quotation inside
 * an ItemList: Review and AggregateRating are deliberately absent, since
 * Google treats reviews hosted on the subject's own site as self-serving.
 */
function buildJsonLd(testimonials: ReturnType<typeof getAllTestimonials>) {
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
            name: "Testimonials",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Testimonials — Aditya Ojha",
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${siteConfig.meta.url}/#website` },
        about: { "@id": `${siteConfig.meta.url}/#person` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: testimonials.length,
          itemListElement: testimonials.map((testimonial, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Quotation",
              text: testimonial.content,
              author: {
                "@type": "Person",
                name: testimonial.name,
                jobTitle: testimonial.role,
              },
            },
          })),
        },
      },
    ],
  };
}

export default function TestimonialsPage() {
  const testimonials = getAllTestimonials();

  return (
    <main
      id="testimonials"
      className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto overflow-x-clip pt-14 pb-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(testimonials)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <section className="border-t border-dashed pt-4">
        <p className="px-6 pb-4 text-xs">Testimonials</p>
        <h1 className="section-heading">what people said.</h1>


      </section>

      <section className="border-t border-dashed">
        <h2 className="sr-only">all testimonials</h2>
        <TestimonialsGrid testimonials={testimonials} />
      </section>
    </main>
  );
}
