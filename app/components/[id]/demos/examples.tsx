import { Carousel, type CarouselItem } from "@/components/ui/carousel";
import { DottedWorldMap } from "@/components/ui/dotted-world-map";
import { CopyCommandBlock } from "@/components/ui/copy-command-block";
import { ProjectExplorer } from "@/components/project-explorer";
import { projectsConfig } from "@/config/projects";
import {
  contributorActivitySources,
  edgeRegionTrafficSources,
  worldPopulationHeatSources,
} from "@/config/world-cities";

import { weeklyVisitors } from "./dotted-world-map-demo";
import { GitHubCalendarExample } from "./github-map-demo";

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
      title: "Standalone Git Command",
      description: "Single-line shell command without tabs.",
      content: (
        <div className="w-full max-w-md">
          <CopyCommandBlock command="git checkout -b feature/registry-blocks" />
        </div>
      ),
    },
    {
      id: "shadcn-add",
      title: "Universal Shadcn Add",
      description: "Dynamic runner resolver for npm, pnpm, yarn, and bun.",
      content: (
        <div className="w-full max-w-md">
          <CopyCommandBlock
            commands={{
              npm: "npx shadcn@latest add @akoder/dotted-world-map",
              pnpm: "pnpm dlx shadcn@latest add @akoder/dotted-world-map",
              yarn: "yarn dlx shadcn@latest add @akoder/dotted-world-map",
              bun: "bunx --bun shadcn@latest add @akoder/dotted-world-map",
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
      title: "GitHub Classic Emerald",
      description: "Traditional 5-tier GitHub green heat scale.",
      content: <GitHubCalendarExample colors={GITHUB_GREENS} />,
    },
    {
      id: "github-violet",
      title: "Amethyst Violet Ramp",
      description: "Vibrant purple gradient for dark theme accents.",
      content: <GitHubCalendarExample colors={VIOLET_RAMP} />,
    },
    {
      id: "github-amber",
      title: "Sunset Amber Heat",
      description: "Warm golden glow for high-energy activity milestones.",
      content: <GitHubCalendarExample colors={AMBER_RAMP} />,
    },
    {
      id: "github-blue",
      title: "Sky Cyan Gradient",
      description: "Cool blue hues for modern dashboard layouts.",
      content: <GitHubCalendarExample colors={BLUE_RAMP} />,
    },
  ];
}

function projectExplorerExamples(): CarouselItem[] {
  return [
    {
      id: "project-explorer-latest",
      title: "Latest Work First",
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
      title: "No Hover Preview",
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
      title: "Full Project Archive",
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
      title: "Onboarding Steps",
      description: "A concise sequence for setup flows where each task needs room for one decision.",
      content: (
        <div className="w-full max-w-md rounded-md border bg-card p-4">
          <span className="font-mono text-[10px] text-muted-foreground">STEP 02 / 03</span>
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
      title: "Release Notes",
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
      title: "Customer Stories",
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

/** Examples per component id. Add an entry here when a component ships examples. */
const exampleRegistry: Record<string, () => CarouselItem[]> = {
  "dotted-world-map": dottedWorldMapExamples,
  "copy-command-block": copyCommandBlockExamples,
  "github-map": githubMapExamples,
  "project-explorer": projectExplorerExamples,
  "carousel": carouselExamples,
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
          Examples
        </h2>
        <p className="text-sm text-muted-foreground">
          Explore different presets, palettes, and configurations.
        </p>
      </div>
      <Carousel items={items} ariaLabel={`${id} examples`} />
    </section>
  );
}
