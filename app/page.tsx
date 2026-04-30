import LandingPageShell from "@/components/landing-page-shell";

const HOMEPAGE_OPENING_HEADLINE =
  "Join the list for launch offers and updates.";

export default function HomePage() {
  return (
    <LandingPageShell
      includeJsonLd
      headline={HOMEPAGE_OPENING_HEADLINE}
    />
  );
}
