import { openGraphConfig } from "@/config/opengraph";
import { siteConfig } from "@/config/site";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const SERIF = "Instrument Serif";
const SANS = "Geist";
const MONO = "Geist Mono";
const { colors, artwork } = openGraphConfig;

const loadFont = (file: string) =>
  readFileSync(path.join(process.cwd(), "lib", "fonts", file));

export function getOgFonts() {
  return [
    {
      name: SERIF,
      data: loadFont("InstrumentSerif-Regular.ttf"),
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: SANS,
      data: loadFont("Geist-Regular.ttf"),
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: MONO,
      data: loadFont("GeistMono-Regular.ttf"),
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

function clamp(text: string, max: number) {
  const clean = text
    .replace(/\u2318/g, "Cmd+")
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = cut.lastIndexOf(" ");
  const body = (at > 0 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, "");
  return `${body}…`;
}

function titleSize(length: number) {
  if (length > 30) return 70;
  if (length > 24) return 80;
  if (length > 18) return 90;
  return 104;
}

export type OgCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
  counter?: string;
};

export function OgCard({
  eyebrow,
  title,
  description,
  footer,
  counter,
}: OgCardProps) {
  const heading = title.replace(/\s*\u2014\s*/g, ": ");
  const garden = readFileSync(
    path.join(process.cwd(), "public", artwork.src),
    "base64",
  );

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: SANS,
      }}
    >
      {createElement("img", {
        src: `data:image/png;base64,${garden}`,
        alt: "",
        width: OG_SIZE.width,
        height: Math.round(OG_SIZE.width * artwork.height / artwork.width),
        style: { position: "absolute", left: 0, bottom: -285 },
      })}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 55,
          alignItems: "center",
          gap: 12,
          fontSize: 20,
          color: colors.mutedForeground,
        }}
      >
        <span>{siteConfig.personal.fullName}</span>
        <span>/</span>
        <span>{eyebrow}</span>
      </div>
      {counter ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 59,
            right: 56,
            fontFamily: MONO,
            fontSize: 16,
            color: colors.mutedForeground,
          }}
        >
          {counter}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          width: 1000,
          marginTop: 155,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            fontFamily: SERIF,
            fontSize: titleSize(heading.length),
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: -1.5,
          }}
        >
          {heading}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: 820,
            marginTop: 20,
            fontSize: 23,
            lineHeight: 1.4,
            color: colors.mutedForeground,
          }}
        >
          {clamp(description, 180)}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: MONO,
            fontSize: 18,
            lineHeight: 1.4,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}
