"use client";

import SitePlaceholderContent from "../_components/site-placeholder-content";

export function MenuContent() {
  return (
    <SitePlaceholderContent
      eyebrow="Menu"
      title="Menu placeholder"
      href="/home"
      label="Back to home"
      buttonClassName="bg-bom-berry text-bom-white font-sans font-medium antialiased w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
    />
  );
}
