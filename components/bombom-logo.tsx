import { cn } from '@/lib/utils';

const LOGO_PATH = '/logo/svg/bom-bom-main.svg';

interface BomBomLogoProps {
  className?: string;
  'aria-label'?: string;
  /** 'light' = white logo (for dark/colored backgrounds), 'dark' = black logo (for light backgrounds) */
  variant?: 'light' | 'dark';
}

export default function BomBomLogo({
  className,
  'aria-label': ariaLabel,
  variant = 'light',
}: BomBomLogoProps) {
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
      style={{ transform: 'translateZ(0)' }}
      loading="eager"
      decoding="async"
    />
  );
}
