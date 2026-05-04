import { useLayoutEffect, useState } from "react";

export function useViewportLg(mediaQuery: string) {
  const [viewportLg, setViewportLg] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(mediaQuery);
    const syncViewport = () => {
      setViewportLg(mq.matches);
    };
    syncViewport();
    mq.addEventListener("change", syncViewport);
    return () => mq.removeEventListener("change", syncViewport);
  }, [mediaQuery]);

  return viewportLg;
}
