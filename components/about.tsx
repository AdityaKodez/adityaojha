"use client";
import { motion } from "motion/react";
const About = () => {
  return (
    <motion.section
      initial={{ opacity: 0.01, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="border-t border-dashed pt-6"
    >
      <h2 className="text-xl font-semibold mb-3 border-y px-6 py-2">
        About me
      </h2>
      <div className="px-6">
        <p className="text-lg text-muted-foreground">
          I started experimenting with computers and building small things early
          on, long before I understood where it would lead. The path wasn’t
          clean or linear, and I had to learn{" "}
          <span className="underline underline-offset-4 decoration-border">
            discipline and consistency
          </span>{" "}
          the hard way. Building products eventually became how I stay focused —
          turning effort into something{" "}
          <span className="underline underline-offset-4 decoration-border">
            concrete and useful
          </span>
          .
        </p>
      </div>
    </motion.section>
  );
};

export default About;
