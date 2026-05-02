import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One open nav popover at a time, with a short delay before closing so the
 * pointer can cross the gap to portaled content.
 */
type Options = {
  closeDelayMs?: number;
};

export type HeaderPopoverManager = ReturnType<typeof useHeaderPopoverManager>;

export function useHeaderPopoverManager({
  closeDelayMs = 200,
}: Options = {}) {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current === null) return;
    window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const close = useCallback(() => {
    cancelClose();
    setActiveHref(null);
  }, [cancelClose]);

  const open = useCallback(
    (href: string) => {
      cancelClose();
      setActiveHref(href);
    },
    [cancelClose]
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveHref(null);
      closeTimeoutRef.current = null;
    }, closeDelayMs);
  }, [cancelClose, closeDelayMs]);

  const toggle = useCallback(
    (href: string) => {
      cancelClose();
      setActiveHref((current) => (current === href ? null : href));
    },
    [cancelClose]
  );

  useEffect(
    () => () => {
      cancelClose();
    },
    [cancelClose]
  );

  return {
    activeHref,
    open,
    close,
    scheduleClose,
    cancelClose,
    toggle,
  };
}
