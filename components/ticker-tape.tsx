'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface TickerTapeProps {
  text: string;
  direction?: 'left' | 'right';
  speed?: number; // duration in seconds for one cycle
  angle?: number; // rotation angle in degrees
  verticalPosition?: string; // top/bottom position (e.g., '30%')
  horizontalOffset?: string; // horizontal positioning (e.g., '20%')
  backgroundColor?: string;
  textColor?: string;
  separator?: string; // separator between repeated text (e.g., '•', '★', '✱')
}

export default function TickerTape({
  text,
  direction = 'left',
  speed = 20,
  angle = -3,
  verticalPosition = '30%',
  horizontalOffset = '0%',
  backgroundColor = '#000000',
  textColor = '#ffffff',
  separator = '✱'
}: TickerTapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const content = container.querySelector('.ticker-content') as HTMLElement;
    
    if (!content) return;

    // Get width for seamless loop
    const width = content.offsetWidth;
    
    // Set up GSAP timeline for infinite scroll
    const tl = gsap.timeline({ repeat: -1 });
    
    if (direction === 'left') {
      gsap.set(content, { x: 0 });
      tl.to(content, {
        x: -width / 2,
        duration: speed,
        ease: 'none'
      });
    } else {
      gsap.set(content, { x: -width / 2 });
      tl.to(content, {
        x: 0,
        duration: speed,
        ease: 'none'
      });
    }

    return () => {
      tl.kill();
    };
  }, [direction, speed]);

  const fullText = `${text} ${separator} `;
  const repeatedText = fullText.repeat(20); // Repeat enough times to fill screen

  return (
    <div
      ref={containerRef}
      className="absolute h-12 lg:h-14 overflow-hidden pointer-events-none"
      style={{
        top: verticalPosition,
        left: '20%', // Start much further left to make them longer
        right: '0%',
        backgroundColor,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center',
        zIndex: 430 // Between pink bg (420) and strawberries (440)
      }}
    >
      <div className="ticker-content flex whitespace-nowrap">
        {/* Duplicate content twice for seamless loop */}
        {[...Array(2)].map((_, i) => (
          <span
            key={i}
            className="font-mono text-sm lg:text-base font-black uppercase tracking-widest inline-block px-4"
            style={{ color: textColor }}
          >
            {repeatedText}
          </span>
        ))}
      </div>
    </div>
  );
}

