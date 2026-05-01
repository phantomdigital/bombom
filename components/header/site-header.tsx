"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import BomBomLogo from "@/components/bombom-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
];

const navLinkClass =
  "font-sans text-base font-medium leading-none tracking-normal antialiased text-bom-black/80 transition-colors hover:text-bom-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-dark-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bom-white rounded-sm";

/** Matches `/home` View menu sizing (`bomPill` defaults); header uses `w-auto` not hero `w-full`. */
const orderNowButtonClass =
  "bg-bom-black text-bom-white shrink-0 font-sans font-medium antialiased w-auto lg:whitespace-nowrap items-center justify-center";

const mobileLinkClass =
  "flex w-full items-center justify-between rounded-2xl px-4 py-3 font-sans text-base font-medium leading-none tracking-normal antialiased text-bom-black/85 transition-colors hover:bg-bom-black/[0.04] hover:text-bom-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-dark-blue";

/**
 * Persistent site chrome: floating white pill that mirrors a Linktree-style
 * header. Stacks above the route-transition overlay so colour wipes peel
 * underneath it.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-7">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              "flex items-center gap-4 rounded-full bg-bom-white py-3 pl-7 pr-3",
              "ring-1 ring-bom-black/[0.06]",
              "sm:gap-5 sm:py-3.5 sm:pl-9 sm:pr-3.5 lg:gap-6 lg:py-4 lg:pl-11 lg:pr-4 xl:gap-7"
            )}
          >
            <Link
              href="/home"
              className="flex min-w-0 shrink translate-x-1 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-dark-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bom-white sm:translate-x-1.5"
              aria-label="BomBom Treats home"
            >
              <BomBomLogo
                variant="dark"
                className="block h-7 w-auto sm:h-8 lg:h-10"
              />
            </Link>

            <nav
              aria-label="Primary"
              className="hidden flex-1 items-center justify-center gap-10 px-6 py-3 lg:flex lg:gap-12 lg:px-10 lg:py-4 xl:gap-14 xl:px-12"
            >
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-5">
              <Link
                href="/locations"
                className={cn(navLinkClass, "hidden sm:inline-flex")}
              >
                Find a store
              </Link>
              <div className="box-border flex shrink-0 items-center gap-3 p-3.5 sm:gap-3.5">
                <Button
                  variant="bomPill"
                  size="bomPill"
                  asChild
                  className={orderNowButtonClass}
                >
                  <Link href="/menu">
                    <span>Order now</span>
                  </Link>
                </Button>
                <button
                  type="button"
                  aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileOpen}
                  aria-controls="site-mobile-nav"
                  onClick={() => setIsMobileOpen((open) => !open)}
                  className="flex size-[65px] shrink-0 items-center justify-center rounded-full text-bom-black/80 transition-colors hover:bg-bom-black/[0.04] hover:text-bom-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-dark-blue lg:hidden"
                >
                  {isMobileOpen ? (
                    <X className="size-5" aria-hidden="true" />
                  ) : (
                    <Menu className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {isMobileOpen && (
            <nav
              id="site-mobile-nav"
              aria-label="Mobile primary"
              className={cn(
                "rounded-3xl bg-bom-white p-3",
                "ring-1 ring-bom-black/[0.06]",
                "lg:hidden"
              )}
            >
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={mobileLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="sm:hidden">
                  <Link href="/locations" className={mobileLinkClass}>
                    Find a store
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
