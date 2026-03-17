export default function ComingSoonPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-11rem)] px-4 lg:px-10 xl:px-16 2xl:px-18 [@media(min-width:1795px)]:px-48 py-6">
      <section className="w-full min-h-[60vh] rounded-2xl sm:rounded-3xl lg:rounded-4xl bg-[#ed5878] text-white flex items-center justify-center">
        <div className="text-center px-6">
          <p className="uppercase tracking-[0.2em] text-sm opacity-90">
            BomBom Treats
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold">
            Coming Soon
          </h1>
          <p className="mt-4 text-base sm:text-lg opacity-95">
            We are putting the final touches on the new site.
          </p>
        </div>
      </section>
    </main>
  );
}
