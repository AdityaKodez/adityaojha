"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { blurReveal, revealDelay } from "@/lib/motion";
import { splitSentences } from "@/lib/sentences";

export const About = () => {
  const sentences = useMemo(() => splitSentences(siteConfig.about.body), []);

  return (
    // The sentences carry the blur, so the wrapper only rises.
    <motion.section
      {...blurReveal({ y: 16, blur: 0, margin: "-80px" })}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="section-heading mb-3">{siteConfig.about.title}</h2>
      <div className="px-2">
        <div className="space-y-1 pl-4 md:pl-5">
          {sentences.map((sentence, index) => (
            <motion.p
              key={`${sentence}-${index}`}
              {...blurReveal({ y: 6, blur: 5, delay: revealDelay(index, 0.05) })}
              className="micro-transition group relative text-base leading-8 text-muted-foreground hover:text-foreground focus-within:text-foreground"
            >
              {sentence}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
