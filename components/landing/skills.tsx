"use client";

import { skillsConfig, skillsSectionConfig } from "@/config/skills";
import type { SkillIcon, SkillItem } from "@/config/types";
import { cn } from "@/lib/utils";
import AiSdk from "@/public/stacks/ai-sdk";
import AuthIcon from "@/public/stacks/auth";
import CursorIcon from "@/public/stacks/cursor";
import NextjsIcon from "@/public/stacks/nextjs";
import PrismaIcon from "@/public/stacks/prisma";
import ReactIcon from "@/public/stacks/react";
import ShadcnIcon from "@/public/stacks/shadcn";
import TailwindIcon from "@/public/stacks/tailwind";
import TrpcIcon from "@/public/stacks/trcp";
import TSIcon from "@/public/stacks/ts";
import JSIcon from "@/public/stacks/js";
import { motion } from "motion/react";
import type { ComponentType } from "react";
import { BsClaude } from "react-icons/bs";
import { SiReactquery } from "react-icons/si";

const skillIconMap: Record<SkillIcon, ComponentType<{ size: string }>> = {
  nextjs: NextjsIcon,
  react: ReactIcon,
  typescript: TSIcon,
  javascript: JSIcon,
  tailwind: TailwindIcon,
  shadcn: ShadcnIcon,
  "better-auth": AuthIcon,
  "ai-sdk": AiSdk,
  claude: BsClaude,
  tanstack: SiReactquery,
  prisma: PrismaIcon,
  trpc: TrpcIcon,
  cursor: CursorIcon,
};

const enabledSkills = skillsConfig
  .filter((skill) => skill.enabled !== false)
  .sort((a, b) => a.order - b.order);

function SkillChip({ skill, idx }: { skill: SkillItem; idx: number }) {
  const Icon = skillIconMap[skill.icon];

  const chipClasses = [
    "no-js-visible inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1 text-sm text-muted-foreground transition-colors",
    "hover:text-foreground hover:border-primary/40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
  ].join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
      className={chipClasses}
      aria-label={skill.name}
    >
      <Icon size="18" />
      <span className="font-medium">{skill.name}</span>
    </motion.div>
  );
}

export function Skills() {
  const skills = enabledSkills;
  const categories = skillsSectionConfig.categories;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.2 }}
      className="border-t border-dashed pt-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.2 }}
        className="no-js-visible section-heading"
      >
        {skillsSectionConfig.title}
      </motion.h2>


        {categories.map((category, groupIndex) => {
          const categorySkills = skills.filter(
            (skill) => skill.category === category.id
          );

          if (categorySkills.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.2, delay: groupIndex * 0.04 }}
              className={cn("flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-6 px-6 py-3.5 border-b", groupIndex === 3 ? "border-none" : "")}
            >
              <span className="shrink-0 w-36 font-mono text-xs tracking-wider text-muted-foreground">
                {`0${groupIndex + 1}`.padStart(2, "0") + " " + category.label}
              </span>

              <div className="flex flex-wrap gap-2 flex-1">
                {categorySkills.map((skill, idx) => (
                  <SkillChip key={skill.id} skill={skill} idx={idx} />
                ))}
              </div>
            </motion.div>
          );
        })}

    </motion.section>
  );
}
