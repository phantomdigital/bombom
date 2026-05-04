import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type UseLogoHoverMotionStateOptions = {
  interactionDisabled: boolean;
  reduceMotion: boolean;
  hoverApproachTotalMs: number;
};

export function useLogoHoverMotionState({
  interactionDisabled,
  reduceMotion,
  hoverApproachTotalMs,
}: UseLogoHoverMotionStateOptions) {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoHoverLocked, setIsLogoHoverLocked] = useState(false);
  const [isLogoApproachCompleting, setIsLogoApproachCompleting] = useState(false);
  const logoHoverEnteredAtRef = useRef<number | null>(null);
  const logoApproachCompletionTimerRef = useRef<number | null>(null);

  const clearLogoApproachCompletionTimer = useCallback(() => {
    if (logoApproachCompletionTimerRef.current === null) return;
    window.clearTimeout(logoApproachCompletionTimerRef.current);
    logoApproachCompletionTimerRef.current = null;
  }, []);

  const resetLogoHoverMotion = useCallback(() => {
    clearLogoApproachCompletionTimer();
    setIsLogoApproachCompleting(false);
    logoHoverEnteredAtRef.current = null;
  }, [clearLogoApproachCompletionTimer]);

  const handleLogoHoverEnter = useCallback(() => {
    clearLogoApproachCompletionTimer();
    setIsLogoApproachCompleting(false);
    logoHoverEnteredAtRef.current =
      typeof performance !== "undefined" ? performance.now() : null;
    setIsLogoHovered(true);
  }, [clearLogoApproachCompletionTimer]);

  const handleLogoHoverLeave = useCallback(() => {
    setIsLogoHovered(false);
    if (reduceMotion) {
      resetLogoHoverMotion();
      return;
    }

    const startedAt = logoHoverEnteredAtRef.current;
    logoHoverEnteredAtRef.current = null;
    if (startedAt === null) {
      clearLogoApproachCompletionTimer();
      setIsLogoApproachCompleting(false);
      return;
    }

    const elapsed = performance.now() - startedAt;
    const remaining = hoverApproachTotalMs - elapsed;
    if (remaining <= 0) {
      clearLogoApproachCompletionTimer();
      setIsLogoApproachCompleting(false);
      return;
    }

    setIsLogoApproachCompleting(true);
    logoApproachCompletionTimerRef.current = window.setTimeout(() => {
      logoApproachCompletionTimerRef.current = null;
      setIsLogoApproachCompleting(false);
    }, remaining);
  }, [
    clearLogoApproachCompletionTimer,
    hoverApproachTotalMs,
    reduceMotion,
    resetLogoHoverMotion,
  ]);

  useLayoutEffect(() => {
    if (interactionDisabled && isLogoHovered) {
      setIsLogoHoverLocked(true);
    }
    if (!interactionDisabled) {
      setIsLogoHoverLocked(false);
    }
  }, [interactionDisabled, isLogoHovered]);

  useEffect(
    () => () => {
      clearLogoApproachCompletionTimer();
    },
    [clearLogoApproachCompletionTimer]
  );

  return {
    effectiveLogoHovered:
      isLogoHovered || isLogoHoverLocked || isLogoApproachCompleting,
    handleLogoHoverEnter,
    handleLogoHoverLeave,
    resetLogoHoverMotion,
  };
}
