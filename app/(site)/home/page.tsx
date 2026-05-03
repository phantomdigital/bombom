import { HomeContent } from "./home-content";
import HomeEventsCateringPlaceholder from "./home-events-catering-placeholder";
import HomeFooterPlaceholder from "./home-footer-placeholder";
import HomeMenuOverviewPlaceholder from "./home-menu-overview-placeholder";

export default function HomePreviewPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex min-h-0 w-full min-w-0 flex-1 flex-col bg-bom-dark-blue"
    >
      <HomeContent />
      <HomeMenuOverviewPlaceholder />
      <HomeEventsCateringPlaceholder />
      <HomeFooterPlaceholder />
      {/* Hash targets for `/home#locations` and `/home#about` */}
      <div
        id="locations"
        className="scroll-mt-24"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        id="about"
        className="scroll-mt-24"
        aria-hidden="true"
        tabIndex={-1}
      />
    </main>
  );
}
