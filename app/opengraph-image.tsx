import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export const alt =
  "Aditya Ojha — product engineer building SaaS products in public";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERIF = "Instrument Serif";

const loadFont = (file: string) =>
  readFileSync(path.join(process.cwd(), "lib", "fonts", file));

const loadAvatar = () => {
  const avatar = readFileSync(
    path.join(process.cwd(), "public", "profile.png"),
  );
  return `data:image/png;base64,${avatar.toString("base64")}`;
};

export default async function handler() {
  const regular = loadFont("InstrumentSerif-Regular.ttf");
  const italic = loadFont("InstrumentSerif-Italic.ttf");
  const avatar = loadAvatar();

  const displayName = siteConfig.personal.fullName;
  const siteUrl = siteConfig.meta.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "stretch",
        backgroundColor: "#ffffff",
        padding: "72px 80px",
      }}
    >
      {/* Left: type block */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingRight: 64,
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            letterSpacing: 6,
            color: "#737373",
          }}
        >
          BUILDING SAAS IN PUBLIC
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 118,
              lineHeight: 1.05,
              color: "#171717",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 34,
              lineHeight: 1.4,
              color: "#525252",
              marginTop: 28,
              maxWidth: 620,
            }}
          >
            The soul becomes dyed with the color of its thoughts.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 56, height: 2, backgroundColor: "#171717" }} />
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 30,
              color: "#171717",
            }}
          >
            {siteUrl}
          </div>
        </div>
      </div>

      {/* Right: portrait */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={avatar}
          alt=""
          width={340}
          height={340}
          style={{
            borderRadius: "50%",
            border: "3px solid #171717",
            objectFit: "cover",
          }}
        />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: SERIF, data: regular, style: "normal", weight: 400 },
        { name: SERIF, data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}