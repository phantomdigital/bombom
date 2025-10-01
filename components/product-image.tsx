'use client';

import StrawberryParticles from './strawberry-particles';
import TickerTape from './ticker-tape';

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
  opacity = 0.9,
  showStrawberries = false,
  strawberryCount = 180,
  strawberrySpawnRate = 8.0,
  strawberryOpacity = 0.9,
  showBadge = false,
  badgeText = 'This Month',
  showTicker = false,
  tickerText = 'FRESH STRAWBERRY GELATO • MADE DAILY • LIMITED TIME'
}: ProductImageProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'right':
        return 'right-8 lg:right-90 top-1/2 -translate-y-1/2';
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
          position === 'right' ? 'right-0 w-[40vw] lg:w-[29vw]' : 
          position === 'left' ? 'left-0 w-[40vw] lg:w-[35vw]' : 
          'left-1/2 -translate-x-1/2 w-[40vw] lg:w-[35vw]'
        }`}
        style={{ 
          zIndex: 420 // Pink background - bottom layer
        }}
      />
      

      
      {/* Strawberry particles - positioned between background and product */}
      {showStrawberries && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 440 }}>
          <StrawberryParticles 
            particleCount={strawberryCount}
            spawnRate={strawberrySpawnRate}
            opacity={strawberryOpacity}
          />
        </div>
      )}
      
      <div
        className={`absolute pointer-events-none ${getPositionClasses()}`}
        style={{ 
          zIndex: 450 // Product image - top layer (below text at 500)
        }}
      >
        {/* Neo-Grotesque Asterisk Badge */}
        {showBadge && (
          <div 
            className="absolute -top-12 -right-12 lg:-top-16 lg:-right-16 pointer-events-auto z-50"
            style={{ 
              animation: 'spin-slow 45s linear infinite'
            }}
          >
            <div className="relative w-32 h-32 lg:w-40 lg:h-40">
              {/* Asterisk/Star shape - 6 points */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 lg:w-4 h-20 lg:h-24 bg-black"
                    style={{
                      transform: `rotate(${i * 60}deg)`,
                      transformOrigin: 'center center'
                    }}
                  />
                ))}
              </div>
              
              {/* Main circle */}
              <div className="absolute inset-6 lg:inset-7 bg-white rounded-full border-4 lg:border-[5px] border-black shadow-2xl flex items-center justify-center overflow-hidden">
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
