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
    content:
      "Gridly is designed to be the ultimate starting point for modern SaaS applications. I noticed that many developers spend the first **40+ hours** of any new project just wiring up authentication, database schemas, and payment gateways. \n\n> Gridly solves this by providing a highly opinionated, yet flexible template.\n\n### Key features include:\n- **Full-stack Auth**: Fully integrated authentication system.\n- **Payments**: Seamless monetization using Polar.\n- **AI Ready**: Out-of-the-box AI integration capabilities with the Vercel AI SDK.\n- **Sleek UI**: A beautiful, responsive UI built with Tailwind CSS and ui components.\n\nThis project is fully open-source because I believe in giving back to the community and helping other builders launch their ideas faster.",
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
    content:
      "Zeno was born out of a personal need to maintain momentum while building projects. Consistency is the hardest part of shipping products, and Zeno acts as an **accountability partner**.\n\n> The application features a robust streak-tracking engine that handles logging activity intelligently.\n\n### Core capabilities:\n- **Analytics**: It provides users with analytical dashboards that highlight performance trends over time, helping them identify their productivity patterns.\n- **Performance**: High-speed queries to ensure fast, snappy dashboards.\n- **Data Modeling**: Complex time-series data aggregation for streaks and activity logs.\n\nFrom a technical perspective, building Zeno involved deep dives into caching and query optimization.",
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
    content:
      "Root focuses on the fundamentals of mathematics by providing a **clean, distraction-free** environment for timed drills. The core philosophy is that active practice and pattern recognition are essential for student fluency.\n\n> Building Root has been an exercise in UX research—understanding the friction points students face when studying.\n\n### System Highlights:\n- **Dynamic Generation**: The application dynamically generates problem sets.\n- **Feedback Loops**: Tracks detailed metrics to provide actionable feedback over time.\n- **Cognitive Load**: Designing an interface that encourages focused, deep work without unnecessary distractions.",
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
