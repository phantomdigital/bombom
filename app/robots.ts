import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

const siteUrl = getPublicSiteUrl();
const siteOpen = process.env.SITE_OPEN === "true";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteOpen
      ? { userAgent: "*", allow: "/", disallow: [] }
      : {
          userAgent: "*",
          // Disallow "/" but allow what crawlers need to index and render /coming-soon.
          allow: ["/coming-soon", "/coming-soon/", "/sitemap.xml", "/_next/"],
          disallow: "/",
        },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
