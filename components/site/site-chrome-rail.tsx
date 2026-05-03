import type { ReactNode } from "react";
import {
  SITE_CONTENT_EDGE_X_CLASS,
  SITE_CONTENT_RAIL_BOX_CLASS,
} from "@/lib/site-layout";
import { cn } from "@/lib/utils";

export type SiteChromeRailProps = {
  children: ReactNode;
  /** Outer layer — viewport horizontal inset on full-bleed sections. */
  className?: string;
  /** Inner rail — constrained width centered; matches fixed header chrome. */
  railClassName?: string;
};

/**
 * Two-layer layout matching fixed header nesting: horizontal edge inset,
 * then the shared max-width rail (`SITE_CONTENT_RAIL_BOX_CLASS` in site-layout.ts).
 */
export default function SiteChromeRail({
  children,
  className,
  railClassName,
}: SiteChromeRailProps) {
  return (
    <div className={cn(SITE_CONTENT_EDGE_X_CLASS, className)}>
      <div className={cn(SITE_CONTENT_RAIL_BOX_CLASS, railClassName)}>{children}</div>
    </div>
  );
}
