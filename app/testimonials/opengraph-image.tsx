import { openGraphConfig } from "@/config/opengraph";
import { getOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og/card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Testimonials about Aditya Ojha's work";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard {...openGraphConfig.routes.testimonials} />,
    { ...OG_SIZE, fonts: getOgFonts() },
  );
}
