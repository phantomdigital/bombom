'use client';

interface LeftFadeOverlayProps {
  fadeWidth?: number; // percentage of screen width to fade (0-100)
  bgColor?: string; // background color to fade from
  opacity?: number; // overall opacity of the effect
}

export default function LeftFadeOverlay({
  fadeWidth = 30, // 30% of screen width
  bgColor, // not used when using Tailwind classes
  opacity = 1.0
}: LeftFadeOverlayProps) {
  // Create a smooth, modern gradient with bright strawberry pink
  const gradientStyle = `linear-gradient(to right, 
    rgb(237, 88, 120) 0%, 
    rgb(237, 88, 120, 0.95) 15%, 
    rgb(237, 88, 120, 0.8) 25%, 
    rgb(237, 88, 120, 0.6) 35%, 
    rgb(237, 88, 120, 0.35) 45%, 
    rgb(237, 88, 120, 0.15) 95%, 
    rgb(237, 88, 120, 0.05) 95%, 
    transparent 75%)`;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[400]"
      style={{
        background: gradientStyle,
        opacity: opacity
      }}
    />
  );
}
