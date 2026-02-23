"use client";

import { siteConfig } from "@/config/site";
import { motion } from "motion/react";
import { Signature } from "./signature";

export function HowIWork() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="no-js-visible border-t border-dashed pt-6"
    >
      <h2 className="section-heading mb-3">
        {siteConfig.workflow.title}
      </h2>
      <div className="px-6 flex flex-col gap-4">
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
          {siteConfig.workflow.items.map((item) => (
            <li key={item.label}>
              <span className="font-medium text-foreground font-pixel">
                {item.label}:
              </span>{" "}
              {item.description}
            </li>
          ))}
        </ul>
        <div className="flex justify-end pr-4">
          <Signature
            className="text-foreground/80 max-sm:h-10 "
            viewport={{ amount: 0.1 }}
          />
        </div>
      </div>
    </motion.section>
  );
}
