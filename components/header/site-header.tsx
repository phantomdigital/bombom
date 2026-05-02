"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CakeIcon,
  CoffeeIcon,
  IceCreamIcon,
} from "@phosphor-icons/react";
import { Menu, X } from "lucide-react";
import BomBomLogo from "@/components/bombom-logo";
import NavPopoverLink, {
  type NavPopoverConfig,
} from "@/components/header/nav-popover-link";
import AccountIcon from "@/components/icons/account-icon";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/components/ui/focus-ring";
import { productCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  popover?: NavPopoverConfig;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/menu",
    label: "Menu",
    popover: {
      variant: "mega",
      groups: [
        {
          href: "/menu/soft-serve",
          label: "Soft serve",
          description: "Swirls, drops, and seasonal flavours.",
          imageLabel: "Soft serve placeholder",
          heroTintClassName: "bg-bom-ice",
          icon: IceCreamIcon,
          items: [
            {
              href: "/menu/soft-serve",
              label: "Monthly flavour",
              description: "The current swirl on rotation.",
            },
            {
              href: "/specials",
              label: "Limited specials",
              description: "Short-run flavours and launch treats.",
            },
          ],
        },
        {
          href: "/menu/cakes",
          label: "Cakes & celebrations",
          description: "Gelato cakes and party-ready treats.",
          imageLabel: "Cake placeholder",
          heroTintClassName: "bg-bom-violet",
          icon: CakeIcon,
          items: [
            {
              href: "/menu/cakes",
              label: "Gelato cakes",
              description: "Layered cakes for birthdays and events.",
            },
            {
              href: "/menu/take-home",
              label: "Take-home tubs",
              description: "Treats for the freezer.",
            },
          ],
        },
        {
          href: "/menu/desserts",
          label: "Coffee & desserts",
          description: "Affogato, coffee, and sweet extras.",
          imageLabel: "Dessert placeholder",
          heroTintClassName: "bg-bom-orange",
          icon: CoffeeIcon,
          items: productCategories.slice(3).map((category) => ({
            href: category.href,
            label: category.name,
            description: category.description,
          })),
        },
      ],
    },
  },
  {
    href: "/specials",
    label: "Specials",
    popover: {
      variant: "compact",
      items: [
        { href: "/specials", label: "Monthly specials" },
        { href: "/menu/soft-serve", label: "Soft serve drops" },
        { href: "/menu/cakes", label: "Celebration cakes" },
      ],
    },
  },
  {
    href: "/story",
    label: "Story",
    popover: {
      variant: "compact",
      items: [
        { href: "/story", label: "About BomBom" },
        { href: "/story#ingredients", label: "Ingredients" },
        { href: "/story#community", label: "Community" },
      ],
    },
  },
  {
    href: "/locations",
    label: "Visit",
    popover: {
      variant: "compact",
      items: [
        { href: "/locations", label: "Wagga Wagga store" },
        { href: "/locations#hours", label: "Opening hours" },
        { href: "/locations#contact", label: "Contact" },
      ],
    },
  },
];

const navLinkClass =
  cn(
    "font-sans text-xl font-medium leading-none tracking-normal antialiased text-bom-black/80 transition-colors hover:text-bom-black hover:bg-neutral-200 p-6 rounded-md",
    focusRing
  );

/** Matches `/home` View menu sizing (`bomPill` defaults); header uses `w-auto` not hero `w-full`. */
const orderNowButtonClass =
  "bg-bom-black text-bom-white shrink-0 font-sans font-medium antialiased w-auto lg:whitespace-nowrap items-center justify-center";

const mobileLinkClass =
  cn(
    "flex w-full items-center justify-between rounded-2xl px-4 py-3 font-sans text-base font-medium leading-none tracking-normal antialiased text-bom-black/85 transition-colors hover:bg-bom-black/[0.04] hover:text-bom-black",
    focusRing
  );

/** Same height as `Button` `size="bomPill"` (`h-[65px]`). */
const accountIconButtonClass =
  cn(
    "inline-flex size-[65px] shrink-0 items-center justify-center rounded-md bg-bom-white text-bom-black/90 transition-colors hover:bg-neutral-200 hover:text-bom-black",
    focusRing
  );

const HEADER_HIDE_AFTER_Y = 96;
const HEADER_SCROLL_DELTA = 8;
const HEADER_HIDE_SCROLL_DISTANCE = 100;

type SiteHeaderProps = {
  interactionDisabled?: boolean;
};

