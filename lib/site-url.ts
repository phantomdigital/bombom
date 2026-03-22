/**
 * Canonical production origin (no trailing slash).
 * Use NEXT_PUBLIC_SITE_URL in .env.local when developing (e.g. http://localhost:3000).
 */
export const SITE_URL_PRODUCTION = "https://bombomtreats.com.au";

/**
 * Public site URL for metadata, sitemap, robots, canonicals, and absolute links.
 */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return SITE_URL_PRODUCTION;
}

/**
 * True when the configured public URL is a local dev host (not production).
 */
export function isPublicSiteUrlLocalhost(): boolean {
  try {
    const { hostname } = new URL(getPublicSiteUrl());
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}
