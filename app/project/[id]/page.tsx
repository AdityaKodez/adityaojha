import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectContent } from "./project-content";

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

  return <ProjectContent project={project} />;
}
