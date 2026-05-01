import type { ReactNode } from "react";
import SiteChrome from "@/components/site/site-chrome";

/**
 * Layout shared by every route under the `(site)` route group. Site chrome
 * stays outside `template.tsx` so route transitions wipe only below the header.
 *
 * Overlay z-index stays below {@link SiteHeader}; content lives in
 * `{children}`, which is wrapped per navigation by `(site)/template.tsx`.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
