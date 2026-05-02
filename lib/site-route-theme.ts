/**
 * Per-route theme colours for `(site)` wipes and viewport backdrop.
 *
 * Each entry's `match` is a pathname prefix. Order matters: the first entry
 * whose `match` is a prefix of the current pathname wins, so list more
 * specific routes before their parents.
 *
 * `css` - use in arbitrary CSS / tokens (`var(--color-bom-*)`) from `app/globals.css`.
 * `hex` - duplicates that token for Framer Motion colour tweening (variables do not interpolate well).
 */

export type SitePalette = {
  css: string;
  hex: string;
};

export type SiteRouteThemeEntry = {
  match: string;
  palette: SitePalette;
};

export const SITE_ROUTE_THEME: SiteRouteThemeEntry[] = [
  {
    match: "/home",
    palette: {
      css: "var(--color-bom-ice)",
      hex: "#91c4ff",
    },
  },
  {
    match: "/menu",
    palette: {
      css: "var(--color-bom-musk)",
      hex: "#f7b7d3",
    },
  },
  {
    match: "/locations",
    palette: {
      css: "var(--color-bom-lemon)",
      hex: "#fad100",
    },
  },
  {
    match: "/specials",
    palette: {
      css: "var(--color-bom-orange)",
      hex: "#ff7040",
    },
  },
  {
    match: "/story",
    palette: {
      css: "var(--color-bom-violet)",
      hex: "#6968de",
    },
  },
  {
    match: "/about",
    palette: {
      css: "var(--color-bom-violet)",
      hex: "#6968de",
    },
  },
];

const DEFAULT_PALETTE: SitePalette = {
  css: "var(--color-bom-dark-blue)",
  hex: "#2665d6",
};

export function getSitePalette(
  pathname: string | null | undefined
): SitePalette {
  if (!pathname) return DEFAULT_PALETTE;
  for (const entry of SITE_ROUTE_THEME) {
    if (pathname === entry.match || pathname.startsWith(`${entry.match}/`)) {
      return entry.palette;
    }
  }
  return DEFAULT_PALETTE;
}

/** Prefer {@link getSitePalette}; returns the CSS token for non-motion use. */
export function getSiteRouteColor(pathname: string | null | undefined): string {
  return getSitePalette(pathname).css;
}
