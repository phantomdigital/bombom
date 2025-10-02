'use client';

import { ProductCategory } from '@/lib/categories';
import { useState } from 'react';

interface CategoryCardProps {
  category: ProductCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={category.href}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden mb-4">
        <img 
          src="/images/optim.png" 
          alt={category.name}
          className="w-full h-full object-contain p-8"
        />
      </div>

      {/* Content */}
      <div>
        <h3 className="font-sans text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          {category.name}
        </h3>
        <p className="font-sans text-xs lg:text-sm text-gray-600 leading-relaxed tracking-wide uppercase">
          {category.description}
        </p>
      </div>
    </a>
  );
}

