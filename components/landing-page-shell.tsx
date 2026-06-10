"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { MapPinIcon } from "@phosphor-icons/react";
import KlaviyoEmailCapture from "@/components/klaviyo-email-capture";
import LandingPageHeader from "@/components/landing-page-header";
import LandingSocialLinks from "@/components/landing-social-links";
import OpeningCountdownTicker, {
  OPENING_LAUNCH_TIMESTAMP_MS,
} from "@/components/opening-countdown-ticker";
import { getPublicSiteUrl } from "@/lib/site-url";

const siteUrl = getPublicSiteUrl();
const LANDING_LARGE_PROMO_TYPE =
  "font-sans text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-bom-white";
const LANDING_BODY_MARKETING =
  "font-sans text-base leading-[1.2] text-bom-white not-italic sm:text-base lg:text-[clamp(1rem,1.75vw,16pt)]";
const MARKETING_OPENING_LABEL = "Opening Friday 1st May from 11am";
const MARKETING_LIST_LINE =
  "Join the list for launch offers and updates.";
const LOCATION_LABEL = "Shop 1, 117 Baylis St, Wagga Wagga";
const OPEN_CELEBRATION_HEADLINE = "And just like that, we're open!";
const OPEN_CELEBRATION_SUBLINE =
  "Wander in if you're around. Otherwise, join the list below for launch offers and updates.";
const MARKETING_SUCCESS_MESSAGE =
  "You're in,  we'll be in touch.";
const INTRO_REVEAL_DELAY_MS = 1000;
const CARD_LAYOUT_TRANSITION = {
  layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};
const MARKETING_SEO_DESCRIPTION =
  "BomBom Treats is now open at Shop 1, 117 Baylis St, Wagga Wagga.";

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
        "https://www.facebook.com/people/Bombom/61587805351397/",
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

function isLaunchPastNow() {
  return Date.now() >= OPENING_LAUNCH_TIMESTAMP_MS;
}

/** Returns inner timeout id so callers can cancel on unmount. */
function burstOpenCelebrationConfetti(): number {
  confetti({
    particleCount: 200,
    spread: 115,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.52 },
    disableForReducedMotion: true,
  });

  return window.setTimeout(() => {
    confetti({
      particleCount: 85,
      angle: 62,
      spread: 72,
      origin: { x: 0 },
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 85,
      angle: 118,
      spread: 72,
      origin: { x: 1 },
      disableForReducedMotion: true,
    });
  }, 260);
}

