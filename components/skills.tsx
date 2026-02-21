"use client";

import { skillsConfig, skillsSectionConfig } from "@/config/skills";
import type { SkillIcon, SkillItem } from "@/config/types";
import { motion } from "motion/react";
import AuthIcon from "@/public/stacks/auth";
import NextjsIcon from "@/public/stacks/nextjs";
import PrismaIcon from "@/public/stacks/prisma";
import ReactIcon from "@/public/stacks/react";
import ShadcnIcon from "@/public/stacks/shadcn";
import TailwindIcon from "@/public/stacks/tailwind";
import TrpcIcon from "@/public/stacks/trcp";
import TSIcon from "@/public/stacks/ts";
import type { ComponentType } from "react";

const skillIconMap: Record<SkillIcon, ComponentType<{ size: string }>> = {
  nextjs: NextjsIcon,
  react: ReactIcon,
  typescript: TSIcon,
  tailwind: TailwindIcon,
  shadcn: ShadcnIcon,
  "better-auth": AuthIcon,
  prisma: PrismaIcon,
  trpc: TrpcIcon,
};

const enabledSkills = skillsConfig
  .filter((skill) => skill.enabled !== false)
  .sort((a, b) => a.order - b.order);

function SkillChip({ skill, idx }: { skill: SkillItem; idx: number }) {
  const Icon = skillIconMap[skill.icon];

  return (
    <motion.div
      key={skill.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.15 + idx * 0.04 }}
      className="no-js-visible inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-default"
    >
      <Icon size="18" />
      <span className="font-medium">{skill.name}</span>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section className="border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="no-js-visible text-xl font-semibold font-pixel mb-4 border-y px-6 py-2"
      >
        {skillsSectionConfig.title}
      </motion.h2>
      <div className="px-6 flex flex-wrap gap-2">
        {enabledSkills.map((skill, idx) => (
          <SkillChip key={skill.id} skill={skill} idx={idx} />
        ))}
      </div>
    </section>
  );
}
