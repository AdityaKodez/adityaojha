"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialsConfig } from "@/config/testimonials";
import { blurReveal } from "@/lib/motion";
import { motion } from "motion/react";

const enabledTestimonials = testimonialsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

export function Testimonials() {
  return (
    <section className="border-t border-dashed pt-8 overflow-hidden">
      {/* Only the heading resolves: the slider below never stops moving, and
          blurring a wide marquee is expensive for no visual gain. */}
      <motion.h2
        {...blurReveal({ y: 8, blur: 6, margin: "-80px" })}
        className="no-js-visible section-heading mb-3"
      >
        Community
      </motion.h2>
      <div className="relative px-6 ">
        <InfiniteSlider gap={0} speed={80} speedOnHover={30}>
          {enabledTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              transition={{ duration: 0.2 }}
              className="w-85 md:w-87.5 py-2.5 md:py-3 0"
            >
              {/* Hover tint is intentional: it signals the marquee slowdown
                  (speedOnHover), not clickability. Deliberately no cursor-pointer
                  here — these quotes have no source links, and advertising a
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
            </motion.div>
          ))}
        </InfiniteSlider>
        {/* pointer-events-none: these sit at z-10 above the slider and would
            otherwise swallow interaction in the outer 32px on each side. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
}
