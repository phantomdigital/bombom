'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AnimatedText from './animated-text';

interface FlavorTextContentProps {
  month: string;
  flavorName: string;
  flavorDescription?: string;
  heroSubtitle?: string;
  ingredients?: string[];
  flavorNotes?: string;
  availability?: string;
  temperature?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  opacity?: number;
}

export default function FlavorTextContent({
  month,
  flavorName,
  flavorDescription,
  heroSubtitle,
  opacity = 0.9
}: FlavorTextContentProps) {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!badgeRef.current) return;

    // Badge animation - scale up with bounce and slight rotation
    gsap.fromTo(badgeRef.current, 
      {
        scale: 0,
        rotation: -10,
        opacity: 0
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.1
      }
    );

    // Add a subtle floating animation after the initial entrance
    gsap.to(badgeRef.current, {
      y: -4,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1
    });
  }, []);

  return (
    <div className="text-white w-full md:max-w-md lg:max-w-lg" style={{ opacity }}>
      {/* Flavor of the Month - Prominent badge */}
      <div 
        ref={badgeRef}
        className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 mb-2 sm:mb-3 md:mb-4 lg:mb-6"
        style={{ opacity: 0 }}
      >
        <div className="font-mono text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-sm font-medium tracking-widest uppercase text-white">
          {month} • FLAVOUR OF THE MONTH
        </div>
      </div>
      
      {/* Main Flavor Name - Bold, prominent */}
      <AnimatedText 
        as="h1" 
        className="font-gasoek font-normal text-5xl sm:text-6xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[7rem] [@media(min-width:1795px)]:text-[8.15rem] leading-[0.95] tracking-[-0.02em] mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-white/95"
        delay={0.3}
        stagger={0.1}
        duration={0.6}
      >
        {flavorName}
      </AnimatedText>
      
      {/* Flavor Description - Clean, readable */}
      {flavorDescription && (
        <AnimatedText 
          as="div" 
          className="font-sans text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl [@media(min-width:1795px)]:text-2xl font-light mb-4 sm:mb-5 md:mb-8 lg:mb-10 opacity-90 tracking-wide leading-relaxed text-white/90"
          delay={1.2}
          stagger={0.05}
          duration={0.5}
        >
          {flavorDescription}
        </AnimatedText>
      )}

      {/* Hero Subtitle - Brief compelling copy */}
      {heroSubtitle && (
        <AnimatedText 
          as="p" 
          className="font-sans text-sm sm:text-base md:text-base lg:text-lg 2xl:text-lg [@media(min-width:1795px)]:text-lg font-light opacity-80 leading-relaxed"
          delay={1.8}
          stagger={0.03}
          duration={0.4}
        >
          {heroSubtitle}
        </AnimatedText>
      )}
    </div>
  );
}

