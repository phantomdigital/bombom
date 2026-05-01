"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

const SitePageTransitionContext = createContext({
  isContentRevealed: true,
});

export function SitePageTransitionProvider({
  children,
  isContentRevealed,
}: {
  children: ReactNode;
  isContentRevealed: boolean;
}) {
  return (
    <SitePageTransitionContext.Provider value={{ isContentRevealed }}>
      {children}
    </SitePageTransitionContext.Provider>
  );
}

export function useSitePageTransition() {
  return useContext(SitePageTransitionContext);
}
