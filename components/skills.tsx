"use client";

import { skillsConfig, skillsSectionConfig } from "@/config/skills";
import type { SkillIcon, SkillItem } from "@/config/types";
import AiSdk from "@/public/stacks/ai-sdk";
import AuthIcon from "@/public/stacks/auth";
import NextjsIcon from "@/public/stacks/nextjs";
import PrismaIcon from "@/public/stacks/prisma";
import ReactIcon from "@/public/stacks/react";
import ShadcnIcon from "@/public/stacks/shadcn";
import TailwindIcon from "@/public/stacks/tailwind";
import TrpcIcon from "@/public/stacks/trcp";
import CursorIcon from "@/public/stacks/cursor";
import TSIcon from "@/public/stacks/ts";
import { BsClaude } from "react-icons/bs";
import {
  DndContext, DragEndEvent
} from "@dnd-kit/core";
import { SiReactquery } from "react-icons/si";
import { useSortable } from "@dnd-kit/react/sortable";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { motion } from "motion/react";
import { useState, type ComponentType } from "react";

const skillIconMap: Record<SkillIcon, ComponentType<{ size: string }>> = {
  nextjs: NextjsIcon,
  react: ReactIcon,
  typescript: TSIcon,
  tailwind: TailwindIcon,
  shadcn: ShadcnIcon,
  "better-auth": AuthIcon,
  "ai-sdk": AiSdk,
  claude:BsClaude,
  tanstack:SiReactquery,
  prisma: PrismaIcon,
  trpc: TrpcIcon,
  cursor: CursorIcon,
};

const enabledSkills = skillsConfig
  .filter((skill) => skill.enabled !== false)
  .sort((a, b) => a.order - b.order);

function SkillChip({ skill, idx }: { skill: SkillItem; idx: number }) {
  const Icon = skillIconMap[skill.icon];
  const { ref, isDragSource, isDropTarget } = useSortable({
    id: skill.id,
    index: idx,
  });

  const chipClasses = [
    "no-js-visible inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-sm text-muted-foreground transition-colors cursor-grab",
    "hover:text-foreground hover:border-foreground/40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
    isDragSource ? "border-foreground/70 bg-muted/80 text-foreground cursor-grabbing" : "",
    isDropTarget ? "border-foreground/60 bg-muted/45 text-foreground" : "",
  ].join(" ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.15 + idx * 0.04 }}
      className={chipClasses}
      aria-label={`${skill.name}. Drag to reorder`}
    >
      <Icon size="18" />
      <span className="font-medium">{skill.name}</span>
    </motion.div>
  );
}

export function Skills() {
  const [skills, setSkills] = useState(enabledSkills);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    setSkills((prev) => {
      const oldIndex = prev.findIndex((skill) => skill.id === active.id);
      const newIndex = prev.findIndex((skill) => skill.id === over?.id);

      if (oldIndex < 0 || newIndex < 0) {
        return prev;
      }
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return (
    <section className="border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="no-js-visible section-heading mb-4"
      >
        {skillsSectionConfig.title}
      </motion.h2>

      <div className="flex flex-wrap gap-2 px-6">
        <DndContext
        
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={skills.map((skill) => skill.id)}>
            {skills.map((skill, idx) => (
              <SkillChip key={skill.id} skill={skill} idx={idx} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}

