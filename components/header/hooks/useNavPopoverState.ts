import { useCallback, useEffect, useRef, useState } from "react";

type UseNavPopoverStateOptions = {
  hasPopover: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeDelayMs: number;
  suppressOpenMs: number;
};

export function useNavPopoverState({
  hasPopover,
  open: controlledOpen,
  onOpenChange,
  closeDelayMs,
  suppressOpenMs,
}: UseNavPopoverStateOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const suppressOpenRef = useRef(false);
  const suppressOpenTimeoutRef = useRef<number | null>(null);

  const open = controlledOpen ?? uncontrolledOpen;

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current === null) return;
    window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const clearSuppressOpenTimeout = useCallback(() => {
    if (suppressOpenTimeoutRef.current === null) return;
    window.clearTimeout(suppressOpenTimeoutRef.current);
    suppressOpenTimeoutRef.current = null;
  }, []);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  const resetSuppressOpen = useCallback(() => {
    suppressOpenRef.current = false;
    clearSuppressOpenTimeout();
  }, [clearSuppressOpenTimeout]);

  const suppressOpenBriefly = useCallback(() => {
    suppressOpenRef.current = true;
    clearSuppressOpenTimeout();
    suppressOpenTimeoutRef.current = window.setTimeout(() => {
      suppressOpenRef.current = false;
      suppressOpenTimeoutRef.current = null;
    }, suppressOpenMs);
  }, [clearSuppressOpenTimeout, suppressOpenMs]);

  const openPopover = useCallback(() => {
    if (!hasPopover || suppressOpenRef.current) return;
    clearCloseTimeout();
    setOpen(true);
  }, [clearCloseTimeout, hasPopover, setOpen]);

  const closePopover = useCallback(() => {
    clearCloseTimeout();
    setOpen(false);
  }, [clearCloseTimeout, setOpen]);

  const closePopoverSoon = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimeoutRef.current = null;
    }, closeDelayMs);
  }, [clearCloseTimeout, closeDelayMs, setOpen]);

  const closePopoverAfterPointerLeave = useCallback(() => {
    resetSuppressOpen();
    closePopoverSoon();
  }, [closePopoverSoon, resetSuppressOpen]);

  const closePopoverForNavigation = useCallback(() => {
    suppressOpenBriefly();
    closePopover();
  }, [closePopover, suppressOpenBriefly]);

  const togglePopover = useCallback(() => {
    clearCloseTimeout();
    setOpen(!open);
  }, [clearCloseTimeout, open, setOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimeout();
      clearSuppressOpenTimeout();
    };
  }, [clearCloseTimeout, clearSuppressOpenTimeout]);

  return {
    open,
    setOpen,
    openPopover,
    closePopover,
    closePopoverSoon,
    closePopoverAfterPointerLeave,
    closePopoverForNavigation,
    togglePopover,
  };
}
