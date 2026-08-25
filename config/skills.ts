import type { SkillCategoryConfig, SkillItem } from "@/config/types";

export const skillsSectionConfig = {
  title: "Stack",
  categories: [
    { id: "language", label: "Language" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "workflow-ai", label: "Workflow & AI" },
  ] as SkillCategoryConfig[],
};

export const skillsConfig: SkillItem[] = [
  // Language
  {
    id: "typescript",
    name: "TypeScript",
    icon: "typescript",
    category: "language",
    order: 1,
    enabled: true,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "javascript",
    category: "language",
    order: 2,
    enabled: true,
  },

  // Frontend
  {
    id: "nextjs",
    name: "Next.js",
    icon: "nextjs",
    category: "frontend",
    order: 3,
    enabled: true,
  },
  {
    id: "react",
    name: "React",
    icon: "react",
    category: "frontend",
    order: 4,
    enabled: true,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: "tailwind",
    category: "frontend",
    order: 5,
    enabled: true,
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    icon: "shadcn",
    category: "frontend",
    order: 6,
    enabled: true,
  },
  {
    id: "tanstack",
    name: "TanStack",
    icon: "tanstack",
    category: "frontend",
    order: 7,
    enabled: true,
  },

  // Database / Backend
  {
    id: "trpc",
    name: "TRPC",
    icon: "trpc",
    category: "backend",
    order: 8,
    enabled: true,
  },
  {
    id: "prisma",
    name: "Prisma",
    icon: "prisma",
    category: "backend",
    order: 9,
    enabled: true,
  },
  {
    id: "better-auth",
    name: "better-auth",
    icon: "better-auth",
    category: "backend",
    order: 10,
    enabled: true,
  },

  // Workflow & AI
  {
    id: "cursor",
    name: "Cursor",
    icon: "cursor",
    category: "workflow-ai",
    order: 11,
    enabled: true,
  },
  {
    id: "ai-sdk",
    name: "AI SDK",
    icon: "ai-sdk",
    category: "workflow-ai",
    order: 12,
    enabled: true,
  },
  {
    id: "chat-gpt",
    name: "Claude",
    icon: "claude",
    category: "workflow-ai",
    order: 13,
    enabled: true,
  },
];
