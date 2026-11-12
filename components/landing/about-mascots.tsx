"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./about-mascots.module.css";

type EyeKind = "dot" | "happy";
type Tone = "teal" | "sun" | "peach" | "mint" | "lilac" | "claude";

type Eyes = { kind: EyeKind; left: [number, number]; right: [number, number] };

type Mascot = {
  id: string;
  name: string;
  tone: Tone;
  shape: ReactNode;
  eyes: Eyes;
  brows?: boolean;
  cheeks?: boolean;
  details?: ReactNode;
  accessory?: ReactNode;
};

const PETALS = Array.from({ length: 8 }, (_, index) => {
  const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
  return {
    cx: Math.round((32 + Math.cos(angle) * 14) * 10) / 10,
    cy: Math.round((31 + Math.sin(angle) * 14) * 10) / 10,
  };
});

const MASCOTS: Mascot[] = [
  {
    id: "cube",
    name: "cube",
    tone: "teal",
    shape: (
      <path d="M11 56V25.5c0-1.4.6-2.6 1.7-3.5l11.2-9.6c2-1.7 4.6-1.8 6.6-.4l2.8 2c.7.5 1.5.8 2.4.9l13.7 1.4c2 .2 3.6 1.9 3.6 4V56Z" />
    ),
    eyes: { kind: "dot", left: [24.5, 32], right: [33, 31] },
  },
  {
    id: "star",
    name: "star",
    tone: "sun",
    shape: (
      <path d="M32 8.5 37.8 19.6 50.4 21.2 42.2 30.2 44 56H20L21.8 30.2 13.6 21.2 26.2 19.6Z" />
    ),
    eyes: { kind: "happy", left: [27.6, 28.5], right: [36.4, 28.5] },
  },
  {
    id: "cloud",
    name: "cloud",
    tone: "peach",
    shape: (
      <path d="M11 56V38.5c-4-3-2.2-9.6 3.6-9.2-.8-6.8 6-10.8 11.2-7.2 2-7 12-8 14.8-.8 5-3 11.4 1.8 9 7.6 5.4 1.2 6.4 8 2.4 10.2V56Z" />
    ),
    eyes: { kind: "dot", left: [29, 33], right: [37, 33] },
  },
  {
    id: "blob",
    name: "blob",
    tone: "mint",
    shape: (
      <path d="M13 56V23.5C13 14 19.5 10.5 31.5 10.5S51 13.5 51 22.5c0 5.5-1 8-1 12V56Z" />
    ),
    eyes: { kind: "dot", left: [27, 28.5], right: [35.5, 28.5] },
    brows: true,
  },
  {
    id: "flower",
    name: "flower",
    tone: "lilac",
    shape: (
      <>
        <circle cx="32" cy="31" r="14" />
        {PETALS.map((petal) => (
          <circle key={`${petal.cx}-${petal.cy}`} {...petal} r="6.6" />
        ))}
        <rect x="18" y="31" width="28" height="25" />
      </>
    ),
    eyes: { kind: "dot", left: [28, 30.5], right: [36, 30.5] },
  },
  {
    id: "claude",
    name: "Claude",
    tone: "claude",
    shape: (
      <>
        <path
          className={styles.bodyFill}
          d="M14 56V31c0-9 6-15 14-17l4-1 4 1c8 2 14 8 14 17v25Z"
        />
        <path
          className={styles.hatFill}
          d="M11 24c0-2.2 1.8-4 4-4h34c2.2 0 4 1.8 4 4s-1.8 4-4 4H15c-2.2 0-4-1.8-4-4Z"
        />
        <path
          className={styles.hatFill}
          d="M18 21c0-7 5-11 11-12l3-1 3 1c6 1 11 5 11 12Z"
        />
      </>
    ),
    eyes: { kind: "dot", left: [26, 33], right: [34, 33] },
    cheeks: false,
    details: (
      <ellipse
        className={styles.snoutFill}
        cx="37"
        cy="40"
        rx="6.5"
        ry="4.5"
      />
    ),
    accessory: (
      <g className={styles.glass}>
        <path d="M51.5 35 55 42" className={styles.glassHandle} />
        <circle cx="47" cy="30" r="6.5" className={styles.glassLens} />
        <path d="M43.5 27a4.5 4.5 0 0 1 3.5-1.8" className={styles.glassGlint} />
      </g>
    ),
  },
];

const CLAUDE_INDEX = MASCOTS.findIndex((mascot) => mascot.id === "claude");
const STAR_INDEX = MASCOTS.findIndex((mascot) => mascot.id === "star");

const SLOTS = [
  { side: "left", seed: 4, delay: "0.25s" },
  { side: "right", seed: 11, delay: "0.55s" },
] as const;

const SWAP_DELAY = 190;

function nextIndex(current: number, taken: number) {
  const next = (current + 1) % MASCOTS.length;
  return next === taken ? (next + 1) % MASCOTS.length : next;
}

function Eye({ kind, x, y }: { kind: EyeKind; x: number; y: number }) {
  if (kind === "happy") {
    return (
      <path d={`M${x - 2.7} ${y + 1.3}q2.7-3.6 5.4 0`} className={styles.line} />
    );
  }

  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={styles.blink}>
        <rect x="-2.3" y="-3.8" width="4.6" height="7.6" rx="2.3" />
        <circle cx="0.7" cy="-1.7" r="0.95" className={styles.glint} />
      </g>
    </g>
  );
}

