import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type HeaderPillHandoffDelta = {
  x: number;
};

type UseHeaderPillHandoffOptions = {
  interactionDisabled: boolean;
  viewportLg: boolean;
  isCompactHeaderActive: boolean;
  heroPillRef: RefObject<HTMLDivElement | null>;
  compactPillRef: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  compactHideDelayMs: number;
  heroRevealDelayMs: number;
};

export function useHeaderPillHandoff({
  interactionDisabled,
  viewportLg,
  isCompactHeaderActive,
  heroPillRef,
  compactPillRef,
  reduceMotion,
  compactHideDelayMs,
  heroRevealDelayMs,
}: UseHeaderPillHandoffOptions) {
  const [compactPillHandoffDelta, setCompactPillHandoffDelta] =
    useState<HeaderPillHandoffDelta | null>(null);
  const [isCompactPillHandoffSuppressed, setIsCompactPillHandoffSuppressed] =
    useState(false);
  const [isHeroPillHandoffSuppressed, setIsHeroPillHandoffSuppressed] =
    useState(false);
  const wasInteractionDisabledRef = useRef(interactionDisabled);

  useEffect(() => {
    if (isCompactHeaderActive) {
      setIsCompactPillHandoffSuppressed(false);
    }
  }, [isCompactHeaderActive]);

  useLayoutEffect(() => {
    const wasInteractionDisabled = wasInteractionDisabledRef.current;
    wasInteractionDisabledRef.current = interactionDisabled;

    if (!interactionDisabled) {
      // If navigation unlocks before the compact-hide timer fires, force-hide
      // the compact pill first so it cannot visibly animate back to origin.
      if (
        compactPillHandoffDelta !== null &&
        !isCompactPillHandoffSuppressed
      ) {
        setIsCompactPillHandoffSuppressed(true);
      }
      setCompactPillHandoffDelta(null);
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
  }, [
    compactPillHandoffDelta,
    compactPillRef,
    heroPillRef,
    interactionDisabled,
    isCompactHeaderActive,
    isCompactPillHandoffSuppressed,
    viewportLg,
  ]);

  useEffect(() => {
    if (!compactPillHandoffDelta) return;

    const timeoutId = window.setTimeout(
      () => setIsCompactPillHandoffSuppressed(true),
      reduceMotion ? 0 : compactHideDelayMs
    );

    return () => window.clearTimeout(timeoutId);
  }, [compactHideDelayMs, compactPillHandoffDelta, reduceMotion]);

  useEffect(() => {
    if (!compactPillHandoffDelta) return;

    const timeoutId = window.setTimeout(
      () => setIsHeroPillHandoffSuppressed(false),
      reduceMotion ? 0 : heroRevealDelayMs
    );

    return () => window.clearTimeout(timeoutId);
  }, [compactPillHandoffDelta, heroRevealDelayMs, reduceMotion]);

  return {
    compactPillHandoffDelta,
    isCompactPillHandoffSuppressed,
    isHeroPillHandoffSuppressed,
  };
}
