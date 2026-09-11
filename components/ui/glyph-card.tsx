"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { useId, useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

const FIELD_BOX = 100;
const GLYPH_GRID = 24;
const DEFAULT_GLYPH_SIZE = 62;

/**
 * Plus marks and the grid they sit on. `TILE` is the pitch between marks and
 * `PLUS_ARM` is half the length of one, so the pair controls how dense and how
 * heavy the field reads. Smaller arms with a tighter tile give a finer grain.
 */
const TILE = 2.6;
const PLUS_ARM = 0.4;
const PLUS_STROKE = 0.18;
const PLUS_CENTER = TILE / 2;
const PLUS_PATH = `M${PLUS_CENTER - PLUS_ARM} ${PLUS_CENTER}h${PLUS_ARM * 2}M${PLUS_CENTER} ${PLUS_CENTER - PLUS_ARM}v${PLUS_ARM * 2}`;

const FIELD_ORIGIN: CSSProperties = {
  transformBox: "view-box",
  transformOrigin: `${FIELD_BOX / 2}px ${FIELD_BOX / 2}px`,
};

const PLUS_ORIGIN: CSSProperties = {
  transformOrigin: `${PLUS_CENTER}px ${PLUS_CENTER}px`,
};

const FOCUS: Transition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
};

const REDUCED: Transition = { duration: 0 };

/**
 * Published-file fallbacks. `--primary` and `--card-foreground` are this site's
 * tokens, so a consumer project without them would otherwise render the artwork
 * in an invalid color. Literals mirror the light-theme token values.
 */
const FALLBACK_ACCENT = "#1447E6";
const FALLBACK_CARD_FOREGROUND = "#0A0A0A";

export interface GlyphCardProps {
  /** Small mono label in the top-left, for example "Runtime". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Makes the whole card a link. Omit for a static card. */
  href?: string;
  /** Link target attribute, for example "_blank". */
  target?: string;
  /** Link rel attribute, for example "noopener noreferrer". */
  rel?: string;
  /** Explicit accessible label for the card link. */
  "aria-label"?: string;
  /** SVG path data authored on a 24x24 grid. */
  glyph: string;
  /**
   * Shifts the glyph inside the 24x24 viewBox, in grid units.
   *
   * Most brand marks are already centered on the grid and need nothing. A mark
   * that is not, for example one whose art only occupies the bottom-right
   * quadrant, ends up off-center inside the card. Rather than rewriting the path
   * coordinates, pass the offset that recenters it: a mark whose bounding box
   * runs x 10..22 and y 8..24 has a center of (16, 16), so it wants
   * `glyphOffset={[-4, -4]}` to land on (12, 12).
   */
  glyphOffset?: readonly [number, number];
  /**
   * Size of the glyph viewport inside the 100x100 field.
   */
  glyphSize?: number;
  /** Accent for the artwork and link arrow. */
  accent?: string;
  className?: string;
}

