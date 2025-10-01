'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { getCurrentMonthFlavor } from '@/lib/flavors';
import CopacabanaShader from './copacabana-shader';
import GrainOverlay from './grain-overlay';
import AtmosphereOverlay from './atmosphere-overlay';
import GeometricOverlay from './geometric-overlay';
import Scanlines from './scanlines';
import ChromaticAberration from './chromatic-aberration';
import LeftFadeOverlay from './left-fade-overlay';
import FlavorTextOverlay from './flavor-text-overlay';
import PinkTintOverlay from './pink-tint-overlay';
import ProductImage from './product-image';

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
  const containerScale = 0.5; // scale up the entire 3D scene container

  useEffect(() => {
    if (!containerRef.current || !sceneRef.current) return;

    const { left, center, right, height } = dims;

    // Perspective setup
    gsap.set(containerRef.current, { perspective: 1200, perspectiveOrigin: '50% 50%' });
    gsap.set(sceneRef.current, { width: center, height, transformStyle: 'preserve-3d', scale: containerScale, rotateZ: 90 });

    // Hinge side walls - static positioning, shader handles animation
    // Left panel moves inward when center is narrower
    gsap.set(leftRef.current, { position: 'absolute', top: 0, bottom: 0, left: 0, width: left, transformOrigin: 'right center', x: -left, rotateY: angle });
    gsap.set(centerRef.current, { position: 'absolute', inset: 0 });
    // Right panel positioned at the edge of the narrower center
    gsap.set(rightRef.current, { position: 'absolute', top: 0, bottom: 0, left: center, width: right, transformOrigin: 'left center', rotateY: -angle });
  }, [dims]);

  const renderStrip = (width: number) => {
    return (
      <div className="w-full h-full" style={{ transform: `scale(${overscan})`, transformOrigin: 'center' }}>
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
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-bom-darkred">
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
      {/* Overlay sits above everything without affecting 3D stacking */}
   
      <LeftFadeOverlay fadeWidth={30} opacity={0.9} />
      <PinkTintOverlay 
        intensity={0.7}
        opacity={0.25}
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
    </div>
  );
}
