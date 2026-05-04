'use client';

import { ProductCategory } from '@/lib/categories';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: ProductCategory;
  /** Overrides `category.name` when set (e.g. placeholder copy). */
  title?: string;
  /** Overrides `category.description` when set. */
  description?: string;
  /** Tighter type and media inset for dense grids (e.g. home menu strip). */
  compact?: boolean;
}

export default function CategoryCard({
  category,
  title,
  description,
  compact = false,
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayTitle = title ?? category.name;
  const displayDescription = description ?? category.description;

  return (
    <Link
      href={category.href}
      className="group block w-full min-w-0 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-[22%] bg-white supports-[corner-shape:squircle]:[corner-shape:squircle]",
          compact ? "mb-3" : "mb-4",
        )}
      >
        <img 
          src="/images/optim.png" 
          alt={displayTitle}
          className={cn(
            "h-full w-full object-contain transition-transform duration-500 group-hover:scale-105",
            compact
              ? "p-7 sm:p-8 lg:p-9"
              : "p-12 sm:p-14 lg:p-16",
          )}
        />
        
        {/* Circular Button in Top Right Corner */}
        <motion.div 
          className={cn(
            "absolute z-10 flex items-center justify-center overflow-hidden rounded-full bg-gray-900 pointer-events-none",
            compact
              ? "right-1.5 top-1.5 size-12 shadow-[0_0_0_14px_var(--color-bom-marble)]"
              : "right-2 top-2 h-16 w-16 shadow-[0_0_0_20px_var(--color-bom-marble)]",
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        >
          <motion.svg 
            width={compact ? 14 : 18} 
            height={compact ? 14 : 18} 
            viewBox="0 0 9 9" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute text-white pointer-events-none"
            initial={{ x: '-150%', y: '150%' }}
            animate={{
              x: isHovered ? '0%' : '150%',
              y: isHovered ? '0%' : '-150%'
            }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <path d="M1 8L8 1M8 1H1M8 1V8" stroke="currentColor" strokeLinejoin="round"/>
          </motion.svg>
        </motion.div>
      </div>

      {/* Content */}
      <div>
        <h3
          className={cn(
            "font-sans font-bold text-gray-900 tracking-tight transition-colors group-hover:text-gray-700",
            compact ? "mb-1.5 text-base sm:text-lg" : "mb-2 text-xl lg:text-2xl",
          )}
        >
          {displayTitle}
        </h3>
        <p
          className={cn(
            "font-sans text-gray-600 leading-relaxed tracking-wide uppercase",
            compact ? "text-[10px] sm:text-xs" : "text-xs lg:text-sm",
          )}
        >
          {displayDescription}
        </p>
      </div>
    </Link>
  );
}

