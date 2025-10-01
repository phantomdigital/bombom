import PerspectiveGallery from '@/components/perspective-gallery';

export default function Home() {
  return (
    <div className="h-[calc(100vh-12rem)] px-48 py-10">
      <div className="w-full h-full overflow-hidden rounded-4xl bg-[#ed5878] flex items-center justify-center">
        <PerspectiveGallery />
      </div>
    </div>
  );
}
