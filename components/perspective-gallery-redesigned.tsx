'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { getCurrentMonthFlavor } from '@/lib/flavors';
import CopacabanaShader from './copacabana-shader';
import LeftFadeOverlay from './left-fade-overlay';
import FlavorTextOverlay from './flavor-text-overlay';
import PinkTintOverlay from './pink-tint-overlay';
import ProductImage from './product-image';

// Types
interface PerspectiveDimensions {
  left: number;
  center: number;
  right: number;
  height: number;
}

interface ShaderStripProps {
  width: number;
  height: number;
  className?: string;
}

// Constants
const PERSPECTIVE_CONFIG = {
  centerHeight: 1100,
  topBottomExtension: 800,
  totalHeight: 3640,
  overscan: 1.0,
  angle: 90,
  mobileBreakpoint: 768,
} as const;

const RESPONSIVE_SCALES = {
  mobile: 0.25,
  sm: 0.3,
  md: 0.35,
  lg: 0.4,
  xl: 0.5,
} as const;

// Shader Strip Component
function ShaderStrip({ width, height, className = '' }: ShaderStripProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <CopacabanaShader
        width={width}
        height={height}
        primaryColor="#ed5878"
        secondaryColor="#000000"
        secondaryAlpha={0}
        opacity={0.5}
      />
    </div>
  );
}

// Mobile View Component - No 3D transforms, pure CSS layout
function MobileView() {
  const currentFlavor = getCurrentMonthFlavor();

  return (
    <div className="relative w-full h-full overflow-hidden bg-bom-darkred">
      {/* Shader Background - Absolute positioned, full coverage */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 scale-150 origin-center">
          <ShaderStrip width={1100} height={2000} />
        </div>
      </div>

      {/* Overlays */}
      <LeftFadeOverlay fadeWidth={30} opacity={0.9} />
      <PinkTintOverlay intensity={0.7} opacity={0.25} />

      {/* Content - Overlays use their own absolute positioning */}
      <FlavorTextOverlay 
        month={currentFlavor.month} 
        flavorName={currentFlavor.flavorName} 
        flavorDescription={currentFlavor.flavorDescription}
        heroSubtitle={currentFlavor.heroSubtitle}
        ingredients={currentFlavor.ingredients}
        flavorNotes={currentFlavor.flavorNotes}
        availability={currentFlavor.availability}
        temperature={currentFlavor.temperature}
        ctaText="Learn More"
        position="top-left"
        opacity={0.95}
      />
      
      <ProductImage 
        position="right"
        size="large"
        opacity={1}
        showBadge={true}
        badgeText="This Month"
      />
    </div>
  );
}

// Desktop 3D View Component
function DesktopView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const currentFlavor = getCurrentMonthFlavor();

  const dims: PerspectiveDimensions = {
    left: PERSPECTIVE_CONFIG.topBottomExtension,
    center: PERSPECTIVE_CONFIG.centerHeight,
    right: PERSPECTIVE_CONFIG.topBottomExtension,
    height: PERSPECTIVE_CONFIG.totalHeight,
  };

  const getResponsiveScale = useCallback(() => {
    if (typeof window === 'undefined') return RESPONSIVE_SCALES.lg;
    
    const width = window.innerWidth;
    if (width < 640) return RESPONSIVE_SCALES.mobile;
    if (width < 768) return RESPONSIVE_SCALES.sm;
    if (width < 1024) return RESPONSIVE_SCALES.md;
    if (width < 1280) return RESPONSIVE_SCALES.lg;
    return RESPONSIVE_SCALES.xl;
  }, []);

  const setup3DScene = useCallback(() => {
    if (!containerRef.current || !sceneRef.current) return;

    const containerScale = getResponsiveScale();
    
    // Setup perspective
    gsap.set(containerRef.current, { 
      perspective: 1200, 
      perspectiveOrigin: '50% 50%' 
    });
    
    // Setup scene
    gsap.set(sceneRef.current, { 
      width: dims.center, 
      height: dims.height, 
      transformStyle: 'preserve-3d', 
      scale: containerScale, 
      rotateZ: 90 
    });

    // Setup panels with proper 3D positioning
    const leftPanel = sceneRef.current.querySelector('[data-panel="left"]') as HTMLElement;
    const centerPanel = sceneRef.current.querySelector('[data-panel="center"]') as HTMLElement;
    const rightPanel = sceneRef.current.querySelector('[data-panel="right"]') as HTMLElement;

    if (leftPanel) {
      gsap.set(leftPanel, { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        width: dims.left, 
        transformOrigin: 'right center', 
        x: -dims.left, 
        rotateY: PERSPECTIVE_CONFIG.angle 
      });
    }

    if (centerPanel) {
      gsap.set(centerPanel, { 
        position: 'absolute', 
        inset: 0 
      });
    }

    if (rightPanel) {
      gsap.set(rightPanel, { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: dims.center, 
        width: dims.right, 
        transformOrigin: 'left center', 
        rotateY: -PERSPECTIVE_CONFIG.angle 
      });
    }
  }, [dims, getResponsiveScale]);

  const handleResize = useCallback(() => {
    if (!sceneRef.current) return;
    
    const newScale = getResponsiveScale();
    gsap.to(sceneRef.current, { scale: newScale, duration: 0.3 });
  }, [getResponsiveScale]);

  useEffect(() => {
    setup3DScene();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setup3DScene, handleResize]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-bom-darkred">
      {/* 3D Scene - Background */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 flex items-center justify-center"
      >
        <div ref={sceneRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Left Panel */}
          <div data-panel="left" className="overflow-hidden bg-transparent">
            <ShaderStrip 
              width={dims.left} 
              height={dims.height}
              className="scale-105 origin-center"
            />
          </div>

          {/* Center Panel */}
          <div data-panel="center" className="overflow-hidden bg-transparent">
            <ShaderStrip 
              width={dims.center} 
              height={dims.height}
              className="scale-105 origin-center"
            />
          </div>

          {/* Right Panel */}
          <div data-panel="right" className="overflow-hidden bg-transparent">
            <ShaderStrip 
              width={dims.right} 
              height={dims.height}
              className="scale-105 origin-center"
            />
          </div>
        </div>
      </div>

      {/* Overlays */}
      <LeftFadeOverlay fadeWidth={30} opacity={0.9} />
      <PinkTintOverlay intensity={0.7} opacity={0.25} />

      {/* Content - Using their own absolute positioning */}
      <FlavorTextOverlay 
        month={currentFlavor.month} 
        flavorName={currentFlavor.flavorName} 
        flavorDescription={currentFlavor.flavorDescription}
        heroSubtitle={currentFlavor.heroSubtitle}
        ingredients={currentFlavor.ingredients}
        flavorNotes={currentFlavor.flavorNotes}
        availability={currentFlavor.availability}
        temperature={currentFlavor.temperature}
        ctaText="Learn More"
        position="top-left"
        opacity={0.95}
      />
      
      <ProductImage 
        position="right"
        size="large"
        opacity={0.95}
        showStrawberries={true}
        strawberryCount={180}
        strawberrySpawnRate={8.0}
        strawberryOpacity={0.9}
        showBadge={true}
        badgeText="This Month"
        showTicker={true}
        tickerText="FRESH STRAWBERRY GELATO • MADE DAILY • LIMITED TIME"
      />
    </div>
  );
}

// Main Component with CSS-only responsive behavior
export default function PerspectiveGallery() {
  return (
    <>
      {/* Mobile View - Hidden on desktop */}
      <div className="block md:hidden">
        <MobileView />
      </div>
      
      {/* Desktop View - Hidden on mobile */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}
