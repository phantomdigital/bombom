const PLACEHOLDER_CATEGORIES = [
  "Soft serve",
  "Frozen yoghurt",
  "Toppings bar",
  "Drinks",
  "Kids & sharing",
  "Seasonal specials",
] as const;

/** Marble below-the-fold block to exercise scroll + transitions on `/home`. */
export default function HomeMenuOverviewPlaceholder() {
  return (
    <section
      id="menu-overview"
      aria-labelledby="menu-overview-heading"
      className="w-full min-h-[110dvh] shrink-0 bg-bom-marble px-5 py-16 sm:px-10 sm:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-black/70">
          Menu overview
        </p>
        <h2
          id="menu-overview-heading"
          className="mt-3 font-sans text-3xl font-medium tracking-tight text-bom-black sm:text-4xl"
        >
          Menu overview - placeholder
        </h2>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-bom-black/80 sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Scroll this page to check how the ice hero and marble
          band read under the header and page transitions.
        </p>
        <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_CATEGORIES.map((title) => (
            <li
              key={title}
              className="rounded-2xl border border-bom-black/10 bg-bom-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-sans text-lg font-medium text-bom-black">
                {title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-bom-black/70">
                Placeholder row - sizes, pricing, and imagery wire in later.
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-2xl font-sans text-sm leading-relaxed text-bom-black/60">
          Extra tail copy so the section has real length on tall viewports. Duis
          aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          eu fugiat nulla pariatur.
        </p>
      </div>
    </section>
  );
}
