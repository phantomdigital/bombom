'use client';

interface PinkTintOverlayProps {
  intensity?: number; // 0-1
  opacity?: number;   // 0-1
}

export default function PinkTintOverlay({
  intensity = 0.6,
  opacity = 0.3
}: PinkTintOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(circle at 70% 50%, 
          rgba(255, 105, 180, ${intensity * opacity}) 0%, 
          rgba(237, 88, 120, ${intensity * opacity * 0.8}) 30%, 
          rgba(255, 145, 163, ${intensity * opacity * 0.6}) 60%, 
          transparent 90%)`,
        mixBlendMode: 'color', // Blend mode for stylized tinting effect
        zIndex: 300 // Below strawberries and text
      }}
    />
  );
}
