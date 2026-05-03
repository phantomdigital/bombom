"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  SITE_HEADER_ORDER_NOW_PILL_SYNC_CLASSNAME,
  useSiteHeaderOrderNowChrome,
} from "@/components/site/site-header-order-now-chrome-context";
import SiteChromeRail from "@/components/site/site-chrome-rail";
import { useSitePageTransition } from "@/components/site/site-page-transition-context";
import { useSitePageSurfaceSetter } from "@/components/site/site-page-surface-context";
import { Button } from "@/components/ui/button";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";
import { cn } from "@/lib/utils";

type SitePlaceholderContentProps = {
  eyebrow?: string;
  title: string;
  href: string;
  label: string;
  buttonClassName: string;
  /**
   * When true, CTA uses the same seam-aware fill + label colors as the header
   * Order now pill (when available).
   */
  syncOrderNowChromeWithHeader?: boolean;
  /**
   * When true (e.g. `(site)` not-found), use ink tuned for marble / light shell.
   */
  notFoundShellTypography?: boolean;
  sectionClassName?: string;
  pageSurfaceHex?: string;
};

export default function SitePlaceholderContent({
  eyebrow,
  title,
  href,
  label,
  buttonClassName,
  syncOrderNowChromeWithHeader = false,
  notFoundShellTypography = false,
  sectionClassName,
  pageSurfaceHex,
}: SitePlaceholderContentProps) {
  const reduceMotion = useReducedMotion();
  const { isContentRevealed } = useSitePageTransition();
  const orderNowChrome = useSiteHeaderOrderNowChrome();
  const setPageSurfaceHex = useSitePageSurfaceSetter();
  const isVisible = reduceMotion || isContentRevealed;

  const useHeaderChrome =
    syncOrderNowChromeWithHeader && orderNowChrome !== null;

  const marbleNotFound = notFoundShellTypography;

  useEffect(() => {
    if (!setPageSurfaceHex || !pageSurfaceHex) return;
    setPageSurfaceHex(pageSurfaceHex);
    return () => setPageSurfaceHex(null);
  }, [pageSurfaceHex, setPageSurfaceHex]);

  return (
    <motion.section
      className={cn(
        "min-h-[100dvh]",
        sectionClassName,
        !isVisible && "pointer-events-none select-none"
      )}
      aria-hidden={!isVisible}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : isVisible
            ? {
                duration: SITE_PAGE_TRANSITION.contentRevealDurationS,
                ease: SITE_PAGE_TRANSITION.contentRevealEase,
                opacity: {
                  duration: SITE_PAGE_TRANSITION.contentRevealDurationS * 0.95,
                },
              }
            : { duration: 0 }
      }
    >
      <SiteChromeRail railClassName="flex min-h-[100dvh] flex-col items-center justify-center gap-8 pb-20 pt-12 text-center sm:pt-26">
        {eyebrow ? (
          <p
            className={cn(
              "font-mono text-xs font-bold uppercase tracking-[0.28em]",
              marbleNotFound ? "text-bom-black/65" : "text-bom-black/70"
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-sans text-4xl font-medium tracking-tight text-bom-black sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p
          className={cn(
            "max-w-xl font-sans text-base leading-relaxed sm:text-lg",
            marbleNotFound ? "text-bom-black/75" : "text-bom-black/80"
          )}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris.
        </p>
        <Button
          variant="bomPill"
          size="bomPill"
          asChild
          className={cn(
            useHeaderChrome
              ? cn(
                  SITE_HEADER_ORDER_NOW_PILL_SYNC_CLASSNAME,
                  "w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
                )
              : buttonClassName
          )}
        >
          <Link
            href={href}
            tabIndex={isVisible ? undefined : -1}
            style={
              useHeaderChrome
                ? {
                    transitionProperty: "filter",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    background: orderNowChrome.fill,
                    color: orderNowChrome.foreground,
                  }
                : undefined
            }
          >
            <span>{label}</span>
          </Link>
        </Button>
      </SiteChromeRail>
    </motion.section>
  );
}
