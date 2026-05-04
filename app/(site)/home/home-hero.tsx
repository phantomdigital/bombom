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
        "flex min-h-[clamp(34rem,100dvh,60rem)] w-full flex-col bg-bom-ice",
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
        className="flex w-full flex-1 flex-col"
        railClassName="flex w-full flex-1 flex-col items-center justify-center gap-10 pb-16 pt-[var(--site-header-total-height,12.5rem)] sm:gap-11 sm:px-4 sm:pb-20 lg:gap-12 lg:pb-24"
      >
        <div
          className={cn(
            "flex w-full max-w-2xl shrink-0 flex-col items-center justify-center gap-10 text-center sm:max-w-3xl sm:gap-11 lg:max-w-4xl lg:gap-12"
          )}
        >
          <h1 className="font-sans tracking-tight text-center text-bom-iris">
            <span className="block text-[clamp(2.35rem,11.2vw,3.2rem)] font-light leading-[1.08] sm:text-4xl lg:text-[3.45rem]">
              Lorem ipsum.
            </span>
            <span className="mt-1 block text-[clamp(3.75rem,16.5vw,5.4rem)] font-[900] leading-[1.25] sm:mt-0 sm:text-5xl lg:text-[7.4rem]">
              Dolor magnam.
            </span>
          </h1>
          <p className="font-sans text-base font-medium leading-[1.2] text-bom-iris/60 not-italic sm:text-base lg:text-[clamp(1rem,1.75vw,16pt)] max-w-2xl text-center">
            Dolor sit amet consectetur. Venenatis lectus magna fringilla
            sit-amet porttitor rhoncus. Mattis rhoncus urna neque.
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
