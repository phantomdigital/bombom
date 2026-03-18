import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bombomtreats.com.au";
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
