/**
 * Shared card renderer for the per-route OG images.
 *
 * The root `app/opengraph-image.tsx` stays hand-rolled, this is the version used
 * by dynamic routes that need to show a title, a description and an install
 * command instead of the site-wide identity card.
 *
 * Fonts are read lazily inside `getOgFonts()` rather than at module scope so the
 * module stays cheap to import and nothing touches the filesystem until a card
 * is actually rendered.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const SANS = "Geist";
const MONO = "Geist Mono";

const BG = "#0a0a0b";
const GRID = "#17171a";
const TEXT = "#fafafa";
const MUTED = "#a1a1aa";
const FAINT = "#52525b";
const BORDER = "#27272a";
const PANEL = "#111113";

const loadFont = (file: string) =>
  readFileSync(path.join(process.cwd(), "lib", "fonts", file));

export function getOgFonts() {
  return [
    {
      name: SANS,
      data: loadFont("Geist-Regular.ttf"),
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: SANS,
      data: loadFont("Geist-Bold.ttf"),
      style: "normal" as const,
      weight: 700 as const,
    },
    {
      name: MONO,
      data: loadFont("GeistMono-Regular.ttf"),
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

/** Collapse whitespace and cut on a word boundary so long copy never overflows. */
function clamp(text: string, max: number) {
  const clean = text
    .replace(/\u2318/g, "Cmd+")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = cut.lastIndexOf(" ");
  const body = (at > 0 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, "");
  return `${body}…`;
}

/** Step the title down as it gets longer so the longest names still fit one line. */
function titleSize(length: number) {
  if (length > 34) return 44;
  if (length > 26) return 52;
  if (length > 20) return 62;
  if (length > 14) return 72;
  return 84;
}

export type OgCardProps = {
  /** Small mono label on the right of the header, e.g. "shadcn registry item". */
  eyebrow: string;
  title: string;
  description: string;
  /** Monospace command or URL rendered in the footer panel. */
  footer: string;
  /** Optional mono counter on the right of the footer, e.g. "01 / 14". */
  counter?: string;
};

export function OgCard({
  eyebrow,
  title,
  description,
  footer,
  counter,
}: OgCardProps) {
  const grid = [];
  for (let x = 90; x < 1200; x += 90) {
    grid.push(
      <div
        key={`v${x}`}
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: 1,
          height: 630,
          backgroundColor: GRID,
        }}
      />,
    );
  }
  for (let y = 90; y < 630; y += 90) {
    grid.push(
      <div
        key={`h${y}`}
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: 1200,
          height: 1,
          backgroundColor: GRID,
        }}
      />,
    );
  }

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: BG,
        overflow: "hidden",
      }}
    >
      {grid}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "54px 72px 62px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 42,
                height: 42,
                borderRadius: 13,
                backgroundColor: TEXT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={42} height={42} viewBox="0 0 32 32">
                <path
                  d="M16 8 L22 24 L19 24 L16 14.5 L13 24 L10 24 Z"
                  fill={BG}
                  stroke={BG}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: MONO,
                fontSize: 22,
                color: FAINT,
                letterSpacing: -0.4,
              }}
            >
              akoder.xyz
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: MONO,
              fontSize: 20,
              color: FAINT,
              letterSpacing: 0.6,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: titleSize(title.length),
              lineHeight: 1.06,
              letterSpacing: -0.5,
              color: TEXT,
              width: 1056,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: SANS,
              fontSize: 25,
              lineHeight: 1.45,
              color: MUTED,
              width: 900,
              marginTop: 22,
            }}
          >
            {clamp(description, 220)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${BORDER}`,
              backgroundColor: PANEL,
              borderRadius: 14,
              padding: "19px 26px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: MONO,
                fontSize: 20,
                color: "#e4e4e7",
              }}
            >
              {footer}
            </div>
          </div>
          {counter ? (
            <div
              style={{
                display: "flex",
                fontFamily: MONO,
                fontSize: 20,
                color: FAINT,
              }}
            >
              {counter}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
