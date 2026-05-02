"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  CakeIcon,
  CoffeeIcon,
  IceCreamIcon,
  ListDashesIcon,
  XIcon,
} from "@phosphor-icons/react";
import BomBomLogo from "@/components/bombom-logo";
import NavPopoverLink, {
  type NavPopoverConfig,
} from "@/components/header/nav-popover-link";
import { useHeaderPopoverManager } from "@/components/header/hooks/useHeaderPopoverManager";
import AccountIcon from "@/components/icons/account-icon";
import { useSiteHeaderOrderNowChromeSetter } from "@/components/site/site-header-order-now-chrome-context";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/components/ui/focus-ring";
import { productCategories } from "@/lib/categories";
import {
  getDefaultSeamChromeForPaletteHex,
  getSeamAwareLogoColor,
} from "@/lib/seam-aware-logo-color";
import { getSitePalette } from "@/lib/site-route-theme";
import { cn } from "@/lib/utils";

/** Chrome / pills / gutters use ~90% spacing; desktop nav stays `text-xl`; account shell, Order bomPill & icon glyphs stay baseline size */

type NavItem = {
  href: string;
  label: string;
  popover?: NavPopoverConfig;
};

type HeaderPillHandoffDelta = {
  x: number;
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
    "font-sans text-xl font-medium leading-none tracking-normal antialiased text-bom-black/80 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200 p-[1.35rem] rounded-md",
    focusRing
  );

/** Matches `/home` View menu sizing (`bomPill` defaults); header uses `w-auto` not hero `w-full`. */
const orderNowButtonBaseClass =
  "shrink-0 font-sans font-medium antialiased w-auto lg:whitespace-nowrap items-center justify-center !h-[65px] !min-h-[65px] !px-[58px] !text-base";

const orderNowButtonDefaultColorsClass = "bg-bom-ink text-bom-white";

/** Canonical soft-black ink token (`globals.css`: `--bom-ink`). */
const BOM_INK_CSS_VAR = "var(--bom-ink)";

/** Fill + label for synced CTAs; `fill` mirrors Order pill (`--bom-order-now-fill` aliases `--bom-ink`). */
const HEADER_ORDER_NOW_CHROME = {
  fill: BOM_INK_CSS_VAR,
  foreground: "var(--color-bom-white)",
} as const;

/** Map palette/seam-returned pure blacks to `:root --bom-ink`. */
function isPureBlackInk(cssColor: string): boolean {
  const t = cssColor.trim().toLowerCase();
  return (
    t === "#000" ||
    t === "#000000" ||
    /^rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(t) ||
    /^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*1(?:\.0*)?\s*\)$/.test(t)
  );
}

/** Replace `#000` / `rgb(0,0,0)` with semantic brand ink everywhere the header writes logo colour. */
function coerceBrandInk(cssColor: string): string {
  return isPureBlackInk(cssColor) ? BOM_INK_CSS_VAR : cssColor;
}

const mobileLinkClass =
  cn(
    "flex w-full items-center justify-between rounded-2xl px-[0.9rem] py-[0.675rem] font-sans text-base font-medium leading-none tracking-normal antialiased text-bom-black/85 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
    focusRing
  );

/** Same height as `Button` `size="bomPill"` (`h-[65px]`). */
const accountIconButtonClass =
  cn(
    "inline-flex size-[65px] shrink-0 items-center justify-center rounded-md bg-bom-white text-bom-black/90 transition-colors hover:bg-neutral-200 hover:text-bom-black",
    focusRing
  );

const COMPACT_HEADER_AFTER_VIEWPORT_RATIO = 0.72;
const COMPACT_HEADER_MIN_SCROLL_Y = 320;
/** Lenis / sub-pixel scroll can spike; keep high to avoid closing while hovering the header. */
const POPOVER_CLOSE_SCROLL_DELTA = 72;

