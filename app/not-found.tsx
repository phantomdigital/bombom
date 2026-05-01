import LandingPageShell from "@/components/landing/landing-page-shell";

export default function NotFound() {
  return (
    <LandingPageShell
      showMarketingSubline={false}
      showOpeningCountdown={false}
      headline={
        <>
          <span className="block">404</span>
          <span className="block mt-2 sm:mt-3">Page not found</span>
        </>
      }
    />
  );
}