export function GlyphCard({
  eyebrow,
  title,
  subtitle,
  href,
  target,
  rel,
  "aria-label": ariaLabel,
  glyph,
  glyphOffset,
  glyphSize = DEFAULT_GLYPH_SIZE,
  accent = `var(--primary, ${FALLBACK_ACCENT})`,
  className,
}: GlyphCardProps) {
  const uid = `gc-${useId().replace(/:/g, "-")}`;
  const restPatternId = `${uid}-rp`;
  const hoverPatternId = `${uid}-hp`;
  const outsideMaskId = `${uid}-om`;
  const insideMaskId = `${uid}-im`;

  const [isActive, setIsActive] = useState(false);
  const reduceMotion = useReducedMotion();
  const focus = reduceMotion ? REDUCED : FOCUS;
  const glyphScale = reduceMotion ? 1 : 0.965;
  // A quarter turn would look identical because a plus is 90-degree symmetric.
  // Forty-five degrees makes the background marks resolve into subtle x shapes.
  const plusRotation = reduceMotion || !isActive ? 0 : 45;

  /*
   * The glyph sits in a `glyphSize` box centered inside the 100x100 field, so
   * the inset is half the leftover space. Both masks share it, which is what
   * keeps the pattern and the tint registered to the same shape.
   */
  const glyphInset = (FIELD_BOX - glyphSize) / 2;

  /*
   * Applied on a wrapping <g> so both masks move together. The transform is in
   * grid units, which are the units the glyph author already knows.
   */
  const glyphTransform = glyphOffset
    ? `translate(${glyphOffset[0]} ${glyphOffset[1]})`
    : undefined;

  /*
   * The SVG covers the complete card. preserveAspectRatio="none" lets the plus
   * field reach every edge, while each mask contains a nested 24x24 SVG that
   * preserves the glyph proportions inside a centered responsive viewport.
   */
  const field = (
    <svg
      viewBox={`0 0 ${FIELD_BOX} ${FIELD_BOX}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 z-0 block h-full w-full"
    >
      <g>
        <rect
          width={FIELD_BOX}
          height={FIELD_BOX}
          fill={`url(#${restPatternId})`}
          mask={`url(#${outsideMaskId})`}
        />
      </g>

      <motion.g
        style={FIELD_ORIGIN}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive && !reduceMotion ? 1.01 : glyphScale,
        }}
        transition={focus}
      >
        <rect
          width={FIELD_BOX}
          height={FIELD_BOX}
          fill={`url(#${hoverPatternId})`}
          mask={`url(#${insideMaskId})`}
        />
      </motion.g>

      <defs>
        <pattern
          id={restPatternId}
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <motion.path
            d={PLUS_PATH}
            fill="none"
            stroke={`color-mix(in oklab, ${accent} 44%, var(--card-foreground, ${FALLBACK_CARD_FOREGROUND}))`}
            strokeWidth={PLUS_STROKE}
            strokeLinecap="round"
            style={PLUS_ORIGIN}
            animate={{
              rotate: plusRotation,
              opacity: isActive ? 0.38 : 1,
            }}
            transition={focus}
          />
        </pattern>

        <pattern
          id={hoverPatternId}
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={PLUS_PATH}
            fill="none"
            stroke={accent}
            strokeWidth={PLUS_STROKE * 1.35}
            strokeLinecap="round"
          />
        </pattern>

        <mask
          id={outsideMaskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={FIELD_BOX}
          height={FIELD_BOX}
        >
          <rect width={FIELD_BOX} height={FIELD_BOX} fill="#fff" />
          <svg
            x={glyphInset}
            y={glyphInset}
            width={glyphSize}
            height={glyphSize}
            viewBox={`0 0 ${GLYPH_GRID} ${GLYPH_GRID}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={glyphTransform}>
              <path d={glyph} fill="#000" />
            </g>
          </svg>
        </mask>

        <mask
          id={insideMaskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={FIELD_BOX}
          height={FIELD_BOX}
        >
          <svg
            x={glyphInset}
            y={glyphInset}
            width={glyphSize}
            height={glyphSize}
            viewBox={`0 0 ${GLYPH_GRID} ${GLYPH_GRID}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={glyphTransform}>
              <path d={glyph} fill="#fff" />
            </g>
          </svg>
        </mask>
      </defs>
    </svg>
  );

  const isExternal =
    target === "_blank" ||
    (typeof href === "string" &&
      (href.startsWith("http://") || href.startsWith("https://")));

  const content = (
    <>
      <div className="relative z-10 flex min-w-0 items-start justify-between gap-3">
        <span className="min-w-0 rounded-sm bg-card/90 px-1.5 py-0.5 font-mono text-xs text-muted-foreground backdrop-blur-[1px] [overflow-wrap:anywhere]">
          {eyebrow}
        </span>
        {href ? (
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-card/90 backdrop-blur-[1px]">
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5"
            />
            {isExternal && (
              <span className="sr-only">(opens external link)</span>
            )}
          </span>
        ) : null}
      </div>

      <div aria-hidden="true" className="min-h-40 sm:min-h-48" />

      <div className="relative z-10 grid min-w-0 gap-1 [overflow-wrap:anywhere]">
        <h3 className="text-base leading-snug font-medium tracking-tight text-card-foreground">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </>
  );

  const rootClass = cn(
    "group relative grid h-full w-full min-w-0 grid-rows-[auto_1fr_auto] gap-4 overflow-hidden rounded-none",
    "bg-background p-2 ring-1 ring-inset ring-border sm:p-5",
    // Mirrors the site's `.micro-transition`, inlined so the published file
    // carries no dependency on a class that only exists in this project.
    "transition-[transform,background-color,border-color,color,opacity,box-shadow]",
    "duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    className,
  );

  const interactionProps = {
    onHoverStart: () => setIsActive(true),
    onHoverEnd: () => setIsActive(false),
    onFocus: () => setIsActive(true),
    onBlur: () => setIsActive(false),
  };

  const style = { color: accent };

  if (href) {
    const computedRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
    return (
      <motion.a
        href={href}
        target={target}
        rel={computedRel}
        aria-label={ariaLabel}
        className={rootClass}
        style={style}
        {...interactionProps}
      >
        {field}
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={cn(rootClass, "cursor-default")}
      style={style}
      {...interactionProps}
    >
      {field}
      {content}
    </motion.div>
  );
}
