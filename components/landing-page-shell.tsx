"use client";

import { useState, type ReactNode } from "react";
import KlaviyoEmailCapture from "@/components/klaviyo-email-capture";
import LandingPageHeader from "@/components/landing-page-header";
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
      <LandingPageHeader />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-5 sm:px-10 lg:px-16 py-8 sm:py-12"
        tabIndex={-1}
      >
        <div className="mx-auto w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl">
          <div className="rounded-4xl bg-bom-dark-blue px-8 py-12 sm:px-12 sm:py-14 lg:px-14 lg:py-16">
            <h1
              className={`bom-body1-heading-sm sm:bom-body1-sm text-bom-white text-center mb-8 sm:mb-11 transition-opacity duration-400 ${isSuccessVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              aria-hidden={isSuccessVisible}
            >
              {headline}
            </h1>
            <KlaviyoEmailCapture
              buttonText="Stay in the loop"
              successMessage={MARKETING_SUCCESS_MESSAGE}
              variant="inline"
              onDarkSurface
              className="relative mx-auto w-full max-w-none"
              onSuccessVisibilityChange={setIsSuccessVisible}
            />
          </div>
        </div>
      </main>

      <footer className="px-5 sm:px-10 lg:px-16 py-6 sm:py-8 pb-10 sm:pb-12 bg-bom-ice">
        <div className="flex flex-col items-start gap-1 sm:gap-2 text-left">
          <span className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium text-bom-white tracking-tight leading-tight text-left">
            {MARKETING_OPENING_LABEL}
          </span>
          <address className="bom-body1-sm text-bom-white not-italic text-left">
            Shop 1, 117 Baylis St, Wagga Wagga
          </address>
        </div>
      </footer>
    </div>
  );
}
