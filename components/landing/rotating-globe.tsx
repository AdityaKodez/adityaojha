"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CONTINENTS_DATA } from "./continents-data";

interface RotatingGlobeProps {
  isHovered?: boolean;
  className?: string;
}

const R = 10; // sphere radius in viewBox units, matches the lucide globe circle
const CX = 12;
const CY = 12;

const TILT_DEG = -18; // axial tilt
const TILT_RAD = (TILT_DEG * Math.PI) / 180;
const COS_TILT = Math.cos(TILT_RAD);
const SIN_TILT = Math.sin(TILT_RAD);

const DEG = Math.PI / 180;
const START_ANGLE = -0.55; // resting longitude, lands the atlantic slightly left of centre

// Angular velocity in radians per millisecond at full spin.
const OMEGA = 0.0014;
// Exponential time constants: quick to wake, slow to settle.
const TAU_IN = 150;
const TAU_OUT = 340;

/**
 * Continent vertices, pre-projected so the render loop needs two trig calls
 * per frame instead of two per point.
 *
 * For a point at (lat, lng) rotated by `angle` about the polar axis:
 *   x = a·cos(angle) + b·sin(angle)
 *   z = b·cos(angle) - a·sin(angle)
 * with y fixed, since rotation happens around the y axis.
 */
const PROJECTED_CONTINENTS = CONTINENTS_DATA.map((polygon) =>
  polygon.map(([lat, lng]) => {
    const radLat = lat * DEG;
    const radLng = lng * DEG;
    const cosLat = Math.cos(radLat);

    return {
      y: R * Math.sin(radLat),
      a: R * cosLat * Math.sin(radLng),
      b: R * cosLat * Math.cos(radLng),
    };
  }),
);

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function buildMeridians(angle: number) {
  let markup = "";

  for (let i = 0; i < 3; i++) {
    const rad = angle + (i * Math.PI) / 3;
    const cos = Math.cos(rad);

    // Only the front-facing half of each great circle is drawn.
    if (cos <= 0) {
      continue;
    }

    const sin = Math.sin(rad);
    const rx = Math.max(0.01, Math.abs(sin) * R).toFixed(2);
    const sweep = sin >= 0 ? 1 : 0;
    const opacity = (0.24 + 0.36 * cos).toFixed(3);

    markup += `<path d="M ${CX} ${CY - R} A ${rx} ${R} 0 0 ${sweep} ${CX} ${CY + R}" stroke-width="1.3" opacity="${opacity}" />`;
  }

  return markup;
}

function buildContinents(angle: number) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  let markup = "";

  for (let p = 0; p < PROJECTED_CONTINENTS.length; p++) {
    const polygon = PROJECTED_CONTINENTS[p];
    let path = "";
    let pointsInRun = 0;

    for (let i = 0; i < polygon.length; i++) {
      const { y: y0, a, b } = polygon[i];

      const x0 = a * cosA + b * sinA;
      const z = b * cosA - a * sinA;

      // Front hemisphere only, with a sliver of tolerance so coastlines
      // disappear at the limb instead of popping.
      if (z <= -0.2) {
        pointsInRun = 0;
        continue;
      }

      const x = x0 * COS_TILT - y0 * SIN_TILT;
      const y = x0 * SIN_TILT + y0 * COS_TILT;

      path += `${pointsInRun === 0 ? "M" : "L"} ${(CX + x).toFixed(2)} ${(CY - y).toFixed(2)} `;
      pointsInRun++;
    }

    markup += path;
  }

  return markup ? `<path d="${markup.trim()}" />` : "";
}

export function RotatingGlobe({ isHovered: externalHover, className }: RotatingGlobeProps) {
  const [internalHover, setInternalHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isHovered = externalHover ?? internalHover;

  const rawId = useId();
  const clipId = `globe-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const staticFaceRef = useRef<SVGGElement | null>(null);
  const wireframeRef = useRef<SVGGElement | null>(null);
  const meridiansRef = useRef<SVGGElement | null>(null);
  const continentsRef = useRef<SVGGElement | null>(null);

  const angleRef = useRef(START_ANGLE);
  const progressRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const target = isHovered ? 1 : 0;
    let previousTime = 0;
    let active = true;

    /**
     * A single eased `progress` value drives both the crossfade and the spin,
     * so the wireframe materialises exactly as the globe starts turning and
     * settles back as it winds down. No swap, no jump.
     */
    const paint = (progress: number) => {
      const faded = smoothstep(progress);

      if (staticFaceRef.current) {
        staticFaceRef.current.style.opacity = `${1 - faded}`;
      }

      // Complementary pair: the two faces trade places without a density dip.
      if (wireframeRef.current) {
        wireframeRef.current.style.opacity = `${faded}`;
      }

      if (meridiansRef.current) {
        meridiansRef.current.innerHTML = buildMeridians(angleRef.current);
      }

      if (continentsRef.current) {
        // Coastlines resolve a beat after the grid, so the globe reads as
        // coming into focus rather than switching on.
        continentsRef.current.style.opacity = `${smoothstep((progress - 0.22) / 0.78)}`;
        continentsRef.current.innerHTML = buildContinents(angleRef.current);
      }
    };

    const step = (time: number) => {
      if (!active) {
        return;
      }

      // Clamp the delta so a backgrounded tab does not fling the globe forward.
      const delta = previousTime === 0 ? 16.7 : Math.min(time - previousTime, 50);
      previousTime = time;

      const tau = target > progressRef.current ? TAU_IN : TAU_OUT;
      const ease = 1 - Math.exp(-delta / tau);
      progressRef.current += (target - progressRef.current) * ease;

      const settled = Math.abs(target - progressRef.current) < 0.002;
      if (settled) {
        progressRef.current = target;
      }

      if (!reducedMotion) {
        angleRef.current += OMEGA * delta * smoothstep(progressRef.current);
      }

      paint(progressRef.current);

      if (settled && (target === 0 || reducedMotion)) {
        if (target === 0) {
          angleRef.current = START_ANGLE;
          paint(0);
        }
        frameRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    if (target === 1 || progressRef.current > 0) {
      frameRef.current = requestAnimationFrame(step);
    }

    return () => {
      active = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isHovered, reducedMotion]);

  return (
    <span
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center text-inherit",
        className,
      )}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx={CX} cy={CY} r={R - 0.1} />
          </clipPath>
        </defs>

        {/* The limb is drawn once and never animated, so the silhouette stays
            pixel-identical to the resting icon through the whole transition. */}
        <circle cx={CX} cy={CY} r={R} />

        <g clipPath={`url(#${clipId})`}>
          {/* Resting face: the lucide globe interior. */}
          <g ref={staticFaceRef}>
            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
            <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
            <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
          </g>

          {/* Live face: tilted graticule plus rotating coastlines. */}
          <g ref={wireframeRef} style={{ opacity: 0 }}>
            <g transform={`rotate(${TILT_DEG} ${CX} ${CY})`}>
              <ellipse cx={CX} cy={CY} rx={R} ry="2.6" strokeWidth="1.3" opacity="0.3" />
              <path d="M 4.3 6.2 Q 12 8.2 19.7 6.2" strokeWidth="1.1" opacity="0.2" />
              <path d="M 4.3 17.8 Q 12 19.8 19.7 17.8" strokeWidth="1.1" opacity="0.2" />
              <g ref={meridiansRef} />
            </g>
            <g ref={continentsRef} strokeWidth="1.6" style={{ opacity: 0 }} />
          </g>
        </g>
      </svg>
    </span>
  );
}
