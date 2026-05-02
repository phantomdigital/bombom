"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  SITE_HEADER_ORDER_NOW_PILL_SYNC_CLASSNAME,
  useSiteHeaderOrderNowChrome,
} from "@/components/site/site-header-order-now-chrome-context";
import { useSitePageTransition } from "@/components/site/site-page-transition-context";
import { Button } from "@/components/ui/button";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";
import { siteBackdropIsDefaultDarkBlue } from "@/lib/site-route-theme";
import { cn } from "@/lib/utils";

const sectionShellClass =
  "mx-auto flex w-full min-h-[100dvh] max-w-5xl flex-col items-center justify-center gap-8 px-5 pb-20 pt-12 text-center sm:px-10 sm:pt-44 lg:px-16";

type SitePlaceholderContentProps = {
  eyebrow: string;
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
   * When true (e.g. `(site)` not-found), heading/description adapt when the shell
   * is default dark blue (unknown routes).
   */
  notFoundShellTypography?: boolean;
};

export default function SitePlaceholderContent({
  eyebrow,
  title,
  href,
  label,
  buttonClassName,
  syncOrderNowChromeWithHeader = false,
  notFoundShellTypography = false,
}: SitePlaceholderContentProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { isContentRevealed } = useSitePageTransition();
  const orderNowChrome = useSiteHeaderOrderNowChrome();
  const isVisible = reduceMotion || isContentRevealed;

  const useHeaderChrome =
    syncOrderNowChromeWithHeader && orderNowChrome !== null;

  const darkBlueNotFound =
    notFoundShellTypography && siteBackdropIsDefaultDarkBlue(pathname);

  return (
    <motion.section
      className={cn(
        sectionShellClass,
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
      <p
        className={cn(
          "font-mono text-xs font-bold uppercase tracking-[0.28em]",
          darkBlueNotFound ? "text-bom-white/75" : "text-bom-black/70"
        )}
      >
        {eyebrow}
      </p>
      <h1
        className={cn(
          "font-sans text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl",
          darkBlueNotFound ? "text-bom-lime" : "text-bom-black"
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "max-w-xl font-sans text-base leading-relaxed sm:text-lg",
          darkBlueNotFound ? "text-bom-white" : "text-bom-black/80"
        )}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
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
    </motion.section>
  );
}
