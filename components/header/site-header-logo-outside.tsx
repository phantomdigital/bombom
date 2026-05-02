"use client";

import SiteHeader, { type SiteHeaderProps } from "@/components/header/site-header";

/**
 * Same as {@link SiteHeader} with the logo outside the white pill: a flex row
 * with `justify-between` between the mark and the pill.
 */
export default function SiteHeaderLogoOutside(
  props: Omit<SiteHeaderProps, "logoPlacement">
) {
  return <SiteHeader {...props} logoPlacement="outside-pill" />;
}