/** Dual header swap targets Tailwind `lg` (see site layout); translate-only, no fade. */
const LG_MEDIA_QUERY = "(min-width: 1024px)";
const HEADER_MODE_SLIDE_PX = 148;
const COMPACT_HEADER_OFFSCREEN_Y = -260;
const HEADER_MODE_SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as const,
};
const HEADER_HANDOFF_COMPACT_HIDE_DELAY_MS = 560;
const HEADER_HANDOFF_HERO_REVEAL_DELAY_MS = 500;

/** Subtle swell + tiny twist during route wipes (readable but never loud). */
const LOGO_TRANSIT_PULSE_ANIMATE = {
  scale: [1, 1.034, 0.997, 1],
  rotate: [0, -1.65, 0.65, 0],
};
const LOGO_SECOND_WORD_PULSE_ANIMATE = {
  scale: [1, 1, 1.034, 0.997, 1],
  rotate: [0, 0, -1.65, 0.65, 0],
};
const LOGO_TRANSIT_IDLE = { scale: 1, rotate: 0 };
const LOGO_FIRST_WORD_LAYOUT_PULSE_ANIMATE = {
  ...LOGO_TRANSIT_PULSE_ANIMATE,
  marginRight: [0, 10, 0, 0],
};
const LOGO_FIRST_WORD_LAYOUT_IDLE = {
  ...LOGO_TRANSIT_IDLE,
  marginRight: 0,
};
const LOGO_WORD_STAGGER_S = 0.23;
const LOGO_TRANSIT_PULSE_TWEEN = {
  duration: 1.24,
  times: [0, 0.4, 0.73, 1],
  ease: [
    [0.33, 1, 0.38, 1],
    [0.45, 0, 0.55, 1],
    [0.4, 1, 0.58, 1],
  ] as [[number, number, number, number], [number, number, number, number], [number, number, number, number]],
};
const LOGO_SECOND_WORD_PULSE_TWEEN = {
  ...LOGO_TRANSIT_PULSE_TWEEN,
  times: [0, LOGO_WORD_STAGGER_S / LOGO_TRANSIT_PULSE_TWEEN.duration, 0.4, 0.73, 1],
  ease: [
    "linear",
    [0.33, 1, 0.38, 1],
    [0.45, 0, 0.55, 1],
    [0.4, 1, 0.58, 1],
  ] as ["linear", [number, number, number, number], [number, number, number, number], [number, number, number, number]],
};
/**
 * Unlock → rest: eased tween only (never overshoots past scale 1 / 0°). Curve is
 * a bit brisk at first, longer soft landing vs the swipe-in pulse opener.
 */
const LOGO_REST_SETTLE = {
  duration: 1.06,
  ease: [0.14, 0.68, 0.045, 1] as [number, number, number, number],
};

export type SiteHeaderProps = {
  interactionDisabled?: boolean;
  /**
   * `in-pill`: logo inside the white bar (default).
   * `outside-pill`: logo sits beside the bar with space between (flex `justify-between`).
   */
  logoPlacement?: "in-pill" | "outside-pill";
};

