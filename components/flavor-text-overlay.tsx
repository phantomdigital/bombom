'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AnimatedText from './animated-text';

interface FlavorTextOverlayProps {
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
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
}

export default function FlavorTextOverlay({
  month,
  flavorName,
  flavorDescription,
  heroSubtitle,
  ingredients,
  flavorNotes,
  availability,
  temperature,
  ctaText = "Learn More",
  onCtaClick,
  position = 'top-left',
  opacity = 0.9
}: FlavorTextOverlayProps) {
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

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-8 left-8 lg:top-20 lg:left-16 bottom-8 lg:bottom-12';
      case 'top-right':
        return 'top-8 right-8 lg:top-12 lg:right-12 bottom-8 lg:bottom-12';
      case 'bottom-left':
        return 'bottom-8 left-8 lg:bottom-12 lg:left-12 top-8 lg:top-12';
      case 'bottom-right':
        return 'bottom-8 right-8 lg:bottom-12 lg:right-12 top-8 lg:top-12';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-8 left-8 lg:top-12 lg:left-12 bottom-8 lg:bottom-12';
    }
  };

  return (
    <div
      className={`absolute z-[500] ${getPositionClasses()}`}
      style={{ opacity }}
    >
      <div className="text-white max-w-lg h-full flex flex-col">
        <div className="flex-1">
          {/* Flavor of the Month - Prominent badge */}
          <div 
            ref={badgeRef}
            className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4 lg:mb-6"
            style={{ opacity: 0 }}
          >
            <div className="font-mono text-xs lg:text-sm font-medium tracking-widest uppercase text-white">
              {month} • FLAVOUR OF THE MONTH
            </div>
          </div>
          
          {/* Main Flavor Name - Bold, prominent */}
          <AnimatedText 
            as="h1" 
            className="font-gasoek font-normal text-4xl lg:text-6xl xl:text-[8.15rem] leading-[0.95] tracking-[-0.02em] mb-6 lg:mb-8 text-white/95"
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
              className="font-sans text-xl lg:text-2xl font-light mb-8 lg:mb-10 opacity-90 tracking-wide leading-relaxed max-w-lg text-white/90"
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
              className="font-sans text-base lg:text-lg font-light opacity-80 leading-relaxed max-w-md"
              delay={1.8}
              stagger={0.03}
              duration={0.4}
            >
              {heroSubtitle}
            </AnimatedText>
          )}
        </div>

      </div>
    </div>
  );
}
