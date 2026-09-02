import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MarkdownAsync } from "react-markdown";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { getComponentIcon } from "@/components/component-icons";
import { CopyBlock, InstallCommand } from "@/components/copy-block";
import { HomeSectionRail } from "@/components/home-section-rail";
import { markdownComponents } from "@/components/markdown-components";
import type { RailItem } from "@/components/section-rail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { findComponent, getEnabledComponents } from "@/config/components";
import {
  getAddCommands,
  getRegistrySetupSnippet,
  registryConfig,
} from "@/config/registry";
import { siteConfig } from "@/config/site";
import { highlightCode } from "@/lib/highlight";
import { CarouselDemo } from "./demos/carousel-demo";
import { ContactChannelsDemo } from "./demos/contact-channels-demo";
import { CopyCommandBlockDemo } from "./demos/copy-command-block-demo";
import { DottedWorldMapDemo } from "./demos/dotted-world-map-demo";
import { ComponentExamples } from "./demos/examples";
import { GitHubMapDemo } from "./demos/github-map-demo";
import { InfiniteSliderDemo } from "./demos/infinite-slider-demo";
import { InteractiveSkillCloudDemo } from "./demos/interactive-skill-cloud-demo";
import { ModeTogglerDemo } from "./demos/mode-toggler-demo";
import { ProgressiveBlurDemo } from "./demos/progressive-blur-demo";
import { ProjectExplorerDemo } from "./demos/project-explorer-demo";
import { SectionRailDemo } from "./demos/section-rail-demo";
import { PreviewBox } from "./preview-box";

export async function generateStaticParams() {
  return getEnabledComponents().map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const component = findComponent(id);
  if (!component) {
    return { title: "Component Not Found" };
  }
  const url = `${siteConfig.meta.url}/components/${component.id}`;
  return {
    title: component.title,
    description: component.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${component.title} — aditya ojha`,
      description: component.description,
      siteName: siteConfig.meta.shortTitle,
      images: [siteConfig.meta.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: component.title,
      description: component.description,
      images: [siteConfig.meta.ogImage.url],
    },
  };
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const component = findComponent(id);
  if (!component) {
    notFound();
  }

  const root = process.cwd();

  // Demo source (raw + syntax-highlighted HTML).
  const demoSourcePath = path.join(/*turbopackIgnore: true*/ root, component.demoPath);
  const [demoRaw, docsMd] = await Promise.all([
    readFile(demoSourcePath, "utf8"),
    readFile(path.join(/*turbopackIgnore: true*/ root, component.docPath), "utf8"),
  ]);
  const highlighted = await highlightCode(demoRaw, "tsx");

  // MarkdownAsync is async-only — await it here so the JSX tree can render the element directly.
  const renderedDocs = await MarkdownAsync({
    remarkPlugins: [remarkGfm],
    components: markdownComponents,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            light: "github-light",
            dark: "github-dark-dimmed",
          },
          keepBackground: false,
          defaultLang: { block: "tsx" },
        },
      ],
    ],
    children: docsMd,
  });

  const railItems: RailItem[] = [
    ...getEnabledComponents().map((c) => {
      const Icon = getComponentIcon(c.icon);
      return {
        id: c.id,
        label: c.title,
        href: `/components/${c.id}`,
        card: {
          title: c.title,
          description: c.description,
          icon: <Icon className="h-4 w-4" />,
        },
      };
    }),
  ];

  return (
    <>
    <HomeSectionRail items={railItems} activeId={component.id} />
    <main
      id={`component-${component.id}`}
      className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-14 pb-12"
    >
      {/* Breadcrumb */}
      <div className="px-6 pt-4 border-t border-dashed">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/components">Components</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{component.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Title bar */}
      <h1 className="section-heading">{component.title}</h1>

      {/* Description */}
      <div className="px-6 mt-3">
        <p className="text-base text-muted-foreground leading-relaxed">
          {component.description}
        </p>
      </div>

      {/* Preview / Code box */}
      <PreviewBox
        componentId={component.id}
        ariaLabel={`${component.title} preview`}
        preview={<ComponentDemo id={component.id} />}
        codeHtml={highlighted}
        rawCode={demoRaw}
      />

      {/* Installation — registry CLI command */}
      <section className="border-t border-dashed px-6 py-6">
        <h2 className="text-base font-medium tracking-tight">Installation</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {component.title} is published as a shadcn registry item. The CLI
          drops the file into your project, installs its dependencies, and adds
          any primitives it relies on.
        </p>
        <InstallCommand
          className="mt-4"
          componentId={component.id}
          location="component_detail_page"
          commands={getAddCommands(component.id)}
        />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          First time? Register the{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            {registryConfig.namespace}
          </code>{" "}
          namespace once in{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            components.json
          </code>{" "}
          and every component installs by name.
        </p>
        <CopyBlock
          className="mt-2"
          value={getRegistrySetupSnippet()}
          copyLabel="copy registry config"
        />
      </section>

      {/* Docs — usage, props, notes. */}
      <div className="border-t border-dashed prose prose-neutral dark:prose-invert max-w-none px-6 py-6 [&_a]:text-primary [&_code]:text-foreground [&_table]:w-full">
        {renderedDocs}
      </div>

      {/* Examples carousel */}
      <ComponentExamples id={component.id} />
    </main>
    </>
  );
}

/**
 * Server component that picks the right demo based on the registry id.
 */
function ComponentDemo({ id }: { id: string }) {
  switch (id) {
    case "dotted-world-map":
      return <DottedWorldMapDemo />;
    case "copy-command-block":
      return <CopyCommandBlockDemo />;
    case "github-map":
      return <GitHubMapDemo />;
    case "project-explorer":
      return <ProjectExplorerDemo />;
    case "carousel":
      return <CarouselDemo />;
    case "infinite-slider":
      return <InfiniteSliderDemo />;
    case "mode-toggler":
      return <ModeTogglerDemo />;
    case "progressive-blur":
      return <ProgressiveBlurDemo />;
    case "interactive-skill-cloud":
      return <InteractiveSkillCloudDemo />;
    case "contact-channels":
      return <ContactChannelsDemo />;
    case "section-rail":
      return <SectionRailDemo />;
    default:
      return (
        <div className="text-sm text-muted-foreground">
          No demo registered for &ldquo;{id}&rdquo;.
        </div>
      );
  }
}
