import type { SkillItem } from "@/config/types";

export const skillsSectionConfig = {
  title: "Stack",
};


export const skillsConfig: SkillItem[] = [
  { id: "nextjs", name: "Next.js", icon: "nextjs", order: 1, enabled: true },
  { id: "react", name: "React", icon: "react", order: 2, enabled: true },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "typescript",
    order: 3,
    enabled: true,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: "tailwind",
    order: 4,
    enabled: true,
  },
  { id: "shadcn", name: "shadcn/ui", icon: "shadcn", order: 5, enabled: true },
  {
    id: "better-auth",
    name: "better-auth",
    icon: "better-auth",
    order: 6,
    enabled: true,
  },
  { id: "prisma", name: "Prisma", icon: "prisma", order: 7, enabled: true },
  { id: "trpc", name: "TRPC", icon: "trpc", order: 8, enabled: true },
];
