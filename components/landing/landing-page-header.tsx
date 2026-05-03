import BomBomLogo from "@/components/bombom-logo";
import LandingSocialLinks from "@/components/landing/landing-social-links";
import SiteChromeRail from "@/components/site/site-chrome-rail";

export default function LandingPageHeader() {
  return (
    <header className="shrink-0 pb-2 pt-8 sm:pb-4 sm:pt-10">
      <SiteChromeRail railClassName="flex flex-row items-center justify-center gap-3 sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
          <BomBomLogo
            className="block h-auto w-full max-w-full sm:w-auto sm:max-w-[28rem] lg:max-w-[36rem]"
            aria-label="BomBom Treats"
          />
        </div>
        <LandingSocialLinks className="hidden sm:flex" />
      </SiteChromeRail>
    </header>
  );
}
