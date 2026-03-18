import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bombom.au";
const siteOpen = process.env.SITE_OPEN === "true";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteOpen
      ? { userAgent: "*", allow: "/", disallow: [] }
      : { userAgent: "*", allow: "/coming-soon", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
