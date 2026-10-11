"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FluidTestimonialCardProps {
  quote: string;
  author: string;
  description?: string;
  role?: string;
  /** Decorative portrait. Missing or failed images show the author's initials. */
  avatarSrc?: string;
  /** Custom decorative avatar, rendered instead of avatarSrc or initials. */
  avatar?: ReactNode;
  /** Glow, accent, and highlight colors. Dark mode derives deeper shades. */
  colors?: readonly [string, string, string];
  /** Hover lift in pixels, clamped to 0 through 32. */
  liftAmount?: number;
  className?: string;
}

function AuthorAvatar({ src, author, children }: { src?: string; author: string; children?: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const initials = author.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("");

  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/70 text-[10px] font-medium text-foreground"
    >
      {children ?? (src && !failed ? (
        // Consumer images do not require a Next.js image loader or domain configuration.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={32}
          height={32}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : initials)}
    </span>
  );
}

export function FluidTestimonialCard({
  quote,
  author,
  description,
  role,
  avatarSrc,
  avatar,
  colors,
  liftAmount = 14,
  className,
}: FluidTestimonialCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = hovered || focused;
  const flowing = active && !reducedMotion;
  const lift = Number.isFinite(liftAmount) ? Math.min(32, Math.max(0, liftAmount)) : 14;
  const paletteStyle = colors ? {
    "--fluid-custom-base": `color-mix(in srgb, ${colors[0]} 35%, white)`,
    "--fluid-custom-base-end": `color-mix(in srgb, ${colors[0]} 65%, white)`,
    "--fluid-custom-gold": colors[0],
    "--fluid-custom-gold-soft": `color-mix(in srgb, ${colors[0]} 70%, white)`,
    "--fluid-custom-orange": colors[1],
    "--fluid-custom-orange-soft": `color-mix(in srgb, ${colors[1]} 70%, ${colors[0]})`,
    "--fluid-custom-highlight": colors[2],
    "--fluid-custom-highlight-soft": `color-mix(in srgb, ${colors[2]} 70%, ${colors[0]})`,
    "--fluid-custom-dark-base": `color-mix(in srgb, ${colors[1]} 12%, #111111)`,
    "--fluid-custom-dark-base-end": `color-mix(in srgb, ${colors[1]} 20%, #111111)`,
    "--fluid-custom-dark-gold": `color-mix(in srgb, color-mix(in srgb, ${colors[0]}, ${colors[1]}) 40%, #111111)`,
    "--fluid-custom-dark-gold-soft": `color-mix(in srgb, ${colors[0]} 25%, #111111)`,
    "--fluid-custom-dark-orange": `color-mix(in srgb, ${colors[1]} 60%, #111111)`,
    "--fluid-custom-dark-orange-soft": `color-mix(in srgb, ${colors[1]} 40%, #111111)`,
    "--fluid-custom-dark-highlight": `color-mix(in srgb, ${colors[2]} 22%, #111111)`,
    "--fluid-custom-dark-highlight-soft": `color-mix(in srgb, ${colors[2]} 15%, #111111)`,
  } as CSSProperties : undefined;

  return (
    <motion.div
      className="max-w-full"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.figure
        tabIndex={0}
        initial={false}
        animate={{ y: active && !reducedMotion ? -lift : 0 }}
        style={paletteStyle}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") event.currentTarget.focus({ preventScroll: true });
        }}
        className={cn(
          "relative isolate m-0 flex min-h-[360px] w-64 max-w-full flex-col overflow-hidden rounded-3xl bg-muted/60 p-5 text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
          "[--fluid-base:var(--fluid-custom-base,#ffe6a7)] [--fluid-base-end:var(--fluid-custom-base-end,#ffd16f)] [--fluid-gold:var(--fluid-custom-gold,#ffcf35)] [--fluid-gold-soft:var(--fluid-custom-gold-soft,#ffdc76)] [--fluid-orange:var(--fluid-custom-orange,#ff762b)] [--fluid-orange-soft:var(--fluid-custom-orange-soft,#ff9a3d)] [--fluid-highlight:var(--fluid-custom-highlight,#fff2c4)] [--fluid-highlight-soft:var(--fluid-custom-highlight-soft,#ffe9a1)]",
          "dark:[--fluid-base:var(--fluid-custom-dark-base,#25140f)] dark:[--fluid-base-end:var(--fluid-custom-dark-base-end,#32180f)] dark:[--fluid-gold:var(--fluid-custom-dark-gold,#783317)] dark:[--fluid-gold-soft:var(--fluid-custom-dark-gold-soft,#532715)] dark:[--fluid-orange:var(--fluid-custom-dark-orange,#a7411c)] dark:[--fluid-orange-soft:var(--fluid-custom-dark-orange-soft,#783017)] dark:[--fluid-highlight:var(--fluid-custom-dark-highlight,#482517)] dark:[--fluid-highlight-soft:var(--fluid-custom-dark-highlight-soft,#351c12)]",
          className,
        )}
      >
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
        >
          {/* Soft gradient edges supply the blur; only transforms and opacity animate. */}
          <div
            className="absolute inset-x-0 bottom-0 h-[72%]"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 45%)" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent, var(--fluid-base) 55%, var(--fluid-base-end))" }}
            />
            <motion.div
              className="absolute -bottom-[30%] -left-[45%] h-[115%] w-[150%]"
              style={{ background: "radial-gradient(ellipse at center, var(--fluid-gold) 0%, var(--fluid-gold-soft) 30%, transparent 68%)" }}
              animate={flowing
                ? { x: [0, 35, -15, 0], y: [0, -25, 10, 0], rotate: [0, -12, 8, 0], scale: [1, 1.12, 0.95, 1] }
                : { x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={flowing ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            />
            <motion.div
              className="absolute -right-[45%] bottom-[2%] h-[100%] w-[135%]"
              style={{ background: "radial-gradient(ellipse at center, var(--fluid-orange) 0%, var(--fluid-orange-soft) 25%, transparent 65%)" }}
              animate={flowing
                ? { x: [0, -45, 5, 0], y: [0, 30, -15, 0], rotate: [0, 18, -8, 0], scale: [1, 0.9, 1.15, 1] }
                : { x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={flowing ? { duration: 8, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            />
            <motion.div
              className="absolute -bottom-[45%] left-[5%] h-[85%] w-[120%]"
              style={{ background: "radial-gradient(ellipse at center, var(--fluid-highlight) 0%, var(--fluid-highlight-soft) 30%, transparent 68%)" }}
              animate={flowing
                ? { x: [0, -30, 15, 0], y: [0, -18, 8, 0], scale: [1, 1.2, 1, 1] }
                : { x: 0, y: 0, scale: 1 }}
              transition={flowing ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            />
          </div>
        </motion.div>

        <blockquote className="m-0 [overflow-wrap:anywhere]">
          <p className="font-serif text-2xl leading-[1.08] tracking-tight">{quote}</p>
          {description && (
            <p className="mt-3 text-xs leading-relaxed text-foreground/65">{description}</p>
          )}
        </blockquote>

        <figcaption className="mt-auto flex items-center gap-2.5 pt-16">
          <AuthorAvatar key={avatarSrc} src={avatarSrc} author={author}>{avatar}</AuthorAvatar>
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <p className="text-xs font-medium leading-snug">{author}</p>
            {role && <p className="mt-0.5 text-[10px] leading-snug text-foreground/65">{role}</p>}
          </div>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}
