"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { insightsConfig } from "@/config/insights";
import type { InsightPoint } from "@/config/types";
import { cn } from "@/lib/utils";

const FALLBACK_WIDTH = 720;
const HEIGHT = 117;
const TOP = 36;
const PIXEL = 2;
// Ordered 4 by 4 Bayer matrix, shared with the header logo and footer Earth.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// Dither density per horizontal band, from the top of the chart down.
const BANDS = [9, 6, 4, 2, 1];
const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const number = new Intl.NumberFormat("en-GB");
// Position changes glide between days; showing and hiding only fades.
const GLIDE =
  "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const FADE = "transition-opacity duration-150 motion-reduce:transition-none";

type PlotPoint = { x: number; y: number };

// Monotone cubic interpolation keeps peaks smooth without inventing overshoots.
function linePath(points: PlotPoint[]) {
  if (points.length < 2) return "";
  const slopes = points
    .slice(1)
    .map(
      (point, index) =>
        (point.y - points[index].y) / (point.x - points[index].x),
    );
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === points.length - 1) return slopes[index - 1];
    const before = slopes[index - 1];
    const after = slopes[index];
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
  });

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const third = (point.x - previous.x) / 3;
    return `${path} C ${previous.x + third} ${previous.y + tangents[index - 1] * third}, ${point.x - third} ${point.y - tangents[index] * third}, ${point.x} ${point.y}`;
  }, "");
}

function DitherPattern({ id, density }: { id: string; density: number }) {
  return (
    <pattern
      id={id}
      width={PIXEL * 4}
      height={PIXEL * 4}
      patternUnits="userSpaceOnUse"
    >
      {BAYER.map((threshold, index) =>
        threshold < density ? (
          <rect
            key={index}
            x={(index % 4) * PIXEL}
            y={Math.floor(index / 4) * PIXEL}
            width={PIXEL}
            height={PIXEL}
            fill="rgb(var(--footer-earth-ocean))"
          />
        ) : null,
      )}
    </pattern>
  );
}

