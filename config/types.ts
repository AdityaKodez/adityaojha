import type { MetadataRoute } from "next";
import type { ComponentType, SVGProps } from "react";

export type SectionId =
  | "socials"
  | "skills"
  | "components"
  | "about"
  | "testimonials"
  | "projects"
  | "experience"
  | "services"
  | "workflow"
  | "github"
  | "bookmarks"
  | "certifications"
  | "sponsors"
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
    timeZone: string;
  };
  githubUsername: string;
}

export interface HeroConfig {
  greeting: string;
  waveEmoji: string | React.ElementType;
  headlineBefore: string;
  highlightedPhrases: [string, string];
  headlineAfter: string;
  description: string;
  descriptionHighlight: string;
}

export interface AboutConfig {
  title: string;
  body: string;
}

export type SkillCategory =
  | "language"
  | "frontend"
  | "backend"
  | "workflow-ai";

export interface SkillCategoryConfig {
  id: SkillCategory;
  label: string;
}

export interface SkillItem {
  id: string;
  name: string;
  icon: SkillIcon;
  category: SkillCategory;
  order: number;
  enabled?: boolean;
}

export type SkillIcon =
  | "nextjs"
  | "react"
  | "typescript"
  | "javascript"
  | "tailwind"
  | "ai-sdk"
  | "shadcn"
  | "better-auth"
  | "prisma"
  | "trpc"
  | "tanstack"
  | "claude"
  | "cursor";

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
  | "reddit";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  image: string;
  /** Permalink to the original X or Reddit post, when one exists. */
  href?: string;
  order: number;
  enabled?: boolean;
}

export interface ProjectMetric {
  icon: "users" | "chart";
  label: string;
}

export type ProjectStatus = "building" | "new" | "shipped";

export interface Project {
  id: string;
  title: string;

  description: string;
  content?: string;
  image: string;
  imageAlt: string;
  liveUrl?: string;
  githubUrl?: string;

  year: number;
  status: ProjectStatus;
  category: string;

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

export interface PricingAnchor {
  label: string;
  value: string;
  note: string;
}

export interface ContactConfig {
  title: string;
  description: string;
  pricing: PricingAnchor[];
  channels: SocialLink[];
}

export type LinkCardIcon = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export interface BookmarksConfig {
  title: string;
  items: Bookmark[];
}

export interface CertificationsConfig {
  title: string;
  items: Certification[];
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  domain: string;
  icon?: LinkCardIcon;
}

export interface Certification {
  id: string;
  url: string;
  title: string;
  domain: string;
  date?: string;
  icon?: LinkCardIcon;
}

export interface Sponsor {
  id: string;
  name: string;
  /** Display date, shown in the hover tooltip. */
  date?: string;
  url?: string;
  /** Square logo image, shown inside the circle. Falls back to a generated avatar. */
  logo?: string;
  /** 0-based seat index on the orbit. */
  seat: number;
  order: number;
  enabled?: boolean;
  /** Dodo payment id, present on sponsors added through the payment webhook. */
  paymentId?: string;
  /** False until the sponsor has submitted the claim form with url and logo. */
  claimed?: boolean;
}

export interface SponsorTier {
  id: string;
  name: string;
  /** One-time price in USD. */
  price: number;
  /** How long the seat stays up. Shown verbatim next to the price. */
  duration: string;
  description: string;
  /** Bullet-free short list of what the tier includes. */
  perks: string[];
  /** Marks the tier as the recommended one in the UI. */
  featured?: boolean;
  order: number;
  enabled?: boolean;
}

export interface SponsorsSectionConfig {
  label: string;
  heading: string;
  description: string;
  seats: number;
  tiers: SponsorTier[];
}

/** One numbered point on the /sponsor page, used for the why and steps lists. */
export interface SponsorPagePoint {
  label: string;
  description: string;
}

export interface SponsorPageConfig {
  title: string;
  tagline: string;
  description: string;
  /** Serif italic caption under the hero mascot. */
  mascotCaption: string;
  whyHeading: string;
  why: SponsorPagePoint[];
  tierHeading: string;
  stepsHeading: string;
  steps: SponsorPagePoint[];
  ctaHeading: string;
  ctaDescription: string;
}

export type ComponentIcon =
  | "globe"
  | "terminal"
  | "git"
  | "folder"
  | "blur"
  | "slider"
  | "carousel"
  | "theme"
  | "pills"
  | "channels"
  | "rail"
  | "bars"
  | "command"
  | "sparkles"
  | "models"
  | "stack"
  | "status";

export interface ComponentDoc {
  id: string;
  title: string;
  description: string;
  icon: ComponentIcon;
  /** Path (relative to project root) of the tsx file used as the live preview. */
  demoPath: string;
  /** Path (relative to project root) of the markdown docs rendered below the preview. */
  docPath: string;
  order: number;
  enabled?: boolean;
  /** Display a new component indicator dot on cards and teasers. */
  new?: boolean;
  /** Responsive column span in the card view grid (1 or 2). Defaults to 1. */
  colSpan?: 1 | 2;
}

export interface PortfolioConfig {
  meta: SiteMetaConfig;
  personal: PersonalInfo;
  sectionOrder: SectionId[];
  sectionFlags: Record<SectionId, boolean>;
  bookmarks: BookmarksConfig;
  certifications: CertificationsConfig;
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


