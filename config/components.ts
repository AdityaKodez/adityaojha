import type { ComponentDoc } from "./types";

/** Home page teaser for the /components showcase. */
export const componentsSectionConfig = {
  title: "Components",
  /** How many registry entries the home page previews before "see all". */
  previewCount: 4,
  seeMoreLabel: "see all",
};

export const componentRegistry: ComponentDoc[] = [
  {
    id: "dotted-world-map",
    title: "Dotted World Map",
    description:
      "A lightweight SVG world map made of dots, each tinted by a value. Drop it into analytics, hero sections, or anywhere you need a quiet global pulse.",
    icon: "globe",
    demoPath: "app/components/[id]/demos/dotted-world-map-demo.tsx",
    docPath: "content/components/dotted-world-map.md",
    order: 1,
    enabled: true,
  },
  {
    id: "copy-command-block",
    title: "Copy Command Block",
    description:
      "A multi-package manager terminal command box with tab switcher (npm, pnpm, yarn, bun), persistent storage, copy feedback animation, and blueprint styling.",
    icon: "terminal",
    demoPath: "app/components/[id]/demos/copy-command-block-demo.tsx",
    docPath: "content/components/copy-command-block.md",
    order: 2,
    enabled: true,
  },
  {
    id: "github-map",
    title: "GitHub Heatmap",
    description:
      "An interactive 52-week contribution activity graph with date-fns interval calculation, theme-aware level colors, and date tooltips.",
    icon: "git",
    demoPath: "app/components/[id]/demos/github-map-demo.tsx",
    docPath: "content/components/github-map.md",
    order: 3,
    enabled: true,
  },
  {
    id: "project-explorer",
    title: "Interactive Project Explorer",
    description:
      "An IDE-style project explorer with collapsible year folders, status badges, and floating cursor image previews.",
    icon: "folder",
    demoPath: "app/components/[id]/demos/project-explorer-demo.tsx",
    docPath: "content/components/project-explorer.md",
    order: 4,
    enabled: true,
  },
  {
    id: "progressive-blur",
    title: "Progressive Blur",
    description:
      "Multi-layered gradient backdrop blur overlay with exponential Gaussian steps and directional masking for sticky navbars and cards.",
    icon: "blur",
    demoPath: "app/components/[id]/demos/progressive-blur-demo.tsx",
    docPath: "content/components/progressive-blur.md",
    order: 5,
    enabled: false,
  },
  {
    id: "infinite-slider",
    title: "Infinite Slider",
    description:
      "A continuous looping marquee slider powered by Motion and React Use Measure with custom gap, speed, direction, and hover deceleration.",
    icon: "slider",
    demoPath: "app/components/[id]/demos/infinite-slider-demo.tsx",
    docPath: "content/components/infinite-slider.md",
    order: 6,
    enabled: false,
  },
  {
    id: "carousel",
    title: "Fluid Carousel",
    description:
      "Accessible touch-swipeable slide carousel with directional spring animations, keyboard arrow navigation, and pagination indicators.",
    icon: "carousel",
    demoPath: "app/components/[id]/demos/carousel-demo.tsx",
    docPath: "content/components/carousel.md",
    order: 7,
    enabled: true,
  },
  {
    id: "mode-toggler",
    title: "Mode Toggler",
    description:
      "A minimal Sun ↔ Moon theme toggle button built on next-themes. Supports an optional click sound, composable className, and dynamic aria-label.",
    icon: "theme",
    demoPath: "app/components/[id]/demos/mode-toggler-demo.tsx",
    docPath: "content/components/mode-toggler.md",
    order: 8,
    enabled: true,
  },
  {
    id: "interactive-skill-cloud",
    title: "Interactive Skill Cloud",
    description:
      "A draggable physics pill cloud powered by matter.js — pills rain down, pile at the bottom, and collide; grab one and fling it.",
    icon: "pills",
    demoPath: "app/components/[id]/demos/interactive-skill-cloud-demo.tsx",
    docPath: "content/components/interactive-skill-cloud.md",
    order: 9,
    enabled: true,
  },
  {
    id: "contact-channels",
    title: "Contact Channels",
    description:
      "A hairline grid of contact cells with copy-to-clipboard actions, single-key shortcuts, tooltips, and blueprint hover styling.",
    icon: "channels",
    demoPath: "app/components/[id]/demos/contact-channels-demo.tsx",
    docPath: "content/components/contact-channels.md",
    order: 10,
    enabled: true,
  },
];

export function findComponent(id: string): ComponentDoc | undefined {
  return componentRegistry
    .filter((c) => c.enabled !== false)
    .find((c) => c.id === id);
}

export function getEnabledComponents(): ComponentDoc[] {
  return [...componentRegistry]
    .filter((c) => c.enabled !== false)
    .sort((a, b) => a.order - b.order);
}
