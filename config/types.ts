import type { MetadataRoute } from "next";

export type SectionId =
  | "socials"
  | "skills"
  | "about"
  | "testimonials"
  | "projects"
  | "experience"
  | "services"
  | "workflow"
  | "github"
  | "bookmarks"
  | "contact";

export interface SectionFlags {
  [key: string]: boolean;
}

export interface SiteMetaConfig {
  url: string;
  title: string;
  titleTemplate: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  authors: Array<{ name: string; url: string }>;
  creator: string;
  publisher: string;
  classification: string;
  category: string;
  locale: string;
  ogImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  twitterCreator: string;
  icon: string;
  appleIcon: string;
  googleVerification: string;
  manifest: MetadataRoute.Manifest;
  robots: MetadataRoute.Robots;
  sitemap: Array<{
    url: string;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority: number;
  }>;
}

export interface PersonalInfo {
  fullName: string;
  firstName: string;
  avatar: {
    src: string;
    alt: string;
    fallback: string;
  };
  location: {
    label: string;
    timezone: string;
  };
  githubUsername: string;
}

export interface HeroConfig {
  greeting: string;
  waveEmoji: string;
  headlineBefore: string;
  highlightedPhrases: [string, string];
  headlineAfter: string;
  description: string;
  descriptionHighlight: string;
}

export interface AboutConfig {
  title: string;
  body: string;
  emphasizedPhrases: [string, string];
}

export interface SkillItem {
  id: string;
  name: string;
  icon: SkillIcon;
  order: number;
  enabled?: boolean;
}

export type SkillIcon =
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwind"
  | "ai-sdk"
  | "shadcn"
  | "better-auth"
  | "prisma"
  | "trpc";

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  href?: string;
  icon: SocialIcon;
  order: number;
  enabled?: boolean;
  action?: "copy" | "external" | "mailto";
  copyValue?: string;
  shortcutKey?: string;
  tooltipDefault?: string;
}

export type SocialIcon =
  | "github"
  | "x"
  | "peerlist"
  | "discord"
  | "gmail"
  | "coffee";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  image: string;
  order: number;
  enabled?: boolean;
}

export interface ProjectMetric {
  icon: "users" | "chart";
  label: string;
}

export interface Project {
  id: string;
  title: string;

  description: string;
  content?: string;
  image: string;
  imageAlt: string;
  liveUrl?: string;
  githubUrl?: string;

  tags: string[];
  metrics?: ProjectMetric[];
  order: number;
  enabled?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights?: string[];
  order: number;
  enabled?: boolean;
}

export interface ListSectionConfig {
  title: string;
  items: string[];
}

export interface WorkflowItem {
  label: string;
  description: string;
}

export interface ContactConfig {
  title: string;
  description: string;
  channels: SocialLink[];
}

export interface BookmarksConfig {
  title: string;
  items: Bookmark[];
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  domain: string;
  icon?: any;
}

export interface PortfolioConfig {
  meta: SiteMetaConfig;
  personal: PersonalInfo;
  sectionOrder: SectionId[];
  sectionFlags: Record<SectionId, boolean>;
  bookmarks: BookmarksConfig;
  banner: {
    imageSrc: string;
    imageAlt: string;
    openSourceUrl: string;
    openSourceTooltip: string;
    themeToggleLabel: string;
    themeShortcut: string;
    themeTooltip: string;
    switchAudioSrc: string;
  };
  about: AboutConfig;
  services: ListSectionConfig;
  workflow: {
    title: string;
    items: WorkflowItem[];
  };
  contact: ContactConfig;
}
