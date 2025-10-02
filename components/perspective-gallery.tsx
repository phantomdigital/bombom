'use client';

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { getCurrentMonthFlavor } from '@/lib/flavors';
import CopacabanaShader from './copacabana-shader';
import LeftFadeOverlay from './left-fade-overlay';
import FlavorTextContent from './flavor-text-content';
import PinkTintOverlay from './pink-tint-overlay';
import ProductImageFlex from './product-image-flex';

// DOM + GSAP version: three rigid panels with synchronized content strips to stay seamless across seams
export default function PerspectiveGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const currentFlavor = getCurrentMonthFlavor();

  const centerHeight = 1100; // height of the center panel (now vertical tunnel)
  const topBottomExtension = 800; // how far top/bottom panels extend (was sideWidth)
  const dims = useMemo(() => ({ left: topBottomExtension, center: centerHeight, right: topBottomExtension, height: 3640 }), [centerHeight, topBottomExtension]);
  const overscan = 1.0; // scale up content to hide edges/gaps
  const angle = 90; // degrees (increase for sharper edges)

  // Responsive container scale based on viewport
  const getContainerScale = useCallback((width: number) => {
    if (width < 640) return 0.25; // mobile
    if (width < 768) return 0.3; // sm
    if (width < 1024) return 0.35; // md
    if (width < 1280) return 0.4; // lg
    return 0.5; // xl+
  }, []);

  useEffect(() => {
    if (!containerRef.current || !sceneRef.current) return;
    if (typeof window === 'undefined') return;

    const { left, center, right, height } = dims;
    const containerScale = getContainerScale(window.innerWidth);
    const isMobile = window.innerWidth < 768;

    // Perspective setup - adjust perspective for mobile
    const perspective = isMobile ? 800 : 1200;
    gsap.set(containerRef.current, { perspective, perspectiveOrigin: '50% 50%' });
    
    if (isMobile) {
      // On mobile: disable 3D transforms for performance, just show flat center panel
      gsap.set(sceneRef.current, { 
        width: '200%', // Much wider to not clip shader
        height: '200%', // Much taller to not clip shader
        transformStyle: 'flat', 
        scale: containerScale, 
        rotateZ: 90,
        y: -200 // Negative value moves UP, positive moves DOWN
      });
      
      // Hide side panels on mobile
      gsap.set(leftRef.current, { display: 'none' });
      gsap.set(centerRef.current, { position: 'absolute', inset: 0, overflow: 'visible', width: '100%', height: '100%' });
      gsap.set(rightRef.current, { display: 'none' });
    } else {
      // Desktop: full 3D effect
      gsap.set(sceneRef.current, { 
        width: center, 
        height, 
        transformStyle: 'preserve-3d', 
        scale: containerScale, 
        rotateZ: 90 
      });
      
      // Hinge side walls - static positioning, shader handles animation
      gsap.set(leftRef.current, { display: 'block', position: 'absolute', top: 0, bottom: 0, left: 0, width: left, transformOrigin: 'right center', x: -left, rotateY: angle });
      gsap.set(centerRef.current, { position: 'absolute', inset: 0 });
      gsap.set(rightRef.current, { display: 'block', position: 'absolute', top: 0, bottom: 0, left: center, width: right, transformOrigin: 'left center', rotateY: -angle });
    }

    // Re-run on resize to handle orientation changes
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newScale = getContainerScale(newWidth);
      const newPerspective = newWidth < 768 ? 800 : 1200;
      const newIsMobile = newWidth < 768;
      
      gsap.set(containerRef.current, { perspective: newPerspective });
      gsap.to(sceneRef.current, { scale: newScale, duration: 0.3 });
      
      // Toggle 3D effect based on screen size
      if (newIsMobile) {
        gsap.set(sceneRef.current, { transformStyle: 'flat', y: -200, width: '200%', height: '200%' });
        gsap.set(leftRef.current, { display: 'none' });
        gsap.set(rightRef.current, { display: 'none' });
        gsap.set(centerRef.current, { overflow: 'visible' });
      } else {
        gsap.set(sceneRef.current, { transformStyle: 'preserve-3d', y: 0, width: center, height });
        gsap.set(leftRef.current, { display: 'block' });
        gsap.set(rightRef.current, { display: 'block' });
        gsap.set(centerRef.current, { overflow: 'hidden' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dims, getContainerScale]);

  const renderStrip = useCallback((width: number) => {
    return (
      <div 
        className="w-full h-full" 
        style={{ 
          transform: `scale(${overscan})`, 
          transformOrigin: 'center'
        }}
      >
        <CopacabanaShader
          width={width}
          height={dims.height}
          primaryColor="#ed5878"
          secondaryColor="#000000"
          secondaryAlpha={0} // make alternate stripes fully transparent
          opacity={0.5} // overall opacity of the shader
        />
      </div>
    );
  }, [dims.height, overscan]);

  // Always render the full desktop layout - mobile styles applied via GSAP
  return (
    <div className="relative w-full h-full overflow-hidden bg-bom-darkred">
      {/* 3D Shader Background */}
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
        <div ref={sceneRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Left */}
          <div ref={leftRef} className="overflow-hidden bg-transparent">
            {renderStrip(dims.left)}
          </div>

          {/* Center */}
          <div ref={centerRef} className="overflow-hidden bg-transparent">
            {renderStrip(dims.center)}
          </div>

          {/* Right */}
          <div ref={rightRef} className="overflow-hidden bg-transparent">
            {renderStrip(dims.right)}
          </div>
        </div>
      </div>
      
      {/* Overlays */}
      <LeftFadeOverlay fadeWidth={30} opacity={0.9} />
      <PinkTintOverlay 
        intensity={0.7}
        opacity={0.25}
      />
      
      {/* Pink Background Area - Fixed to right */}
      <div 
        className="absolute top-0 bottom-0 right-0 bg-bom-red pointer-events-none z-[420]"
        style={{ 
          width: '20vw',
          opacity: 0.95,
        }}
      />
      
      {/* Content Layer - Flex Layout */}
      <div className="relative z-[500] w-full h-full flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
        {/* Text Content - Left Side */}
        <div className="flex-1 flex items-center justify-start w-full md:w-auto mb-8 md:mb-0">
          <FlavorTextContent 
            month={currentFlavor.month} 
            flavorName={currentFlavor.flavorName} 
            flavorDescription={currentFlavor.flavorDescription}
            heroSubtitle={currentFlavor.heroSubtitle}
            ingredients={currentFlavor.ingredients}
            flavorNotes={currentFlavor.flavorNotes}
            availability={currentFlavor.availability}
            temperature={currentFlavor.temperature}
            ctaText="Learn More"
            opacity={0.95}
          />
        </div>

        {/* Product Image - Right Side */}
        <div className="flex-shrink-0 flex items-center justify-center md:justify-end mr-0 md:mr-8 lg:mr-24">
          <ProductImageFlex 
            size="large"
            opacity={0.95}
            showBadge={true}
            badgeText="This Month"
          />
        </div>
      </div>
    </div>
  );
}
