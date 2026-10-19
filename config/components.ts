import type { ComponentDoc } from "./types";

/** Home page teaser for the /components showcase. */
export const componentsSectionConfig = {
  title: "Components",
  /** How many registry entries the home page previews before "See all". */
  previewCount: 4,
  seeMoreLabel: "See all",
  /** Copy for the suggestion entry point, dialog, and submit feedback. */
  suggestion: {
    cardTitle: "Suggest a component",
    cardDescription: "The next block lands in this slot. Tell it what to be.",
    title: "Suggest a component",
    description:
      "Describe the component you want. References and images help it get built.",
    ideaLabel: "Component idea",
    ideaPlaceholder:
      "A command menu with nested pages, recent actions and keyboard navigation.",
    ideaTooShortMessage: "Describe the component in at least 20 characters.",
    referencesLabel: "References",
    referencesPlaceholder:
      "Links to similar components, docs, or demos. One per line.",
    imagesLabel: "Images",
    imagesButton: "Add images or drop them here",
    imagesHint: "PNG, JPG, or WebP. Up to 3 files, 1.5 MB each.",
    removeImageLabel: "Remove image",
    nameLabel: "X handle",
    namePlaceholder: "yourhandle",
    nameRequiredMessage: "Add your X handle so we can reach you about progress.",
    submitLabel: "Send suggestion",
    submittingLabel: "Sending suggestion...",
    successTitle: "Suggestion received",
    successDescription: "It is on the bench for review.",
    successFollowUp: "We will contact you about progress at @{handle}.",
    errorDescription: "The suggestion could not be sent. Try again.",
    rateLimitMessage: "Too many suggestions right now. Try again later.",
    unavailableMessage: "The suggestion box is not set up yet.",
    cancelLabel: "Cancel",
    doneLabel: "Done",
  },
};

