import { useEffect, useRef, useState, type RefObject } from "react";

type UseCompactHeaderModeOptions = {
  interactionDisabled: boolean;
  isMobileOpen: boolean;
  popoverCloseScrollDelta: number;
  compactHeaderMinScrollY: number;
  compactHeaderAfterViewportRatio: number;
  isPopoverScrollLockedRef: RefObject<boolean>;
  lockedPopoverScrollYRef: RefObject<number>;
  onPopoverClose: () => void;
};

export function useCompactHeaderMode({
  interactionDisabled,
  isMobileOpen,
  popoverCloseScrollDelta,
  compactHeaderMinScrollY,
  compactHeaderAfterViewportRatio,
  isPopoverScrollLockedRef,
  lockedPopoverScrollYRef,
  onPopoverClose,
}: UseCompactHeaderModeOptions) {
  const [isCompactHeaderActive, setIsCompactHeaderActive] = useState(false);
  const lastScrollYRef = useRef(0);
  const isTickingRef = useRef(false);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function requestScrollUpdate() {
      if (isTickingRef.current) return;
      isTickingRef.current = true;

      window.requestAnimationFrame(() => {
        if (isPopoverScrollLockedRef.current) {
          if (window.scrollY !== lockedPopoverScrollYRef.current) {
            window.scrollTo(window.scrollX, lockedPopoverScrollYRef.current);
          }
          lastScrollYRef.current = lockedPopoverScrollYRef.current;
          isTickingRef.current = false;
          return;
        }

        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollYRef.current;
        if (Math.abs(delta) > popoverCloseScrollDelta) {
          onPopoverClose();
        }

        const compactThreshold = Math.max(
          compactHeaderMinScrollY,
          window.innerHeight * compactHeaderAfterViewportRatio
        );

        setIsCompactHeaderActive(!isMobileOpen && currentScrollY > compactThreshold);
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
  }, [
    compactHeaderAfterViewportRatio,
    compactHeaderMinScrollY,
    interactionDisabled,
    isMobileOpen,
    isPopoverScrollLockedRef,
    lockedPopoverScrollYRef,
    onPopoverClose,
    popoverCloseScrollDelta,
  ]);

  return {
    isCompactHeaderActive,
    setIsCompactHeaderActive,
  };
}
