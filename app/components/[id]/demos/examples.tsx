import { Carousel, type CarouselItem } from "@/components/ui/carousel";
import { AskAI } from "@/components/ui/ask-ai";
import { DottedWorldMap } from "@/components/ui/dotted-world-map";
import { CopyCommandBlock } from "@/components/ui/copy-command-block";
import { ProgressBars } from "@/components/ui/progress-bars";
import { ProjectExplorer } from "@/components/project-explorer";
import { projectsConfig } from "@/config/projects";
import {
  contributorActivitySources,
  edgeRegionTrafficSources,
  worldPopulationHeatSources,
} from "@/config/world-cities";

import { weeklyVisitors } from "./dotted-world-map-demo";
import { GitHubCalendarExample } from "./github-map-demo";
import { DotProgressExample, ProgressBarsCapacityExample } from "./progress-bars-demo";

const GITHUB_GREENS = ["#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#047857"];
const VIOLET_RAMP = ["#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#6d28d9"];
const AMBER_RAMP = ["#fef08a", "#fde047", "#eab308", "#ca8a04", "#854d0e"];
const BLUE_RAMP = ["#bae6fd", "#7dd3fc", "#38bdf8", "#0284c7", "#0369a1"];

function dottedWorldMapExamples(): CarouselItem[] {
  return [
    {
      id: "population-density",
      title: "Population density",
      description:
        "A marker-free heatmap — warm dots for dense regions, cool dots for sparse ones.",
      content: (
        <div className="w-full space-y-2">
          <DottedWorldMap
            points={worldPopulationHeatSources}
            dotRadius={2}
            spacing={6}
            baseOpacity={0.92}
            showMarkers={false}
            legendLabels={{ low: "Sparse", high: "Dense" }}
          />
          <p className="text-xs text-muted-foreground">
            Illustrative population density — not live census data.
          </p>
        </div>
      ),
    },
    {
      id: "weekly-visitors",
      title: "Weekly visitors",
      description:
        "Markers add hover and keyboard detail — focus one to read its visitor count.",
      content: (
        <div className="w-full space-y-2">
          <DottedWorldMap
            points={weeklyVisitors}
            dotRadius={2}
            spacing={6}
            baseOpacity={0.92}
            legendLabels={{ low: "Fewer visitors", high: "More visitors" }}
          />
        </div>
      ),
    },
    {
      id: "edge-regions",
      title: "Edge regions",
      description:
        "A custom violet palette with tighter spacing for a denser grid.",
      content: (
        <div className="w-full space-y-2">
          <DottedWorldMap
            points={edgeRegionTrafficSources}
            colors={VIOLET_RAMP}
            dotRadius={1.6}
            spacing={5}
            baseOpacity={0.85}
            legendLabels={{ low: "Less traffic", high: "More traffic" }}
          />
        </div>
      ),
    },
    {
      id: "contributor-activity",
      title: "Contributor activity",
      description:
        "GitHub-style greens for commit activity across contributor hubs.",
      content: (
        <div className="w-full space-y-2">
          <DottedWorldMap
            points={contributorActivitySources}
            colors={GITHUB_GREENS}
            dotRadius={1.8}
            spacing={6}
            baseOpacity={0.9}
            legendLabels={{ low: "Less", high: "More" }}
          />
        </div>
      ),
    },
  ];
}

function copyCommandBlockExamples(): CarouselItem[] {
  return [
    {
      id: "single-git",
      title: "Standalone git command",
      description: "Single-line shell command without tabs.",
      content: (
        <div className="w-full max-w-md">
          <CopyCommandBlock command="git checkout -b feature/registry-blocks" />
        </div>
      ),
    },
    {
      id: "shadcn-add",
      title: "Universal shadcn add",
      description: "Dynamic runner resolver for npm, pnpm, yarn, and bun.",
      content: (
        <div className="w-full max-w-md">
          <CopyCommandBlock
            commands={{
              npm: "npx shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
              pnpm: "pnpm dlx shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
              yarn: "yarn dlx shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
              bun: "bunx --bun shadcn@latest add https://akoder.xyz/r/dotted-world-map.json",
            }}
          />
        </div>
      ),
    },
  ];
}

