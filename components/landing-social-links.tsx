import Link from "next/link";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";

type LandingSocialLinksProps = {
  className?: string;
};

export default function LandingSocialLinks({
  className = "",
}: LandingSocialLinksProps) {
  return (
    <nav
      className={`flex shrink-0 items-center gap-2 sm:gap-6 ${className}`}
      aria-label="Social links"
    >
      <Link
        href="https://instagram.com/bombom.au"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center p-2 text-bom-white transition-colors hover:text-bom-dark-blue sm:p-3"
        aria-label="Instagram (opens in new tab)"
      >
        <SiInstagram className="size-10 shrink-0 sm:size-12 lg:size-14" />
      </Link>
      <Link
        href="https://www.facebook.com/people/Bombom/61587805351397/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center p-2 text-bom-white transition-colors hover:text-bom-dark-blue sm:p-3"
        aria-label="Facebook (opens in new tab)"
      >
        <SiFacebook className="size-10 shrink-0 sm:size-12 lg:size-14" />
      </Link>
      <Link
        href="https://tiktok.com/@bombom_au"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center p-2 text-bom-white transition-colors hover:text-bom-dark-blue sm:p-3"
        aria-label="TikTok (opens in new tab)"
      >
        <SiTiktok className="size-10 shrink-0 sm:size-12 lg:size-14" />
      </Link>
    </nav>
  );
}
