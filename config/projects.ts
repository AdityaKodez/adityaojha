import type { Project } from "@/config/types";

export const projectsSectionConfig = {
  title: "Work",
  liveButtonLabel: "Live site",
  sourceButtonLabel: "Source code",
};

export const projectsConfig: Project[] = [
  {
    id: "talvess",
    title: "Talvess",
    tagline: "Cookieless web analytics",
    description:
      "Cookieless analytics that shows where visitors come from and what they do next.",
    content:
      "Pageviews, sources, funnels, revenue and Web Vitals in one dashboard, with GitHub deploys marked on the timeline. It also runs the analytics on this site.",
    image: "/talvess.png",
    imageAlt: "Talvess homepage",
    imageTone: "dark",
    liveUrl: "https://talvess.app",
    tags: ["Analytics", "SaaS", "Next.js", "Privacy"],
    year: 2026,
    status: "shipped",
    category: "Analytics",
    order: 1,
    enabled: true,
  },
  {
    id: "rixel",
    title: "Rixel",
    tagline: "AI code security scanner",
    description:
      "Scans AI-generated apps for security and design flaws, then opens the fix pull request.",
    content:
      "Connects to GitHub, finds exposed secrets, disabled Row Level Security and open API routes, and explains each one in plain English. Built for founders shipping with v0, Lovable and Bolt.",
    image: "/rixel.png",
    imageAlt: "Rixel homepage",
    imageTone: "light",
    liveUrl: "https://rixel.tech",
    tags: ["AI", "Security", "Design", "SaaS", "Developer Tools"],
    year: 2026,
    status: "shipped",
    category: "Developer tools",
    order: 2,
    enabled: true,
  },
  {
    id: "aura",
    title: "Aura",
    tagline: "AI study planner",
    description:
      "A daily study plan built from your exam goal, syllabus progress and energy.",
    content:
      "The backend ranks what to study, then the model arranges study, revision and tests for the day. Made for students preparing for competitive exams.",
    image: "/aura.png",
    imageAlt: "Aura homepage",
    imageTone: "dark",
    liveUrl: "https://aura.akoder.xyz",
    githubUrl: "https://github.com/AdityaKodez/starter",
    tags: ["Next.js", "AI", "TypeScript", "Education"],
    year: 2026,
    status: "new",
    category: "AI / Education",
    order: 3,
    enabled: true,
  },
  {
    id: "gridly",
    title: "Gridly",
    tagline: "Open-source SaaS starter",
    description:
      "A Next.js starter with auth, database, payments and AI chat already wired.",
    content:
      "Skip week one of setup and start on the first real feature. Open source under the MIT license.",
    image: "/gridly.png",
    imageAlt: "Gridly homepage",
    imageTone: "light",
    liveUrl: "https://gridly.akoder.xyz/",
    githubUrl: "https://github.com/AdityaKodez/gridly",
    tags: ["Next.js", "TypeScript", "Prisma", "Payments", "Open Source"],
    year: 2025,
    status: "shipped",
    category: "Open source",
    order: 4,
    enabled: true,
  },
  {
    id: "zeno",
    title: "Zeno",
    tagline: "Work log for builders",
    description:
      "A lightweight log for builders to track what they ship and keep a streak.",
    content:
      "Log your work, keep the streak, and see the trend. Auth, streaks, dashboards and the data model, built end to end.",
    image: "/zeno.png",
    imageAlt: "Zeno homepage",
    imageTone: "dark",
    liveUrl: "https://zeno.akoder.xyz/",
    tags: ["Next.js", "TypeScript", "Analytics"],
    year: 2025,
    status: "shipped",
    category: "SaaS",
    order: 5,
    enabled: true,
  },
  {
    id: "root",
    title: "Root",
    tagline: "Timed math drills",
    description:
      "Timed math drills with quick feedback and nothing else on screen.",
    content:
      "A stripped-down practice tool for students, built to keep attention on repetition.",
    image: "/root.png",
    imageAlt: "Root homepage",
    imageTone: "light",
    liveUrl: "https://root.akoder.xyz/",
    tags: ["Education", "Next.js"],
    year: 2025,
    status: "shipped",
    category: "Education",
    order: 6,
    enabled: true,
  },
];