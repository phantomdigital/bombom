"use client";

import SitePlaceholderContent from "../_components/site-placeholder-content";

export function AboutContent() {
  return (
    <SitePlaceholderContent
      eyebrow="About"
      title="About placeholder"
      href="/home"
      label="Back to home"
      buttonClassName="bg-bom-lime text-bom-black font-sans font-medium antialiased w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
    />
  );
}
