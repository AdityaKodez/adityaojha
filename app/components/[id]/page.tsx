import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import rehypePrettyCode from "rehype-pretty-code";
import { MarkdownAsync } from "react-markdown";

import { findComponent, getEnabledComponents } from "@/config/components";
import { siteConfig } from "@/config/site";
import { highlightCode } from "@/lib/highlight";
import { DottedWorldMapDemo } from "./demos/dotted-world-map-demo";
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
      title: component.title,
      description: component.description,
      siteName: siteConfig.meta.shortTitle,
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
  const demoSourcePath = path.join(root, component.demoPath);
  const [demoRaw, docsMd] = await Promise.all([
    readFile(demoSourcePath, "utf8"),
    readFile(path.join(root, component.docPath), "utf8"),
  ]);
  const highlighted = await highlightCode(demoRaw, "tsx");

  // MarkdownAsync is async-only — await it here so the JSX tree can render the element directly.
  const renderedDocs = await MarkdownAsync({
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

  return (
    <main
      id={`component-${component.id}`}
      className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-[env(safe-area-inset-top)] pb-12"
    >
      {/* Back link */}
      <div className="px-6 pt-6">
        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All components
        </Link>
      </div>

      {/* Title bar */}
      <h1 className="section-heading">{component.title}</h1>

      {/* Description */}
      <div className="px-6 mt-3">
        <p className="text-md text-muted-foreground leading-relaxed">
          {component.description}
        </p>
      </div>

      {/* Preview / Code box — the demo component is rendered lazily by the page body. */}
      <PreviewBox
        ariaLabel={`${component.title} preview`}
        preview={<ComponentDemo id={component.id} />}
        codeHtml={highlighted}
        rawCode={demoRaw}
      />

      {/* Docs below */}
      <div className="border-t border-dashed prose prose-neutral dark:prose-invert max-w-none px-6 py-6 [&_a]:text-primary [&_code]:text-foreground [&_table]:w-full">
        {renderedDocs}
      </div>
    </main>
  );
}

/**
 * Server component that picks the right demo based on the registry id.
 * Statically imports every demo so the bundler can include them all; the
 * switch is cheap because each demo is a leaf component.
 */
function ComponentDemo({ id }: { id: string }) {
  switch (id) {
    case "dotted-world-map":
      return <DottedWorldMapDemo />;
    default:
      return (
        <div className="text-sm text-muted-foreground">
          No demo registered for &ldquo;{id}&rdquo;.
        </div>
      );
  }
}
