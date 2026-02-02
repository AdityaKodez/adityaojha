"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Vishal Sharma",
    role: "Student",
    content:
      "Your portfolio UI looks good, well which tech stack and state management you have used ?",
    avatar: "VS",
    image: "/testimonial/vishal.png",
  },
  {
    name: "natey_mac",
    role: "Redditor",
    content:
      "This is great. Most of the portfolios people post here are doing WAY too much. Yours here shows off just enough skill and an eye for design and doesn’t look like a boiler plate template to me at least. So great work. No notes.",
    avatar: "NM",
    image: "/testimonial/natey.png",
  },
  {
    name: "ElongatedBear",
    role: "Redditor",
    content: "You've got a good eye for design",
    avatar: "EW",
    image: "/testimonial/elongated.png",
  },
  {
    name: "Garvit Joshi",
    role: "Creator of animbits.dev.",
    content: "I like the minimalistic look good work.",
    avatar: "GJ",
    image: "/testimonial/garvit.png",
  },
  {
    name: "Vivek Singh",
    role: "CoFounder at Digia",
    content: "Congrats on your launch. Looking forward",
    avatar: "VS",
    image: "/testimonial/vivek.png",
  },
];

export function Testimonials() {
  return (
    <section className="px-6 border-t border-dashed pt-8 overflow-hidden">
      <div className="relative">
        <InfiniteSlider gap={4} speed={50} speedOnHover={10}>
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
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
                      <span className="text-xs text-muted-foreground mt-1">
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
