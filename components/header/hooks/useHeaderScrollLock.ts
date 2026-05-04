import { useEffect, useRef } from "react";

type UseHeaderScrollLockOptions = {
  activeHref: string | null;
  scrollLockKeys: Set<string>;
  onRestoreLockedScroll?: (lockedY: number) => void;
};

export function useHeaderScrollLock({
  activeHref,
  scrollLockKeys,
  onRestoreLockedScroll,
}: UseHeaderScrollLockOptions) {
  const isPopoverScrollLockedRef = useRef(false);
  const lockedPopoverScrollYRef = useRef(0);

  useEffect(() => {
    if (!activeHref) return;

    isPopoverScrollLockedRef.current = true;
    lockedPopoverScrollYRef.current = window.scrollY;

    const restoreLockedScroll = () => {
      if (!isPopoverScrollLockedRef.current) return;
      if (window.scrollY !== lockedPopoverScrollYRef.current) {
        window.scrollTo(window.scrollX, lockedPopoverScrollYRef.current);
      }
      onRestoreLockedScroll?.(lockedPopoverScrollYRef.current);
    };

    const preventWheelScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      window.requestAnimationFrame(restoreLockedScroll);
    };

    const preventTouchScroll = (event: TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      window.requestAnimationFrame(restoreLockedScroll);
    };

    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const target = event.target;

      if (target instanceof HTMLElement) {
        const tagName = target.tagName;
        if (
          target.isContentEditable ||
          tagName === "INPUT" ||
          tagName === "SELECT" ||
          tagName === "TEXTAREA"
        ) {
          return;
        }
      }

      if (scrollLockKeys.has(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        window.requestAnimationFrame(restoreLockedScroll);
      }
    };

    const handleScrollAttempt = () => {
      window.requestAnimationFrame(restoreLockedScroll);
    };

    window.addEventListener("wheel", preventWheelScroll, {
      capture: true,
      passive: false,
    });
    document.addEventListener("wheel", preventWheelScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchmove", preventTouchScroll, {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", preventTouchScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("keydown", preventKeyboardScroll, {
      capture: true,
    });
    window.addEventListener("scroll", handleScrollAttempt, {
      capture: true,
      passive: true,
    });

    return () => {
      isPopoverScrollLockedRef.current = false;
      document.removeEventListener("wheel", preventWheelScroll, true);
      window.removeEventListener("wheel", preventWheelScroll, true);
      document.removeEventListener("touchmove", preventTouchScroll, true);
      window.removeEventListener("touchmove", preventTouchScroll, true);
      window.removeEventListener("keydown", preventKeyboardScroll, true);
      window.removeEventListener("scroll", handleScrollAttempt, true);
    };
  }, [activeHref, onRestoreLockedScroll, scrollLockKeys]);

  return {
    isPopoverScrollLockedRef,
    lockedPopoverScrollYRef,
  };
}
