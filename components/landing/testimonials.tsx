"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllTestimonials,
  getEnabledTestimonials,
  testimonialsSectionConfig,
} from "@/config/testimonials";
import type { Testimonial } from "@/config/types";
import { reveal } from "@/lib/motion";
import { motion } from "motion/react";
import Link from "next/link";
import { BsArrowUpRightCircle } from "react-icons/bs";

const MARQUEE_SPEED = 80;
const MARQUEE_SPEED_HOVER = 30;

const enabledTestimonials = getEnabledTestimonials();
const marqueeSplit = Math.ceil(enabledTestimonials.length / 2);
const marqueeTop = enabledTestimonials.slice(0, marqueeSplit);
const marqueeBottom = enabledTestimonials.slice(marqueeSplit);

function TestimonialSlide({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-85 md:w-87.5 py-2.5 md:py-3">
      {/* Hover tint is intentional: it signals the marquee slowdown
          (speedOnHover), not clickability. Deliberately no cursor-pointer
          here. These quotes have no source links, and advertising a
          click that does nothing generates PostHog $dead_click events. */}
      <Card className="h-full bg-background hover:bg-muted/50 transition-colors rounded-none">
        <CardContent className="p-3 flex flex-col gap-2 h-full">
          <p className="text-sm text-muted-foreground leading-tight flex-1">
            &quot;{testimonial.content}&quot;
          </p>

          <div className="flex items-center gap-3 mt-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={testimonial.image}
                alt={testimonial.name}
              />
              <AvatarFallback>{testimonial.avatar}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {testimonial.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1 font-pixel">
                {testimonial.role}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TestimonialsMarquee({
  reverse = false,
}: {
  reverse?: boolean;
}) {
  return (
    <div className="relative px-6">
      <TestimonialsTrack items={enabledTestimonials} reverse={reverse} />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent" />
    </div>
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
      gap={0}
      speed={MARQUEE_SPEED}
      speedOnHover={MARQUEE_SPEED_HOVER}
      reverse={reverse}
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
      {/* Only the heading reveals: the slider below never stops moving, and
          animating a wide marquee is expensive for no visual gain. */}
      <motion.h2
        {...reveal({ y: 8, margin: "-80px" })}
        className="no-js-visible section-heading mb-3"
      >
        Community
      </motion.h2>
      <div className="relative px-6">
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
          className="flex items-center gap-2 font-pixel text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {`${testimonialsSectionConfig.seeMoreLabel} ${getAllTestimonials().length} testimonials`}
          <BsArrowUpRightCircle className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
