"use client";

import type { ReactNode } from "react";
import HomeHero from "./home-hero";

export function HomeContent({ menuOverview }: { menuOverview: ReactNode }) {
  return (
    <>
      <HomeHero />
      {menuOverview}
    </>
  );
}
