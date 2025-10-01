'use client';

interface ScanlinesProps {
  spacing?: number; // px between lines
  opacity?: number; // 0..1
  thickness?: number; // px thickness
  color?: string;
  blend?: React.CSSProperties['mixBlendMode'];
}

export default function Scanlines({
  spacing = 4,
  opacity = 0.02,
  thickness = 1,
  color = '#000000',
  blend = 'multiply'
}: ScanlinesProps) {
  const pattern = `repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent ${spacing - thickness}px,
    ${color} ${spacing - thickness}px,
    ${color} ${spacing}px
  )`;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-15"
      style={{
        background: pattern,
        opacity: opacity,
        mixBlendMode: blend
      }}
    />
  );
}
