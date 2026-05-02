"use client";

import SitePlaceholderContent from "../_components/site-placeholder-content";

export function StoryContent() {
  return (
    <SitePlaceholderContent
      eyebrow="Story"
      title="Story placeholder"
      href="/menu"
      label="View the menu"
      buttonClassName="bg-bom-lime text-bom-black font-sans font-medium antialiased w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
    />
  );
}
