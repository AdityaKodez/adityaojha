"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@/config/types";
import { blurReveal, revealDelay } from "@/lib/motion";
import { motion } from "motion/react";

/**
 * Two-column quote grid for /testimonials.
 *
 * Same cell idiom as the bookmarks and certifications grids: zero gap, each
 * cell drawing its own inset ring, with the blueprint hatch and a top-edge
 * highlight that both resolve on hover. Quotes are real figure/blockquote
 * markup so each note is addressable on its own.
 */
export function TestimonialsGrid({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <motion.figure
          key={testimonial.id}
          {...blurReveal({
            y: 8,
            blur: 5,
            delay: revealDelay(index, 0.04),
          })}
          className="group relative flex flex-col p-3 transition-colors hover:bg-muted/10"
        >
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
          <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative z-10 flex flex-1 flex-col">
            <blockquote className="text-sm leading-snug text-muted-foreground">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            <figcaption className="mt-auto pt-3 flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <AvatarFallback>{testimonial.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium tracking-tight">
                  {testimonial.name}
                </span>
                <span className="truncate font-mono text-[10px] tracking-wider text-muted-foreground/60">
                  {testimonial.role}
                </span>
              </div>
            </figcaption>
          </div>
        </motion.figure>
      ))}
    </div>
  );
}
