"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <section className="px-6 border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="text-xl font-semibold mb-3"
      >
        Stack
      </motion.h2>
      <TooltipProvider delayDuration={0}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex flex-wrap gap-5"
        >
          {skills.map((skill) => (
            <Tooltip key={skill.name}>
              <TooltipTrigger asChild>
                <div className="grayscale hover:grayscale-0 transition-all duration-300 cursor-help">
                  <skill.icon size="24" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{skill.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </TooltipProvider>
    </section>
  );
}
