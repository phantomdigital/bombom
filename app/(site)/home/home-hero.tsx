"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SiteChromeRail from "@/components/site/site-chrome-rail";
import { useSitePageTransition } from "@/components/site/site-page-transition-context";
import { Button } from "@/components/ui/button";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";
import { cn } from "@/lib/utils";

const MAGIC_LAB_DISK_INLINE =
  "flex size-7 select-none items-center justify-center rounded-full bg-bom-marble font-sans text-[0.55rem] font-[800] uppercase tracking-tighter text-bom-ink shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-1px_1px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.07] sm:size-8 sm:text-[0.6rem] lg:size-9 lg:text-[0.65rem] " +
  "[background-image:radial-gradient(ellipse_100%_80%_at_35%_15%,rgba(255,255,255,0.55),transparent_50%),radial-gradient(circle_at_72%_78%,rgba(180,176,165,0.14),transparent_42%),linear-gradient(158deg,#f9faf8_0%,#eae8e4_42%,#f4f3f1_100%)]";

/** Coordinates + hand-tuned dashed paths (SVG 0–100, same units as label % positions). */
const KOALA_CALLOUTS = [
  {
    key: "froyo",
    label: "Frozen Yoghurt",
    anchor: { x: 12.4, y: 14.8 },
    pathD: "M 18.8 21.9 C 24.9 34.9, 31.9 42.9, 40.9 49.9",
    strokeWidth: 0.44,
    dashKeyframes: "0;-14;-24",
    animDur: "1.25s",
    floatDur: 3.95,
    floatDelay: 0.08,
  },
  {
    key: "wagga",
    label: "Wagga Made",
    anchor: { x: 92.8, y: 19.8 },
    pathD:
      "M 88.9 26.9 C 82.9 29.9, 74.9 38.9, 62.9 41.9 C 60.9 42.9, 59.9 41.9, 57.9 43.9",
    strokeWidth: 0.52,
    dashKeyframes: "3;-12;-26",
    animDur: "1.1s",
    floatDur: 3.15,
    floatDelay: 0.42,
  },
  {
    key: "fresh",
    label: "Morning batch",
    anchor: { x: 88.9, y: 86.9 },
    pathD:
      "M 84.9 72.9 C 78.9 65.9, 63.9 56.9, 54.9 59.9 C 52.9 60.9, 52.9 58.9, 53.9 56.9",
    strokeWidth: 0.5,
    dashKeyframes: "-2;-17;-29",
    animDur: "1.35s",
    floatDur: 3.62,
    floatDelay: 0.71,
  },
  {
    key: "bras",
    label: "Brazilian twist",
    anchor: { x: 10.9, y: 79.9 },
    pathD:
      "M 16.8 71.9 C 23.9 62.9, 37.9 54.9, 43.9 52.9 C 44.9 51.9, 45.9 51.9, 46.9 49.9",
    strokeWidth: 0.45,
    dashKeyframes: "6;-13;-26",
    animDur: "1.15s",
    floatDur: 3.82,
    floatDelay: 0.05,
  },
] as const;

/** Plain floating callout copy — no shadows; scales with enlarged hero illustration. */
const KOALA_CALLOUT_LABEL_CLASS =
  "block max-w-[14.5rem] text-left font-sans text-[1.08rem] font-medium normal-case leading-snug text-white sm:max-w-[17rem] sm:text-[1.2rem] lg:max-w-[19rem] lg:text-[1.34rem]";

function KoalaAnnotPath(props: {
  pathD: string;
  strokeWidth: number;
  dashKeyframes: string;
  animDur?: string;
}) {
  const { pathD, strokeWidth, dashKeyframes, animDur = "1.2s" } = props;
  return (
    <path
      d={pathD}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="14 10"
      vectorEffect="non-scaling-stroke"
    >
      <animate
        attributeName="stroke-dashoffset"
        values={dashKeyframes}
        keyTimes="0;0.5;1"
        dur={animDur}
        calcMode="discrete"
        repeatCount="indefinite"
      />
    </path>
  );
}