export const componentRegistry: ComponentDoc[] = [
  {
    id: "fluid-testimonial-card",
    title: "Fluid testimonial card",
    summary: "A testimonial card with a flowing gradient and hover lift.",
    description:
      "A compact testimonial card that lifts on hover, with a warm, flowing gradient behind its serif quote and author.",
    icon: "testimonial",
    demoPath: "app/components/[id]/demos/fluid-testimonial-card-demo.tsx",
    docPath: "content/components/fluid-testimonial-card.md",
    order: -4,
    enabled: true,
    new: true,
  },
  {
    id: "emoji-reactions",
    title: "Emoji reactions",
    summary: "A reaction picker with spring feedback and saved selections.",
    description:
      "A compact emoji reaction picker that swaps the emoji on your message with a short spring bounce, persistent selection, and keyboard navigation.",
    icon: "reactions",
    demoPath: "app/components/[id]/demos/emoji-reactions-demo.tsx",
    docPath: "content/components/emoji-reactions.md",
    order: -3,
    enabled: true,
    new: true,
  },
  {
    id: "todo-list",
    title: "Todo list",
    summary: "Task rows that animate completed items to the bottom.",
    description:
      "Content-sized task rows with completion checks in your primary color, an animated strike-through, and spring reordering that moves finished tasks to the bottom.",
    icon: "todo",
    demoPath: "app/components/[id]/demos/todo-list-demo.tsx",
    docPath: "content/components/todo-list.md",
    order: -2,
    enabled: true,
  },
  {
    id: "theme-switcher",
    title: "Theme switcher",
    summary: "Light, dark, and system themes with visual previews.",
    description:
      "A visual Light, Dark, and System theme selector with textured previews, an animated selection outline, and keyboard navigation.",
    icon: "appearance",
    demoPath: "app/components/[id]/demos/theme-switcher-demo.tsx",
    docPath: "content/components/theme-switcher.md",
    order: -1,
    enabled: true,
  },
  {
    id: "prompt-bar",
    title: "Prompt Bar",
    summary: "A prompt input with context chips and send, stop, and retry states.",
    description:
      "A compact prompt input with removable context chips, a toolbar slot for your model picker, and async send, stop, and retry states.",
    icon: "prompt",
    demoPath: "app/components/[id]/demos/prompt-bar-demo.tsx",
    docPath: "content/components/prompt-bar.md",
    order: 0,
    enabled: true,
  },
  {
    id: "ask-ai",
    title: "Ask AI",
    summary: "Send a prompt to your AI provider from a compact popover.",
    description:
      "A popover prompt launcher with an animated mascot trigger, one-click query links for major AI providers, and instant clipboard fallback.",
    icon: "sparkles",
    demoPath: "app/components/[id]/demos/ask-ai-demo.tsx",
    docPath: "content/components/ask-ai.md",
    order: 1,
    enabled: true,

  },
  {
    id: "model-picker",
    title: "Model Picker",
    summary: "Choose a model from a list filtered by provider.",
    description:
      "A chat-style model switcher. Provider icons on a side rail filter the list to models available from that provider.",
    icon: "models",
    demoPath: "app/components/[id]/demos/model-picker-demo.tsx",
    docPath: "content/components/model-picker.md",
    order: 2,
    enabled: true,
  },
  {
    id: "glyph-card",
    title: "Glyph Card",
    summary: "A card that gathers tiny marks into a glyph on hover.",
    description:
      "A hairline card whose background resolves into tiny plus marks on hover, gathering inside the glyph. Draws itself from a single SVG path on a 24x24 grid.",
    icon: "stack",
    demoPath: "app/components/[id]/demos/glyph-card-demo.tsx",
    docPath: "content/components/glyph-card.md",
    order: 3,
    enabled: true,
  },
  {
    id: "command-palette",
    title: "Command Palette",
    summary: "A keyboard command menu with nested pages and recent actions.",
    description:
      "A keyboard-first ⌘K palette with grouped actions, drill-down pages, recent items, and directional motion, built on cmdk inside a self-contained dialog shell.",
    icon: "command",
    demoPath: "app/components/[id]/demos/command-palette-demo.tsx",
    docPath: "content/components/command-palette.md",
    order: 4,
    enabled: true,
  },
  {
    id: "progress-bars",
    title: "Progress Bars",
    summary: "Textured bar charts with line or dot fills and tooltips.",
    description:
      "A minimal textured bar chart with vertical and horizontal layouts, shipping a line fill and a dot matrix fill. Each item needs only a value, with an optional label and tooltip.",
    icon: "bars",
    demoPath: "app/components/[id]/demos/progress-bars-demo.tsx",
    docPath: "content/components/progress-bars.md",
    order: 5,
    enabled: true,
  },
  {
    id: "section-rail",
    title: "Section Rail",
    summary: "Section navigation with scroll tracking and hover previews.",
    description:
      "A responsive section navigation rail with scroll tracking, smooth anchor jumps, link mode, and optional rich hover previews.",
    icon: "rail",
    demoPath: "app/components/[id]/demos/section-rail-demo.tsx",
    docPath: "content/components/section-rail.md",
    order: 6,
    enabled: true,
  },
  {
    id: "project-explorer",
    title: "Interactive Project Explorer",
    summary: "Year folders with project status badges and image previews.",
    description:
      "An IDE-style project explorer with collapsible year folders, status badges, and floating cursor image previews.",
    icon: "folder",
    demoPath: "app/components/[id]/demos/project-explorer-demo.tsx",
    docPath: "content/components/project-explorer.md",
    order: 7,
    enabled: true,
  },
  {
    id: "dotted-world-map",
    title: "Dotted World Map",
    summary: "An SVG world map with dots colored by your data.",
    description:
      "A lightweight SVG world map made of dots, each tinted by a value. Drop it into analytics, hero sections, or anywhere you need a quiet global pulse.",
    icon: "globe",
    demoPath: "app/components/[id]/demos/dotted-world-map-demo.tsx",
    docPath: "content/components/dotted-world-map.md",
    order: 8,
    enabled: true,
  },
  {
    id: "copy-command-block",
    title: "Copy Command Block",
    summary: "Copy install commands with saved package manager preferences.",
    description:
      "A multi-package manager terminal command box with tab switcher (npm, pnpm, yarn, bun), persistent storage, copy feedback animation, and blueprint styling.",
    icon: "terminal",
    demoPath: "app/components/[id]/demos/copy-command-block-demo.tsx",
    docPath: "content/components/copy-command-block.md",
    order: 9,
    enabled: true,
  },
  {
    id: "interactive-skill-cloud",
    title: "Interactive Skill Cloud",
    summary: "Draggable skill pills that fall, collide, and bounce.",
    description:
      "A draggable physics pill cloud powered by matter.js, pills rain down, pile at the bottom, and collide; grab one and fling it.",
    icon: "pills",
    demoPath: "app/components/[id]/demos/interactive-skill-cloud-demo.tsx",
    docPath: "content/components/interactive-skill-cloud.md",
    order: 10,
    enabled: true,
  },
  {
    id: "github-map",
    title: "GitHub Heatmap",
    summary: "A contribution calendar with themed colors and date tooltips.",
    description:
      "An interactive 52-week contribution activity graph with date-fns interval calculation, theme-aware level colors, and date tooltips.",
    icon: "git",
    demoPath: "app/components/[id]/demos/github-map-demo.tsx",
    docPath: "content/components/github-map.md",
    order: 11,
    enabled: true,
  },
  {
    id: "carousel",
    title: "Fluid Carousel",
    summary: "A spring carousel with touch, keyboard, and pagination controls.",
    description:
      "Accessible touch-swipeable slide carousel with directional spring animations, keyboard arrow navigation, and pagination indicators.",
    icon: "carousel",
    demoPath: "app/components/[id]/demos/carousel-demo.tsx",
    docPath: "content/components/carousel.md",
    order: 12,
    enabled: true,
  },
  {
    id: "contact-channels",
    title: "Contact Channels",
    summary: "A contact grid with copy actions and keyboard shortcuts.",
    description:
      "A hairline grid of contact cells with copy-to-clipboard actions, single-key shortcuts, tooltips, and blueprint hover styling.",
    icon: "channels",
    demoPath: "app/components/[id]/demos/contact-channels-demo.tsx",
    docPath: "content/components/contact-channels.md",
    order: 13,
    enabled: true,
  },
  {
    id: "mode-toggler",
    title: "Mode Toggler",
    summary: "A compact theme toggle with an optional click sound.",
    description:
      "A minimal Sun ↔ Moon theme toggle button built on next-themes. Supports an optional click sound, composable className, and dynamic aria-label.",
    icon: "theme",
    demoPath: "app/components/[id]/demos/mode-toggler-demo.tsx",
    docPath: "content/components/mode-toggler.md",
    order: 14,
    enabled: true,
  },
  {
    id: "workflow-status",
    title: "Workflow Status",
    summary: "Workflow badges with custom states, icons, and colors.",
    description:
      "Compact workflow badges with semantic defaults, custom states, icon and colour overrides, two sizes, and an icon-only form.",
    icon: "status",
    demoPath: "app/components/[id]/demos/workflow-status-demo.tsx",
    docPath: "content/components/workflow-status.md",
    order: 17,
    enabled: true,
  },
  {
    id: "snake",
    title: "Snake",
    summary: "A dot-grid snake game with keyboard and swipe controls.",
    description:
      "A monochrome snake game on a dot-lattice field. Steer with the arrow keys, WASD, or a swipe, eat to grow by one segment, and wrap around the edges.",
    icon: "snake",
    demoPath: "app/components/[id]/demos/snake-demo.tsx",
    docPath: "content/components/snake.md",
    order: 18,
    enabled: true,
  },
  {
    id: "stack-rolodex",
    title: "Stack Rolodex",
    summary: "A rotating pill stack with depth and edge fading.",
    description:
      "A rotating vertical pill stack that cycles through a list rolodex-style, with depth scaling, edge fading, and an optional side label.",
    icon: "rolodex",
    demoPath: "app/components/[id]/demos/stack-rolodex-demo.tsx",
    docPath: "content/components/stack-rolodex.md",
    order: 19,
    enabled: true,
  },
  {
    id: "progressive-blur",
    title: "Progressive Blur",
    summary: "A layered backdrop blur with directional masking.",
    description:
      "Multi-layered gradient backdrop blur overlay with exponential Gaussian steps and directional masking for sticky navbars and cards.",
    icon: "blur",
    demoPath: "app/components/[id]/demos/progressive-blur-demo.tsx",
    docPath: "content/components/progressive-blur.md",
    order: 15,
    enabled: false,
  },
  {
    id: "infinite-slider",
    title: "Infinite Slider",
    summary: "A looping slider with adjustable speed and hover slowdown.",
    description:
      "A continuous looping marquee slider powered by Motion and React Use Measure with custom gap, speed, direction, and hover deceleration.",
    icon: "slider",
    demoPath: "app/components/[id]/demos/infinite-slider-demo.tsx",
    docPath: "content/components/infinite-slider.md",
    order: 16,
    enabled: false,
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