function githubMapExamples(): CarouselItem[] {
  return [
    {
      id: "github-greens",
      title: "Classic emerald",
      description: "Traditional 5-tier GitHub green heat scale.",
      content: <GitHubCalendarExample colors={GITHUB_GREENS} />,
    },
    {
      id: "github-violet",
      title: "Amethyst violet ramp",
      description: "Vibrant purple gradient for dark theme accents.",
      content: <GitHubCalendarExample colors={VIOLET_RAMP} />,
    },
    {
      id: "github-amber",
      title: "Sunset amber heat",
      description: "Warm golden glow for high-energy activity milestones.",
      content: <GitHubCalendarExample colors={AMBER_RAMP} />,
    },
    {
      id: "github-blue",
      title: "Sky cyan gradient",
      description: "Cool blue hues for modern dashboard layouts.",
      content: <GitHubCalendarExample colors={BLUE_RAMP} />,
    },
  ];
}

function projectExplorerExamples(): CarouselItem[] {
  return [
    {
      id: "project-explorer-latest",
      title: "Latest work first",
      description:
        "Start with the most recent folder open when the explorer sits inside a compact project panel.",
      content: (
        <div className="w-full max-w-xl">
          <ProjectExplorer
            projects={projectsConfig}
            showHeading={false}
            defaultOpen="latest"
          />
        </div>
      ),
    },
    {
      id: "project-explorer-no-preview",
      title: "No hover preview",
      description:
        "Disable floating cursor preview cards for a minimal, fast, text-focused project list.",
      content: (
        <div className="w-full max-w-xl">
          <ProjectExplorer
            projects={projectsConfig}
            showHeading={false}
            defaultOpen="latest"
            showHoverPreview={false}
          />
        </div>
      ),
    },
    {
      id: "project-explorer-archive",
      title: "Full project archive",
      description:
        "Open every year up front when browsing across a portfolio matters more than initial density.",
      content: (
        <div className="w-full max-w-xl">
          <ProjectExplorer
            projects={projectsConfig}
            showHeading={false}
            defaultOpen="all"
          />
        </div>
      ),
    },
  ];
}