export default function HomeHero() {
  const reduceMotion = useReducedMotion();
  const { isContentRevealed } = useSitePageTransition();
  const isVisible = reduceMotion || isContentRevealed;

  return (
    <motion.section
      className={cn(
        "flex min-h-[100svh] w-full flex-col bg-bom-ice",
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
        className="flex w-full flex-col"
        railClassName="flex w-full flex-col items-center gap-14 pb-40 pt-[var(--site-header-total-height,12.5rem)] sm:gap-16 sm:pb-44 lg:gap-16 lg:pb-48"
      >
        <div
          className={cn(
            "flex w-full max-w-xl min-h-[calc(100svh_-_var(--site-header-total-height,12.5rem))] flex-col items-center justify-center gap-10 px-4 text-center sm:max-w-2xl sm:gap-11 lg:max-w-3xl lg:gap-12 lg:py-20"
          )}
        >
          <h1 className="font-sans tracking-tight text-center text-bom-iris">
            <span className="block text-2xl font-light leading-[1.2] sm:text-3xl lg:text-[3.25rem]">
              Tiny Koalas.
            </span>
            <span className="block text-3xl font-[900] leading-[1.2] sm:text-4xl lg:text-[7rem]">
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

        <div className="flex w-full flex-col items-center">
          <div className="mx-auto flex w-full max-w-[min(100%,26rem)] flex-col rounded-[2rem] bg-bom-ice p-5 sm:max-w-[min(100%,34rem)] sm:p-7 lg:max-w-[min(100%,42rem)]">
            <div className="relative mx-auto aspect-[3/5] w-full max-h-[min(56dvh,28rem)] min-h-[14rem] overflow-visible sm:max-h-[min(60dvh,32rem)] lg:max-h-[min(62dvh,38rem)]">
              <div className="absolute inset-[4%_2.5%_5%_2.5%] min-h-0">
                <div className="relative h-full min-h-[1px] w-full">
                  <svg
                    className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible text-white"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {KOALA_CALLOUTS.map(
                      ({
                        key,
                        pathD,
                        strokeWidth,
                        dashKeyframes,
                        animDur,
                      }) => (
                        <KoalaAnnotPath
                          key={key}
                          pathD={pathD}
                          strokeWidth={strokeWidth}
                          dashKeyframes={dashKeyframes}
                          animDur={animDur}
                        />
                      )
                    )}
                  </svg>

                  <Image
                    src="/images/koala.png"
                    alt="Koala-shaped soft serve treat with toppings"
                    fill
                    className="relative z-[2] object-contain object-center"
                    sizes="(max-width: 1023px) 90vw, (max-width: 1536px) 45vw, 640px"
                    priority
                  />

                  <div
                    className="pointer-events-none absolute inset-0 z-[3] overflow-visible"
                    aria-hidden="true"
                  >
                    {KOALA_CALLOUTS.map(
                      ({
                        key,
                        label,
                        anchor,
                        floatDur,
                        floatDelay,
                      }) => (
                        <div
                          key={`${key}-lbl`}
                          className="absolute"
                          style={{
                            left: `${anchor.x}%`,
                            top: `${anchor.y}%`,
                            translate: "-50% -50%",
                          }}
                        >
                          <motion.span
                            className={KOALA_CALLOUT_LABEL_CLASS}
                            initial={false}
                            animate={
                              reduceMotion || !isVisible
                                ? { y: 0 }
                                : { y: [-3.5, 3.5, -3.5] }
                            }
                            transition={{
                              duration: floatDur,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: floatDelay,
                            }}
                          >
                            {label}
                          </motion.span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mt-6 flex w-full flex-wrap justify-center gap-1 sm:mt-8 sm:gap-1.5 lg:mt-10"
              role="img"
              aria-label="Magic Lab"
            >
              {(["M", "A", "G", "I", "C"] as const).map((ch) => (
                <span
                  key={`m-${ch}`}
                  aria-hidden
                  className={MAGIC_LAB_DISK_INLINE}
                >
                  {ch}
                </span>
              ))}
              <span
                aria-hidden
                className="mx-0.5 w-1 shrink-0 sm:mx-1 sm:w-1.5"
              />
              {(["L", "A", "B"] as const).map((ch) => (
                <span
                  key={`l-${ch}`}
                  aria-hidden
                  className={MAGIC_LAB_DISK_INLINE}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SiteChromeRail>
    </motion.section>
  );
}
