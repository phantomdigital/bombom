import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

const siteUrl = getPublicSiteUrl();
const siteOpen = process.env.SITE_OPEN === "true";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteOpen
      ? { userAgent: "*", allow: "/", disallow: [] }
      : { userAgent: "*", allow: "/coming-soon", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
