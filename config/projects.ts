import type { Project } from "@/config/types";

export const projectsSectionConfig = {
  title: "Projects",
  liveButtonLabel: "Live",
  liveTooltip: "Live Preview",
};


export const projectsConfig: Project[] = [
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
    order: 1,
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
    order: 2,
    enabled: true,
  },
];