function carouselExamples(): CarouselItem[] {
  return [
    {
      id: "carousel-onboarding",
      title: "Onboarding steps",
      description: "A concise sequence for setup flows where each task needs room for one decision.",
      content: (
        <div className="w-full max-w-md rounded-md border bg-card p-4">
          <span className="font-mono text-[10px] text-muted-foreground">step 02 / 03</span>
          <p className="mt-2 text-sm font-medium">Connect your repository</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Pick the codebase to scan. You can change access later from workspace settings.
          </p>
          <div className="mt-4 h-1 rounded-full bg-muted">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
        </div>
      ),
    },
    {
      id: "carousel-release-notes",
      title: "Release notes",
      description: "A practical way to keep related changes readable without turning a changelog into a long wall of text.",
      content: (
        <div className="w-full max-w-md divide-y divide-dashed overflow-hidden rounded-md border bg-card">
          {[
            ["New", "Saved filters now sync between sessions."],
            ["Improved", "Exports retain the active date range."],
            ["Fixed", "Keyboard focus no longer skips the table toolbar."],
          ].map(([label, detail]) => (
            <div key={label} className="flex gap-3 px-4 py-3">
              <span className="mt-0.5 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{label}</span>
              <p className="text-xs leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "carousel-customer-stories",
      title: "Customer stories",
      description: "Give each quote enough breathing room while preserving a controlled browsing rhythm.",
      content: (
        <figure className="w-full max-w-md rounded-md border border-primary/20 bg-primary/5 p-4">
          <blockquote className="text-sm leading-relaxed">
            “The first useful dashboard we have had: it tells us what changed without making us hunt for it.”
          </blockquote>
          <figcaption className="mt-3 font-mono text-[10px] text-muted-foreground">
            — Operations lead, B2B SaaS team
          </figcaption>
        </figure>
      ),
    },
  ];
}

function progressBarsExamples(): CarouselItem[] {
  const milestones = [
    { id: "research", label: "research", value: 86 },
    { id: "prototype", label: "prototype", value: 62 },
    { id: "release", label: "release", value: 34 },
  ];

  return [
    {
      id: "progress-bars-horizontal",
      title: "Compact rows",
      description: "A horizontal layout keeps status lists easy to scan in dense surfaces.",
      content: <ProgressBars items={milestones} orientation="horizontal" />,
    },
    {
      id: "progress-bars-dots",
      title: "Dot fill",
      description: "The same bars filled with a matrix of dots rather than etched rules.",
      content: <DotProgressExample />,
    },
    {
      id: "progress-bars-without-scale",
      title: "Unscaled vertical rhythm",
      description: "Hide the axis when relative progress matters more than exact chart reading.",
      content: <ProgressBars items={milestones} showScale={false} height={180} />,
    },
    {
      id: "progress-bars-capacity",
      title: "Capacity allocation",
      description: "Use a different maximum and formatter for hours, seats, credits, or any bounded unit.",
      content: <ProgressBarsCapacityExample />,
    },
  ];
}

function askAiExamples(): CarouselItem[] {
  return [
    {
      id: "portfolio-intro",
      title: "Portfolio introduction",
      description:
        "Full-sized launcher with a prompt asking the AI to introduce your background, stack, and notable work.",
      content: (
        <div className="flex h-48 w-full items-center justify-center">
          <AskAI
            prompt="Hi! I'm on Aditya Ojha's portfolio (https://akoder.xyz). Based on this page, introduce him: what he builds, his stack, and what he is looking for."
            title="ask an ai about me"
            description="a fresh perspective, from your favorite assistant."
            side="bottom"
          />
        </div>
      ),
    },
    {
      id: "compact-trigger",
      title: "Compact trigger",
      description:
        "Tighter dimensions suitable for embedding in headers, toolbars, or floating navigation strips.",
      content: (
        <div className="flex h-48 w-full items-center justify-center">
          <AskAI
            size="compact"
            prompt="summarize this repository's technical architecture and core design patterns."
            label="ask ai"
            title="repository overview"
            side="bottom"
          />
        </div>
      ),
    },
    {
      id: "case-study-query",
      title: "Project case study",
      description:
        "Contextual prompt tailored for deep-dive case studies and technical architecture reviews.",
      content: (
        <div className="flex h-48 w-full items-center justify-center">
          <AskAI
            prompt="analyze the architectural decisions and trade-offs made in this project. What are the key highlights?"
            label="ask about this project"
            title="deep dive"
            description="get a comprehensive breakdown of the technical decisions."
            side="bottom"
          />
        </div>
      ),
    },
  ];
}

/** Examples per component id. Add an entry here when a component ships examples. */
const exampleRegistry: Record<string, () => CarouselItem[]> = {
  "ask-ai": askAiExamples,
  "dotted-world-map": dottedWorldMapExamples,
  "copy-command-block": copyCommandBlockExamples,
  "github-map": githubMapExamples,
  "project-explorer": projectExplorerExamples,
  "carousel": carouselExamples,
  "progress-bars": progressBarsExamples,
};

/**
 * Server component that renders the examples section for a component.
 */
export function ComponentExamples({ id }: { id: string }) {
  const buildExamples = exampleRegistry[id];
  if (!buildExamples) return null;

  const items = buildExamples();
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="component-examples"
      className="border-t border-dashed py-8"
    >
      <div className="mb-6 space-y-1 px-6">
        <h2 id="component-examples" className="text-sm font-medium">
          examples
        </h2>
        <p className="text-sm text-muted-foreground">
          Explore different presets, palettes, and configurations.
        </p>
      </div>
      <Carousel items={items} ariaLabel={`${id} examples`} />
    </section>
  );
}
