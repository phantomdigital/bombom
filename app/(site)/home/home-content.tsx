"use client";

import SitePlaceholderContent from "../_components/site-placeholder-content";

export function HomeContent() {
  return (
    <SitePlaceholderContent
      eyebrow="Home"
      title="Home placeholder"
      href="/menu"
      label="View menu"
      buttonClassName="bg-bom-dark-blue text-bom-white font-sans font-medium antialiased w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
    />
  );
}
