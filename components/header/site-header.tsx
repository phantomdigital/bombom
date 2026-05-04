"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
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
import { useCompactHeaderMode } from "@/components/header/hooks/useCompactHeaderMode";
import { useHeaderPopoverManager } from "@/components/header/hooks/useHeaderPopoverManager";
import { useHeaderPillHandoff } from "@/components/header/hooks/useHeaderPillHandoff";
import { useHeaderScrollLock } from "@/components/header/hooks/useHeaderScrollLock";
import { useLogoHoverMotionState } from "@/components/header/hooks/useLogoHoverMotionState";
import { useViewportLg } from "@/components/header/hooks/useViewportLg";
import {
  COMPACT_HEADER_OFFSCREEN_Y,
  DESKTOP_HEADER_MEDIA_QUERY,
  HEADER_HANDOFF_COMPACT_HIDE_DELAY_MS,
  HEADER_HANDOFF_HERO_REVEAL_DELAY_MS,
  HEADER_MODE_SLIDE_PX,
  HEADER_MODE_SLIDE_TRANSITION,
  LOGO_FIRST_WORD_LAYOUT_HOVER_HOLD,
  LOGO_FIRST_WORD_LAYOUT_IDLE,
  LOGO_HOVER_APPROACH,
  LOGO_HOVER_APPROACH_TOTAL_MS,
  LOGO_HOVER_HOLD,
  LOGO_REST_SETTLE,
  LOGO_SECOND_WORD_HOVER_APPROACH,
  LOGO_TRANSIT_IDLE,
} from "@/components/header/header-motion.constants";
import {
  DEFAULT_HEADER_NAV_ITEMS,
  type HeaderNavIconKey,
  type HeaderNavItem,
  type HeaderNavPopoverConfig,
  type HeaderNavPopoverMegaGroup,
} from "@/components/header/nav-items";
import AccountIcon from "@/components/icons/account-icon";
import { useSiteHeaderOrderNowChromeSetter } from "@/components/site/site-header-order-now-chrome-context";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/components/ui/focus-ring";
import {
  getDefaultSeamChromeForPaletteHex,
  getSeamAwareLogoColor,
} from "@/lib/seam-aware-logo-color";
import {
  SITE_CONTENT_RAIL_BOX_CLASS,
  SITE_HEADER_SHELL_CLASS,
  SITE_HEADER_TOTAL_HEIGHT_VAR,
} from "@/lib/site-layout";
import { getSitePageRevealSurface } from "@/lib/site-page-reveal-surface";
import { cn } from "@/lib/utils";

const navLinkClass =
  cn(
    "font-sans text-xl font-medium leading-none tracking-normal antialiased text-bom-black/80 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200 p-[1.35rem] rounded-md",
    focusRing
  );

const orderNowButtonBaseClass =
  "shrink-0 font-sans font-medium antialiased w-auto lg:whitespace-nowrap items-center justify-center !h-[65px] !min-h-[65px] !px-[58px] !text-base";

const orderNowButtonDefaultColorsClass = "bg-bom-ink text-bom-white";

const BOM_INK_CSS_VAR = "var(--bom-ink)";

const HEADER_ORDER_NOW_CHROME = {
  fill: BOM_INK_CSS_VAR,
  foreground: "var(--color-bom-white)",
} as const;

function isPureBlackInk(cssColor: string): boolean {
  const t = cssColor.trim().toLowerCase();
  return (
    t === "#000" ||
    t === "#000000" ||
    /^rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(t) ||
    /^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*1(?:\.0*)?\s*\)$/.test(t)
  );
}

function coerceBrandInk(cssColor: string): string {
  return isPureBlackInk(cssColor) ? BOM_INK_CSS_VAR : cssColor;
}

const mobileLinkClass =
  cn(
    "flex w-full items-center justify-between rounded-2xl px-[0.9rem] py-[0.675rem] font-sans text-base font-medium leading-none tracking-normal antialiased text-bom-black/85 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
    focusRing
  );

