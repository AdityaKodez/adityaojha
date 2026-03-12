import type { Project } from "@/config/types";

export const projectsSectionConfig = {
  title: "Selected Builds",
  liveButtonLabel: "View Product",
  liveTooltip: "Open project",
};

export const projectsConfig: Project[] = [
  {
    id: "gridly",
    title: "Gridly — The Premium SaaS Boilerplate",
    description:
      "Open-source SaaS starter kit built to remove the slowest part of shipping a new product: auth, payments, schemas, and AI setup.",
    content:
      "## Problem\nEvery new SaaS idea starts with the same invisible tax: auth, schema design, payments, and baseline product scaffolding before the real feature even exists.\n\n## Solution\nI built Gridly as an open-source starter kit with authentication, Prisma models, Polar payments, AI SDK wiring, and a clean UI foundation. The goal was to remove repetitive setup work so a founder or developer can start from the first business feature instead of week-one plumbing.\n\n## Outcome\nGridly compresses the first build phase into hours instead of days and shows how I structure reusable product foundations, not just one-off pages. It is also a public proof point of how I think about shipping modern SaaS systems end to end.",
    image: "/gridly.png",
    githubUrl: "https://github.com/AdityaKodez/gridly",
    imageAlt: "Gridly - SaaS Starter Kit",
    liveUrl: "https://gridly.akoder.xyz/",
    tags: ["Next.js", "TypeScript", "Prisma", "Payments", "Open Source"],
    metrics: [
      { icon: "chart", label: "40+ setup hours removed" },
      { icon: "users", label: "MIT licensed" },
    ],
    order: 1,
    enabled: true,
  },
  {
    id: "zeno",
    title: "Zeno — Accountability tracker for builders",
    description:
      "Self-initiated SaaS app for builders who want a lightweight way to log work, keep streaks, and review performance over time.",
    content:
      "## Problem\nSolo builders often know what they should be doing, but the feedback loop is weak. Most productivity tools are either too bloated, too generic, or disconnected from actual shipping habits.\n\n## Solution\nI built Zeno around one clear workflow: log meaningful work, preserve momentum with streaks, and surface performance trends through simple analytics. The product forced me to design authentication, streak logic, dashboards, and the data model as one connected system instead of isolated features.\n\n## Outcome\nZeno reached early usage with active builders and repeated logs, which gave me real feedback on onboarding, retention loops, and how a product evolves after launch. It is the clearest example of me shipping a full-stack product, then learning from actual behavior instead of stopping at the first deploy.",
    image: "/zeno.png",
    imageAlt: "Zeno SaaS Boilerplate",
    liveUrl: "https://zeno.akoder.xyz/",
    tags: ["Next.js", "TypeScript", "Analytics", "Self-initiated"],
    metrics: [
      { icon: "users", label: "20+ active builders" },
      { icon: "chart", label: "200+ logs recorded" },
    ],
    order: 2,
    enabled: true,
  },
  {
    id: "root",
    title: "Root — Math Drill Engine",
    description:
      "Practice product built to test how students respond to timed drills, simple feedback loops, and distraction-free study flows.",
    content:
      "## Problem\nStudents lose momentum when practice tools are noisy, slow, or overloaded with features that distract from repetition and pattern recognition.\n\n## Solution\nI built Root around timed drills, simple question flows, and lightweight feedback loops. The interface is intentionally stripped down so the product supports practice discipline instead of competing for attention.\n\n## Outcome\nWith early student usage and repeat sessions, Root gave me signal on education UX, session design, and how behavior data should shape the next iteration of the product. It also shows that I can build beyond generic SaaS dashboards when the product demands a different interaction model.",
    image: "/root.png",
    imageAlt: "Root - Math Drill Engine",
    liveUrl: "https://root.akoder.xyz/",
    tags: ["Education", "UX Research", "Data Modeling", "Self-initiated"],
    metrics: [
      { icon: "users", label: "50+ students" },
      { icon: "chart", label: "50+ practice sessions" },
    ],
    order: 3,
    enabled: true,
  },
];
