"use client";
import { motion } from "motion/react";
import NextjsIcon from "@/public/stacks/nextjs";
import ReactIcon from "@/public/stacks/react";
import TSIcon from "@/public/stacks/ts";
import TailwindIcon from "@/public/stacks/tailwind";
import ShadcnIcon from "@/public/stacks/shadcn";
import AuthIcon from "@/public/stacks/auth";
import PrismaIcon from "@/public/stacks/prisma";
import TrpcIcon from "@/public/stacks/trcp";

export function Skills() {
  const skills = [
    { name: "Next.js", icon: NextjsIcon },
    { name: "React", icon: ReactIcon },
    { name: "TypeScript", icon: TSIcon },
    { name: "Tailwind CSS", icon: TailwindIcon },
    { name: "shadcn/ui", icon: ShadcnIcon },
    { name: "better-auth", icon: AuthIcon },
    { name: "Prisma", icon: PrismaIcon },
    { name: "TRPC", icon: TrpcIcon },
  ];

  return (
    <section className=" border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="no-js-visible text-xl font-semibold mb-3 border-y px-6 py-2"
      >
        Stack
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="no-js-visible flex flex-wrap gap-3 px-6"
      >
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-sm border border-dashed px-2 py-1 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <skill.icon size="20" />
              <span className="text-xs">{skill.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
