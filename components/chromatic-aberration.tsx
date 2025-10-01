'use client';

import { useEffect, useRef } from 'react';

interface ChromaticAberrationProps {
  intensity?: number; // 0..1 
  redOffset?: number; // px offset for red channel
  blueOffset?: number; // px offset for blue channel
  opacity?: number; // overall effect strength
}

export default function ChromaticAberration({
  intensity = 0.4,
  redOffset = 2,
  blueOffset = -1.5,
  opacity = 0.08
}: ChromaticAberrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-40"
      style={{
        background: 'transparent',
        opacity: opacity
      }}
    >
      {/* Red channel shifted */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(255, 0, 0, ${intensity * 0.3}) 0%, rgba(255, 0, 0, 0) 70%)`,
          transform: `translateX(${redOffset}px)`,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Blue channel shifted */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(0, 0, 255, ${intensity * 0.25}) 0%, rgba(0, 0, 255, 0) 70%)`,
          transform: `translateX(${blueOffset}px)`,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
