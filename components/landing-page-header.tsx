import BomBomLogo from "@/components/bombom-logo";
import LandingSocialLinks from "@/components/landing-social-links";

export default function LandingPageHeader() {
  return (
    <header className="shrink-0 px-5 sm:px-10 lg:px-16 pt-8 pb-2 sm:pt-10 sm:pb-4">
      <div className="flex flex-row items-center justify-center gap-3 sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
          <BomBomLogo
            className="block h-auto w-full max-w-full sm:w-auto sm:max-w-[28rem] lg:max-w-[36rem]"
            aria-label="BomBom Treats"
          />
        </div>
        <LandingSocialLinks className="hidden sm:flex" />
      </div>
    </header>
  );
}
