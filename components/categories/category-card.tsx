'use client';

import { ProductCategory } from '@/lib/categories';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CategoryCardProps {
  category: ProductCategory;
  /** Overrides `category.name` when set (e.g. placeholder copy). */
  title?: string;
  /** Overrides `category.description` when set. */
  description?: string;
}

export default function CategoryCard({
  category,
  title,
  description,
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayTitle = title ?? category.name;
  const displayDescription = description ?? category.description;

  return (
    <Link
      href={category.href}
      className="group block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-[22%] bg-white supports-[corner-shape:squircle]:[corner-shape:squircle]">
        <img 
          src="/images/optim.png" 
          alt={displayTitle}
          className="w-full h-full object-contain p-12 transition-transform duration-500 group-hover:scale-105 sm:p-14 lg:p-16"
        />
        
        {/* Circular Button in Top Right Corner */}
        <motion.div 
          className="absolute top-2 right-2 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center overflow-hidden z-10 pointer-events-none shadow-[0_0_0_20px_var(--color-bom-marble)]"
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
            width="18" 
            height="18" 
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
        <h3 className="font-sans text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight transition-colors group-hover:text-gray-700">
          {displayTitle}
        </h3>
        <p className="font-sans text-xs lg:text-sm text-gray-600 leading-relaxed tracking-wide uppercase">
          {displayDescription}
        </p>
      </div>
    </Link>
  );
}