export default function LandingPageShell({
  headline = MARKETING_OPENING_LABEL,
  showMarketingSubline = true,
  showOpeningCountdown = true,
  includeJsonLd = false,
}: LandingPageShellProps) {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isIntroContentRevealed, setIsIntroContentRevealed] = useState(true);
  const [celebrationDemo, setCelebrationDemo] = useState(false);
  /** Re-render periodically so countdown → celebration flips without user action. */
  const [, setPulseTick] = useState(0);
  const [isLocalDev, setIsLocalDev] = useState(false);
  /** Increment from localhost-only control to replay confetti bursts. */
  const [confettiReplayKey, setConfettiReplayKey] = useState(0);
  const showOpeningCountdownRef = useRef(showOpeningCountdown);
  const hasShownSuccessRef = useRef(false);
  showOpeningCountdownRef.current = showOpeningCountdown;

  const launchCelebration =
    showOpeningCountdown &&
    (celebrationDemo || isLaunchPastNow());

  useEffect(() => {
    const h =
      typeof window !== "undefined" ? window.location.hostname : "";
    setIsLocalDev(
      h === "localhost" || h === "127.0.0.1" || h === "[::1]"
    );
  }, []);

  useEffect(() => {
    if (!showOpeningCountdown) return;
    const id = window.setInterval(() => {
      setPulseTick((n) => n + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [showOpeningCountdown]);

  useEffect(() => {
    if (isSuccessVisible) {
      hasShownSuccessRef.current = true;
      setIsIntroContentRevealed(false);
      return;
    }

    if (!hasShownSuccessRef.current) return;

    const revealTimeoutId = window.setTimeout(() => {
      setIsIntroContentRevealed(true);
    }, INTRO_REVEAL_DELAY_MS);

    return () => window.clearTimeout(revealTimeoutId);
  }, [isSuccessVisible]);

  useEffect(() => {
    if (!launchCelebration || !showOpeningCountdown) return;

    const innerTimeoutId = burstOpenCelebrationConfetti();

    return () => {
      window.clearTimeout(innerTimeoutId);
    };
  }, [launchCelebration, showOpeningCountdown, confettiReplayKey]);

  /** After launch: confetti again when tab is restored from BFCache (back/forward). */
  useEffect(() => {
    if (!showOpeningCountdown) return;

    function onPageShow(ev: PageTransitionEvent) {
      if (!ev.persisted) return;
      if (!showOpeningCountdownRef.current) return;
      if (Date.now() < OPENING_LAUNCH_TIMESTAMP_MS) return;
      burstOpenCelebrationConfetti();
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [showOpeningCountdown]);

  const displayHeadline = launchCelebration ? OPEN_CELEBRATION_HEADLINE : headline;
  const displaySubline = launchCelebration
    ? OPEN_CELEBRATION_SUBLINE
    : MARKETING_LIST_LINE;

  return (
    <div className="flex min-h-dvh flex-col bg-bom-ice">
      {includeJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {showOpeningCountdown && isLocalDev ? (
        <button
          type="button"
          className="fixed bottom-4 right-4 z-50 rounded-sm border border-bom-black bg-bom-ice px-3 py-2 font-sans text-xs font-semibold uppercase tracking-wide text-bom-black shadow-lg transition-colors hover:bg-bom-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-black focus-visible:ring-offset-2"
          onClick={() => {
            setCelebrationDemo(true);
            setConfettiReplayKey((n) => n + 1);
          }}
        >
          Test opening
        </button>
      ) : null}
      <LandingPageHeader />
      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-16"
        tabIndex={-1}
      >
        <div className="mx-auto w-full max-w-3xl sm:max-w-4xl lg:max-w-6xl">
          <motion.div
            layout
            transition={CARD_LAYOUT_TRANSITION}
            className="rounded-4xl bg-bom-dark-blue px-10 py-12 sm:px-14 sm:py-14 lg:px-20 lg:py-16"
          >
            <motion.div
              layout="position"
              transition={CARD_LAYOUT_TRANSITION}
            >
              <div
                className={`mb-8 transition-opacity duration-400 sm:mb-11 ${isSuccessVisible ? "hidden" : isIntroContentRevealed ? "opacity-100" : "pointer-events-none opacity-0"}`}
                aria-hidden={isSuccessVisible || !isIntroContentRevealed}
              >
                <h1
                  className={`${LANDING_LARGE_PROMO_TYPE} text-center ${showMarketingSubline ? "mb-3 sm:mb-4" : ""}`}
                >
                  {displayHeadline}
                </h1>
                {showMarketingSubline ? (
                  <p
                    className={`${LANDING_BODY_MARKETING} mx-auto max-w-2xl text-center`}
                  >
                    {displaySubline}
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
            </motion.div>
          </motion.div>
          <div className="mt-10 flex flex-col items-center gap-8 sm:hidden">
            <address
              className={`flex max-w-xs items-center justify-center gap-2.5 text-center not-italic ${LANDING_BODY_MARKETING}`}
            >
              <MapPinIcon
                weight="light"
                className="size-[1.15em] shrink-0 text-current"
                aria-hidden
              />
              <span className="min-w-0 leading-tight">{LOCATION_LABEL}</span>
            </address>
            {showOpeningCountdown && !launchCelebration ? (
              <OpeningCountdownTicker className="w-fit" />
            ) : null}
          </div>
        </div>
      </main>

      <footer className="shrink-0 bg-bom-ice px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-0 sm:px-10 sm:py-8 sm:pb-12 lg:px-16">
        <div className="flex w-full flex-col sm:gap-4">
          <div className="hidden w-full flex-col items-start gap-3 text-left sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <address
              className={`hidden max-w-xl shrink-0 items-center gap-2.5 text-left not-italic sm:flex ${LANDING_BODY_MARKETING}`}
            >
              <MapPinIcon
                weight="light"
                className="size-[1.15em] shrink-0 text-current"
                aria-hidden
              />
              <span className="min-w-0 leading-tight">{LOCATION_LABEL}</span>
            </address>
            {showOpeningCountdown && !launchCelebration ? (
              <OpeningCountdownTicker className="hidden shrink-0 sm:block" />
            ) : null}
          </div>
          <LandingSocialLinks className="flex justify-center sm:hidden" />
        </div>
      </footer>
    </div>
  );
}
