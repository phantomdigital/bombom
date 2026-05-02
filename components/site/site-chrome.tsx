"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import SiteHeaderLogoOutside from "@/components/header/site-header-logo-outside";
import { SitePageTransitionProvider } from "@/components/site/site-page-transition-context";
import SitePageTransitionOverlay, {
  type SitePageTransitionOverlayHandle,
} from "@/components/site/site-page-transition-overlay";
import { SITE_PAGE_TRANSITION } from "@/lib/site-page-transition-timing";
import { getSitePalette } from "@/lib/site-route-theme";

/**
 * Persistent `(site)` shell. Click-driven navigation is intercepted so the
 * overlay **covers first**, then `router.push` runs behind the cover (scroll
 * reset invisible), then the overlay peels away to reveal the new route.
 *
 * Browser back/forward (pathname change without a click) falls back to the
 * same cover → hold → peel sequence driven by a `pathname` effect.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef<SitePageTransitionOverlayHandle>(null);
  const prevPathRef = useRef<string | null>(null);
  const clickTransitionRef = useRef(false);
  const pendingClickRevealPathRef = useRef<string | null>(null);
  const [isContentRevealed, setIsContentRevealed] = useState(true);
  const [isNavigationLocked, setIsNavigationLocked] = useState(false);
  const [shellHex, setShellHex] = useState(
    () => getSitePalette(pathname).hex
  );

  useEffect(() => {
    if (reduceMotion) {
      prevPathRef.current = pathname;
      setShellHex(getSitePalette(pathname).hex);
      return;
    }

    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      setShellHex(getSitePalette(pathname).hex);
      return;
    }

    const from = prevPathRef.current;
    if (pathname === from) return;

    const oldPalette = getSitePalette(from);
    const newPalette = getSitePalette(pathname);
    prevPathRef.current = pathname;

    if (oldPalette.hex === newPalette.hex) {
      setShellHex(newPalette.hex);
      return;
    }

    // Click-driven transitions are orchestrated in `handleClickCapture`; skip here.
    if (clickTransitionRef.current) return;

    let cancelled = false;

    (async () => {
      const overlay = overlayRef.current;
      if (!overlay) {
        setShellHex(newPalette.hex);
        setIsContentRevealed(true);
        setIsNavigationLocked(false);
        return;
      }
      setIsNavigationLocked(true);
      setIsContentRevealed(false);
      await overlay.cover(newPalette.hex);
      if (cancelled) return;
      await new Promise<void>((resolve) =>
        setTimeout(resolve, SITE_PAGE_TRANSITION.briefHoldS * 1000)
      );
      if (cancelled) return;
      setShellHex(newPalette.hex);
      await overlay.peel();
      if (cancelled) return;
      setIsContentRevealed(true);
      setIsNavigationLocked(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, reduceMotion]);

  useEffect(() => {
    if (!clickTransitionRef.current) return;
    if (pendingClickRevealPathRef.current !== pathname) return;

    let cancelled = false;

    (async () => {
      const overlay = overlayRef.current;
      if (!overlay) {
        flushSync(() => {
          setIsContentRevealed(true);
          setIsNavigationLocked(false);
        });
        clickTransitionRef.current = false;
        pendingClickRevealPathRef.current = null;
        return;
      }

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve())
        )
      );
      if (cancelled) return;
      await overlay.peel();
      if (cancelled) return;
      flushSync(() => {
        setIsContentRevealed(true);
        setIsNavigationLocked(false);
      });
      clickTransitionRef.current = false;
      pendingClickRevealPathRef.current = null;
    })();

    return () => {
      cancelled = true;
    };
  }, [children, pathname]);

  async function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;

    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) return;
    if (reduceMotion) return;
    if (clickTransitionRef.current) {
      event.preventDefault();
      return;
    }

    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    const nextPath = url.pathname;
    const nextSearch = url.search;
    const nextHash = url.hash;

    if (
      nextPath === currentPath &&
      nextSearch === currentSearch &&
      nextHash === currentHash
    ) {
      return;
    }

    // Same-page fragment links keep native scroll/focus behavior.
    if (
      nextPath === currentPath &&
      nextSearch === currentSearch &&
      nextHash
    ) {
      return;
    }

    event.preventDefault();

    const href = `${nextPath}${nextSearch}${nextHash}`;
    const newPalette = getSitePalette(nextPath);
    const overlay = overlayRef.current;

    clickTransitionRef.current = true;
    setIsNavigationLocked(true);

    try {
      if (!overlay) {
        router.push(href);
        clickTransitionRef.current = false;
        setIsNavigationLocked(false);
        return;
      }

      // 1. Cover with the destination colour while the page is still as-is.
      await overlay.cover(newPalette.hex);
      // 2. Brief hold so the full cover registers as a pause, not a flash.
      await new Promise<void>((resolve) =>
        setTimeout(resolve, SITE_PAGE_TRANSITION.briefHoldS * 1000)
      );
      // 3. Swap the shell backdrop to the destination colour *before* we push,
      //    so when the peel later exposes it there is no colour flicker.
      flushSync(() => {
        setShellHex(newPalette.hex);
        setIsContentRevealed(false);
      });
      prevPathRef.current = nextPath;
      pendingClickRevealPathRef.current = nextPath;
      // 4. Navigate behind the full cover - scroll reset is invisible here.
      router.push(href);
    } catch (error) {
      clickTransitionRef.current = false;
      pendingClickRevealPathRef.current = null;
      setIsNavigationLocked(false);
      throw error;
    }
  }

  const backdropStyle = {
    backgroundColor: shellHex,
    transition: "none",
  } satisfies CSSProperties;

  return (
    <div
      className="relative min-h-dvh"
      style={backdropStyle}
      onClickCapture={handleClickCapture}
    >
      <SiteHeaderLogoOutside interactionDisabled={isNavigationLocked} />
      <SitePageTransitionProvider isContentRevealed={isContentRevealed}>
        {children}
      </SitePageTransitionProvider>
      <SitePageTransitionOverlay ref={overlayRef} />
    </div>
  );
}
