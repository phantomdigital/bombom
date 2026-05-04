"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SiteChromeRail from "@/components/site/site-chrome-rail";
import { useSitePageTransition } from "@/components/site/site-page-transition-context";
import { Button } from "@/components/ui/button";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";
import { cn } from "@/lib/utils";

export default function HomeHero() {
  const reduceMotion = useReducedMotion();
  const { isContentRevealed } = useSitePageTransition();
  const isVisible = reduceMotion || isContentRevealed;

  return (
    <motion.section
      className={cn(
        "flex h-[100dvh] max-h-[100dvh] min-h-0 w-full flex-col overflow-y-auto bg-bom-ice",
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
      <SiteChromeRail
        className="flex min-h-0 w-full flex-1 flex-col"
        railClassName="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-10 pt-[var(--site-header-total-height,12.5rem)] sm:gap-11 sm:px-4 lg:gap-12"
      >
        <div
          className={cn(
            "flex w-full max-w-xl shrink-0 flex-col items-center justify-center gap-10 text-center sm:max-w-2xl sm:gap-11 lg:max-w-3xl lg:gap-12"
          )}
        >
          <h1 className="font-sans tracking-tight text-center text-bom-iris">
            <span className="block text-[clamp(2.15rem,10.5vw,3rem)] font-light leading-[1.08] sm:text-3xl lg:text-[3.25rem]">
              Tiny Koalas.
            </span>
            <span className="mt-1 block text-[clamp(3.45rem,15.5vw,5rem)] font-[900] leading-[1.25] sm:mt-0 sm:text-4xl lg:text-[7rem]">
              Big flavours.
            </span>
          </h1>
          <p className="font-sans text-base font-medium leading-[1.2] text-bom-iris/60 not-italic sm:text-base lg:text-[clamp(1rem,1.75vw,16pt)] max-w-2xl text-center">
            Made fresh every morning. Frozen yoghurt and Brazilian-inspired
            desserts. Made fresh in Wagga.
          </p>
          <Button
            variant="bomPill"
            size="bomPill"
            asChild
            className="self-center bg-bom-lime text-bom-black border border-gray-100/10 font-sans font-medium antialiased lg:whitespace-nowrap"
          >
            <Link href="/menu" tabIndex={isVisible ? undefined : -1}>
              <span>View menu</span>
            </Link>
          </Button>
        </div>
      </SiteChromeRail>
    </motion.section>
  );
}
