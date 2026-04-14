import Link from "next/link";
import HomeMenuScrollExperience from "@/components/home/home-menu-scroll-experience";
import HomeVideoPlaceholder from "@/components/home/home-video-placeholder";

const homeNavItemClass =
  "font-sans text-2xl font-normal capitalize tracking-tight text-bom-black hover:underline underline-offset-[0.18em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-black focus-visible:ring-offset-2 sm:text-3xl md:text-4xl lg:text-5xl";

export default function HomePreviewPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate min-h-screen bg-bom-white"
    >
      <div className="bom-home-page-grid absolute inset-0 -z-10" aria-hidden />
      <div className="relative mx-auto w-full max-w-none px-2 pt-24 sm:px-3 sm:pt-28 md:px-4 md:pt-32 lg:pt-28">
        <div className="flex w-full flex-col gap-12 sm:gap-14 md:gap-16 lg:gap-20">
          <div className="w-full shrink-0">
            <div className="flex w-full flex-col gap-2 sm:gap-3">
              <div className="w-full pb-24">
                <nav
                  aria-label="Primary"
                  className="flex flex-col items-center gap-3 text-center leading-tight sm:flex-row sm:items-baseline sm:justify-between sm:gap-2 sm:text-left md:gap-4"
                >
                  <Link href="#menu" className={homeNavItemClass}>
                    Menu
                  </Link>
                  <span
                    className="hidden select-none text-bom-black/35 sm:inline sm:shrink-0"
                    aria-hidden
                  >
                    ·
                  </span>
                  <Link href="#locations" className={homeNavItemClass}>
                    Locations
                  </Link>
                  <span
                    className="hidden select-none text-bom-black/35 sm:inline sm:shrink-0"
                    aria-hidden
                  >
                    ·
                  </span>
                  <Link href="#about" className={homeNavItemClass}>
                    About
                  </Link>
                </nav>
              </div>
              <div
                className="relative aspect-[1223.31/234.87] w-full"
                role="img"
                aria-label="BomBom Treats — video placeholder masked to logotype"
              >
                <div className="bom-home-logo-video-mask absolute inset-0">
                  <HomeVideoPlaceholder
                    variant="logo"
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <section
            id="locations"
            className="scroll-mt-24"
            aria-labelledby="locations-heading"
          >
            <h2
              id="locations-heading"
              className="sr-only"
            >
              Locations
            </h2>
          </section>
        </div>
      </div>

      <section
        id="about"
        className="sr-only"
        aria-labelledby="home-about-heading"
        tabIndex={-1}
      >
        <h2 id="home-about-heading">About BomBom Treats</h2>
        <p>
          Frozen yoghurt, soft serve, and ice cream in Wagga Wagga. Opening soon
          on Baylis Street.
        </p>
      </section>

      <HomeMenuScrollExperience className="max-w-none" />
    </main>
  );
}
