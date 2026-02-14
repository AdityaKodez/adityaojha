"use client";
import { motion } from "motion/react";

export function Services() {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-dashed pt-6"
    >
      <h2 className="text-xl font-semibold mb-3 border-y px-6 py-2">
        What I can help you with
      </h2>
      <div className="px-6">
        <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
          <li>Rapid MVP development and deployment.</li>
          <li>Scalable full-stack application architecture.</li>
          <li>Performance optimization and code refactoring.</li>
        </ul>
      </div>
    </motion.section>
  );
}
