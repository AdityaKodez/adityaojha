/* eslint-disable @next/next/no-img-element -- ImageResponse renders embedded images directly. */
import { openGraphConfig } from "@/config/opengraph";
import { siteConfig } from "@/config/site";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";

export const runtime = "nodejs";
export const alt = `${siteConfig.personal.fullName}, ${openGraphConfig.locationLabel}, framed by a paper-cut flower garden`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERIF = "Instrument Serif";
const SANS = "Geist";
const { colors, artwork } = openGraphConfig;
const [font, locationFont, garden] = await Promise.all([
  readFile(path.join(process.cwd(), "lib/fonts/InstrumentSerif-Regular.ttf")),
  readFile(path.join(process.cwd(), "lib/fonts/Geist-Regular.ttf")),
  readFile(path.join(process.cwd(), "public", artwork.src), "base64"),
]);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: colors.background,
          color: colors.foreground,
          fontFamily: SERIF,
        }}
      >
        <img
          src={`data:image/png;base64,${garden}`}
          alt=""
          width={size.width}
          height={Math.round(size.width * artwork.height / artwork.width)}
          style={{ position: "absolute", left: 0, bottom: -210 }}
        />
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            {siteConfig.personal.fullName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 18,
              color: colors.mutedForeground,
              fontFamily: SANS,
              fontSize: 24,
              lineHeight: 1.2,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {Location01Icon.map(([tag, { key, ...attributes }]) =>
                createElement(tag, { ...attributes, key }),
              )}
            </svg>
            {openGraphConfig.locationLabel}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: SERIF, data: font, style: "normal", weight: 400 },
        { name: SANS, data: locationFont, style: "normal", weight: 400 },
      ],
    },
  );
}
