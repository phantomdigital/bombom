'use client';

import { useEffect, useRef } from 'react';

interface AtmosphereOverlayProps {
  vignetteStrength?: number; // 0..1 darkness at edges
  vignetteFeather?: number; // 0..1 radius where vignette starts (higher = more center)
  glowColor?: string; // CSS color for center glow
  glowOpacity?: number; // 0..1
  raysOpacity?: number; // 0..1
  bandingOpacity?: number; // 0..1
  vignetteTint?: string; // edge color tint (e.g., brand red)
  mousePosition?: { x: number; y: number }; // for responsive effects
}

export default function AtmosphereOverlay({
  vignetteStrength = 0.12,
  vignetteFeather = 0.65,
  glowColor = '#e4d01b',
  glowOpacity = 0.08,
  raysOpacity = 0.05,
  bandingOpacity = 0.05,
  vignetteTint = '#af3428'
}: AtmosphereOverlayProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000; // seconds
      // Gentle pulses roughly aligned with the shader's motion
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.7);
      if (glowRef.current) {
        const target = glowOpacity * (0.8 + 0.6 * pulse);
        glowRef.current.style.opacity = String(target);
      }
      if (raysRef.current) {
        const target = raysOpacity * (0.8 + 0.7 * pulse);
        const rot = 1.5 * Math.sin(t * 0.2);
        raysRef.current.style.opacity = String(target);
        raysRef.current.style.transform = `rotate(${rot}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [glowOpacity, raysOpacity]);

  // Helper to apply alpha to hex/rgb strings
  const withAlpha = (color: string, alpha: number) => {
    // hex #rrggbb
    if (/^#([0-9a-fA-F]{6})$/.test(color)) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // rgb or rgba, just replace alpha
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const [r, g, b] = m[1]
        .split(',')
        .map((v) => parseFloat(v.trim()))
        .slice(0, 3);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  };

  const vignetteOuter = withAlpha(vignetteTint, vignetteStrength);
  const vignetteVert = withAlpha(vignetteTint, vignetteStrength * 0.6);
  const vignetteBg = `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) ${Math.round(
    vignetteFeather * 100
  )}%, ${vignetteOuter} 100%), linear-gradient(to bottom, ${vignetteVert} 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, ${vignetteVert} 100%)`;

  // Subtle horizontal banding
  const bandingBg = `repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, rgba(0,0,0,0) 6px)`;

  // Radial center glow
  const glowBg = `radial-gradient(ellipse at 50% 55%, ${glowColor} 0%, rgba(255,255,255,0) 60%)`;

  // Soft light rays from center using conic-gradient
  const raysBg = `conic-gradient(from -20deg at 50% 55%, rgba(255,255,255,0.14), rgba(255,255,255,0) 15deg, rgba(255,255,255,0) 45deg, rgba(255,255,255,0.12) 60deg, rgba(255,255,255,0) 75deg, rgba(255,255,255,0) 105deg, rgba(255,255,255,0.12) 120deg, rgba(255,255,255,0) 135deg)`;

  return (
    <div className="pointer-events-none absolute inset-0 z-30" style={{ background: 'transparent' }}>
      {/* Vignette + edge darkening */}
      <div
        className="absolute inset-0"
        style={{
          background: vignetteBg,
          mixBlendMode: 'multiply',
          opacity: 1
        }}
      />

      {/* Subtle center glow */}
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          background: glowBg,
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          opacity: glowOpacity
        }}
      />

      {/* Soft light rays */}
      <div
        ref={raysRef}
        className="absolute inset-0"
        style={{
          background: raysBg,
          filter: 'blur(16px)',
          mixBlendMode: 'screen',
          opacity: raysOpacity
        }}
      />

      {/* Subtle horizontal banding for depth cue */}
      <div
        className="absolute inset-0"
        style={{
          background: bandingBg,
          mixBlendMode: 'overlay',
          opacity: bandingOpacity
        }}
      />
    </div>
  );
}


