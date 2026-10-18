"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAllTestimonials,
  getEnabledTestimonials,
  testimonialsSectionConfig,
} from "@/config/testimonials";
import type { Testimonial } from "@/config/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BsArrowUpRightCircle } from "react-icons/bs";

const MARQUEE_SPEED = 64;
const MARQUEE_SPEED_HOVER = 24;

const enabledTestimonials = getEnabledTestimonials();
const marqueeSplit = Math.ceil(enabledTestimonials.length / 2);
const marqueeTop = enabledTestimonials.slice(0, marqueeSplit);
const marqueeBottom = enabledTestimonials.slice(marqueeSplit);

function TestimonialSlide({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure
      className={cn(
        "group relative flex w-85 shrink-0 flex-col border-x border-border p-5 transition-colors hover:bg-muted/10 md:w-87.5",
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

        <figcaption className="mt-auto flex items-center gap-4 pt-5">
          <Avatar className="size-9">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
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
    </figure>
  );
}

function TestimonialsTrack({
  items,
  reverse = false,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) {
  return (
    <InfiniteSlider
      gap={15}
      speed={MARQUEE_SPEED}
      speedOnHover={MARQUEE_SPEED_HOVER}
      reverse={reverse}
      className="border-y border-border"
    >
      {items.map((testimonial) => (
        <TestimonialSlide key={testimonial.id} testimonial={testimonial} />
      ))}
    </InfiniteSlider>
  );
}

export function Testimonials() {
  return (
    <section className="border-t border-dashed pt-8 overflow-hidden">
      <h2 className="no-js-visible section-heading mb-3">
        Community
      </h2>
      <div className="relative mb-[15px] flex flex-col gap-[15px]">
        <TestimonialsTrack items={marqueeTop} />
        {marqueeBottom.length > 0 && (
          <TestimonialsTrack items={marqueeBottom} reverse />
        )}
        {/* pointer-events-none: these sit at z-10 above the slider and would
            otherwise swallow interaction in the outer 32px on each side. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent z-10" />
      </div>

      <div className="flex justify-center items-center border-y py-4">
        <Link
          href="/testimonials"
          className="flex items-center gap-2 font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {`${testimonialsSectionConfig.seeMoreLabel} ${getAllTestimonials().length} testimonials`}
          <BsArrowUpRightCircle className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
