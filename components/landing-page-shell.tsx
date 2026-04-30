"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import BomBomLogo from "@/components/bombom-logo";
import KlaviyoEmailCapture from "@/components/klaviyo-email-capture";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { getPublicSiteUrl } from "@/lib/site-url";

const siteUrl = getPublicSiteUrl();
const MARKETING_OPENING_LABEL = "Opening Friday 1st May from 11am";
const MARKETING_SUCCESS_MESSAGE =
  "Thanks! You're on the list.";
const MARKETING_SEO_DESCRIPTION =
  "BomBom Treats opens Friday 1st May from 11am at Shop 1, 117 Baylis St, Wagga Wagga. Join the list for launch offers and updates.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "BomBom Treats",
      url: siteUrl,
      sameAs: [
        "https://instagram.com/bombom.au",
        "https://www.tiktok.com/@bombom_au",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "BomBom Treats",
      description: MARKETING_SEO_DESCRIPTION,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "IceCreamShop",
      "@id": `${siteUrl}/#local`,
      name: "BomBom Treats",
      url: siteUrl,
      description: MARKETING_SEO_DESCRIPTION,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop 1, 117 Baylis St",
        addressLocality: "Wagga Wagga",
        addressRegion: "NSW",
        addressCountry: "AU",
      },
      parentOrganization: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

type LandingPageShellProps = {
  headline: ReactNode;
  includeJsonLd?: boolean;
};

export default function LandingPageShell({
  headline,
  includeJsonLd = false,
}: LandingPageShellProps) {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  return (
    <div className="min-h-screen bg-bom-ice flex flex-col">
      {includeJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-12"
        tabIndex={-1}
      >
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-full px-2 sm:px-4 text-bom-white">
            <BomBomLogo className="max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto" aria-label="BomBom Treats" />
          </div>

          <div
            className="w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto shrink-0 aspect-[1223.31/234.87] sm:aspect-[2446.62/234.87]"
            aria-hidden
          />

          <div className="mx-auto w-full">
            <h1
              className={`bom-body1-heading-sm sm:bom-body1-sm text-bom-black text-center mb-8 transition-opacity duration-400 ${isSuccessVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              aria-hidden={isSuccessVisible}
            >
              {headline}
            </h1>
            <KlaviyoEmailCapture
              buttonText="Get Notified"
              successMessage={MARKETING_SUCCESS_MESSAGE}
              variant="inline"
              className="mx-auto"
              onSuccessVisibilityChange={setIsSuccessVisible}
            />
          </div>
        </div>
      </main>

      <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 px-5 sm:px-10 lg:px-16 py-6 sm:py-8 pb-10 sm:pb-12 bg-bom-ice">
        <div className="flex flex-col gap-1 sm:gap-2">
          <span className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-bom-white tracking-tight leading-tight">
            {MARKETING_OPENING_LABEL}
          </span>
          <address className="bom-body1-sm text-bom-white not-italic text-left">
            Shop 1, 117 Baylis St, Wagga Wagga
          </address>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="https://instagram.com/bombom.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-3 text-bom-white hover:text-bom-musk transition-colors cursor-pointer"
            aria-label="Instagram (opens in new tab)"
          >
            <SiInstagram className="size-8 sm:size-10 shrink-0" />
          </Link>
          <Link
            href="https://tiktok.com/@bombom_au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-3 text-bom-white hover:text-bom-musk transition-colors cursor-pointer"
            aria-label="TikTok (opens in new tab)"
          >
            <SiTiktok className="size-8 sm:size-10 shrink-0" />
          </Link>
        </nav>
      </footer>
    </div>
  );
}
