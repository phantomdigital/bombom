"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Local hero placeholder (Copacabana-style wide photo). */
const PLACEHOLDER_SRC = "/9154.jpg";

/** px per unit of “how far element midline is from viewport centre” — tune for strength. */
const PARALLAX_STRENGTH = 0.45;

/**
 * Zoom past 100% so parallax / mask never show empty edges. Logo strip uses a much
 * larger scale so the photo always fills the SVG clip with lots of slack.
 */
const IMAGE_OVERFLOW_SCALE_DEFAULT = 1.35;
const IMAGE_OVERFLOW_SCALE_LOGO = 2;

/**
 * Vertical anchor for object-fit:cover (horizontal always centered).
 * Lower % = weight toward the top of the photo in the strip; raise if you want more sky/headroom.
 */
const OBJECT_POSITION_LOGO = "center 10%";
const OBJECT_POSITION_DEFAULT = "center top";

interface HomeVideoPlaceholderProps {
  className?: string;
  /** Masked wordmark strip: slightly stronger zoom + a top-weighted object-position. */
  variant?: "default" | "logo";
  /** When false, disables vertical parallax (e.g. inside scroll-pinned stages). */
  parallax?: boolean;
}

/** Stand-in for marketing video; swap for `<video>` / iframe with same layout later. */
export default function HomeVideoPlaceholder({
  className,
  variant = "default",
  parallax = true,
}: HomeVideoPlaceholderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollY } = useScroll();

  const y = useTransform(scrollY, (latest) => {
    void latest;
    if (reduceMotion || !parallax) return 0;
    const el = ref.current;
    if (!el) return 0;
    const { top, height } = el.getBoundingClientRect();
    const midY = top + height / 2;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1;
    const delta = midY - vh / 2;
    return -delta * PARALLAX_STRENGTH;
  });

  const overflowScale =
    reduceMotion
      ? 1
      : variant === "logo"
        ? IMAGE_OVERFLOW_SCALE_LOGO
        : IMAGE_OVERFLOW_SCALE_DEFAULT;

  const objectPosition =
    variant === "logo" ? OBJECT_POSITION_LOGO : OBJECT_POSITION_DEFAULT;

  return (
    <div
      ref={ref}
      className={cn(
        "bom-home-video-surface relative h-full w-full overflow-hidden",
        className
      )}
      aria-hidden
    >
      <motion.img
        src={PLACEHOLDER_SRC}
        alt=""
        width={3840}
        height={2160}
        draggable={false}
        style={{
          objectPosition,
          y,
          scale: overflowScale,
          transformOrigin: "center center",
        }}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full max-w-none select-none object-cover grayscale will-change-transform"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/25"
        aria-hidden
      />
    </div>
  );
}
