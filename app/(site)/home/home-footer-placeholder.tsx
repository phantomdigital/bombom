import Link from "next/link";

/** Footer placeholder for `/home` while final footer content is in progress. */
export default function HomeFooterPlaceholder() {
  return (
    <footer className="w-full shrink-0 bg-bom-dark-blue px-5 py-14 text-bom-white sm:px-10 sm:py-16 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-lime/80">
            Footer placeholder
          </p>
          <h2 className="font-sans text-3xl font-medium tracking-tight sm:text-4xl">
            Stay in the loop with BomBom
          </h2>
          <p className="max-w-2xl font-sans text-base leading-relaxed text-bom-white/80 sm:text-lg">
            Placeholder footer for contact details, opening hours, socials, and
            newsletter wiring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-sans text-sm font-medium">
          <Link href="/locations" className="rounded-full bg-bom-lime px-5 py-2 text-bom-black">
            Find a store
          </Link>
          <Link href="/menu" className="text-bom-white/85 hover:text-bom-white">
            Explore menu
          </Link>
          <Link href="/story" className="text-bom-white/85 hover:text-bom-white">
            About BomBom
          </Link>
        </div>
      </div>
    </footer>
  );
}
