import { footerConfig, siteConfig } from "@/config/site";

const domain = new URL(siteConfig.meta.url).host;

export const openGraphConfig = {
  locationLabel: "Delhi, India",
  // Resolved light-theme tokens for the image renderer, which has no CSS cascade.
  colors: {
    background: "rgb(255, 255, 255)",
    foreground: "rgb(10, 10, 10)",
    mutedForeground: "rgb(115, 115, 115)",
  },
  // PNG rendition of the footer garden, since the OG rasterizer omits WebP.
  artwork: {
    src: "/images/og/garden.png",
    width: footerConfig.artwork.width,
    height: footerConfig.artwork.height,
  },
  routes: {
    components: {
      eyebrow: "Shadcn registry",
      title: "Components",
      description:
        "A growing set of reusable building blocks, lightweight, themable, and easy to drop into any project.",
      footer: `${domain}/components`,
    },
    testimonials: {
      eyebrow: "Kind words",
      title: "Testimonials",
      description:
        "In their own words. From designers, developers, and founders who took a look at the work.",
      footer: `${domain}/testimonials`,
    },
    sponsor: {
      eyebrow: "Independent work",
      title: "Sponsor",
      description:
        "Support independent work with $5, paid once. Your name, link, and logo stay in the supporter list for good.",
      footer: `${domain}/sponsor`,
    },
    project: {
      eyebrow: "Project case study",
    },
  },
};
