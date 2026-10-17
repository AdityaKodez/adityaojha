import { getEnabledComponents } from "@/config/components";
import { openGraphConfig } from "@/config/opengraph";
import { getOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og/card";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Reusable components from the akoder shadcn registry";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      {...openGraphConfig.routes.components}
      counter={`${getEnabledComponents().length} components`}
    />,
    { ...OG_SIZE, fonts: getOgFonts() },
  );
}
