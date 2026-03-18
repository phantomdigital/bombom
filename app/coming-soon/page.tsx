import Link from "next/link";
import BomBomLogo from "@/components/bombom-logo";
import KlaviyoEmailCapture, {
  FLAVOUR_BUTTON_STYLES,
} from "@/components/klaviyo-email-capture";
import { SiInstagram, SiTiktok } from "react-icons/si";

function pickFlavour() {
  return FLAVOUR_BUTTON_STYLES[
    Math.floor(Math.random() * FLAVOUR_BUTTON_STYLES.length)
  ];
}

export default function ComingSoonPage() {
  const flavour = pickFlavour();
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-12">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-full px-2 sm:px-4 text-bom-white">
            <BomBomLogo className="max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto" aria-label="BomBom Treats" />
          </div>

          {/* Spacer: full logo height on mobile, half on desktop */}
          <div
            className="w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto shrink-0 aspect-[1223.31/234.87] sm:aspect-[2446.62/234.87]"
            aria-hidden
          />

          <div className="mx-auto w-full">
            <KlaviyoEmailCapture
              buttonText="Get Notified"
              successMessage="Thanks! We'll let you know when we launch."
              variant="inline"
              className="mx-auto"
              flavourStyle={flavour}
            />
          </div>
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 px-5 sm:px-10 lg:px-16 py-6 sm:py-8 pb-10 sm:pb-12 bg-bom-ice">
        <div className="flex flex-col gap-1 sm:gap-2">
          <span className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-bom-white tracking-tight leading-tight">
            Coming Autumn!
          </span>
          <address className="bom-body1-sm text-base text-bom-white not-italic text-left">
            Shop 1, 117 Baylis St, Wagga
          </address>
        </div>
        <nav className="flex items-center gap-5 sm:gap-6">
          <Link
            href="https://instagram.com/bombom.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bom-white hover:text-bom-musk transition-colors cursor-pointer"
            style={{ cursor: "pointer" }}
            aria-label="Instagram"
          >
            <SiInstagram className="size-8 sm:size-10" />
          </Link>
          <Link
            href="https://tiktok.com/@bombom_au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bom-white hover:text-bom-musk transition-colors cursor-pointer"
            style={{ cursor: "pointer" }}
            aria-label="TikTok"
          >
            <SiTiktok className="size-8 sm:size-10" />
          </Link>
        </nav>
      </footer>
    </main>
  );
}
