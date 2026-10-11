"use client";

import {
  FluidTestimonialCard,
  type FluidTestimonialCardProps,
} from "@/components/ui/fluid-testimonial-card";

export function FluidTestimonialCardDemo(props: Partial<FluidTestimonialCardProps> = {}) {
  return (
    <div className="flex w-full justify-center px-2 py-8">
      <FluidTestimonialCard
        quote="Collaborating with Tanj was a game changer for us."
        description="We turned vague ideas into actionable plans and designs in record time."
        author="Sofia Kim"
        role="Creative director at Inno Labs"
        avatar={
          <svg viewBox="0 0 32 32" fill="none" className="size-full" aria-hidden="true">
            <path fill="var(--chart-1)" d="M0 0h32v32H0z" />
            <path fill="var(--foreground)" d="M7 15C7 6 10 3 16 3s10 4 10 13v11H6l1-12Z" />
            <path fill="var(--chart-4)" d="M2 32c0-7 5-11 14-11s14 4 14 11H2Z" />
            <path fill="var(--background)" d="M13 19h6v6c-2 2-4 2-6 0v-6Z" />
            <ellipse cx="16" cy="14" rx="7" ry="8" fill="var(--background)" />
            <path fill="var(--foreground)" d="M8 13c0-7 3-10 8-10 6 0 9 4 8 11-4-1-7-4-8-7-2 4-4 5-8 6Z" />
            <circle cx="13.5" cy="15" r=".7" fill="var(--foreground)" />
            <circle cx="19" cy="15" r=".7" fill="var(--foreground)" />
            <path d="M14 18c1.5 1 3 1 4 0" stroke="var(--chart-3)" strokeLinecap="round" />
          </svg>
        }
        {...props}
      />
    </div>
  );
}
