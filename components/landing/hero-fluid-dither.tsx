"use client";

import { useEffect, useRef } from "react";

type RgbTriplet = [number, number, number];

const BAYER_4X4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

const PIXEL_SIZE = 3;
const TIME_SEED = 14.2;
const APPEAR_DURATION = 0.65;

function readRgb(styles: CSSStyleDeclaration, name: string): RgbTriplet {
  const parts = styles.getPropertyValue(name).trim().split(/\s+/).map(Number);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

function readPalette(element: Element): RgbTriplet[] {
  const styles = getComputedStyle(element);
  return [
    readRgb(styles, "--hero-wave-stop-1"),
    readRgb(styles, "--hero-wave-stop-2"),
    readRgb(styles, "--hero-wave-stop-3"),
    readRgb(styles, "--hero-wave-stop-4"),
    readRgb(styles, "--hero-wave-stop-5"),
  ];
}

function hash1(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise1D(x: number): number {
  const i = Math.floor(x);
  const f = smooth(x - i);
  return hash1(i) + (hash1(i + 1) - hash1(i)) * f;
}

function noise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

function ridge1D(x: number): number {
  const n = 1 - Math.abs(noise1D(x) * 2 - 1);
  return n * n * n;
}

interface ColumnProfile {
  edgeRow: number;
  spikeStrength: number;
  valleyDepth: number;
}

function computeColumnProfile(
  nx: number,
  t: number,
  rows: number,
  pointerX: number,
  pointerStrength: number,
): ColumnProfile {
  const macro = noise1D(nx * 3.1 + t * 0.055);
  const valley = Math.pow(noise1D(nx * 5.6 - t * 0.042 + 19.3), 1.75);
  const primarySpike = ridge1D(nx * 8.2 + t * 0.08 + 4.7);
  const sharpSpike = ridge1D(nx * 19.4 - t * 0.1 + 31.2);
  const grit = (noise1D(nx * 44 + t * 0.13 + 7.1) - 0.5) * 0.095;

  let edgeFrac =
    0.55 +
    (macro - 0.5) * 0.28 -
    valley * 0.29 +
    primarySpike * 0.27 +
    sharpSpike * 0.17 +
    grit;

  let pointerBoost = 0;
  if (pointerStrength > 0.005) {
    const dx = nx - pointerX;
    const influence = Math.exp(-(dx * dx) / 0.018);
    const localSpike = ridge1D(nx * 14 - t * 0.35 + 2.3);
    edgeFrac += (localSpike - 0.35) * 0.16 * influence * pointerStrength;
    pointerBoost = influence * pointerStrength * 0.25;
  }

  const clamped = Math.max(0.14, Math.min(0.94, edgeFrac));
  const spikeStrength = Math.min(1, primarySpike * 0.85 + sharpSpike * 0.65 + pointerBoost);

  return {
    edgeRow: clamped * rows,
    spikeStrength,
    valleyDepth: valley,
  };
}

export function HeroFluidDither({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette(canvas);
    let cols = 0;
    let rows = 0;
    let imageData: ImageData | null = null;
    let frameId = 0;
    let visible = true;
    let elapsed = 0;
    let appearElapsed = reducedMotion.matches ? APPEAR_DURATION : 0;
    let lastTimestamp = 0;
    let pointerX = -1;
    let pointerStrength = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextCols = Math.max(1, Math.ceil(rect.width / PIXEL_SIZE));
      const nextRows = Math.max(1, Math.ceil(rect.height / PIXEL_SIZE));

      cols = nextCols;
      rows = nextRows;
      canvas.width = nextCols;
      canvas.height = nextRows;
      imageData = context.createImageData(nextCols, nextRows);
    };

    const draw = (time: number) => {
      if (cols <= 1 || rows <= 1 || !imageData) return;
      const data = imageData.data;
      data.fill(0);

      const t = time + TIME_SEED;
      const colSpan = Math.max(1, cols - 1);
      const rowSpan = Math.max(1, rows - 1);
      const rawAppear = Math.max(0, Math.min(1, appearElapsed / APPEAR_DURATION));
      const appearEase = 1 - Math.pow(1 - rawAppear, 3);
      const revealFloor = 0.14 + appearEase * 0.86;

      for (let c = 0; c < cols; c++) {
        const nx = c / colSpan;
        const { edgeRow, spikeStrength, valleyDepth } = computeColumnProfile(
          nx,
          t,
          rows,
          pointerX,
          pointerStrength,
        );

        const scatterRows = 4.5 + spikeStrength * 5;
        const maxRow = Math.min(rows - 1, Math.ceil(edgeRow + scatterRows));
        const colAppearJitter = (noise1D(nx * 14 + 3.7) - 0.5) * 0.22;

        for (let r = 0; r <= maxRow; r++) {
          const distBelow = r - edgeRow;
          const ny = r / rowSpan;
          const bayer = (BAYER_4X4[(r & 3) * 4 + (c & 3)] + 0.5) / 16;

          const voidBroad = noise2D(nx * 7.4 + t * 0.048, ny * 3.8 - t * 0.032);
          const voidFine = noise2D(nx * 17.5 - t * 0.065 + 11.4, ny * 8.2 + t * 0.04);
          const pocket = voidBroad * 0.66 + voidFine * 0.34;

          // Top-down Bayer materialize cascade on initial mount.
          const appearMask =
            rawAppear >= 1
              ? 1
              : Math.max(
                  0,
                  Math.min(
                    1,
                    (revealFloor * 1.28 - ny * 0.95 + colAppearJitter) * 2.4,
                  ),
                );
          if (appearMask <= 0) continue;

          // Carve a soft organic clearing around the top-left header logo so
          // dense blue pixels do not camouflage the mark.
          const xPx = (c + 0.5) * PIXEL_SIZE;
          const yPx = (r + 0.5) * PIXEL_SIZE;
          const logoDx = (xPx - 46) / 38;
          const logoDy = (yPx - 36) / 30;
          const logoDistSq =
            logoDx * logoDx + logoDy * logoDy + (voidFine - 0.5) * 0.28;
          const logoCut =
            logoDistSq < 1.35
              ? Math.pow(Math.max(0, 1 - logoDistSq / 1.35), 1.4) * 1.15
              : 0;

          let lit = false;
          let progress = 1;

          if (distBelow <= 0) {
            progress = Math.max(0, Math.min(1, r / Math.max(1, edgeRow)));
            const topAnchor = Math.max(0, 1 - ny * 2.6) * 0.24;
            const bodyDensity =
              0.26 +
              (1 - progress) * 0.32 +
              spikeStrength * 0.32 * progress -
              valleyDepth * 0.14;
            const spaceCut = pocket < 0.42 ? (0.42 - pocket) * 2.05 : 0;
            const roughGrain = (voidFine - 0.5) * 0.36;
            const density =
              Math.max(
                0,
                Math.min(
                  0.95,
                  bodyDensity + topAnchor + roughGrain - spaceCut - logoCut,
                ),
              ) * appearMask;
            lit = density > bayer;
          } else {
            const falloff = Math.max(0, 1 - distBelow / scatterRows);
            const scatterDensity =
              Math.max(
                0,
                falloff *
                  falloff *
                  (0.38 + spikeStrength * 0.44) *
                  (0.35 + voidFine * 0.95) -
                  logoCut,
              ) * appearMask;
            lit = scatterDensity > bayer;
          }

          if (!lit) continue;

          const bayerColor =
            (BAYER_4X4[((r + 2) & 3) * 4 + ((c + 1) & 3)] + 0.5) / 16;

          const accentChance =
            Math.max(0, (spikeStrength - 0.36) * 1.45) *
              Math.pow(progress, 1.35) +
            (distBelow > 0 && spikeStrength > 0.48 ? 0.32 : 0);

          let stopIndex: number;
          if (accentChance > bayerColor) {
            stopIndex = 4;
          } else {
            const coolTone = Math.max(
              0,
              Math.min(
                1,
                progress * 0.68 +
                  (1 - pocket) * 0.22 +
                  (voidBroad - 0.5) * 0.26,
              ),
            );
            const scaled = coolTone * 3;
            const base = Math.min(2, Math.floor(scaled));
            stopIndex = base + (scaled - base > bayerColor ? 1 : 0);
          }

          const [cr, cg, cb] = palette[stopIndex];
          const offset = (r * cols + c) * 4;
          data[offset] = cr;
          data[offset + 1] = cg;
          data[offset + 2] = cb;
          data[offset + 3] = 255;
        }
      }

      context.putImageData(imageData, 0, 0);
    };

    const stopLoop = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      lastTimestamp = 0;
    };

    const tick = (timestamp: number) => {
      frameId = 0;
      if (!visible || document.hidden || reducedMotion.matches) {
        lastTimestamp = 0;
        return;
      }

      const dt = lastTimestamp ? Math.min(0.05, (timestamp - lastTimestamp) / 1000) : 0;
      lastTimestamp = timestamp;
      elapsed += dt;
      if (appearElapsed < APPEAR_DURATION) {
        appearElapsed = Math.min(APPEAR_DURATION, appearElapsed + dt);
      }

      if (pointerX < 0) {
        pointerStrength = Math.max(0, pointerStrength - dt * 1.6);
      } else {
        pointerStrength = Math.min(1, pointerStrength + dt * 2.4);
      }

      draw(elapsed);
      frameId = window.requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      if (reducedMotion.matches) {
        stopLoop();
        pointerStrength = 0;
        appearElapsed = APPEAR_DURATION;
        draw(elapsed);
        return;
      }
      if (visible && !document.hidden && !frameId) {
        lastTimestamp = 0;
        frameId = window.requestAnimationFrame(tick);
      } else if (!visible || document.hidden) {
        stopLoop();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0) return;
      pointerX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    };

    const resetPointer = () => {
      pointerX = -1;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(elapsed);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        syncPlayback();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      palette = readPalette(canvas);
      draw(elapsed);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleVisibilityChange = () => {
      syncPlayback();
    };

    const handleMotionChange = () => {
      syncPlayback();
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", resetPointer);
    canvas.addEventListener("pointercancel", resetPointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionChange);

    resize();
    draw(elapsed);
    syncPlayback();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", resetPointer);
      canvas.removeEventListener("pointercancel", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
