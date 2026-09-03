import { getEnabledComponents } from "@/config/components";
import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
const defaultDate = new Date();


  const baseEntries = siteConfig.meta.sitemap.map((item) => ({
    ...item,
    lastModified: defaultDate,
  }));

  const componentEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.meta.url}/components`,
      lastModified: defaultDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...getEnabledComponents().map((c) => ({
      url: `${siteConfig.meta.url}/components/${c.id}`,
      lastModified: defaultDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const projectEntries: MetadataRoute.Sitemap = projectsConfig
    .filter((p) => p.enabled !== false)
    .map((p) => ({
      url: `${siteConfig.meta.url}/project/${p.id}`,
      lastModified: new Date(`${p.year}-01-01T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...baseEntries, ...componentEntries, ...projectEntries];
}
