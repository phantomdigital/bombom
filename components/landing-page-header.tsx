import Link from "next/link";
import { SiInstagram, SiTiktok } from "react-icons/si";
import BomBomLogo from "@/components/bombom-logo";

export default function LandingPageHeader() {
  return (
    <header className="shrink-0 px-5 sm:px-10 lg:px-16 pt-8 pb-2 sm:pt-10 sm:pb-4">
      <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <BomBomLogo
            className="block h-auto w-auto max-w-96 sm:max-w-[28rem] lg:max-w-[36rem]"
            aria-label="BomBom Treats"
          />
        </div>
        <nav
          className="flex shrink-0 items-center gap-1 sm:gap-2"
          aria-label="Social links"
        >
          <Link
            href="https://instagram.com/bombom.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 text-bom-white hover:text-bom-musk transition-colors sm:p-3"
            aria-label="Instagram (opens in new tab)"
          >
            <SiInstagram className="size-7 shrink-0 sm:size-8 lg:size-10" />
          </Link>
          <Link
            href="https://tiktok.com/@bombom_au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 text-bom-white hover:text-bom-musk transition-colors sm:p-3"
            aria-label="TikTok (opens in new tab)"
          >
            <SiTiktok className="size-7 shrink-0 sm:size-8 lg:size-10" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
