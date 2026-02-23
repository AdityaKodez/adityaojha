"use client";

import { experienceConfig, experienceSectionConfig } from "@/config/experience";
import { motion } from "motion/react";

const enabledExperience = experienceConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

export function Experience() {
  if (!enabledExperience.length) {
    return null;
  }

  return (
    <section className="border-t border-dashed pt-6">
      <h2 className="section-heading mb-3">
        {experienceSectionConfig.title}
      </h2>
      <div className="px-6 space-y-4">
        {enabledExperience.map((item, idx) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="border border-dashed p-4"
          >
            <h3 className="text-base font-semibold">{item.role}</h3>
            <p className="text-sm text-muted-foreground">
              {item.company} · <span className="font-pixel">{item.period}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
            {item.highlights?.length ? (
              <ul className="mt-2 list-disc pl-4 text-sm text-muted-foreground space-y-1">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