export default function SiteHeader({
  interactionDisabled = false,
  logoPlacement = "in-pill",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  /** Hero vs compact chrome swap reads `lg` breakpoint so mobile never inherits desktop motion. */
  const [viewportLg, setViewportLg] = useState(false);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(LG_MEDIA_QUERY);
    const syncViewport = () => {
      setViewportLg(mq.matches);
    };
    syncViewport();
    mq.addEventListener("change", syncViewport);
    return () => mq.removeEventListener("change", syncViewport);
  }, []);

  const popoverManager = useHeaderPopoverManager();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMobileHref, setExpandedMobileHref] = useState<string | null>(
    null
  );
  const [isCompactHeaderActive, setIsCompactHeaderActive] = useState(false);
  const lastScrollYRef = useRef(0);
  const isTickingRef = useRef(false);
  const headerRootRef = useRef<HTMLElement | null>(null);
  const heroPillRef = useRef<HTMLDivElement | null>(null);
  const compactPillRef = useRef<HTMLDivElement | null>(null);
  const logoLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasInteractionDisabledRef = useRef(interactionDisabled);
  const [compactPillHandoffDelta, setCompactPillHandoffDelta] =
    useState<HeaderPillHandoffDelta | null>(null);
  const [isCompactPillHandoffSuppressed, setIsCompactPillHandoffSuppressed] =
    useState(false);
  const [isHeroPillHandoffSuppressed, setIsHeroPillHandoffSuppressed] =
    useState(false);
  const paletteHex = getSitePalette(pathname).hex;
  const routeLogoChrome = getDefaultSeamChromeForPaletteHex(paletteHex, "logo");
  const outsidePillLogoInk = coerceBrandInk(routeLogoChrome.color);

  const logoColorRef = useRef(outsidePillLogoInk);

  useEffect(() => {
    setIsMobileOpen(false);
    setExpandedMobileHref(null);
    popoverManager.close();
    setIsCompactHeaderActive(false);
    setCompactPillHandoffDelta(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable; we only want to reset on pathname change
  }, [pathname]);

  useEffect(() => {
    if (!interactionDisabled) return;
    popoverManager.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable; only react to interactionDisabled
  }, [interactionDisabled]);

  useLayoutEffect(() => {
    const wasInteractionDisabled = wasInteractionDisabledRef.current;
    wasInteractionDisabledRef.current = interactionDisabled;

    if (!interactionDisabled) {
      setCompactPillHandoffDelta(null);
      setIsCompactPillHandoffSuppressed(false);
      setIsHeroPillHandoffSuppressed(false);
      return;
    }

    if (
      wasInteractionDisabled ||
      !viewportLg ||
      !isCompactHeaderActive ||
      !heroPillRef.current ||
      !compactPillRef.current
    ) {
      return;
    }

    const heroRect = heroPillRef.current.getBoundingClientRect();
    const compactRect = compactPillRef.current.getBoundingClientRect();

    setIsCompactPillHandoffSuppressed(false);
    setIsHeroPillHandoffSuppressed(true);
    setCompactPillHandoffDelta({
      x: heroRect.left - compactRect.left,
    });
  }, [interactionDisabled, isCompactHeaderActive, viewportLg]);

  useEffect(() => {
    if (!compactPillHandoffDelta) return;

    const timeoutId = window.setTimeout(
      () => setIsCompactPillHandoffSuppressed(true),
      reduceMotion ? 0 : HEADER_HANDOFF_COMPACT_HIDE_DELAY_MS
    );

    return () => window.clearTimeout(timeoutId);
  }, [compactPillHandoffDelta, reduceMotion]);

  useEffect(() => {
    if (!compactPillHandoffDelta) return;

    const timeoutId = window.setTimeout(
      () => setIsHeroPillHandoffSuppressed(false),
      reduceMotion ? 0 : HEADER_HANDOFF_HERO_REVEAL_DELAY_MS
    );

    return () => window.clearTimeout(timeoutId);
  }, [compactPillHandoffDelta, reduceMotion]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function requestScrollUpdate() {
      if (isTickingRef.current) return;
      isTickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollYRef.current;

        if (Math.abs(delta) > POPOVER_CLOSE_SCROLL_DELTA) {
          popoverManager.close();
        }

        const compactThreshold = Math.max(
          COMPACT_HEADER_MIN_SCROLL_Y,
          window.innerHeight * COMPACT_HEADER_AFTER_VIEWPORT_RATIO
        );
        setIsCompactHeaderActive(
          !isMobileOpen && currentScrollY > compactThreshold
        );

        lastScrollYRef.current = currentScrollY;
        isTickingRef.current = false;
      });
    }

    requestScrollUpdate();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);

    return () => {
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable; avoid re-subscribing on every state change
  }, [interactionDisabled, isMobileOpen]);

  const setOrderNowChrome = useSiteHeaderOrderNowChromeSetter();

  useLayoutEffect(() => {
    setOrderNowChrome?.(HEADER_ORDER_NOW_CHROME);
  }, [setOrderNowChrome]);

  useLayoutEffect(() => {
    if (logoPlacement !== "outside-pill") return;

    logoColorRef.current = outsidePillLogoInk;
    headerRootRef.current?.style.setProperty(
      "--seam-logo-color",
      outsidePillLogoInk
    );
  }, [logoPlacement, outsidePillLogoInk]);

  useLayoutEffect(() => {
    if (logoPlacement !== "outside-pill" || !interactionDisabled) return;

    let rafId: number | null = null;
    let pendingLogoColor: string | null = null;
    let pendingLogoStreak = 0;

    const commitLogoColor = (nextLogoColor: string) => {
      if (nextLogoColor === logoColorRef.current) return;
      logoColorRef.current = nextLogoColor;
      headerRootRef.current?.style.setProperty(
        "--seam-logo-color",
        nextLogoColor
      );
    };

    const sampleTransitionLogoColor = () => {
      const headerElement = headerRootRef.current;
      const logoElement = logoLinkRef.current;

      if (headerElement && logoElement) {
        const rect = logoElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const sampled = getSeamAwareLogoColor(
            logoElement,
            [headerElement],
            "logo"
          );
          const nextLogoColor = coerceBrandInk(sampled);

          if (nextLogoColor === logoColorRef.current) {
            pendingLogoColor = null;
            pendingLogoStreak = 0;
          } else {
            if (pendingLogoColor === nextLogoColor) {
              pendingLogoStreak += 1;
            } else {
              pendingLogoColor = nextLogoColor;
              pendingLogoStreak = 1;
            }

            if (pendingLogoStreak >= 2) {
              commitLogoColor(nextLogoColor);
              pendingLogoColor = null;
              pendingLogoStreak = 0;
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(sampleTransitionLogoColor);
    };

    rafId = window.requestAnimationFrame(sampleTransitionLogoColor);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [interactionDisabled, logoPlacement]);

  useEffect(() => {
    popoverManager.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable; mode changes should dismiss anchored panels
  }, [isCompactHeaderActive]);

  useEffect(() => {
    return () => {
      setOrderNowChrome?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unmount-only cleanup
  }, []);

  function closeMobileNav() {
    setIsMobileOpen(false);
    setExpandedMobileHref(null);
  }

  const isCompactPillHandoffRequested =
    interactionDisabled &&
    viewportLg &&
    isCompactHeaderActive;
  const isCompactPillHandoffActive =
    isCompactPillHandoffRequested &&
    compactPillHandoffDelta !== null;

  const logoMotionAnimate =
    reduceMotion ?
      LOGO_TRANSIT_IDLE
    : interactionDisabled ?
      LOGO_TRANSIT_PULSE_ANIMATE
    : LOGO_TRANSIT_IDLE;
  const firstLogoMotionAnimate =
    reduceMotion ?
      LOGO_FIRST_WORD_LAYOUT_IDLE
    : interactionDisabled ?
      LOGO_FIRST_WORD_LAYOUT_PULSE_ANIMATE
    : LOGO_FIRST_WORD_LAYOUT_IDLE;
  const logoMotionTransition =
    reduceMotion ?
      { duration: 0 }
    : interactionDisabled ?
      LOGO_TRANSIT_PULSE_TWEEN
    : LOGO_REST_SETTLE;
  const secondLogoWordTransition =
    reduceMotion ?
      { duration: 0 }
    : interactionDisabled ?
      LOGO_SECOND_WORD_PULSE_TWEEN
    : LOGO_REST_SETTLE;
  const secondLogoMotionAnimate =
    reduceMotion ?
      LOGO_TRANSIT_IDLE
    : interactionDisabled ?
      LOGO_SECOND_WORD_PULSE_ANIMATE
    : LOGO_TRANSIT_IDLE;
  const logoVariant = logoPlacement === "outside-pill" ? "light" : "dark";
  const logoColor =
    logoPlacement === "outside-pill" ? "var(--seam-logo-color)" : undefined;
  const logoWordClassName =
    logoPlacement === "outside-pill" ?
      "block h-[84px] w-auto sm:h-[92px] lg:h-[88px]"
    : "block h-[21.6px] w-auto sm:h-[25.2px] lg:h-[28.8px]";

  const logoLink = (
    <Link
      ref={logoLinkRef}
      href="/home"
      className={cn(
        "flex min-w-0 items-center rounded-full translate-x-[0.225rem] sm:translate-x-[0.3375rem]",
        logoPlacement === "outside-pill"
          ? "shrink-0 self-stretch"
          : "shrink",
        focusRing
      )}
      aria-label="BomBom Treats home"
    >
      <span
        className={cn(
          "inline-flex max-w-full items-center",
          logoPlacement === "outside-pill" ? "origin-left" : "origin-center"
        )}
      >
        <motion.span
          className="inline-flex shrink-0 origin-bottom-left will-change-transform"
          animate={firstLogoMotionAnimate}
          transition={logoMotionTransition}
        >
          <BomBomLogo
            variant={logoVariant}
            color={logoColor}
            word="first"
            className={logoWordClassName}
          />
        </motion.span>
        <motion.span
          className="inline-flex shrink-0 origin-bottom-left will-change-transform"
          animate={secondLogoMotionAnimate}
          transition={secondLogoWordTransition}
        >
          <BomBomLogo
            variant={logoVariant}
            color={logoColor}
            word="second"
            className={logoWordClassName}
          />
        </motion.span>
      </span>
    </Link>
  );

  const renderPrimaryNav = (
    disabled: boolean,
    layoutClassName: string
  ) => (
    <nav
      aria-label="Primary"
      className={cn(
        "hidden min-w-0 items-center justify-end gap-[0.9rem] px-[0.9rem] lg:flex lg:gap-[1.8rem] lg:px-[1.35rem] xl:gap-0 xl:px-[1.8rem]",
        layoutClassName
      )}
    >
      {NAV_ITEMS.map((item) => (
        <NavPopoverLink
          key={item.href}
          href={item.href}
          label={item.label}
          popover={item.popover}
          className={navLinkClass}
          manager={popoverManager}
          interactionDisabled={interactionDisabled || disabled}
        />
      ))}
    </nav>
  );

  const renderHeaderActions = (withInlineMargin = false) => (
    <div
      className={cn(
        "flex shrink-0 items-center gap-[10.8px] sm:gap-[14.4px] lg:gap-[18px]",
        withInlineMargin && "ml-auto"
      )}
    >
      <div className="box-border flex shrink-0 items-center gap-1 p-[0.788rem] sm:p-[0.788rem]">
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
          className={cn(
            orderNowButtonBaseClass,
            orderNowButtonDefaultColorsClass,
            "border-0 shadow-none transition-[filter] hover:brightness-[0.92] motion-reduce:hover:brightness-100"
          )}
        >
          <Link
            href="/menu"
            style={{
              transitionProperty: "filter",
              transitionDuration: "200ms",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
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
            <XIcon className="size-5" weight="regular" aria-hidden />
          ) : (
            <ListDashesIcon className="size-5" weight="regular" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <header
      ref={headerRootRef}
      data-site-header-root
      style={
        logoPlacement === "outside-pill" ?
          ({
            "--seam-logo-color": outsidePillLogoInk,
          } as CSSProperties)
        : undefined
      }
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[70] p-[3.6rem] sm:p-[4.5rem] lg:p-[2.7rem]",
        interactionDisabled && "pointer-events-none"
      )}
    >
      <div className="mx-auto w-full max-w-full">
        <div className="flex flex-col gap-[0.675rem]">
          <div className="relative lg:min-h-[5.75rem]">
            <motion.div
              className={cn(
                !interactionDisabled &&
                  !(viewportLg && isCompactHeaderActive) &&
                  "pointer-events-auto",
                viewportLg && isCompactHeaderActive && "pointer-events-none"
              )}
              initial={false}
              animate={{
                y:
                  viewportLg &&
                  isCompactHeaderActive &&
                  !isCompactPillHandoffRequested ?
                    -HEADER_MODE_SLIDE_PX
                  : 0,
              }}
              transition={
                reduceMotion ?
                  { duration: 0 }
                : HEADER_MODE_SLIDE_TRANSITION
              }
            >
              {logoPlacement === "outside-pill" ? (
                <div className="mx-auto flex w-full items-stretch justify-between">
                  {logoLink}
                  <div
                    ref={heroPillRef}
                    data-site-header-pill="hero"
                    className={cn(
                      "flex w-fit max-w-full shrink-0 self-stretch items-center gap-[0.9rem] rounded-full bg-bom-white py-[0.675rem] pl-[0.9rem] pr-[0.675rem]",
                      "ring-1 ring-bom-black/[0.06]",
                      "sm:gap-[1.125rem] sm:py-[0.7875rem] sm:pl-[1.125rem] sm:pr-[0.788rem] lg:gap-1 lg:py-[0.45rem] lg:pl-[1.35rem] lg:pr-[0.9rem] xl:gap-0",
                      isHeroPillHandoffSuppressed && "invisible"
                    )}
                  >
                    {renderPrimaryNav(isCompactHeaderActive, "w-auto shrink-0")}
                    {renderHeaderActions()}
                  </div>
                </div>
              ) : (
                <div
                  ref={heroPillRef}
                  data-site-header-pill="hero"
                  className={cn(
                    "flex items-center gap-[0.9rem] rounded-full bg-bom-white py-[0.675rem] pl-[1.575rem] pr-[0.675rem]",
                    "ring-1 ring-bom-black/[0.06]",
                    "sm:gap-[1.125rem] sm:py-[0.7875rem] sm:pl-[2.025rem] sm:pr-[0.788rem] lg:gap-1 lg:py-[0.45rem] lg:pl-[2.475rem] lg:pr-[0.9rem] xl:gap-0",
                    isHeroPillHandoffSuppressed && "invisible"
                  )}
                >
                  {logoLink}
                  {renderPrimaryNav(isCompactHeaderActive, "flex-1")}
                  {renderHeaderActions(true)}
                </div>
              )}
            </motion.div>

            <motion.div
              className={cn(
                "pointer-events-none absolute left-0 right-0 top-0 z-[1] hidden justify-center lg:flex",
                viewportLg &&
                  isCompactHeaderActive &&
                  !interactionDisabled &&
                  "pointer-events-auto"
              )}
              initial={false}
              animate={{
                x:
                  isCompactPillHandoffActive ?
                    compactPillHandoffDelta.x
                  : 0,
                y:
                  viewportLg && isCompactHeaderActive ?
                    0
                  : COMPACT_HEADER_OFFSCREEN_Y,
              }}
              transition={
                reduceMotion ?
                  { duration: 0 }
                : HEADER_MODE_SLIDE_TRANSITION
              }
            >
              <div
                ref={compactPillRef}
                data-site-header-pill="compact"
                className={cn(
                  "flex w-fit max-w-[calc(100vw-5.4rem)] shrink-0 items-center gap-[0.9rem] rounded-full bg-bom-white py-[0.45rem] pl-[1.35rem] pr-[0.9rem]",
                  "ring-1 ring-bom-black/[0.06]",
                  "lg:gap-1 xl:gap-0",
                  isCompactPillHandoffSuppressed && "hidden"
                )}
              >
                {renderPrimaryNav(!isCompactHeaderActive, "w-auto shrink-0")}
                {renderHeaderActions()}
              </div>
            </motion.div>
          </div>

          {isMobileOpen && (
            <nav
              id="site-mobile-nav"
              aria-label="Mobile primary"
              className={cn(
                "pointer-events-auto rounded-3xl bg-bom-white p-[0.675rem]",
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
                            <div className="mt-1 grid gap-1 rounded-2xl bg-bom-black/[0.03] p-[0.45rem]">
                              {item.popover.variant === "mega"
                                ? item.popover.groups.map((group) => (
                                    <Link
                                      key={group.href}
                                      href={group.href}
                                      onClick={closeMobileNav}
                                      className={cn(
                                        "rounded-xl px-[0.9rem] py-[0.675rem] font-sans text-sm font-medium leading-none text-bom-black/75 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
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
                                        "rounded-xl px-[0.9rem] py-[0.675rem] font-sans text-sm font-medium leading-none text-bom-black/75 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
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
