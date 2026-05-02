"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteHeaderOrderNowChrome = {
  fill: string;
  foreground: string;
};

/** Matches seam-synced Order now pill in {@link SiteHeader} (outside-pill). */
export const SITE_HEADER_ORDER_NOW_PILL_SYNC_CLASSNAME =
  "shrink-0 border-0 font-sans font-medium antialiased shadow-none transition-[filter] hover:brightness-[0.92] motion-reduce:hover:brightness-100";

type SiteHeaderOrderNowChromeContextValue = {
  chrome: SiteHeaderOrderNowChrome | null;
  setOrderNowChrome: (value: SiteHeaderOrderNowChrome | null) => void;
};

const SiteHeaderOrderNowChromeContext =
  createContext<SiteHeaderOrderNowChromeContextValue | null>(null);

export function SiteHeaderOrderNowChromeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [chrome, setOrderNowChrome] = useState<SiteHeaderOrderNowChrome | null>(
    null
  );
  const value = useMemo(
    () => ({ chrome, setOrderNowChrome }),
    [chrome]
  );
  return (
    <SiteHeaderOrderNowChromeContext.Provider value={value}>
      {children}
    </SiteHeaderOrderNowChromeContext.Provider>
  );
}

export function useSiteHeaderOrderNowChrome(): SiteHeaderOrderNowChrome | null {
  return useContext(SiteHeaderOrderNowChromeContext)?.chrome ?? null;
}

export function useSiteHeaderOrderNowChromeSetter():
  | SiteHeaderOrderNowChromeContextValue["setOrderNowChrome"]
  | undefined {
  return useContext(SiteHeaderOrderNowChromeContext)?.setOrderNowChrome;
}