const accountIconButtonClass =
  cn(
    "inline-flex size-[65px] shrink-0 items-center justify-center rounded-md bg-bom-white text-bom-black/90 transition-colors hover:bg-neutral-200 hover:text-bom-black",
    focusRing
  );

const COMPACT_HEADER_AFTER_VIEWPORT_RATIO = 0.72;
const COMPACT_HEADER_MIN_SCROLL_Y = 320;
/** Lenis / sub-pixel scroll can spike; keep high to avoid closing while hovering the header. */
const POPOVER_CLOSE_SCROLL_DELTA = 72;
const POPOVER_SCROLL_LOCK_KEYS = new Set([
  " ",
  "Spacebar",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
]);

const HEADER_ICON_BY_KEY = {
  iceCream: IceCreamIcon,
  cake: CakeIcon,
  coffee: CoffeeIcon,
} as const satisfies Record<HeaderNavIconKey, unknown>;

function hydrateMegaGroup(group: HeaderNavPopoverMegaGroup) {
  const icon =
    group.iconKey ? HEADER_ICON_BY_KEY[group.iconKey] : undefined;

  return {
    ...group,
    icon,
  };
}

function hydrateNavPopover(
  popover?: HeaderNavPopoverConfig
): NavPopoverConfig | undefined {
  if (!popover) return undefined;
  if (popover.variant === "mega") {
    return {
      ...popover,
      groups: popover.groups.map(hydrateMegaGroup),
    };
  }
  return popover;
}

export type SiteHeaderProps = {
  interactionDisabled?: boolean;
  pageSurfaceHexOverride?: string | null;
  navItems?: HeaderNavItem[];
  /**
   * `in-pill`: logo inside the white bar (default).
   * `outside-pill`: logo sits beside the bar with space between (flex `justify-between`).
   */
  logoPlacement?: "in-pill" | "outside-pill";
};

