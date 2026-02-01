"use client";
import { motion } from "motion/react";

export function Services() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-6 border-t border-dashed pt-6"
    >
      <h2 className="text-xl font-semibold mb-3">What I can help you with</h2>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
        <li>Rapid MVP development and deployment.</li>
        <li>Scalable full-stack application architecture.</li>
        <li>Performance optimization and code refactoring.</li>
      </ul>
    </motion.section>
  );
}
