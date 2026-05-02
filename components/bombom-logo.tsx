import type { CSSProperties } from "react";
import { cn } from '@/lib/utils';

const LOGO_PATH = '/logo/svg/bom-bom-main.svg';
const LOGO_ASPECT_RATIO = 1223 / 235;

interface BomBomLogoProps {
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  /** 'light' = white logo (for dark/colored backgrounds), 'dark' = black logo (for light backgrounds) */
  variant?: 'light' | 'dark';
  /**
   * Explicit logo color (e.g. `rgb(...)`, `#...`, or CSS variable).
   * When provided, the logo renders as a mask so we can match brand colors exactly.
   */
  color?: string;
}

export default function BomBomLogo({
  className,
  style,
  'aria-label': ariaLabel,
  variant = 'light',
  color,
}: BomBomLogoProps) {
  if (color) {
    return (
      <span
        role="img"
        aria-label={ariaLabel ?? 'BomBom Treats'}
        className={cn("inline-block shrink-0 bom-home-logo-video-mask", className)}
        style={{
          background: color,
          aspectRatio: LOGO_ASPECT_RATIO,
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          transitionProperty: 'none',
          ...style,
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_PATH}
      alt={ariaLabel ?? 'BomBom Treats'}
      width={1223}
      height={235}
      className={cn(
        'w-full h-auto',
        variant === 'light' && 'invert',
        className
      )}
      style={{ transform: 'translateZ(0)', ...style }}
      loading="eager"
      decoding="async"
    />
  );
}
