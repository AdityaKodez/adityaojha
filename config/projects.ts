import type { Project } from "@/config/types";

export const projectsSectionConfig = {
  title: "Work",
  liveButtonLabel: "View Product",
  liveTooltip: "Open project",
};

export const projectsConfig: Project[] = [
  {
    id: "rixel",
    title: "Rixel — AI App Security & Design Scanner",
    description:
      "AI app security and design scanner for founders. It finds the security mistakes AI-generated code ships by default — exposed secrets, disabled RLS, open API routes — plus the design flaws that make it feel unfinished. Every fix explained in plain English.",
    content:
      "## Problem\nAI ships vulnerabilities — and half-finished design — just as fast as it ships features. Tools like v0, Lovable, Bolt, and Replit let founders ship in a weekend, but they also repeat the same dangerous mistakes: Row Level Security left off, secrets hard-coded in the repo, API routes with no auth, contrast-failing text, missing loading/empty/error states, and spacing that just feels off.\n\n## Solution\nRixel scans your AI-generated app for the security mistakes that burn founders and the design flaws that make it feel unfinished. It connects your repo, detects issues, explains each one in plain English, generates ready-to-paste fix prompts for Cursor or Claude Code, re-scans to verify the fix closed, and monitors every deploy so nothing slips back in. Integrations cover GitHub, Vercel, Supabase, Neon, and Clerk.\n\n## Outcome\nRixel walks an app from vibe-coded to production-ready in six steps — Scan, Detect, Explain, Fix, Verify, Monitor. It ships finding fingerprinting to cut duplicate noise, automatic fix pull requests for critical risks, and a Starter ($19/mo) and Pro ($39/mo) plan backed by a 7-day free trial. It is a clear example of building a developer tool that turns security from a wall of jargon into founder-friendly, actionable fixes.",
    image: "/rixel.png",
    imageAlt: "Rixel - AI App Security & Design Scanner",
    liveUrl: "https://rixel.tech",
    tags: ["AI", "Security", "Design", "SaaS", "Developer Tools"],
    metrics: [
      { icon: "chart", label: "Continuous monitoring" },
      { icon: "users", label: "Founder-first" },
    ],
    year: 2026,
    status: "building",
    category: "Developer tools",
    order: 1,
    enabled: true,
  },
  {
    id: "aura",
    title: "Aura — AI Study Planner",
    description:
      "AI-powered study planning tool that builds focused daily plans from exam goals, syllabus progress, and cognitive load — turning ambition into a calm, repeatable routine.",
    content:
      "## Problem\nStudents planning for competitive exams often burn out not from studying, but from planning itself. Generic tools either ignore cognitive load or try to gamify everything, adding noise instead of clarity.\n\n## Solution\nAura builds a focused daily plan using the student's exam goal, syllabus, progress, mistakes, and energy levels. The backend ranks topics first and sends a smaller set to the AI planner, so the model arranges a useful mix of study, revision, and tests — only when there is evidence for them. A wellness layer watches cognitive load and revision timing to keep days doable.\n\n## Outcome\nAura demonstrates full-stack AI product design: deterministic ranking on the backend, LLM orchestration for day planning, and a wellness-aware feedback loop that makes tomorrow's plan better based on today's real evidence. It is the clearest proof of building AI products where the model enhances a structured system instead of replacing it.",
    image: "/aura.png",
    githubUrl: "https://github.com/AdityaKodez/starter",
    imageAlt: "Aura - AI Study Planner",
    liveUrl: "https://aura.akoder.xyz",
    tags: ["Next.js", "AI", "TypeScript", "Education", "Wellness"],
    metrics: [
      { icon: "chart", label: "Cognitive load balancing" },
      { icon: "users", label: "AI-powered planning" },
    ],
    year: 2026,
    status: "new",
    category: "AI / Education",
    order: 2,
    enabled: true,
  },
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
    year: 2025,
    status: "shipped",
    category: "Open source",
    order: 3,
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
    year: 2025,
    status: "shipped",
    category: "SaaS",
    order: 4,
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
    year: 2025,
    status: "shipped",
    category: "Education",
    order: 5,
    enabled: true,
  },
];
