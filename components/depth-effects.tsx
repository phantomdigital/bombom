'use client';

import { useEffect, useRef } from 'react';

interface DepthEffectsProps {
  mousePosition: { x: number; y: number }; // normalized 0..1
  intensity?: number; // 0..1
  blurStrength?: number; // px
  shadowOpacity?: number; // 0..1
}

export default function DepthEffects({
  mousePosition,
  intensity = 0.6,
  blurStrength = 8,
  shadowOpacity = 0.15
}: DepthEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert mouse position to tilt values
    const normalizedX = (mousePosition.x - 0.5) * 2; // -1..1
    const normalizedY = (mousePosition.y - 0.5) * 2; // -1..1

    // Dynamic depth of field blur
    const blurAmount = Math.abs(normalizedX) * blurStrength * intensity;
    
    // Shadow positioning based on tilt
    const shadowX = normalizedX * 20 * intensity;
    const shadowY = normalizedY * 10 * intensity;
    
    // Edge vignetting that responds to tilt
    const vignetteShift = normalizedX * 15; // shift vignette center

    containerRef.current.style.filter = `blur(${blurAmount * 0.3}px)`;
    containerRef.current.style.transform = `translate3d(${shadowX * 0.5}px, ${shadowY * 0.5}px, 0)`;
  }, [mousePosition, intensity, blurStrength]);

  const normalizedX = (mousePosition.x - 0.5) * 2;
  const normalizedY = (mousePosition.y - 0.5) * 2;
  
  // Dynamic shadow
  const shadowX = normalizedX * 25 * intensity;
  const shadowY = normalizedY * 15 * intensity;
  
  // Responsive vignette
  const vignetteX = 50 + normalizedX * 8;
  const vignetteY = 50 + normalizedY * 5;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-45">
      {/* Dynamic shadow that follows perspective */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${vignetteX}% ${vignetteY}%, transparent 40%, rgba(0,0,0,${shadowOpacity}) 100%)`,
          transform: `translate3d(${shadowX}px, ${shadowY}px, 0)`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Edge blur for depth of field */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.1) 100%)`,
          filter: `blur(${Math.abs(normalizedX) * blurStrength}px)`,
          mixBlendMode: 'multiply',
          opacity: intensity * 0.3
        }}
      />
    </div>
  );
}
