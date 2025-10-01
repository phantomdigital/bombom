'use client';

import { useEffect, useRef } from 'react';

interface GeometricOverlayProps {
  opacity?: number; // 0..1
  gridSize?: number; // spacing in px
  lineWeight?: number; // thickness in px
  color?: string; // line color
}

export default function GeometricOverlay({
  opacity = 0.03,
  gridSize = 120,
  lineWeight = 1,
  color = '#ffffff'
}: GeometricOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const draw = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w <= 0 || h <= 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Static geometric grid
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWeight;

      // Static grid - no movement
      const offsetX = 0;
      const offsetY = 0;

      // Vertical lines
      for (let x = offsetX; x < w + gridSize; x += gridSize) {
        if (x >= 0) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
      }

      // Horizontal lines (fewer for Neo-Grotesque restraint)
      for (let y = offsetY; y < h + gridSize; y += gridSize * 2) {
        if (y >= 0) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    };

    const ro = new ResizeObserver(draw);
    ro.observe(parent);
    draw(); // Draw once, no animation

    return () => {
      ro.disconnect();
    };
  }, [opacity, gridSize, lineWeight, color]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-5"
      style={{ mixBlendMode: 'overlay', background: 'transparent' }}
    />
  );
}