export default function SiteHeader({
  interactionDisabled = false,
  pageSurfaceHexOverride = null,
  navItems = DEFAULT_HEADER_NAV_ITEMS,
  logoPlacement = "in-pill",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const viewportLg = useViewportLg(DESKTOP_HEADER_MEDIA_QUERY);

  const popoverManager = useHeaderPopoverManager();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMobileHref, setExpandedMobileHref] = useState<string | null>(
    null
  );
  const headerRootRef = useRef<HTMLElement | null>(null);
  const heroPillRef = useRef<HTMLDivElement | null>(null);
  const compactPillRef = useRef<HTMLDivElement | null>(null);
  const logoLinkRef = useRef<HTMLAnchorElement | null>(null);
  const pageSurfaceHex =
    pageSurfaceHexOverride ?? getSitePageRevealSurface(pathname).hex;
  const routeLogoChrome = getDefaultSeamChromeForPaletteHex(
    pageSurfaceHex,
    "logo"
  );
  const outsidePillLogoInk = coerceBrandInk(routeLogoChrome.color);

  const logoColorRef = useRef(outsidePillLogoInk);
  const {
    effectiveLogoHovered,
    handleLogoHoverEnter,
    handleLogoHoverLeave,
    resetLogoHoverMotion,
  } = useLogoHoverMotionState({
    interactionDisabled,
    reduceMotion: !!reduceMotion,
    hoverApproachTotalMs: LOGO_HOVER_APPROACH_TOTAL_MS,
  });
  const { isPopoverScrollLockedRef, lockedPopoverScrollYRef } =
    useHeaderScrollLock({
      activeHref: popoverManager.activeHref,
      scrollLockKeys: POPOVER_SCROLL_LOCK_KEYS,
    });
  const { isCompactHeaderActive, setIsCompactHeaderActive } = useCompactHeaderMode({
    interactionDisabled,
    isMobileOpen,
    popoverCloseScrollDelta: POPOVER_CLOSE_SCROLL_DELTA,
    compactHeaderMinScrollY: COMPACT_HEADER_MIN_SCROLL_Y,
    compactHeaderAfterViewportRatio: COMPACT_HEADER_AFTER_VIEWPORT_RATIO,
    isPopoverScrollLockedRef,
    lockedPopoverScrollYRef,
    onPopoverClose: popoverManager.close,
  });
  const {
    compactPillHandoffDelta,
    isCompactPillHandoffSuppressed,
    isHeroPillHandoffSuppressed,
  } = useHeaderPillHandoff({
    interactionDisabled,
    viewportLg,
    isCompactHeaderActive,
    heroPillRef,
    compactPillRef,
    reduceMotion: !!reduceMotion,
    compactHideDelayMs: HEADER_HANDOFF_COMPACT_HIDE_DELAY_MS,
    heroRevealDelayMs: HEADER_HANDOFF_HERO_REVEAL_DELAY_MS,
  });
  const hydratedNavItems = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        popover: hydrateNavPopover(item.popover),
      })),
    [navItems]
  );

  useEffect(() => {
    setIsMobileOpen(false);
    setExpandedMobileHref(null);
    popoverManager.close();
    setIsCompactHeaderActive(false);
    resetLogoHoverMotion();
    // Keep handoff state through route swaps; cleared when interaction lock ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable; we only want to reset on pathname change
  }, [pathname]);

  useEffect(() => {
    if (!interactionDisabled) return;
    popoverManager.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable; only react to interactionDisabled
  }, [interactionDisabled]);

  const setOrderNowChrome = useSiteHeaderOrderNowChromeSetter();

  useLayoutEffect(() => {
    setOrderNowChrome?.(HEADER_ORDER_NOW_CHROME);
  }, [setOrderNowChrome]);

  useLayoutEffect(() => {
    const el = headerRootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const docRoot = document.documentElement;

    const sync = () => {
      docRoot.style.setProperty(
        SITE_HEADER_TOTAL_HEIGHT_VAR,
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      docRoot.style.removeProperty(SITE_HEADER_TOTAL_HEIGHT_VAR);
    };
  }, []);

  useLayoutEffect(() => {
    if (logoPlacement !== "outside-pill") return;

    logoColorRef.current = outsidePillLogoInk;
    headerRootRef.current?.style.setProperty(
      "--seam-logo-color",
      outsidePillLogoInk
    );
  }, [logoPlacement, outsidePillLogoInk]);

  useLayoutEffect(() => {
    if (logoPlacement !== "outside-pill" || interactionDisabled) return;

    logoColorRef.current = outsidePillLogoInk;
    headerRootRef.current?.style.setProperty(
      "--seam-logo-color",
      outsidePillLogoInk
    );
  }, [interactionDisabled, logoPlacement, outsidePillLogoInk]);

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
  /**
   * Once the handoff delta is set, lock the compact pill in that visual state
   * until it unmounts (via `isCompactPillHandoffSuppressed`). Without this,
   * `setIsCompactHeaderActive(false)` on `pathname` change would yank the pill
   * back to offscreen mid-transition (most visible on 404 / unprefetched routes).
   */
  const isCompactPillHandoffActive = compactPillHandoffDelta !== null;

  const logoMotionAnimate =
    reduceMotion ?
      LOGO_TRANSIT_IDLE
    : effectiveLogoHovered ?
      LOGO_HOVER_HOLD
    : LOGO_TRANSIT_IDLE;
  const firstLogoMotionAnimate =
    reduceMotion ?
      LOGO_FIRST_WORD_LAYOUT_IDLE
    : effectiveLogoHovered ?
      LOGO_FIRST_WORD_LAYOUT_HOVER_HOLD
    : LOGO_FIRST_WORD_LAYOUT_IDLE;
  const logoMotionTransition =
    reduceMotion ?
      { duration: 0 }
    : effectiveLogoHovered ?
      LOGO_HOVER_APPROACH
    : LOGO_REST_SETTLE;
  const secondLogoWordTransition =
    reduceMotion ?
      { duration: 0 }
    : effectiveLogoHovered ?
      LOGO_SECOND_WORD_HOVER_APPROACH
    : LOGO_REST_SETTLE;
  const secondLogoMotionAnimate =
    reduceMotion ?
      LOGO_TRANSIT_IDLE
    : effectiveLogoHovered ?
      LOGO_HOVER_HOLD
    : LOGO_TRANSIT_IDLE;
  const logoVariant = logoPlacement === "outside-pill" ? "light" : "dark";
  const logoColor =
    logoPlacement === "outside-pill" ? "var(--seam-logo-color)" : undefined;
  const logoWordClassName =
    logoPlacement === "outside-pill" ?
      "block h-[84px] w-auto sm:h-[92px] lg:h-[88px] max-[1300px]:h-auto max-[1300px]:w-1/2"
    : "block h-[21.6px] w-auto sm:h-[25.2px] lg:h-[28.8px]";

  const logoLink = (
    <Link
      ref={logoLinkRef}
      href="/home"
      onPointerEnter={handleLogoHoverEnter}
      onPointerLeave={handleLogoHoverLeave}
      onFocus={handleLogoHoverEnter}
      onBlur={handleLogoHoverLeave}
      className={cn(
        "flex min-w-0 items-center rounded-full",
        /* Optical nudge for in-pill only; outside-pill should sit flush with content rail inset. */
        logoPlacement !== "outside-pill" &&
          "translate-x-[0.225rem] sm:translate-x-[0.3375rem]",
        logoPlacement === "outside-pill"
          ? "shrink-0 self-stretch max-[1300px]:pointer-events-auto max-[1300px]:fixed max-[1300px]:inset-x-[1rem] max-[1300px]:top-[1rem] max-[1300px]:z-[80] max-[1300px]:w-[calc(100vw-2rem)] max-[1300px]:self-auto max-[1300px]:supports-[padding:max(0px)]:top-[max(1rem,env(safe-area-inset-top))]"
          : "shrink",
        focusRing
      )}
      aria-label="BomBom Treats home"
    >
      {logoPlacement === "outside-pill" ? (
        <span className="hidden w-full max-[1300px]:block">
          <BomBomLogo
            variant={logoVariant}
            color={logoColor}
            className="block h-auto w-full"
          />
        </span>
      ) : null}
      <span
        className={cn(
          "inline-flex max-w-full items-center",
          logoPlacement === "outside-pill" && "max-[1300px]:hidden",
          logoPlacement === "outside-pill" ?
            "origin-left max-[1300px]:w-full"
          : "origin-center"
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
    layoutClassName: string,
    megaPopoverAlignment: "trigger" | "viewport" = "trigger"
  ) => (
    <nav
      aria-label="Primary"
      className={cn(
        "hidden min-w-0 items-center justify-end gap-[0.9rem] px-[0.9rem] min-[1301px]:flex min-[1301px]:gap-[1.8rem] min-[1301px]:px-[1.35rem] xl:gap-0 xl:px-[1.8rem]",
        layoutClassName
      )}
    >
      {hydratedNavItems.map((item) => (
        <NavPopoverLink
          key={item.href}
          href={item.href}
          label={item.label}
          popover={item.popover}
          className={navLinkClass}
          manager={popoverManager}
          interactionDisabled={interactionDisabled || disabled}
          megaPopoverAlignment={megaPopoverAlignment}
        />
      ))}
    </nav>
  );

  const renderHeaderActions = (withInlineMargin = false) => (
    <div
      className={cn(
        "flex shrink-0 items-center gap-[10.8px] sm:gap-[14.4px] min-[1301px]:gap-[18px]",
        "max-[1300px]:w-full max-[1300px]:shrink max-[1300px]:gap-3 sm:max-[1300px]:gap-4 md:max-[1300px]:gap-6",
        withInlineMargin && "ml-auto"
      )}
    >
      <div className="box-border flex shrink-0 items-center gap-1 p-[0.788rem] sm:p-[0.788rem] max-[1300px]:w-full max-[1300px]:shrink max-[1300px]:gap-3 max-[1300px]:p-[0.45rem] sm:max-[1300px]:gap-4 md:max-[1300px]:gap-6">
        <Link
          href="/account"
          className={cn(accountIconButtonClass, "max-[1300px]:order-1")}
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
            "border-0 shadow-none transition-[filter] hover:brightness-[0.92] motion-reduce:hover:brightness-100",
            "max-[1300px]:order-2 max-[1300px]:min-w-0 max-[1300px]:flex-1"
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
            "flex size-[65px] shrink-0 items-center justify-center rounded-full text-bom-black/80 transition-colors hover:bg-bom-black/[0.04] hover:text-bom-black min-[1301px]:hidden max-[1300px]:order-3",
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
        "pointer-events-none fixed inset-x-0 top-0 z-[70]",
        SITE_HEADER_SHELL_CLASS,
        interactionDisabled && "pointer-events-none"
      )}
    >
      <div className={SITE_CONTENT_RAIL_BOX_CLASS}>
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
                <div className="mx-auto flex w-full items-stretch justify-between max-[1300px]:block">
                  {logoLink}
                  <div
                    ref={heroPillRef}
                    data-site-header-pill="hero"
                    className={cn(
                      "flex w-fit max-w-full shrink-0 self-stretch items-center gap-[0.9rem] rounded-full bg-bom-white py-[0.675rem] pl-[0.9rem] pr-[0.675rem]",
                      "ring-1 ring-bom-black/[0.06]",
                      "sm:gap-[1.125rem] sm:py-[0.7875rem] sm:pl-[1.125rem] sm:pr-[0.788rem] lg:gap-1 lg:py-[0.45rem] lg:pl-[1.35rem] lg:pr-[0.9rem] xl:gap-0",
                      "max-[1300px]:pointer-events-auto max-[1300px]:fixed max-[1300px]:inset-x-[1rem] max-[1300px]:bottom-[1rem] max-[1300px]:z-[80] max-[1300px]:mx-auto max-[1300px]:w-[calc(100vw-2rem)] max-[1300px]:justify-between max-[1300px]:self-auto max-[1300px]:px-[0.675rem]",
                      "max-[1300px]:supports-[padding:max(0px)]:bottom-[max(1rem,env(safe-area-inset-bottom))]",
                      isHeroPillHandoffSuppressed && "opacity-0"
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
                    isHeroPillHandoffSuppressed && "opacity-0"
                  )}
                >
                  {logoLink}
                  {renderPrimaryNav(isCompactHeaderActive, "flex-1")}
                  {renderHeaderActions(true)}
                </div>
              )}
            </motion.div>

            {!isCompactPillHandoffSuppressed && (
              <motion.div
                className={cn(
                  "pointer-events-none absolute left-0 right-0 top-0 z-[1] hidden justify-center lg:flex",
                  viewportLg &&
                    isCompactHeaderActive &&
                    !interactionDisabled &&
                    "pointer-events-auto"
                )}
                initial={{ x: 0, y: COMPACT_HEADER_OFFSCREEN_Y }}
                animate={{
                  x:
                    isCompactPillHandoffActive ?
                      compactPillHandoffDelta.x
                    : 0,
                  y:
                    isCompactPillHandoffActive ||
                    (viewportLg && isCompactHeaderActive) ?
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
                    "lg:gap-1 xl:gap-0"
                  )}
                >
                  {renderPrimaryNav(
                    !isCompactHeaderActive,
                    "w-auto shrink-0",
                    "viewport"
                  )}
                  {renderHeaderActions()}
                </div>
              </motion.div>
            )}
          </div>

          {isMobileOpen && (
            <nav
              id="site-mobile-nav"
              aria-label="Mobile primary"
              className={cn(
                "pointer-events-auto rounded-3xl bg-bom-white p-[0.675rem]",
                "ring-1 ring-bom-black/[0.06]",
                "fixed inset-x-[1rem] bottom-[6.75rem] z-[90] max-h-[min(70svh,32rem)] overflow-y-auto overscroll-contain min-[1301px]:hidden",
                "supports-[padding:max(0px)]:bottom-[max(6.75rem,calc(env(safe-area-inset-bottom)+6.75rem))]"
              )}
            >
              <ul className="flex flex-col gap-1">
                {hydratedNavItems.map((item) => {
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
