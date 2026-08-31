"use client";

import { InteractiveSkillCloud } from "@/components/ui/interactive-skill-cloud";
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
import type { ComponentType } from "react";

const icon = (Icon: ComponentType<{ size: string }>) => (
  <Icon size="14" />
);

const stackItems = [
  { id: "nextjs", name: "Next.js", icon: icon(NextjsIcon) },
  { id: "react", name: "React", icon: icon(ReactIcon) },
  { id: "typescript", name: "TypeScript", icon: icon(TSIcon) },
  { id: "tailwind", name: "Tailwind", icon: icon(TailwindIcon) },
  { id: "shadcn", name: "shadcn/ui", icon: icon(ShadcnIcon) },
  { id: "prisma", name: "Prisma", icon: icon(PrismaIcon) },
  { id: "trpc", name: "tRPC", icon: icon(TrpcIcon) },
  { id: "auth", name: "better-auth", icon: icon(AuthIcon) },
  { id: "ai-sdk", name: "AI SDK", icon: icon(AiSdk) },
  { id: "cursor", name: "Cursor", icon: icon(CursorIcon) },
];

export function InteractiveSkillCloudDemo() {
  return (
    <div className="w-full max-w-xl">
      <InteractiveSkillCloud items={stackItems} height={420}>
        <div className="pointer-events-none absolute left-4 top-4 z-0 max-w-[220px] select-none sm:left-6 sm:top-6 sm:max-w-[260px]">
          <p className="font-serif text-2xl italic leading-tight text-foreground/90 sm:text-3xl">
            my skills for building modern products
          </p>
        </div>
      </InteractiveSkillCloud>
    </div>
  );
}
