"use client";

import SitePlaceholderContent from "../_components/site-placeholder-content";

export function SpecialsContent() {
  return (
    <SitePlaceholderContent
      eyebrow="Specials"
      title="Specials placeholder"
      href="/menu"
      label="View the menu"
      syncOrderNowChromeWithHeader
      buttonClassName="bg-bom-dark-blue text-white font-sans font-medium antialiased w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
    />
  );
}
