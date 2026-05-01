"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import HomeVideoPlaceholder from "@/components/home/home-video-placeholder";
import { cn } from "@/lib/utils";

/** Scroll track height - more = slower, finer control per wheel tick. */
const TRACK_HEIGHT_VH = 420;

type HomeMenuScrollExperienceProps = {
  id?: string;
  className?: string;
};

export default function HomeMenuScrollExperience({
  id = "menu",
  className,
}: HomeMenuScrollExperienceProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /** Phase 1: expand image to fullscreen (0–35%). */
  const expand = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  /** Phase 2: musk overlay grows from bottom after expansion (35–85%). */
  const overlay = useTransform(scrollYProgress, [0.35, 0.85], [0, 1]);

  /**
   * Matches previous inset: calc(100vw - 1.5rem) ≈ 12px per side; eases to 0 with scroll.
   */
  const padPx = useTransform(expand, [0, 1], [12, 0]);
  const padding = useTransform(padPx, (p) => `${p}px`);

  const height = useTransform([expand, padPx], ([e, p]) => {
    const ex = Number(e);
    const px = Number(p);
    const innerW = `calc(100vw - ${2 * px}px)`;
    if (ex >= 0.998) return "100%";
    return `calc(${innerW} * 7 / 16)`;
  });

  const borderRadius = useTransform(expand, [0, 1], [16, 0]);
  const ring = useTransform(
    expand,
    [0, 1],
    ["0 0 0 2px rgba(0,0,0,0.12)", "0 0 0 0px rgba(0,0,0,0)"]
  );

  /** Musk overlay grows from bottom up, covering the image. */
  const overlayHeight = useTransform(overlay, [0, 1], ["0%", "100%"]);

  if (reduceMotion) {
    return (
      <section
        id={id}
        className={cn("scroll-mt-24 w-full", className)}
        aria-labelledby="home-menu-heading"
      >
        <h2 id="home-menu-heading" className="sr-only">
          Menu
        </h2>
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border-2 border-bom-black/15 bg-bom-black/10">
          <HomeVideoPlaceholder
            parallax={false}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="mt-6 rounded-2xl bg-bom-musk px-6 py-8 text-bom-black">
          <p className="font-sans text-sm font-medium uppercase tracking-wide text-bom-black/70">
            This month&apos;s flavour
          </p>
          <p className="mt-2 font-sans text-2xl font-medium tracking-tight sm:text-3xl">
            Musk &amp; vanilla twist
          </p>
          <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-bom-black/80">
            Limited soft-serve swirl - swap this line when the real monthly
            flavour is live.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      id={id}
      style={{ height: `${TRACK_HEIGHT_VH}vh` }}
      className={cn("relative w-full scroll-mt-24", className)}
      aria-labelledby="home-menu-heading"
    >
      <h2 id="home-menu-heading" className="sr-only">
        Menu
      </h2>

      <div className="sticky top-0 h-svh w-full overflow-hidden bg-bom-white">
        <motion.div
          className="relative flex h-full w-full items-center justify-center box-border"
          style={{ padding }}
        >
          <motion.div
            className="relative z-0 h-full w-full overflow-hidden bg-bom-black/10"
            style={{
              height,
              borderRadius,
              boxShadow: ring,
            }}
          >
            <HomeVideoPlaceholder
              parallax={false}
              className="absolute inset-0 h-full w-full"
            />

            <motion.div
              className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-bom-musk text-bom-black"
              style={{ height: overlayHeight }}
            >
              <div className="flex flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 sm:px-12 sm:pb-16 sm:pt-14 md:px-16">
                <p className="font-sans text-sm font-medium uppercase tracking-wide text-bom-black/70 sm:text-base">
                  This month&apos;s flavour
                </p>
                <p className="mt-3 font-sans text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                  Musk &amp; vanilla twist
                </p>
                <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-bom-black/85 sm:text-xl sm:leading-relaxed">
                  Limited soft-serve swirl - swap this line when the real monthly
                  flavour is live.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
