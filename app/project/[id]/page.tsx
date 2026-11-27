import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { markdownComponents } from "@/lib/markdown/markdown-components";
import { getNpmWeeklyDownloads } from "@/lib/npm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownAsync } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProjectContent } from "./project-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  return projectsConfig.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const project = projectsConfig.find((p) => p.id === resolvedParams.id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const url = `${siteConfig.meta.url}/project/${project.id}`;
  const title = `${project.title}: ${project.tagline}`;

  return {
    title,
    description: project.description,
    keywords: [
      ...siteConfig.meta.keywords,
      ...project.tags,
      "portfolio project",
      "developer project",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description: project.description,
      siteName: siteConfig.meta.shortTitle,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      creator: siteConfig.meta.twitterCreator,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const project = projectsConfig.find(
    (p) => p.id === resolvedParams.id && p.enabled !== false,
  );

  if (!project) {
    notFound();
  }

  const [weeklyDownloads, renderedContent] = await Promise.all([
    project.npmPackage
      ? getNpmWeeklyDownloads(project.npmPackage)
      : Promise.resolve(null),
    project.content
      ? MarkdownAsync({
          remarkPlugins: [remarkGfm],
          components: markdownComponents,
          children: project.content,
        })
      : Promise.resolve(null),
  ]);

  return (
    <ProjectContent
      project={project}
      weeklyDownloads={weeklyDownloads}
      renderedContent={renderedContent}
    />
  );
}
