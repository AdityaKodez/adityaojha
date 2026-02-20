import { socialsConfig } from "@/config/socials";
import type { PortfolioConfig } from "@/config/types";

export const siteConfig: PortfolioConfig = {
  meta: {
    url: "https://akoder.xyz",
    title: "Aditya — Full-Stack Engineer",
    titleTemplate: "%s | Aditya",
    shortTitle: "Aditya",
    description:
      "Aditya is a Full-stack Engineer building high-performance web applications. Specializing in Next.js, TypeScript, and modern web architecture.",
    keywords: [
      "Full-stack Engineer",
      "Web Developer",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Software Engineer",
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
      url: "/profile.png",
      width: 1200,
      height: 630,
      alt: "Aditya — Full-Stack Engineer",
    },
    twitterCreator: "@AdiKodez",
    icon: "/favicon.svg",
    appleIcon: "/apple-touch-icon.png",
    googleVerification: "google-site-verification-code",
    manifest: {
      name: "Aditya — Full-Stack Engineer",
      short_name: "Aditya",
      description:
        "Aditya is a Full-stack Engineer building high-performance web applications.",
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
    sitemap: [{ url: "https://akoder.xyz", changeFrequency: "monthly", priority: 1 }],
  },
  personal: {
    fullName: "Aditya Ojha",
    firstName: "Aditya",
    avatar: {
      src: "/profile.png",
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
    "socials",
    "skills",
    "about",
    "testimonials",
    "projects",
    "experience",
    "services",
    "workflow",
    "github",
    "contact",
  ],
  sectionFlags: {
    socials: true,
    skills: true,
    about: true,
    testimonials: true,
    projects: true,
    experience: true,
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
    body: "I started experimenting with computers and building small things early on, long before I understood where it would lead. The path wasn’t clean or linear, and I had to learn discipline and consistency the hard way. Building products eventually became how I stay focused — turning effort into something concrete and useful.",
    emphasizedPhrases: ["discipline and consistency", "concrete and useful"],
  },
  services: {
    title: "What I can help you with",
    items: [
      "Rapid MVP development and deployment.",
      "Scalable full-stack application architecture.",
      "Performance optimization and code refactoring.",
    ],
  },
  workflow: {
    title: "How I work",
    items: [
      {
        label: "Scope Control",
        description: "Requirements are locked before code. No feature creep.",
      },
      {
        label: "Speed",
        description: "I ship continuously. You see progress every day.",
      },
      {
        label: "Communication",
        description: "Async-first. No daily standups.",
      },
    ],
  },
  contact: {
    title: "Ready to build?",
    description:
      "I am currently available for scoped MVP projects. Reach out if you are ready to ship.",
    channels: socialsConfig.filter((item) => ["email", "discord", "coffee"].includes(item.id)),
  },
};
