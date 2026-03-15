import { socialsConfig } from "@/config/socials";
import type { PortfolioConfig } from "@/config/types";
import SoloLearnIcon from "@/public/sololearn-icon";
import BrandNextjs from "@/public/stacks/nextjs";
import X from "@/public/x-icon";
import { BookmarkCheckIcon } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
export const siteConfig: PortfolioConfig = {
  meta: {
    url: "https://akoder.xyz",
    title: "Aditya — SaaS MVP Developer for Founders",
    titleTemplate: "%s | Aditya",
    shortTitle: "Aditya",
    description:
      "Aditya builds early-stage SaaS MVPs for founders, with a focus on auth, billing, dashboards, admin tools, and clean first versions.",
    keywords: [
      "SaaS MVP Developer",
      "MVP Development",
      "Founder Support",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Product Development",
      "India",
      "Aditya",
      "Aditya Ojha",
      "AdityaKodez",
      "SaaS",
    ],
    authors: [{ name: "Aditya", url: "https://akoder.xyz" }],
    creator: "Aditya",
    publisher: "Aditya",
    classification: "Portfolio",
    category: "technology",
    locale: "en_US",
    ogImage: {
      url: "/profile.avif",
      width: 1200,
      height: 630,
      alt: "Aditya — SaaS MVP Developer for Founders",
    },
    twitterCreator: "@AdiKodez",
    icon: "/favicon.svg",
    appleIcon: "/apple-touch-icon.png",
    googleVerification: "google-site-verification-code",
    manifest: {
      name: "Aditya — SaaS MVP Developer for Founders",
      short_name: "Aditya",
      description:
        "Aditya builds early-stage SaaS MVPs for founders.",
      start_url: "/",
      display: "standalone",
      background_color: "#fafafa",
      theme_color: "#18181b",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    robots: {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://akoder.xyz/sitemap.xml",
    },
    sitemap: [
      { url: "https://akoder.xyz", changeFrequency: "monthly", priority: 1 },
    ],
  },
  personal: {
    fullName: "Aditya Ojha",
    firstName: "Aditya",
    avatar: {
      src: "/profile.avif",
      alt: "@akcll",
      fallback: "AK",
    },
    location: {
      label: "New Delhi, India",
      timezone: "UTC +5:30",
    },
    githubUsername: "AdityaKodez",
  },
  sectionOrder: [
    "projects",
    "services",
    "workflow",
    "about",
    "contact",
    "github",
    "testimonials",
    "skills",
    "bookmarks",
    "socials",
  ],
  sectionFlags: {
    socials: true,
    skills: true,
    about: true,
    testimonials: true,
    projects: true,
    bookmarks: true,
    certifications: false,
    experience: false,
    services: true,
    workflow: true,
    github: true,
    contact: true,
  },
  banner: {
    imageSrc: "/banner.png",
    imageAlt: "Banner",
    openSourceUrl: "https://github.com/AdityaKodez/adityaojha",
    openSourceTooltip: "This project is open source !",
    themeToggleLabel: "Toggle theme",
    themeShortcut: "D",
    themeTooltip: "Toggle theme",
    switchAudioSrc: "/switch.mp3",
  },
  about: {
    title: "About me",
    body: "I build my own SaaS products end to end, which forces me to think beyond code: user flows, onboarding friction, data models, and deployment. That is why I work best with founders who need a practical v1 rather than a lot of process. My edge is turning ambiguous product ideas into scoped builds that ship fast and stay maintainable after launch.",
    emphasizedPhrases: ["end to end", "practical v1"],
  },
  services: {
    title: "What I build best",
    items: [
      "Founder-led SaaS MVPs with auth, onboarding, payments, dashboards, and admin tools.",
      "Internal tools and back-office workflows that need clear roles, clean data models, and fast delivery.",
      "Next.js products that need one strong feature shipped or a messy flow rebuilt without overengineering.",
    ],
  },
  workflow: {
    title: "How I run a project",
    items: [
      {
        label: "Scope",
        description: "We agree on one core workflow, fixed deliverables, and what is explicitly out of scope.",
      },
      {
        label: "Communication",
        description: "You get short async updates, working demos, and clear blockers instead of vague progress.",
      },
      {
        label: "Handoff",
        description: "I ship clean code, deployment support, and next-step recommendations after the first release.",
      },
    ],
  },
  contact: {
    title: "Need a builder for your v1?",
    description:
      "Email me with the product, target user, and deadline. If the scope is a fit, I’ll reply with next steps and a practical build recommendation.",
    pricing: [
      {
        label: "Minimum engagement",
        value: "$700",
        note: "A good fit for smaller scoped builds, feature sprints, or setup work.",
      },
      {
        label: "Typical MVP range",
        value: "$2.5k-$5k",
        note: "Most founder MVP builds land here once scope, integrations, and handoff are clear.",
      },
      {
        label: "How pricing works",
        value: "Final quote depends on scope",
        note: "Complex workflows, billing, roles, and admin tooling push projects higher.",
      },
    ],
    channels: socialsConfig.filter((item) =>
      ["email", "x", "discord"].includes(item.id),
    ),
  },
  bookmarks: {
    title: "Learning",

    items: [
      {
        id: "1",
        url: "https://x.com/thedankoe/status/2014022520513634718",
        title: "The future of work when work is meaningless",
        domain: "x.com",
        icon: X,
      },
      {
        id: "2",
        url: "https://youtu.be/xwbI8VOsDTo?si=bSU7AkTOZJt-esFd",
        title: "Power Of Words | Mohammed Qathani",
        domain: "youtube.com",
        icon: FaYoutube,
      },
      {
        id: "3",
        url: "https://x.com/thedankoe/status/2010751592346030461",
        title: "How To Fix Your Life In 1 Day",

        domain: "x.com",
        icon: X,
      },
      {
        id: "4",
        url: "https://www.youtube.com/watch?v=fq0txiTIiFM&list=PPSV",
        title: "All of Computer Science in 10 Real Projects",
        domain: "youtube.com",
        icon: FaYoutube,
      },
      {
        id: "5",
        url: "https://x.com/digiii/status/2015009789546262984",
        title: "Nothing matters, head for the mountains  ",
        domain: "x.com",
        icon: X,
      },
      {
        id: "6",
        url: "https://x.com/dwarkesh_sp/status/2022357801276690455",
        title: "Dario's Interview ",
        domain: "x.com",
        icon: X,
      },
      {
        id: "7",
        url: "https://youtu.be/aStHTTPxlis?si=VoWpllxMa1Ihphro",
        title: "How Elon Work",
        domain: "youtube.com",
        icon: FaYoutube,
      },
      {
        id: "8",
        url: "https://arxiv.org/abs/1706.03762",
        title: "Attention Is All You Need",
        domain: "arxiv.org",
        icon: BookmarkCheckIcon,
      },
    ],
  },
  certifications: {
    title: "Learning Foundations",
    items: [
      {
        id: "certificate-1",
        url: "https://nextjs.org/learn/certificate?course=react-foundations&user=45793&certId=react-foundations-45793-1771918035299",
        title: "React Foundations",
        domain: "nextjs.org",
        date: "2025",
        icon: BrandNextjs,
      },
      {
        id: "certificate-2",
        url: "https://www.sololearn.com/certificates/CC-N1JK4PWH",
        title: "Web Development",
        domain: "sololearn.com",
        date: "2024",
        icon: SoloLearnIcon,
      },
      {
        id: "certificate-3",
        url: "https://nextjs.org/learn/certificate?course=dashboard-app&user=45793&certId=dashboard-app-45793-1771919744029",
        title: "App Router",
        domain: "nextjs.org",
        date: "2025",
        icon: BrandNextjs,
      },
      {
        id: "certificate-4",
        url: "https://www.sololearn.com/certificates/CC-FSTNML8K",
        title: "Introduction to CSS",
        domain: "sololearn.com",
        date: "2024",
        icon: SoloLearnIcon,
      },
      {
        id: "certificate-5",
        url: "https://www.sololearn.com/certificates/CC-ATHOEG0Y",
        title: "Introduction to C#",
        domain: "sololearn.com",
        date: "2024",
        icon: SoloLearnIcon,
      },
      {
        id: "certificate-6",
        url: "https://www.sololearn.com/certificates/CC-I0LF0CGS",
        title: "Javascript Intermediate",
        domain: "sololearn.com",
        date: "2024",
        icon: SoloLearnIcon,
      },
    ],
  },
};
