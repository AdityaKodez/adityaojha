"use client";

import { siteConfig } from "@/config/site";
import { motion } from "motion/react";

export function Services() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="section-heading mb-3">
        {siteConfig.services.title}
      </h2>
      <div className="px-6">
        <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
          {siteConfig.services.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