export default function SiteHeader({
  interactionDisabled = false,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMobileHref, setExpandedMobileHref] = useState<string | null>(
    null
  );
  const [activePopoverHref, setActivePopoverHref] = useState<string | null>(
    null
  );
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const downwardScrollDistanceRef = useRef(0);
  const isTickingRef = useRef(false);

  useEffect(() => {
    setIsMobileOpen(false);
    setExpandedMobileHref(null);
    setActivePopoverHref(null);
    setIsHeaderHidden(false);
    downwardScrollDistanceRef.current = 0;
  }, [pathname]);

  useEffect(() => {
    if (!interactionDisabled) return;
    setActivePopoverHref(null);
  }, [interactionDisabled]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function handleScroll() {
      if (isTickingRef.current) return;
      isTickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollYRef.current;

        if (Math.abs(delta) > HEADER_SCROLL_DELTA) {
          setActivePopoverHref(null);
        }

        if (isMobileOpen || currentScrollY <= HEADER_HIDE_AFTER_Y) {
          downwardScrollDistanceRef.current = 0;
          setIsHeaderHidden(false);
        } else if (delta > HEADER_SCROLL_DELTA) {
          downwardScrollDistanceRef.current += delta;
          if (downwardScrollDistanceRef.current >= HEADER_HIDE_SCROLL_DISTANCE) {
            setIsHeaderHidden(true);
          }
        } else if (delta < -HEADER_SCROLL_DELTA) {
          downwardScrollDistanceRef.current = 0;
          setIsHeaderHidden(false);
        }

        lastScrollYRef.current = currentScrollY;
        isTickingRef.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileOpen]);

  function closeMobileNav() {
    setIsMobileOpen(false);
    setExpandedMobileHref(null);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] px-4 pt-4 transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none sm:px-6 sm:pt-6 lg:px-10 lg:pt-7",
        isHeaderHidden ? "-translate-y-[calc(100%+2rem)]" : "translate-y-0",
        interactionDisabled && "pointer-events-none"
      )}
    >
      <div className="mx-auto w-full max-w-[87.5rem]">
        <div className="flex flex-col gap-3">
          <div
            data-site-header-pill
            className={cn(
              "flex items-center gap-4 rounded-full bg-bom-white py-3 pl-7 pr-3",
              "ring-1 ring-bom-black/[0.06]",
              "sm:gap-5 sm:py-3.5 sm:pl-9 sm:pr-3.5 lg:gap-1 lg:py-2 lg:pl-11 lg:pr-4 xl:gap-0"
            )}
          >
            <Link
              href="/home"
              className={cn(
                "flex min-w-0 shrink translate-x-1 items-center rounded-full sm:translate-x-1.5",
                focusRing
              )}
              aria-label="BomBom Treats home"
            >
              <BomBomLogo
                variant="dark"
                className="block h-7 w-auto sm:h-8 lg:h-10"
              />
            </Link>

            <nav
              aria-label="Primary"
              className="hidden min-w-0 flex-1 items-center justify-end gap-4 px-4 lg:flex lg:gap-8 lg:px-6 xl:gap-0 xl:px-8"
            >
              {NAV_ITEMS.map((item) => (
                <NavPopoverLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  popover={item.popover}
                  className={navLinkClass}
                  interactionDisabled={interactionDisabled}
                  open={activePopoverHref === item.href}
                  onOpenChange={(open) => {
                    setActivePopoverHref((currentHref) => {
                      if (open) return item.href;
                      return currentHref === item.href ? null : currentHref;
                    });
                  }}
                />
              ))}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-5">
              <div className="box-border flex shrink-0 items-center gap-1 p-3.5 sm:p-3.5">
                <Link
                  href="/account"
                  className={accountIconButtonClass}
                  aria-label="Account"
                >
                  <AccountIcon
                    size={32}
                    strokeWidth={19}
                    aria-hidden
                    className="shrink-0 text-bom-black/90"
                  />
                </Link>
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
                  className={cn(
                    "flex size-[65px] shrink-0 items-center justify-center rounded-full text-bom-black/80 transition-colors hover:bg-bom-black/[0.04] hover:text-bom-black lg:hidden",
                    focusRing
                  )}
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
                {NAV_ITEMS.map((item) => {
                  const isExpanded = expandedMobileHref === item.href;

                  return (
                    <li key={item.href}>
                      {item.popover ? (
                        <>
                          <button
                            type="button"
                            className={mobileLinkClass}
                            aria-expanded={isExpanded}
                            onClick={() =>
                              setExpandedMobileHref((currentHref) =>
                                currentHref === item.href ? null : item.href
                              )
                            }
                          >
                            <span>{item.label}</span>
                            <span aria-hidden>{isExpanded ? "-" : "+"}</span>
                          </button>
                          {isExpanded ? (
                            <div className="mt-1 grid gap-1 rounded-2xl bg-bom-black/[0.03] p-2">
                              {item.popover.variant === "mega"
                                ? item.popover.groups.map((group) => (
                                    <Link
                                      key={group.href}
                                      href={group.href}
                                      onClick={closeMobileNav}
                                      className={cn(
                                        "rounded-xl px-4 py-3 font-sans text-sm font-medium leading-none text-bom-black/75 transition-colors hover:bg-bom-white hover:text-bom-black focus-visible:bg-bom-white",
                                        focusRing
                                      )}
                                    >
                                      {group.label}
                                    </Link>
                                  ))
                                : item.popover.items.map((popoverItem) => (
                                    <Link
                                      key={popoverItem.href}
                                      href={popoverItem.href}
                                      onClick={closeMobileNav}
                                      className={cn(
                                        "rounded-xl px-4 py-3 font-sans text-sm font-medium leading-none text-bom-black/75 transition-colors hover:bg-bom-white hover:text-bom-black focus-visible:bg-bom-white",
                                        focusRing
                                      )}
                                    >
                                      {popoverItem.label}
                                    </Link>
                                  ))}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={mobileLinkClass}
                          onClick={closeMobileNav}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
                <li className="sm:hidden">
                  <Link
                    href="/locations"
                    className={mobileLinkClass}
                    onClick={closeMobileNav}
                  >
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
