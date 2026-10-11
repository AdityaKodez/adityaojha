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
        {...props}
      />
    </div>
  );
}
