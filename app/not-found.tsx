import LandingPageShell from "@/components/landing-page-shell";

export default function NotFound() {
  return (
    <LandingPageShell
      headline={
        <>
          <span className="block">404</span>
          <span className="block mt-2 sm:mt-3">Page not found</span>
        </>
      }
    />
  );
}
