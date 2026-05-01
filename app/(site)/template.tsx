import type { ReactNode } from "react";

/**
 * `(site)` segment template - stays a thin shell because **AnimatePresence for
 * page exit must live under the persistent `(site)` layout** (`SiteChrome`):
 * templates remount every navigation and would wipe exit state instantly.
 *
 * Entrance timing still lives per route (e.g. `menu/menu-content.tsx`).
 */
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return children;
}
