import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const LOGO_PATH = "/logo/svg/bom-bom-main.svg";
const LOGO_ASPECT_RATIO = 1223 / 235;
const LOGO_WORD_ASPECT_RATIO = LOGO_ASPECT_RATIO / 2;

interface BomBomLogoProps {
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  /** 'light' = white logo (for dark/coloured backgrounds via inverted asset), `dark` uses `--bom-ink` masked mark. */
  variant?: "light" | "dark";
  /**
   * Explicit logo colour (e.g. `rgb(...)`, `#...`, or CSS variable).
   * When set, renders as masked mark (matches brand exactly).
   */
  color?: string;
  word?: "first" | "second";
}

/** Shared SVG-mask wordmark (`globals.css`: `.bom-home-logo-video-mask`). */
function BomBomMaskedMark({
  ariaLabel,
  background,
  className,
  style,
}: {
  ariaLabel?: string;
  background: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      role="img"
      aria-label={ariaLabel ?? "BomBom Treats"}
      className={cn("inline-block shrink-0 bom-home-logo-video-mask", className)}
      style={{
        background,
        aspectRatio: LOGO_ASPECT_RATIO,
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        transitionProperty: "none",
        ...style,
      }}
    />
  );
}

function BomBomMaskedWord({
  ariaLabel,
  background,
  className,
  style,
  word,
}: {
  ariaLabel?: string;
  background: string;
  className?: string;
  style?: CSSProperties;
  word: "first" | "second";
}) {
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("inline-block shrink-0 bom-home-logo-video-mask", className)}
      style={{
        background,
        aspectRatio: LOGO_WORD_ASPECT_RATIO,
        WebkitMaskSize: "200% 100%",
        maskSize: "200% 100%",
        WebkitMaskPosition: word === "first" ? "left center" : "right center",
        maskPosition: word === "first" ? "left center" : "right center",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        transitionProperty: "none",
        ...style,
      }}
    />
  );
}

export default function BomBomLogo({
  className,
  style,
  "aria-label": ariaLabel,
  variant = "light",
  color,
  word,
}: BomBomLogoProps) {
  const maskedBackground =
    color ?? (variant === "dark" ? "var(--bom-ink)" : "var(--color-bom-white)");

  if (word) {
    return (
      <BomBomMaskedWord
        ariaLabel={ariaLabel}
        background={maskedBackground}
        className={className}
        style={style}
        word={word}
      />
    );
  }

  if (color) {
    return (
      <BomBomMaskedMark
        ariaLabel={ariaLabel}
        background={color}
        className={className}
        style={style}
      />
    );
  }

  if (variant === "dark") {
    return (
      <BomBomMaskedMark
        ariaLabel={ariaLabel}
        background="var(--bom-ink)"
        className={className}
        style={style}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_PATH}
      alt={ariaLabel ?? "BomBom Treats"}
      width={1223}
      height={235}
      className={cn("w-full h-auto invert", className)}
      style={{ transform: "translateZ(0)", ...style }}
      loading="eager"
      decoding="async"
    />
  );
}
