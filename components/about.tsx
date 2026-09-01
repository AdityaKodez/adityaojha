"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { splitSentences } from "@/lib/sentences";

export const About = () => {
  const sentences = useMemo(() => splitSentences(siteConfig.about.body), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="no-js-visible border-t border-dashed pt-6"
      id="about"
    >
      <h2 className="section-heading mb-3">{siteConfig.about.title}</h2>
      <div className="px-2">
        <div className="space-y-1 pl-4 md:pl-5">
          {sentences.map((sentence, index) => (
            <motion.p
              key={`${sentence}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.24, delay: index * 0.06 }}
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
