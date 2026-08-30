import { getEnabledComponents } from "@/config/components";
import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseEntries = siteConfig.meta.sitemap.map((item) => ({
    ...item,
    lastModified: new Date(),
  }));

  const componentEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.meta.url}/components`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...getEnabledComponents().map((c) => ({
      url: `${siteConfig.meta.url}/components/${c.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...baseEntries, ...componentEntries];
}
