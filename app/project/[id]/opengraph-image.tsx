import { openGraphConfig } from "@/config/opengraph";
import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { getOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og/card";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const alt = "A project case study by Aditya Ojha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projectsConfig
    .filter((project) => project.enabled !== false)
    .map((project) => ({ id: project.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projectsConfig.find(
    (project) => project.id === id && project.enabled !== false,
  );
  if (!project) notFound();

  return new ImageResponse(
    <OgCard
      eyebrow={openGraphConfig.routes.project.eyebrow}
      title={project.title}
      description={project.description}
      footer={`${new URL(siteConfig.meta.url).host}/project/${project.id}`}
    />,
    { ...OG_SIZE, fonts: getOgFonts() },
  );
}
