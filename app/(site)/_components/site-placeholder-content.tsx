"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSitePageTransition } from "@/components/site/site-page-transition-context";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";
import { cn } from "@/lib/utils";

const sectionShellClass =
  "mx-auto flex w-full min-h-[100dvh] max-w-5xl flex-col items-center justify-center gap-8 px-5 pb-20 pt-12 text-center sm:px-10 sm:pt-16 lg:px-16";

type SitePlaceholderContentProps = {
  eyebrow: string;
  title: string;
  href: string;
  label: string;
  buttonClassName: string;
};

export default function SitePlaceholderContent({
  eyebrow,
  title,
  href,
  label,
  buttonClassName,
}: SitePlaceholderContentProps) {
  const reduceMotion = useReducedMotion();
  const { isContentRevealed } = useSitePageTransition();
  const isVisible = reduceMotion || isContentRevealed;

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
      <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-black/70">
        {eyebrow}
      </p>
      <h1 className="font-sans text-4xl font-medium tracking-tight text-bom-black sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="max-w-xl font-sans text-base leading-relaxed text-bom-black/80 sm:text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
      </p>
      <Button
        variant="bomPill"
        size="bomPill"
        asChild
        className={buttonClassName}
      >
        <Link href={href} tabIndex={isVisible ? undefined : -1}>
          <span>{label}</span>
        </Link>
      </Button>
    </motion.section>
  );
}
