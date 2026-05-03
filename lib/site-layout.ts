/**
 * Site chrome layout — single place to tune content width/inset vs the fixed header.
 *
 * Header: `<header SITE_HEADER_SHELL_CLASS>` wraps `<div SITE_CONTENT_RAIL_BOX_CLASS>`.
 * Body: use `SiteChromeRail` from `components/site/site-chrome-rail.tsx` for the same
 * horizontal inset + max-width as that inner header rail.
 */

/** Horizontal inset only; matches mobile fixed rails, then desktop header/content chrome. */
export const SITE_CONTENT_EDGE_X_CLASS =
  "px-[1rem] min-[1301px]:px-[2.7rem]";

/**
 * Centered content rail (same inner wrapper as fixed header chrome).
 * **Edit `max-w-[…]` here** to dial site-wide content width everywhere.
 */
export const SITE_CONTENT_RAIL_BOX_CLASS = "mx-auto w-full max-w-[97rem]";

/** Fixed header outer shell — top + horizontal inset; mobile rails are fixed 1rem from edges. */
export const SITE_HEADER_SHELL_CLASS =
  "px-[1rem] pt-[1rem] pb-0 min-[1301px]:px-[1.9rem] min-[1301px]:pt-[1.9rem]";

/** Alias — same string as SITE_HEADER_SHELL_CLASS. */
export const SITE_HEADER_GUTTER_CLASS = SITE_HEADER_SHELL_CLASS;

/**
 * Full fixed header footprint (border box height in `px`) — synced to `:root` by
 * `ResizeObserver` in `SiteHeader`. Use CSS `padding-top: var(...)`.
 */
export const SITE_HEADER_TOTAL_HEIGHT_VAR = "--site-header-total-height";

/** Until measured (SSR / no header). Keep loosely aligned with `SITE_HEADER_SHELL_CLASS` hero row. */
export const SITE_HEADER_TOTAL_HEIGHT_FALLBACK = "12.5rem";

/** @deprecated Prefer SITE_CONTENT_RAIL_BOX_CLASS */
export const SITE_CHROME_FULL_WIDTH_CLASS = SITE_CONTENT_RAIL_BOX_CLASS;

/** @deprecated Prefer SITE_CONTENT_EDGE_X_CLASS */
export const SITE_CHROME_HORIZONTAL_GUTTER_CLASS = SITE_CONTENT_EDGE_X_CLASS;
