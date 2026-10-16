import { footerConfig } from "@/config/site";

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
};
