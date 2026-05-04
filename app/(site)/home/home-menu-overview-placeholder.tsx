import SiteChromeRail from "@/components/site/site-chrome-rail";
import CategoryCard from "@/components/categories/category-card";
import { productCategories } from "@/lib/categories";

const MENU_OVERVIEW_CARDS = productCategories.slice(0, 4);

const MENU_CARD_LOREM = [
  {
    title: "Lorem ipsum",
    description: "Dolor sit amet consectetur adipiscing elit sed do eiusmod.",
  },
  {
    title: "Tempor incididunt",
    description: "Ut labore et dolore magna aliqua ut enim ad minim veniam.",
  },
  {
    title: "Quis nostrud",
    description: "Exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
  },
  {
    title: "Duis aute irure",
    description: "Dolor in reprehenderit in voluptate velit esse cillum dolore.",
  },
] as const;

/** Marble below-the-fold block to exercise scroll + transitions on `/home`. */
export default function HomeMenuOverviewPlaceholder() {
  return (
    <section
      id="menu-overview"
      aria-labelledby="menu-overview-heading"
      className="w-full min-h-[clamp(34rem,100dvh,60rem)] shrink-0 bg-bom-marble py-20 sm:py-24 lg:py-28"
    >
      <SiteChromeRail>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-black/70">
          Lorem ipsum
        </p>
        <h2
          id="menu-overview-heading"
          className="mt-3 font-sans text-3xl font-medium tracking-tight text-bom-black sm:text-4xl"
        >
          Dolor sit amet
        </h2>
        <p className="mt-4 max-w-xl font-sans text-base leading-snug text-bom-black/75 sm:text-lg">
          Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
        </p>
        <ul className="mt-16 grid w-full list-none grid-cols-1 gap-x-4 gap-y-8 min-[640px]:grid-cols-2 min-[640px]:gap-x-6 min-[640px]:gap-y-10 min-[900px]:grid-cols-4 min-[900px]:gap-x-16 min-[900px]:gap-y-8 md:mt-20">
          {MENU_OVERVIEW_CARDS.map((category, index) => {
            const lorem = MENU_CARD_LOREM[index];
            return (
              <li key={category.id} className="min-w-0 w-full">
                <CategoryCard
                  category={category}
                  compact
                  title={lorem.title}
                  description={lorem.description}
                />
              </li>
            );
          })}
        </ul>
      </SiteChromeRail>
    </section>
  );
}
