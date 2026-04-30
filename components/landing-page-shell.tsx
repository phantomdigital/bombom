"use client";

import { useState, type ReactNode } from "react";
import { MapPinIcon } from "@phosphor-icons/react";
import KlaviyoEmailCapture from "@/components/klaviyo-email-capture";
import LandingPageHeader from "@/components/landing-page-header";
import LandingSocialLinks from "@/components/landing-social-links";
import OpeningCountdownTicker from "@/components/opening-countdown-ticker";
import { getPublicSiteUrl } from "@/lib/site-url";
const siteUrl = getPublicSiteUrl();
const LANDING_LARGE_PROMO_TYPE =
  "font-sans text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-bom-white";
const LANDING_BODY_MARKETING =
  "font-sans text-base leading-[1.2] text-bom-white not-italic sm:text-[clamp(0.8125rem,1.75vw,16pt)]";
const MARKETING_OPENING_LABEL = "Opening Friday 1st May from 11am";
const MARKETING_LIST_LINE =
  "Join the list for launch offers and updates.";
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
  headline?: ReactNode;
  /** When true, shows “Join the list…” under the headline (marketing page). Hide for e.g. not-found. */
  showMarketingSubline?: boolean;
  /** Footer AEST countdown to opening; hide on not-found. */
  showOpeningCountdown?: boolean;
  includeJsonLd?: boolean;
};

export default function LandingPageShell({
  headline = MARKETING_OPENING_LABEL,
  showMarketingSubline = true,
  showOpeningCountdown = true,
  includeJsonLd = false,
}: LandingPageShellProps) {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-bom-ice">
      {includeJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <LandingPageHeader />
      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-16"
        tabIndex={-1}
      >
        <div className="mx-auto w-full max-w-3xl sm:max-w-4xl lg:max-w-6xl">
          <div className="rounded-4xl bg-bom-dark-blue px-10 py-12 sm:px-14 sm:py-14 lg:px-20 lg:py-16">
            <div
              className={`mb-8 transition-opacity duration-400 sm:mb-11 ${isSuccessVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              aria-hidden={isSuccessVisible}
            >
              <h1
                className={`${LANDING_LARGE_PROMO_TYPE} text-center ${showMarketingSubline ? "mb-3 sm:mb-4" : ""}`}
              >
                {headline}
              </h1>
              {showMarketingSubline ? (
                <p
                  className={`${LANDING_BODY_MARKETING} mx-auto max-w-2xl text-center`}
                >
                  {MARKETING_LIST_LINE}
                </p>
              ) : null}
            </div>
            <KlaviyoEmailCapture
              buttonText="Stay in the loop"
              successMessage={MARKETING_SUCCESS_MESSAGE}
              variant="inline"
              onDarkSurface
              className="relative mx-auto w-full max-w-none"
              onSuccessVisibilityChange={setIsSuccessVisible}
            />
          </div>
          {showOpeningCountdown ? (
            <OpeningCountdownTicker className="mx-auto mt-4 w-fit sm:hidden" />
          ) : null}
        </div>
      </main>

      <footer className="shrink-0 bg-bom-ice px-5 py-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-10 sm:py-8 sm:pb-12 lg:px-16">
        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <div className="flex w-full flex-col items-start gap-3 text-left sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <address
              className={`flex max-w-xl shrink-0 items-start gap-2 ${LANDING_BODY_MARKETING} text-left`}
            >
              <MapPinIcon
                weight="light"
                className="size-[1.125em] shrink-0 translate-y-px text-current"
                aria-hidden
              />
              Shop 1, 117 Baylis St, Wagga Wagga
            </address>
            {showOpeningCountdown ? (
              <OpeningCountdownTicker className="hidden sm:block" />
            ) : null}
          </div>
          <LandingSocialLinks className="mt-3 flex sm:hidden -ml-2" />
        </div>
      </footer>
    </div>
  );
}
