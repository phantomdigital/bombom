import LandingPageShell from "@/components/landing-page-shell";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <LandingPageShell includeJsonLd />;
}
