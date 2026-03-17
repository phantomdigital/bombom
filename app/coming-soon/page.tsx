import Image from "next/image";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-12">
      <div className="w-full max-w-5xl">
        {/* <div className="flex items-center justify-between text-xs sm:text-sm lg:text-base font-medium text-gray-700 uppercase tracking-[0.3em] px-4 sm:px-8 mb-6 sm:mb-8 lg:mb-10">
          <span>Frozen Yogurt</span>
          <span>Soft Serve</span>
          <span>Ice Cream</span>
        </div> */}

        <div className="w-full px-4 sm:px-8">
          <Image
            src="/images/logo/logo.png"
            alt="BomBom Treats"
            width={1200}
            height={300}
            className="w-full h-auto"
            priority
          />
        </div>

        <p className="mt-8 sm:mt-10 lg:mt-12 text-center text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          We're putting the finishing touches on something special. Coming Autumn 2026.
        </p>
      </div>
    </main>
  );
}
