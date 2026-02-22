import type { Project } from "@/config/types";

export const projectsSectionConfig = {
  title: "Projects",
  liveButtonLabel: "Live",
  liveTooltip: "Live Preview",
};

export const projectsConfig: Project[] = [
  {
    id: "gridly",
    title: "Gridly — The Premium SaaS Boilerplate",
    description:
      "Built and open-sourced a full-stack SaaS starter kit with Auth, Prisma, Polar payments, and AI integrations via Vercel AI SDK. Designed to save developers 40+ hours of boilerplate setup. 100% free and MIT licensed.",
    image: "/gridly.png",
    githubUrl: "https://github.com/AdityaKodez/gridly",
    imageAlt: "Gridly - SaaS Starter Kit",
    liveUrl: "https://gridly.akoder.xyz/",
    tags: ["Next.js", "TypeScript", "Prisma", "AI SDK", "Open Source"],
    metrics: [
      { icon: "chart", label: "40+ hours saved" },
      { icon: "users", label: "100% Free & OSS" },
    ],
    order: 1,
    enabled: true,
  },
  {
    id: "zeno",
    title: "Zeno — Accountability tracker for builders",
    description:
      "Designed and shipped a full-stack web app to track work logs, streaks, and performance trends. Built authentication, streak logic, analytics dashboards, and core data models. Shipped solo and iterated based on usage.",
    image: "/zeno.png",
    imageAlt: "Zeno SaaS Boilerplate",
    liveUrl: "https://zeno.akoder.xyz/",
    tags: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    metrics: [
      { icon: "users", label: "20+ active builders" },
      { icon: "chart", label: "200+ logs created" },
    ],
    order: 2,
    enabled: true,
  },
  {
    id: "root",
    title: "Root — Math Drill Engine",
    description:
      "A practice-focused web app centered on question patterns and timed drills. Exploring how students interact with practice workflows and how data models evolve with usage.",
    image: "/root.png",
    imageAlt: "Root - Math Drill Engine",
    liveUrl: "https://root.akoder.xyz/",
    tags: ["Education", "UX Research", "Data Modeling"],
    metrics: [
      { icon: "users", label: "50+ students" },
      { icon: "chart", label: "50 + Session Created" },
    ],
    order: 3,
    enabled: true,
  },
];
