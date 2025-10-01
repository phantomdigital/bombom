'use client';

import { useEffect, useRef } from 'react';

interface GrainOverlayProps {
  opacity?: number; // 0..1 strength of the effect
  size?: number; // base tile size in px
  blendMode?: React.CSSProperties['mixBlendMode'];
}

export default function GrainOverlay({ opacity = 0.08, size = 256, blendMode = 'multiply' }: GrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Prepare a small noise tile we can repeat for performance
    const tile = document.createElement('canvas');
    tile.width = size;
    tile.height = size;
    const tctx = tile.getContext('2d', { alpha: true });
    if (!tctx) return;

    const imageData = tctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Subtle monochrome noise around mid-gray
      const v = 128 + Math.floor((Math.random() - 0.5) * 64); // 96..160
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255; // opaque in tile; overall strength via global alpha
    }
    tctx.putImageData(imageData, 0, 0);

    const pattern = ctx.createPattern(tile, 'repeat');
    if (!pattern) return;

    const draw = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w <= 0 || h <= 0) return;
      // Match device pixel ratio for crispness
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing to CSS pixels
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    };

    const ro = new ResizeObserver(draw);
    ro.observe(parent);
    draw();

    return () => {
      ro.disconnect();
    };
  }, [opacity, size]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      style={{ mixBlendMode: blendMode, opacity: 1, background: 'transparent' }}
    />
  );
}


