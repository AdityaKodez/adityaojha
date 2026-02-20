import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.meta.sitemap.map((item) => ({
    ...item,
    lastModified: new Date(),
  }));
}
