import Link from "next/link";
import { Button } from "@/components/ui/button";

const EVENT_PLACEHOLDERS = [
  "Birthday party packs",
  "School fundraiser tubs",
  "Corporate sundae bar",
] as const;

/** Musk band below menu overview for home-page service teaser content. */
export default function HomeEventsCateringPlaceholder() {
  return (
    <section
      id="events-catering-overview"
      aria-labelledby="events-catering-heading"
      className="flex w-full min-h-[110dvh] shrink-0 items-center bg-bom-musk px-5 py-16 sm:px-10 sm:py-20 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-black/70">
          Events & catering
        </p>
        <h2
          id="events-catering-heading"
          className="mt-3 font-sans text-3xl font-medium tracking-tight text-bom-black sm:text-4xl"
        >
          Events & catering - placeholder
        </h2>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-bom-black/85 sm:text-lg">
          Placeholder section for event-focused offers like party packs,
          pop-ups, and catering bundles. Content, pricing tiles, and booking
          calls-to-action can be wired in later.
        </p>
        <Button
          variant="bomPill"
          size="bomPill"
          asChild
          className="mt-8 w-full lg:w-auto lg:whitespace-nowrap items-center justify-center bg-bom-berry text-bom-white font-sans font-medium antialiased"
        >
          <Link href="/locations">
            <span>Enquire for an event</span>
          </Link>
        </Button>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_PLACEHOLDERS.map((label) => (
            <li
              key={label}
              className="rounded-2xl border border-bom-black/15 bg-bom-white/55 p-5"
            >
              <h3 className="font-sans text-base font-medium text-bom-black">
                {label}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-bom-black/70">
                Placeholder copy for inclusions, minimum spend, and lead time.
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
