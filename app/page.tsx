import PerspectiveGallery from '@/components/perspective-gallery';
import CategoriesSection from '@/components/categories/categories-section';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] [@media(min-width:768px)_and_(max-width:1023px)]:h-[45vh] lg:h-[calc(100vh-13.25rem)] px-4 lg:px-10 xl:px-16 2xl:px-18 [@media(min-width:1795px)]:px-48 py-2 sm:py-3 lg:py-6 pb-8 lg:pb-12">
        <div className="w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-4xl bg-[#ed5878] flex items-center justify-center">
          <PerspectiveGallery />
        </div>
      </div>

      {/* Categories Section */}
      <CategoriesSection />
    </>
  );
}
