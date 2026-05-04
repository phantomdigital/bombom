import Link from "next/link";
import { Button } from "@/components/ui/button";
import SiteChromeRail from "@/components/site/site-chrome-rail";

const EVENT_CARD_LOREM = [
  {
    title: "Lorem ipsum",
    body: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  },
  {
    title: "Incididunt ut labore",
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    title: "Duis aute irure",
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  },
] as const;

/** Below menu overview — same rail width as other home strips (block layout, not flex-centered). */
export default function HomeEventsCateringPlaceholder() {
  return (
    <section
      id="events-catering-overview"
      aria-labelledby="events-catering-heading"
      className="w-full shrink-0 bg-bom-musk py-20 sm:py-24 lg:py-28"
    >
      <SiteChromeRail>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-black/70">
          Events &amp; catering
        </p>
        <h2
          id="events-catering-heading"
          className="mt-3 font-sans text-3xl font-medium tracking-tight text-bom-black sm:text-4xl"
        >
          Lorem ipsum dolor sit
        </h2>
        <p className="mt-4 max-w-xl font-sans text-base leading-snug text-bom-black/75 sm:text-lg">
          Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
        </p>
        <Button
          variant="bomPill"
          size="bomPill"
          asChild
          className="mt-8 w-full bg-bom-berry font-sans font-medium text-bom-white antialiased lg:w-auto lg:whitespace-nowrap"
        >
          <Link href="/locations">
            <span>Ut enim ad minim</span>
          </Link>
        </Button>

        <ul className="mt-16 grid list-none grid-cols-1 gap-y-6 sm:gap-y-8 md:mt-20 md:grid-cols-3 md:gap-x-10 md:gap-y-0 lg:gap-x-14">
          {EVENT_CARD_LOREM.map(({ title, body }) => (
            <li key={title} className="min-w-0 border-t border-bom-black/15 pt-6 md:border-t-0 md:pt-0">
              <h3 className="font-sans text-base font-medium text-bom-black">{title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-bom-black/70">{body}</p>
            </li>
          ))}
        </ul>
      </SiteChromeRail>
    </section>
  );
}