function MascotArt({ mascot, seed }: { mascot: Mascot; seed: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { eyes } = mascot;

  return (
    <svg
      viewBox="0 0 64 56"
      aria-hidden="true"
      focusable="false"
      className={styles.art}
      data-tone={mascot.tone}
    >
      <defs>
        <clipPath id={`${uid}-ledge`}>
          <rect x="-12" y="-20" width="88" height="63" />
        </clipPath>
        <clipPath id={`${uid}-shape`}>{mascot.shape}</clipPath>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.35"
            numOctaves="1"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0 0.04 18 0 0 0 -10.8" />
        </filter>
        <filter id={`${uid}-flecks`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.05"
            seed={seed + 7}
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 18 0 0 -10.4" />
        </filter>
        <radialGradient id={`${uid}-light`} cx="34%" cy="22%" r="72%">
          <stop offset="0" className={styles.lightStop} stopOpacity="0.46" />
          <stop offset="0.48" className={styles.lightStop} stopOpacity="0.08" />
          <stop offset="1" className={styles.darkStop} stopOpacity="0.14" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${uid}-ledge)`}>
        <g className={styles.body}>
          <g className={styles.shade} transform="translate(2.6 1.7)">
            {mascot.shape}
          </g>
          <g className={styles.base}>{mascot.shape}</g>
          <g clipPath={`url(#${uid}-shape)`}>
            <rect width="64" height="56" fill={`url(#${uid}-light)`} />
            <rect
              width="64"
              height="56"
              filter={`url(#${uid}-grain)`}
              className={styles.grain}
            />
            <rect
              width="64"
              height="56"
              filter={`url(#${uid}-flecks)`}
              className={styles.flecks}
            />
            <g className={styles.rim}>{mascot.shape}</g>
          </g>
          <g className={styles.face}>
            {mascot.details}
            {mascot.brows && (
              <path
                d={`M${eyes.left[0] - 2.4} ${eyes.left[1] - 6}l3.8-.8M${eyes.right[0] - 1.4} ${eyes.right[1] - 6.8}l3.8.8`}
                className={styles.brows}
              />
            )}
            <Eye kind={eyes.kind} x={eyes.left[0]} y={eyes.left[1]} />
            <Eye kind={eyes.kind} x={eyes.right[0]} y={eyes.right[1]} />
            {mascot.cheeks !== false &&
              [
                [eyes.left[0] - 3.4, eyes.left[1] + 5],
                [eyes.right[0] + 3.4, eyes.right[1] + 5],
              ].map(([cx, cy]) => (
                <ellipse
                  key={cx}
                  cx={cx}
                  cy={cy}
                  rx="2.5"
                  ry="1.3"
                  className={styles.cheek}
                />
              ))}
          </g>
          {mascot.accessory}
        </g>
      </g>

      <g className={styles.hands}>
        {[20.5, 43.5].map((x, index) => (
          <g key={x} transform={`rotate(${index ? 6 : -6} ${x} 44.5)`}>
            <rect
              x={x - 5.4}
              y="42.3"
              width="11.6"
              height="6"
              rx="3"
              className={styles.shade}
            />
            <rect
              x={x - 6}
              y="41.4"
              width="11.6"
              height="5.8"
              rx="2.9"
              className={styles.base}
            />
            <path
              d={`M${x - 1.6} 42.6v2.4M${x + 1.6} 42.6v2.4`}
              className={styles.knuckles}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Two textured mascots peeking over the About heading. Click one to swap it. */
export function AboutMascots() {
  const [picked, setPicked] = useState<[number, number]>([
    CLAUDE_INDEX,
    STAR_INDEX,
  ]);
  const [ducking, setDucking] = useState<[boolean, boolean]>([false, false]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const timeouts = timers.current;
    return () => timeouts.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = buttons.current[0]?.parentElement;
    if (!finePointer.matches || reduced.matches || !target) return;

    let frame = 0;
    let visible = false;
    let pointer = { x: 0, y: 0 };
    const clamp = (value: number) => Math.max(-1, Math.min(1, value)).toFixed(3);

    const update = () => {
      frame = 0;
      for (const button of buttons.current) {
        if (!button) continue;
        const rect = button.getBoundingClientRect();
        const dx = (pointer.x - rect.left - rect.width / 2) / 260;
        const dy = (pointer.y - rect.top - rect.height / 2) / 180;
        button.style.setProperty("--look-x", clamp(dx));
        button.style.setProperty("--look-y", clamp(dy));
      }
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (visible && !frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(target);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const setDuck = (slot: number, value: boolean) =>
    setDucking((current) =>
      slot ? [current[0], value] : [value, current[1]],
    );

  const swap = (slot: number) => {
    if (ducking[slot]) return;

    const next = () =>
      setPicked((current) => {
        const updated: [number, number] = [current[0], current[1]];
        updated[slot] = nextIndex(current[slot], current[slot ? 0 : 1]);
        return updated;
      });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      next();
      return;
    }

    setDuck(slot, true);
    timers.current.push(
      window.setTimeout(() => {
        next();
        setDuck(slot, false);
      }, SWAP_DELAY),
    );
  };

  return SLOTS.map((slot, index) => {
    const mascot = MASCOTS[picked[index]];
    const upcoming = MASCOTS[nextIndex(picked[index], picked[index ? 0 : 1])];

    return (
      <button
        key={slot.side}
        ref={(node) => {
          buttons.current[index] = node;
        }}
        type="button"
        className={styles.mascot}
        data-side={slot.side}
        data-ducking={ducking[index] || undefined}
        style={{ "--mascot-delay": slot.delay } as CSSProperties}
        aria-label={`Swap the ${mascot.name} mascot for the ${upcoming.name}`}
        onClick={() => swap(index)}
      >
        <MascotArt mascot={mascot} seed={slot.seed} />
      </button>
    );
  });
}
