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
    sitemap: [
      { url: "https://akoder.xyz", changeFrequency: "monthly", priority: 1 },
    ],
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
    "workflow",
    "services",
    "github",
    "certifications",
    "bookmarks",

    "contact",
  ],
  sectionFlags: {
    socials: true,
    skills: true,
    about: true,
    testimonials: true,
    projects: true,
    bookmarks: true,
    certifications: true,
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
    channels: socialsConfig.filter((item) =>
      ["email", "discord", "coffee"].includes(item.id),
    ),
  },
  bookmarks: {
    title: "Bookmarks",

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
