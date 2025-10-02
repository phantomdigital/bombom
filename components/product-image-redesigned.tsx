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
  className?: string;
}

export default function ProductImage({
  imagePath = '/images/optim.png',
  position = 'center',
  size = 'medium',
  opacity = 1,
  showBadge = false,
  badgeText = 'This Month',
  showStrawberries = false,
  className = '',
}: ProductImageProps) {
  const productContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for subtle 3D effect (client-side only)
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

  // Apply subtle 3D rotation based on mouse position
  useEffect(() => {
    const rotationIntensity = 0.8;
    const rotateX = -mousePosition.y * rotationIntensity;
    const rotateY = mousePosition.x * rotationIntensity;
    const rotateZ = mousePosition.x * rotationIntensity * 0.3;

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

  // CSS classes for different sizes - no JavaScript needed
  const sizeClasses = {
    small: 'w-32 sm:w-40 md:w-48 lg:w-56',
    medium: 'w-48 sm:w-56 md:w-64 lg:w-72',
    large: 'w-64 sm:w-72 md:w-80 lg:w-96',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background Color Area - Uses CSS for positioning */}
      <div 
        className="absolute inset-0 bg-bom-red pointer-events-none -z-10"
        style={{ 
          transform: 'scale(1.2)',
          opacity: 0.8,
        }}
      />

      {/* Neo Particles Background */}
      {showStrawberries && (
        <div className="absolute inset-0 pointer-events-none -z-5">
          <NeoParticles />
        </div>
      )}
      
      {/* Product Container */}
      <div
        ref={productContainerRef}
        className="relative flex flex-col items-center justify-center"
        style={{ opacity }}
      >
        {/* Badge - Positioned relative to product */}
        {showBadge && (
          <div 
            ref={badgeRef}
            className="absolute -top-8 -right-8 z-10 pointer-events-auto"
            style={{ 
              animation: 'spin-slow 45s linear infinite'
            }}
          >
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40">
              {/* Asterisk/Star shape - 6 points */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-16 sm:h-18 lg:h-20 bg-bom-darkred"
                    style={{
                      transform: `rotate(${i * 60}deg)`,
                      transformOrigin: 'center center'
                    }}
                  />
                ))}
              </div>
              
              {/* Main circle */}
              <div 
                className="absolute inset-4 sm:inset-5 lg:inset-6 bg-white rounded-full border-3 lg:border-4 border-black flex items-center justify-center overflow-hidden" 
                style={{ boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.5)' }}
              >
                {/* Neo-star SVG in center */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <svg 
                    viewBox="0 0 149.13 149.13" 
                    className="w-12 h-12 lg:w-14 lg:h-14 fill-bom-darkred" 
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
                    <text className="text-[0.5rem] lg:text-[0.55rem] font-mono font-black uppercase fill-black" letterSpacing="0.2em">
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
        
        {/* Product Image */}
        <img
          src={imagePath}
          alt="Product"
          className={`${sizeClasses[size]} h-auto object-contain drop-shadow-2xl relative z-10`}
          style={{
            filter: 'brightness(1.1) contrast(1.05)' 
          }}
        />

      </div>
    </div>
  );
}
