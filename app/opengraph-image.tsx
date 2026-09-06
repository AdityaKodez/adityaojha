import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export const alt = "Aditya Ojha, building SaaS in public";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GEIST = "Geist";
const SERIF = "Instrument Serif";

const DARK_BG = "#0a0a0b";
const DARK_TEXT = "#fafafa";

const loadFont = (file: string) =>
  readFileSync(path.join(process.cwd(), "lib", "fonts", file));

const loadNodeFont = (rel: string) =>
  readFileSync(path.join(process.cwd(), "node_modules", rel));

const HEAT_LEVELS = ["#1a1a1d", "#27272b", "#3d3d44", "#62626c", "#a1a1aa", "#e4e4e7"];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function LogoMark({ size = 46 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        borderRadius: (size * 10) / 32,
        backgroundColor: "#fafafa",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        <path
          d="M16 8 L22 24 L19 24 L16 14.5 L13 24 L10 24 Z"
          fill="#0a0a0b"
          stroke="#0a0a0b"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Heatmap() {
  const rnd = mulberry32(1337);
  const cols = 24;
  const rows = 7;
  const cell = 18;
  const gap = 5;
  const weeks: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const col: number[] = [];
    for (let r = 0; r < rows; r++) {
      const v = rnd();
      const level = v < 0.24 ? 0 : v < 0.46 ? 1 : v < 0.68 ? 2 : v < 0.86 ? 3 : v < 0.96 ? 4 : 5;
      col.push(level);
    }
    weeks.push(col);
  }
  return (
    <div
      style={{ display: "flex", position: "absolute", right: 72, bottom: 64, flexDirection: "column", gap }}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", flexDirection: "row", gap }}>
          {weeks.map((week, c) => (
            <div
              key={c}
              style={{
                width: cell,
                height: cell,
                borderRadius: 4,
                backgroundColor: HEAT_LEVELS[week[r]],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function handler() {
  const displayName = siteConfig.personal.fullName;
  const [firstName, lastName] = displayName.split(" ");

  const gridLines = [];
  for (let x = 90; x < 1200; x += 90) {
    gridLines.push(
      <div
        key={`v${x}`}
        style={{ position: "absolute", left: x, top: 0, width: 1, height: 630, backgroundColor: "#17171a" }}
      />,
    );
  }
  for (let y = 90; y < 630; y += 90) {
    gridLines.push(
      <div
        key={`h${y}`}
        style={{ position: "absolute", left: 0, top: y, width: 1200, height: 1, backgroundColor: "#17171a" }}
      />,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: DARK_BG,
          overflow: "hidden",
        }}
      >
        {gridLines}
        <div style={{ display: "flex", position: "absolute", left: 72, top: 60 }}>
          <LogoMark />
        </div>
        <div style={{ display: "flex", position: "absolute", left: 72, bottom: 64, flexDirection: "column" }}>
          <div
            style={{
              fontFamily: GEIST,
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1.04,
              letterSpacing: -3,
              color: DARK_TEXT,
            }}
          >
            {firstName}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 100,
              lineHeight: 1.02,
              color: "#d4d4d8",
              marginTop: 4,
            }}
          >
            {lastName}
          </div>
        </div>
        <Heatmap />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: GEIST, data: loadNodeFont("geist/dist/fonts/geist-sans/Geist-Bold.ttf"), style: "normal", weight: 700 },
        { name: SERIF, data: loadFont("InstrumentSerif-Italic.ttf"), style: "italic", weight: 400 },
      ],
    },
  );
}
