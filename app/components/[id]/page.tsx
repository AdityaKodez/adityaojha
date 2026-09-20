import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MarkdownAsync } from "react-markdown";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { getComponentIcon } from "@/components/showcase/component-icons";
import { InstallCommand } from "@/components/showcase/copy-block";
import { ManualInstall } from "@/components/showcase/manual-install";
import { HomeSectionRail } from "@/components/landing/home-section-rail";
import { markdownComponents } from "@/lib/markdown/markdown-components";
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
import { getAddCommands } from "@/config/registry";
import { siteConfig } from "@/config/site";
import { highlightCode } from "@/lib/highlight";
import { ComponentDemo } from "@/components/showcase/component-demo";
import { ComponentExamples } from "./demos/examples";
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
    },
    twitter: {
      card: "summary_large_image",
      title: component.title,
      description: component.description,
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
          icon: (
            <span className="relative inline-flex">
              <Icon className="h-4 w-4" />
              {c.new && (
                <span
                  className="absolute -top-1.5 -right-1.5 size-2 rounded-full bg-sky-500 ring-2 ring-background"
                  aria-label="New component"
                />
              )}
            </span>
          ),
        },
      };
    }),
  ];

  return (
    <>
    <HomeSectionRail items={railItems} activeId={component.id} />
    <main
      id={`component-${component.id}`}
      className="relative flex min-h-dvh flex-col gap-y-4 overflow-x-clip border-x border-b-2 bg-background pt-14 pb-12"
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
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          The{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            @akoder
          </code>{" "}
          namespace ships with the shadcn CLI, so there is nothing to configure
          first. Install any other component the same way from the{" "}
          <Link
            href="/components"
            className="text-foreground underline decoration-dashed underline-offset-4 transition-colors hover:text-primary"
          >
            components page
          </Link>.
        </p>
      </section>

      {/* Docs — usage, props, notes. */}
      <div className="border-t border-dashed prose prose-neutral dark:prose-invert max-w-none px-6 py-6 [&_a]:text-primary [&_code]:text-foreground [&_table]:w-full">
        {renderedDocs}
      </div>

      {/* Manual installation — dependencies and the actual source, from registry.json. */}
      <ManualInstall
        componentId={component.id}
        componentTitle={component.title}
      />

      {/* Examples carousel */}
      <ComponentExamples id={component.id} />
    </main>
    </>
  );
}

