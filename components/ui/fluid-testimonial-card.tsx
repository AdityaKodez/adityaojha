"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

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
  className,
}: FluidTestimonialCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = hovered || focused;
  const flowing = active && !reducedMotion;

  return (
    <motion.div
      className="max-w-full"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.figure
        tabIndex={0}
        initial={false}
        animate={{ y: active && !reducedMotion ? -14 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") event.currentTarget.focus({ preventScroll: true });
        }}
        className={cn(
          "relative isolate m-0 flex min-h-[360px] w-64 max-w-full flex-col overflow-hidden rounded-3xl bg-muted/60 p-5 text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
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
            className="absolute inset-x-0 bottom-0 h-[72%] dark:opacity-40"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 45%)" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent, #ffe6a7 55%, #ffd16f)" }}
            />
            <motion.div
              className="absolute -bottom-[30%] -left-[45%] h-[115%] w-[150%]"
              style={{ background: "radial-gradient(ellipse at center, #ffcf35 0%, #ffdc76 30%, transparent 68%)" }}
              animate={flowing
                ? { x: [0, 35, -15, 0], y: [0, -25, 10, 0], rotate: [0, -12, 8, 0], scale: [1, 1.12, 0.95, 1] }
                : { x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={flowing ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            />
            <motion.div
              className="absolute -right-[45%] bottom-[2%] h-[100%] w-[135%]"
              style={{ background: "radial-gradient(ellipse at center, #ff762b 0%, #ff9a3d 25%, transparent 65%)" }}
              animate={flowing
                ? { x: [0, -45, 5, 0], y: [0, 30, -15, 0], rotate: [0, 18, -8, 0], scale: [1, 0.9, 1.15, 1] }
                : { x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={flowing ? { duration: 8, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            />
            <motion.div
              className="absolute -bottom-[45%] left-[5%] h-[85%] w-[120%]"
              style={{ background: "radial-gradient(ellipse at center, #fff2c4 0%, #ffe9a1 30%, transparent 68%)" }}
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
