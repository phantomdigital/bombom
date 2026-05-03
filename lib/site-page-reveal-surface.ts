import { getSitePalette, type SitePalette } from "@/lib/site-route-theme";

/**
 * Final “page paint” behind {@link SiteChrome} children (hero / sectionClassName),
 * not the route wipe colour. Used to avoid invisible wipes when the destination
 * wipe matches what the user is already sitting on.
 */
export type SiteRevealSurfaceEntry = {
  match: string;
  surface: SitePalette;
  includeChildren?: boolean;
};

const ICE_SURFACE: SitePalette = {
  css: "var(--color-bom-ice)",
  hex: "#91c4ff",
};

const MARBLE_SURFACE: SitePalette = {
  css: "var(--color-bom-marble)",
  hex: "#f3f3f1",
};

export const SITE_PAGE_REVEAL_SURFACES: SiteRevealSurfaceEntry[] = [
  { match: "/home", surface: ICE_SURFACE },
  {
    match: "/menu",
    surface: { css: "var(--color-bom-musk)", hex: "#f7b7d3" },
  },
  {
    match: "/locations",
    surface: { css: "var(--color-bom-lemon)", hex: "#fad100" },
  },
  {
    match: "/specials",
    surface: { css: "var(--color-bom-orange)", hex: "#ff7040" },
  },
  { match: "/story", surface: MARBLE_SURFACE },
  {
    match: "/about",
    surface: { css: "var(--color-bom-violet)", hex: "#6968de" },
  },
];

/** Matches unthemed / 404 placeholders (`sectionClassName="bg-bom-marble"`). */
export function getSitePageRevealSurface(
  pathname: string | null | undefined
): SitePalette {
  if (!pathname) return MARBLE_SURFACE;
  for (const entry of SITE_PAGE_REVEAL_SURFACES) {
    if (
      pathname === entry.match ||
      (entry.includeChildren && pathname.startsWith(`${entry.match}/`))
    ) {
      return entry.surface;
    }
  }
  return MARBLE_SURFACE;
}

function normalizePaletteHex(hex: string): string {
  let t = hex.trim().toLowerCase();
  if (!t.startsWith("#")) {
    t = `#${t}`;
  }
  return t;
}

/** Compare hex ignoring case / stray whitespace. */
function paletteHexLooksEqual(a: string, b: string): boolean {
  return normalizePaletteHex(a) === normalizePaletteHex(b);
}

/**
 * Wipe overlay colour for a hop `from → to`: route wipe from {@link getSitePalette}
 * unless it matches the departing page reveal surface — then use arriving surface
 * (the “destination page bg”) so the cover registers against what you leave.
 */
export function getSiteCoverHex(
  fromPathname: string | null | undefined,
  toPathname: string | null | undefined
): string {
  if (!toPathname) return getSitePalette(undefined).hex;
  const wipe = getSitePalette(toPathname).hex;
  const leaving = getSitePageRevealSurface(fromPathname).hex;
  const arriving = getSitePageRevealSurface(toPathname).hex;
  if (
    paletteHexLooksEqual(wipe, leaving) &&
    !paletteHexLooksEqual(wipe, arriving)
  ) {
    return arriving;
  }
  return wipe;
}
