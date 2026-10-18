"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@/config/types";
import { reveal, revealDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

/**
 * Two-column quote grid for /testimonials.
 *
 * Row borders continue through the gutters to form a continuous grid, with
 * a blueprint hatch that resolves on hover. Quotes are real figure/blockquote
 * markup so each note is addressable on its own.
 */
export function TestimonialsGrid({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className="relative flex flex-col gap-[15px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[15px] -translate-x-1/2 border-x border-border sm:block"
      />
      {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, rowIndex) => (
        <div
          key={testimonials[rowIndex * 2].id}
          className="contents sm:grid sm:grid-cols-2 sm:gap-[15px] sm:border-y sm:border-border"
        >
          {testimonials.slice(rowIndex * 2, rowIndex * 2 + 2).map((testimonial, columnIndex) => (
            <motion.figure
              key={testimonial.id}
              {...reveal({
                y: 8,
                delay: revealDelay(rowIndex * 2 + columnIndex, 0.04),
              })}
              className={cn(
                "group relative flex flex-col border-y border-border p-5 transition-colors hover:bg-muted/10 sm:border-0",
                testimonial.href && "cursor-pointer",
              )}
            >
              <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10 flex flex-1 flex-col">
                {testimonial.href ? (
                  <a
                    href={testimonial.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20"
                    aria-label={`Open original post from ${testimonial.name}`}
                  />
                ) : null}
                <blockquote className="text-sm leading-snug text-muted-foreground">
                  {testimonial.content}
                </blockquote>

                <figcaption className="mt-auto pt-5 flex items-center gap-4">
                  <Avatar className="size-9">
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
      ))}
    </div>
  );
}
