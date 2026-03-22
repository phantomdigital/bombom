import {
  SITE_URL_PRODUCTION,
  getPublicSiteUrl,
  isPublicSiteUrlLocalhost,
} from '../lib/site-url';

/**
 * Email colors — core brand and flavour colors from app/globals.css only.
 * No light/dark variants; inline styles need hex.
 */
export const EMAIL_THEME = {
  bomWhite: '#ffffff',
  /** Body padding + footer strip — neutral frame around the white card */
  emailOuterBg: '#eef0f3',
  /** Rules between blocks inside the card (pairs with emailOuterBg) */
  emailDivider: '#dde1e6',
  /** Footer secondary lines on emailOuterBg */
  footerMuted: '#5c6168',
  footerSubtle: '#7d8288',
  bomBlack: '#000000',
  bomIce: '#91c4ff',
  bomCaramel: '#bf7000',
  bomDarkred: '#ed5878',
  bomRed: '#f8a8c0',
  bomMusk: '#f7b7d3',
} as const;

export const SHOP_ADDRESS = 'Shop 1, 117 Baylis St, Wagga Wagga';

/**
 * @font-face URLs. Defaults to production; for React Email preview with a local Next
 * server, set EMAIL_FONT_BASE_URL=http://localhost:3000 (same origin as /public/fonts).
 */
const fontBaseOverride = process.env.EMAIL_FONT_BASE_URL?.trim()?.replace(/\/$/, '');
export const FONT_BASE_URL = fontBaseOverride || SITE_URL_PRODUCTION;

/** Shipped links (logo, CTAs) always use production — never localhost. */
export const EMAIL_SITE_URL = SITE_URL_PRODUCTION;

/** Ticker GIF — record from /ticker-preview, save to public/email/ticker.gif */
export const TICKER_GIF_URL = `${SITE_URL_PRODUCTION}/email/ticker.gif`;

export const EMAIL_BLEED_URL = `${SITE_URL_PRODUCTION}/email/bleed-white.png`;

/** Absolute logo URL for sent email / Klaviyo (must exist on the live site). */
export const EMAIL_LOGO_URL = `${SITE_URL_PRODUCTION}/email/logo-white.png`;
export const EMAIL_INSTAGRAM_ICON_URL = `${SITE_URL_PRODUCTION}/email/instagram.png`;
export const EMAIL_TIKTOK_ICON_URL = `${SITE_URL_PRODUCTION}/email/tiktok.png`;

/**
 * React Email `email dev` serves `emails/static/` at `/static/*` on the preview port.
 * Root-relative paths like `/images/...` hit the preview app (e.g. :3001), not Next's
 * `public/` folder, so they 404 unless you mirror assets under `emails/static/`.
 *
 * `npm run email:dev` sets EMAIL_PREVIEW_STATIC=1 so preview uses those mirrors; Klaviyo
 * push leaves it unset and keeps absolute production URLs.
 */
const emailPreviewStatic =
  process.env.EMAIL_PREVIEW_STATIC === '1' ||
  process.env.EMAIL_PREVIEW_STATIC === 'true';

export const EMAIL_LOGO_SRC = emailPreviewStatic
  ? '/static/images/logo-white.png'
  : EMAIL_LOGO_URL;

/**
 * Ticker GIF src for templates.
 * - Preview (`npm run email:dev`): `/static/images/ticker.gif` (mirrors `public/email/ticker.gif`).
 * - Local Next + `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`: load from Next
 *   `public/email/ticker.gif` while preview static is off.
 * - Production: `https://bombomtreats.com.au/email/ticker.gif` — must exist on the live site (deploy `public/email/`).
 */
function resolveTickerGifSrc(): string {
  if (emailPreviewStatic) {
    return '/static/images/ticker.gif';
  }
  if (isPublicSiteUrlLocalhost()) {
    return `${getPublicSiteUrl()}/email/ticker.gif`;
  }
  return TICKER_GIF_URL;
}

export const TICKER_GIF_SRC = resolveTickerGifSrc();

function resolveBleedSrc(): string {
  if (emailPreviewStatic) {
    return '/static/email/bleed-white.png';
  }
  if (isPublicSiteUrlLocalhost()) {
    return `${getPublicSiteUrl()}/email/bleed-white.png`;
  }
  return EMAIL_BLEED_URL;
}

export const EMAIL_BLEED_SRC = resolveBleedSrc();

function resolveInstagramIconSrc(): string {
  if (emailPreviewStatic) {
    return '/static/images/instagram.png';
  }
  if (isPublicSiteUrlLocalhost()) {
    return `${getPublicSiteUrl()}/email/instagram.png`;
  }
  return EMAIL_INSTAGRAM_ICON_URL;
}

function resolveTikTokIconSrc(): string {
  if (emailPreviewStatic) {
    return '/static/images/tiktok.png';
  }
  if (isPublicSiteUrlLocalhost()) {
    return `${getPublicSiteUrl()}/email/tiktok.png`;
  }
  return EMAIL_TIKTOK_ICON_URL;
}

export const EMAIL_INSTAGRAM_ICON_SRC = resolveInstagramIconSrc();
export const EMAIL_TIKTOK_ICON_SRC = resolveTikTokIconSrc();
