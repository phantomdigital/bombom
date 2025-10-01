'use client';

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
          {/* Month - Small, understated */}
          <div className="font-mono text-sm lg:text-base font-light tracking-wider uppercase mb-2 lg:mb-3 opacity-70">
            {month}
          </div>
          
          {/* Main Flavor Name - Bold, prominent */}
          <h1 className="font-gasoek font-normal text-4xl lg:text-6xl xl:text-8xl leading-[0.85] tracking-[0.0001em] mb-4 lg:mb-6">
            {flavorName}
          </h1>
          
          {/* Flavor Description - Clean, readable */}
          {flavorDescription && (
            <div className="font-sans text-xl lg:text-2xl font-normal mb-6 lg:mb-8 opacity-85 tracking-wide">
              {flavorDescription}
            </div>
          )}

          {/* Hero Subtitle - Brief compelling copy */}
          {heroSubtitle && (
            <p className="font-sans text-base lg:text-lg font-light opacity-80 leading-relaxed max-w-md">
              {heroSubtitle}
            </p>
          )}
        </div>

        {/* Call to Action Button - Bottom aligned */}
        <div className="pointer-events-auto mt-auto">
          <button 
            onClick={onCtaClick}
            className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/30 text-white font-sans font-medium text-sm lg:text-base uppercase tracking-[0.2em] px-10 lg:px-12 py-4 lg:py-5 hover:bg-white hover:border-white hover:text-bom-darkred transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-[1.02]"
          >
            <span className="relative z-10">{ctaText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          </button>
        </div>
      </div>
    </div>
  );
}
