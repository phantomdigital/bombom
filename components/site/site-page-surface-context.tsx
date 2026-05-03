"use client";

import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

const SitePageSurfaceSetterContext = createContext<
  Dispatch<SetStateAction<string | null>> | null
>(null);

export const SitePageSurfaceSetterProvider =
  SitePageSurfaceSetterContext.Provider;

export function useSitePageSurfaceSetter() {
  return useContext(SitePageSurfaceSetterContext);
}
