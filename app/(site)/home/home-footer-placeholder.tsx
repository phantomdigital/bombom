import Link from "next/link";
import KlaviyoEmailCapture from "@/components/landing/klaviyo-email-capture";
import SiteChromeRail from "@/components/site/site-chrome-rail";

const FOOTER_EXPLORE_LINKS = [
  { href: "/menu", label: "Lorem ipsum" },
  { href: "/specials", label: "Dolor sit amet" },
  { href: "/story", label: "Consectetur elit" },
  { href: "/locations", label: "Sed do eiusmod" },
] as const;

const YEAR = new Date().getFullYear();

/** Site-style footer for `/home` — marble surface, ink type, lorem placeholder copy. */
export default function HomeFooterPlaceholder() {
  return (
    <footer className="w-full shrink-0 border-t border-bom-ink/10 bg-bom-marble pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-14 text-bom-ink sm:pt-16">
      <SiteChromeRail>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-ink/70">
              Lorem ipsum
            </p>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-bom-ink/75">
              Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
            <address className="mt-6 font-sans text-sm not-italic leading-snug text-bom-ink/80">
              Ut enim ad minim veniam
              <br />
              Quis nostrud exercitation ullamco
            </address>
          </div>

          <nav
            className="lg:col-span-3"
            aria-label="Footer"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-ink/70">
              Tempor incididunt
            </p>
            <ul className="mt-4 flex flex-col gap-3 font-sans text-sm font-medium">
              {FOOTER_EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-bom-ink/80 transition-colors hover:text-bom-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-ink/70">
              Ut labore et
            </p>
            <h2 className="mt-3 font-sans text-2xl font-medium tracking-tight text-bom-ink sm:text-3xl">
              Dolore magna aliqua enim ad minim
            </h2>
            <p className="mt-2 max-w-lg font-sans text-sm leading-relaxed text-bom-ink/75">
              Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-6">
              <KlaviyoEmailCapture
                variant="stacked"
                buttonText="Duis aute irure"
                placeholder="dolor@example.com"
                onDarkSurface={false}
                className="max-w-xl"
                successMessage="Excepteur sint occaecat cupidatat."
              />
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-bom-ink/10 pt-10 sm:mt-16">
          <p className="font-sans text-sm text-bom-ink/55">
            © {YEAR} Non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </SiteChromeRail>
    </footer>
  );
}
