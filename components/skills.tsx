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

function SkillCell({ skill, idx }: { skill: SkillItem; idx: number }) {
  const Icon = skillIconMap[skill.icon];

  return (
    <motion.div
      key={skill.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.15 + idx * 0.03 }}
      className="no-js-visible group flex items-center gap-3 p-4 border-b border-r border-dashed max-sm:border-r-0 transition-colors hover:bg-muted/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
        <Icon size="18" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium leading-none">{skill.name}</span>
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section className=" border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="no-js-visible text-xl font-semibold mb-3 border-y px-6 py-2"
      >
        {skillsSectionConfig.title}
      </motion.h2>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 overflow-hidden -mb-px">
        {enabledSkills.map((skill, idx) => (
          <SkillCell key={skill.id} skill={skill} idx={idx} />
        ))}
      </div>
    </section>
  );
}
