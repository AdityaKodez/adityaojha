"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialsConfig } from "@/config/testimonials";
import { motion } from "motion/react";
import Image from "next/image";

const enabledTestimonials = testimonialsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

function renderFormattedContent(content: string) {
  const regex = /(==[\s\S]+?==|~[\s\S]+?~|\[\.\.\.\])/g;
  const parts = content.split(regex);

  if (parts.length === 1 && !content.includes("==") && !content.includes("~")) {
    return content;
  }

  return parts.map((part, index) => {
    if (part.startsWith("==") && part.endsWith("==")) {
      const text = part.slice(2, -2);
      return (
        <span
          key={index}
          className="rounded-xs bg-primary/20 text-foreground px-1 py-0.5 font-medium [box-decoration-break:clone]"
        >
          {text}
        </span>
      );
    }
    if (part.startsWith("~") && part.endsWith("~")) {
      const text = part.slice(1, -1);
      return (
        <span
          key={index}
          className="underline decoration-dotted underline-offset-4 decoration-muted-foreground/60 text-muted-foreground/75 [box-decoration-break:clone]"
        >
          {text}
        </span>
      );
    }
    if (part === "[...]") {
      return (
        <span
          key={index}
          className="inline-block border-b-2 border-dotted border-muted-foreground/40 w-6 mx-1.5 align-middle"
          title="omitted"
        />
      );
    }
    return part;
  });
}

export function Testimonials() {
  return (
    <section className="border-t border-dashed pt-8 overflow-hidden">
      <h2 className="section-heading mb-3">Community</h2>
      <div className="relative px-6">
        <InfiniteSlider gap={0} speed={80} speedOnHover={30}>
          {enabledTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              transition={{ duration: 0.2 }}
              className="w-85 md:w-87.5 py-2.5 md:py-3"
            >
              <Card className="h-full bg-background hover:bg-muted/50 transition-colors cursor-pointer rounded-none">
                <CardContent className="p-3 flex flex-col gap-2 h-full">
                  <p className="text-sm text-muted-foreground leading-normal flex-1">
                    &quot;{renderFormattedContent(testimonial.content)}&quot;
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full select-none bg-muted after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={32}
                        height={32}
                        sizes="32px"
                        loading="lazy"
                        decoding="async"
                        className="size-full rounded-full object-cover"
                      />
                    </div>

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
