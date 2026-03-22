import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

const siteUrl = getPublicSiteUrl();
const siteOpen = process.env.SITE_OPEN === "true";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/coming-soon`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
  if (siteOpen) {
    urls.unshift({
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }
  return urls;
}
