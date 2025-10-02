'use client';

import { productCategories } from '@/lib/categories';
import CategoryCard from './category-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function CategoriesSection() {
  return (
    <section className="w-full bg-[#faf9f7] py-8 lg:py-12">
      <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 lg:mb-8 border-b border-gray-200">
          <h2 className="font-sans text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Our Collections
          </h2>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 group">
            <span className="font-sans text-sm lg:text-base font-medium">See Full Menu</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 9 9" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M1 8L8 1M8 1H1M8 1V8" stroke="currentColor" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Categories Carousel */}
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 overflow-visible">
            {productCategories.map((category) => (
              <CarouselItem key={category.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="-left-16 border-2 border-gray-800 bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-800" 
          />
          <CarouselNext 
            className="-right-16 border-2 border-gray-800 bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-800" 
          />
        </Carousel>
      </div>
    </section>
  );
}

