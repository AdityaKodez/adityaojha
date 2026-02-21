"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialsConfig } from "@/config/testimonials";
import { motion } from "motion/react";

const enabledTestimonials = testimonialsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

export function Testimonials() {
  return (
    <section className="px-6 border-t border-dashed pt-8 overflow-hidden">
      <div className="relative">
        <InfiniteSlider gap={4} speed={50} speedOnHover={10}>
          {enabledTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              transition={{ duration: 0.2 }}
              className="w-[300px] md:w-[350px]"
            >
              <Card className="h-full border border-dashed shadow-none hover:border-foreground/20 transition-colors ring-0 rounded-none bg-background hover:bg-muted">
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
        <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
}
