'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import NeoParticles from './neo-particles';

interface ProductImageProps {
  imagePath?: string;
  position?: 'right' | 'left' | 'center';
  size?: 'small' | 'medium' | 'large';
  opacity?: number;
  showStrawberries?: boolean;
  strawberryCount?: number;
  strawberrySpawnRate?: number;
  strawberryOpacity?: number;
  showBadge?: boolean;
  badgeText?: string;
  showTicker?: boolean;
  tickerText?: string;
}

export default function ProductImage({
  imagePath = '/images/optim.png',
  position = 'right',
  size = 'medium',
  showBadge = false,
  badgeText = 'This Month',
}: ProductImageProps) {
  const productContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize mouse position to -1 to 1 range
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Very subtle rotation based on mouse position
    const rotationIntensity = 0.8; // Much more subtle - less than 1 degree
    const rotateX = -mousePosition.y * rotationIntensity;
    const rotateY = mousePosition.x * rotationIntensity;
    const rotateZ = mousePosition.x * rotationIntensity * 0.3;

    // Animate the product container
    if (productContainerRef.current) {
      gsap.to(productContainerRef.current, {
        duration: 1.2,
        rotateX,
        rotateY,
        rotateZ,
        ease: "power2.out",
        transformPerspective: 1000,
        transformOrigin: "center center"
      });
    }

    // Animate the badge with slightly different movement
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        duration: 1.0,
        rotateX: rotateX * 0.5,
        rotateY: rotateY * 0.8,
        rotateZ: rotateZ * 1.2,
        ease: "power2.out",
        transformPerspective: 800,
        transformOrigin: "center center"
      });
    }
  }, [mousePosition]);

  const getPositionClasses = () => {
    switch (position) {
      case 'right':
        return 'right-8 lg:right-40 top-1/2 -translate-y-1/2';
      case 'left':
        return 'left-8 lg:left-16 top-1/2 -translate-y-1/2';
      case 'center':
        return 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'right-8 lg:right-16 top-1/2 -translate-y-1/2';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-32 lg:w-48 h-auto';
      case 'medium':
        return 'w-48 lg:w-64 h-auto';
      case 'large':
        return 'w-64 lg:w-94 h-auto';
      default:
        return 'w-48 lg:w-64 h-auto';
    }
  };

  return (
    <>
      {/* Full viewport height background in BOM dark red */}
      <div 
        className={`absolute top-0 bottom-0 bg-bom-red pointer-events-none ${
          position === 'right' ? 'right-0 w-[40vw] lg:w-[18vw] ' : 
          position === 'left' ? 'left-0 w-[40vw] lg:w-[35vw]' : 
          'left-1/2 -translate-x-1/2 w-[40vw] lg:w-[35vw]'
        }`}
        style={{ 
          zIndex: 420 // Pink background - bottom layer
        }}
      />
      

      
      {/* Neo-Grotesque particles - positioned near product */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 440 }}>
        <NeoParticles />
      </div>
      
      <div
        ref={productContainerRef}
        className={`absolute pointer-events-none ${getPositionClasses()}`}
        style={{ 
          zIndex: 450 // Product image - top layer (below text at 500)
        }}
      >
        {/* Neo-Grotesque Asterisk Badge */}
        {showBadge && (
          <div 
            ref={badgeRef}
            className="absolute -top-12 -right-12 lg:top-6 lg:-right-1 pointer-events-auto z-50"
            style={{ 
              animation: 'spin-slow 45s linear infinite'
            }}
          >
            <div className="relative w-40 h-40 lg:w-50 lg:h-50">
              {/* Asterisk/Star shape - 6 points */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 lg:w-4 h-20 lg:h-24 bg-bom-darkred"
                    style={{
                      transform: `rotate(${i * 60}deg)`,
                      transformOrigin: 'center center'
                    }}
                  />
                ))}
              </div>
              
              {/* Main circle */}
              <div className="absolute inset-6 lg:inset-7 bg-white rounded-full border-4 lg:border-[5px] border-black flex items-center justify-center overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.5)' }}>
                {/* Neo-star SVG in center */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <svg 
                    viewBox="0 0 149.13 149.13" 
                    className="w-16 h-16 lg:w-12 lg:h-12 fill-bom-darkred" 
                    style={{ 
                      animation: 'spin-slow 8s linear infinite reverse'
                    }}
                  >
                    <path 
                      d="M139.58,65.94l-41.4-.69,29.76-28.78c3.86-3.73,3.96-9.88.23-13.74-3.73-3.86-9.88-3.96-13.74-.23l-29.76,28.78.69-41.4C85.46,4.51,81.18.09,75.81,0c-5.36-.09-9.79,4.19-9.88,9.55l-.69,41.4-28.78-29.76c-3.73-3.86-9.88-3.96-13.74-.23-3.86,3.73-3.96,9.88-.23,13.74l28.78,29.76-41.4-.69C4.51,63.67.09,67.95,0,73.32c-.09,5.36,4.19,9.79,9.55,9.88l41.4.69-29.76,28.78c-3.86,3.73-3.96,9.88-.23,13.74,3.73,3.86,9.88,3.96,13.74.23l29.76-28.78-.69,41.4c-.09,5.36,4.19,9.79,9.55,9.88h0c5.36.09,9.79-4.19,9.88-9.55l.69-41.4,28.78,29.76c3.73,3.86,9.88,3.96,13.74.23,3.86-3.73,3.96-9.88.23-13.74l-28.78-29.76,41.4.69c5.36.09,9.79-4.19,9.88-9.55h0c.09-5.37-4.19-9.79-9.55-9.88Z"
                    />
                  </svg>
                </div>
                
                {/* Circular rotating text */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    animation: 'spin-slow 12s linear infinite'
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      />
                    </defs>
                    <text className="text-[0.55rem] lg:text-[0.7rem] font-mono font-black uppercase fill-black" letterSpacing="0.2em">
                      <textPath href="#circlePath" startOffset="0%">
                        {badgeText} ✱ {badgeText} ✱ {badgeText} ✱ 
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <img
          src={imagePath}
          alt="Product"
          className={`${getSizeClasses()} object-contain drop-shadow-2xl relative z-10`}
          style={{
            filter: 'brightness(1.1) contrast(1.05)' // Slight enhancement for Neo-Grotesque pop
          }}
        />
      </div>
    </>
  );
}
