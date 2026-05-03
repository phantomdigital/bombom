"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";

/** Nothing visible; wipe will expand downward from the top. */
const CLIP_FULLY_HIDDEN_FROM_TOP = "inset(100% 0% 0% 0%)";
/** Full frame (new colour fully covering viewport). */
const CLIP_FULL = "inset(0% 0% 0% 0%)";
/** Nothing visible; wipe will expand upward from the bottom. */
const CLIP_FULLY_HIDDEN_FROM_BOTTOM = "inset(0% 0% 100% 0%)";

type WipeLeadEdge = "top" | "bottom";

/** Run state updates with `flushSync` after this task, so navigation never nests it inside React render. */
function flushSyncSoon(update: () => void): Promise<void> {
  return new Promise<void>((resolve) => {
    queueMicrotask(() => {
      flushSync(update);
      resolve();
    });
  });
}

export type SitePageTransitionOverlayHandle = {
  /** Start the cover phase (clipped → full frame) with the given destination hex. */
  cover: (hex: string) => Promise<void>;
  /** Retreat the current coverage off the opposite edge from the previous cover. */
  peel: () => Promise<void>;
};

/**
 * Imperatively-controlled colour wipe that sits above route content and below
 * the sticky header. `SiteChrome` orchestrates the sequence (cover → router
 * push behind full cover → peel) so the user never sees the scroll reset or
 * the previous page's hero backdrop during navigation.
 *
 * Alternates lead edge each cycle: top → bottom → top …
 * Reduced-motion: noop (handle methods resolve immediately).
 */
const SitePageTransitionOverlay = forwardRef<SitePageTransitionOverlayHandle>(
  function SitePageTransitionOverlay(_props, ref) {
    const controls = useAnimationControls();
    const reduceMotion = useReducedMotion();
    const nextLeadEdgeRef = useRef<WipeLeadEdge>("top");
    const [hex, setHex] = useState<string>("transparent");

    useImperativeHandle(
      ref,
      () => ({
        async cover(nextHex: string) {
          if (reduceMotion) {
            await flushSyncSoon(() => setHex(nextHex));
            return;
          }
          const lead = nextLeadEdgeRef.current;
          const coverStartClip =
            lead === "top"
              ? CLIP_FULLY_HIDDEN_FROM_TOP
              : CLIP_FULLY_HIDDEN_FROM_BOTTOM;
          // Commit the new bg colour BEFORE any visible frame of the cover
          // animation, otherwise the first frames can tween with the previous
          // route's colour.
          await flushSyncSoon(() => setHex(nextHex));
          await controls.start({
            clipPath: coverStartClip,
            skewY: 0,
            transition: { duration: 0 },
          });
          await controls.start({
            clipPath: CLIP_FULL,
            skewY: SITE_PAGE_TRANSITION.coverSkewDeg,
            transition: {
              duration:
                lead === "top" ?
                  SITE_PAGE_TRANSITION.coverDurationS
                : SITE_PAGE_TRANSITION.coverDurationFromBottomLeadS,
              ease: SITE_PAGE_TRANSITION.coverEase,
            },
          });
        },
        async peel() {
          if (reduceMotion) return;
          const lead = nextLeadEdgeRef.current;
          const revealEndClip =
            lead === "top"
              ? CLIP_FULLY_HIDDEN_FROM_BOTTOM
              : CLIP_FULLY_HIDDEN_FROM_TOP;
          await controls.start({
            clipPath: revealEndClip,
            skewY: 0,
            transition:
              lead === "bottom" ?
                SITE_PAGE_TRANSITION.revealSpringPeelTowardTop
              : SITE_PAGE_TRANSITION.revealSpring,
          });
          nextLeadEdgeRef.current = lead === "top" ? "bottom" : "top";
        },
      }),
      [controls, reduceMotion]
    );

    return (
      <motion.div
        aria-hidden
        data-site-page-transition-overlay=""
        initial={{
          clipPath: CLIP_FULLY_HIDDEN_FROM_TOP,
          skewY: 0,
        }}
        animate={controls}
        className="pointer-events-none fixed z-[55] isolate will-change-[clip-path,transform]"
        style={{
          backgroundColor: hex,
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
        }}
      />
    );
  }
);

export default SitePageTransitionOverlay;