export function InsightsChart({ points }: { points: InsightPoint[] }) {
  const id = useId().replace(/:/g, "");
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(FALLBACK_WIDTH);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [heldIndex, setHeldIndex] = useState(points.length - 1);
  const [gliding, setGliding] = useState(false);

  function select(next: number | null) {
    if (next === activeIndex) return;
    setGliding(activeIndex !== null && next !== null);
    setActiveIndex(next);
    if (next !== null) setHeldIndex(next);
  }

  // The chart draws in real pixels so the dither stays crisp at every width.
  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setWidth(next);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const maximum = Math.max(1, ...points.map((point) => point.visitors));
  const step = width / Math.max(1, points.length - 1);
  const plot = points.map((point, index) => ({
    x: index * step,
    y: HEIGHT - 4 - (point.visitors / maximum) * (HEIGHT - 20),
  }));
  const path = linePath(plot);
  const area = path ? `${path} L ${width} ${HEIGHT} L 0 ${HEIGHT} Z` : "";
  const bandHeight = HEIGHT / BANDS.length;
  const peakIndex = points.reduce(
    (best, point, index) =>
      point.visitors > points[best].visitors ? index : best,
    0,
  );
  const active = activeIndex !== null;
  const selected = points[heldIndex] ?? points[points.length - 1];
  const marker = plot[heldIndex] ?? plot[plot.length - 1];
  const motion = gliding ? GLIDE : FADE;
  const pillX = Math.min(Math.max(marker?.x ?? 0, 48), width - 48);
  const dotX = Math.min(Math.max(marker?.x ?? 0, 5), width - 5);
  const sliderIndex = activeIndex ?? points.length - 1;
  const sliderPoint = points[sliderIndex];
  const today = plot[plot.length - 1];
  const peak = plot[peakIndex];
  const clampLeft = (x: number) => `clamp(48px, ${x}px, calc(100% - 48px))`;

  function selectAtPointer(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;
    const ratio = (event.clientX - bounds.left) / bounds.width;
    select(
      Math.max(
        0,
        Math.min(points.length - 1, Math.round(ratio * (points.length - 1))),
      ),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next = activeIndex ?? points.length - 1;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next -= 1;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next += 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = points.length - 1;
        break;
      case "Escape":
        event.preventDefault();
        select(null);
        return;
      default:
        return;
    }
    event.preventDefault();
    select(Math.max(0, Math.min(points.length - 1, next)));
  }

  if (!sliderPoint || !today || !peak || !selected || !marker) return null;

  return (
    <figure className="mt-5 min-w-0">
      <figcaption id={`${id}-instructions`} className="sr-only">
        {insightsConfig.chartLabel}. {insightsConfig.instructions}
      </figcaption>
      <div
        ref={frame}
        role="slider"
        tabIndex={0}
        aria-label={insightsConfig.chartLabel}
        aria-describedby={`${id}-instructions`}
        aria-valuemin={0}
        aria-valuemax={points.length - 1}
        aria-valuenow={sliderIndex}
        aria-valuetext={`${fullDate.format(new Date(`${sliderPoint.date}T00:00:00Z`))} UTC, ${number.format(sliderPoint.visitors)} ${sliderPoint.visitors === 1 ? insightsConfig.visitor : insightsConfig.visitors}`}
        className="relative touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        style={{ height: TOP + HEIGHT }}
        onPointerMove={selectAtPointer}
        onPointerDown={(event) => {
          selectAtPointer(event);
          if (event.pointerType === "touch" && event.isPrimary) {
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") select(null);
        }}
        onPointerCancel={() => select(null)}
        onFocus={() => select(activeIndex ?? points.length - 1)}
        onBlur={() => select(null)}
        onKeyDown={handleKeyDown}
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${width} ${HEIGHT}`}
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full fill-none"
          style={{ height: HEIGHT }}
        >
          <defs>
            {BANDS.map((density, band) => (
              <DitherPattern
                key={band}
                id={`${id}-dither-${band}`}
                density={density}
              />
            ))}
            <clipPath id={`${id}-area`}>
              <path d={area} />
            </clipPath>
            <clipPath id={`${id}-highlight`}>
              <rect
                x={-step}
                y={0}
                width={step * 2}
                height={HEIGHT}
                className={motion}
                style={{ transform: `translateX(${marker.x}px)` }}
              />
            </clipPath>
          </defs>
          <g
            clipPath={`url(#${id}-area)`}
            className={cn(
              "transition-opacity duration-150 motion-reduce:transition-none",
              active ? "opacity-45" : "opacity-100",
            )}
          >
            {BANDS.map((_, band) => (
              <rect
                key={band}
                x={0}
                y={band * bandHeight}
                width={width}
                height={bandHeight + 1}
                fill={`url(#${id}-dither-${band})`}
              />
            ))}
          </g>
          <path
            d={path}
            stroke="rgb(var(--footer-earth-ocean))"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
            className={cn(
              "transition-opacity duration-150 motion-reduce:transition-none",
              active && "opacity-40",
            )}
          />
          <path
            d={path}
            stroke="rgb(var(--footer-earth-ocean))"
            strokeWidth={2.5}
            strokeLinecap="round"
            shapeRendering="geometricPrecision"
            clipPath={`url(#${id}-highlight)`}
            className={cn(FADE, active ? "opacity-100" : "opacity-0")}
          />
        </svg>

        <div aria-hidden="true" className="pointer-events-none select-none">
          <span className={cn(FADE, active ? "opacity-0" : "opacity-100")}>
            <span
              className="absolute top-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-muted-foreground"
              style={{ left: clampLeft(peak.x) }}
            >
              {insightsConfig.peakLabel}{" "}
              <span className="text-foreground">
                {number.format(points[peakIndex].visitors)}
              </span>
            </span>
            <span
              className="absolute w-px bg-foreground/15"
              style={{
                left: peak.x,
                top: 24,
                height: Math.max(0, TOP + peak.y - 30),
              }}
            />
            <span
              className="absolute size-2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: today.x - 4, top: TOP + today.y }}
            >
              <span className="absolute inset-0 rounded-full bg-[rgb(var(--footer-earth-ocean))] opacity-50 motion-safe:animate-ping" />
              <span className="absolute inset-0 rounded-full bg-[rgb(var(--footer-earth-ocean))] ring-2 ring-background" />
            </span>
          </span>
          <span className={cn(FADE, active ? "opacity-100" : "opacity-0")}>
            <span
              className={cn(
                "absolute bottom-0 left-0 w-px origin-bottom bg-[rgb(var(--footer-earth-ocean))]",
                motion,
              )}
              style={{
                height: HEIGHT,
                transform: `translateX(${marker.x - 0.5}px) scaleY(${(HEIGHT - marker.y) / HEIGHT})`,
              }}
            />
            <span
              className={cn(
                "absolute left-0 top-2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium tabular-nums text-background",
                motion,
              )}
              style={{ transform: `translateX(${pillX}px) translateX(-50%)` }}
            >
              {number.format(selected.visitors)}{" "}
              <span className="font-normal opacity-70">
                {selected.visitors === 1
                  ? insightsConfig.visitor
                  : insightsConfig.visitors}
                , {shortDate.format(new Date(`${selected.date}T00:00:00Z`))}
              </span>
            </span>
            <span
              className={cn(
                "absolute left-0 top-0 size-2.5 rounded-full bg-[rgb(var(--footer-earth-ocean))] ring-[3px] ring-background",
                motion,
              )}
              style={{
                transform: `translate(${dotX - 5}px, ${TOP + marker.y - 5}px)`,
              }}
            />
          </span>
        </div>
      </div>
    </figure>
  );
}
