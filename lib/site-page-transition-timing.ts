/**
 * Shared timings for `(site)` route transitions: wipe overlay, template exit,
 * optional per-route content entrance. Overlay and `SiteChrome` read this file;
 * each route can import the same values (e.g. `sitePageContentRevealDelayS`) so
 * local page motion stays synced with the wipe.
 */
export const SITE_PAGE_TRANSITION = {
  /** Top-to-fullscreen clip wipe (seconds). */
  coverDurationS: 0.52,
  briefHoldS: 0.1,
  coverEase: [0.65, 0, 0.35, 1] as const,
  /** Shear during cover; keep at 0 to avoid seams at the wipe edge vs shell. */
  coverSkewDeg: 0,
  /** Organic peel-away from the bottom after the brief hold. */
  revealSpring: {
    type: "spring" as const,
    stiffness: 420,
    damping: 38,
    mass: 0.85,
  },

  /** Extra wait after cover+hold before page content easing starts (feel + sync with peel). */
  contentRevealStartPaddingS: 0.16,
  /** Page body fade begins this many seconds *before* cover+hold end (overlap peel). Zero = starts only after hold. */
  contentRevealOverlapS: 0,
  contentRevealDurationS: 0.72,
  contentRevealEase: [0.25, 1, 0.55, 1] as const,
  /** Quick pre-navigation fade; keep short because the colour wipe follows it. */
  contentExitDurationS: 0.55,
  /** Gentle ease for the departing page shell. */
  contentExitEase: [0.45, 0, 0.75, 1] as const,
};

export function sitePageContentRevealDelayS(): number {
  return Math.max(
    0,
    SITE_PAGE_TRANSITION.coverDurationS +
      SITE_PAGE_TRANSITION.briefHoldS -
      SITE_PAGE_TRANSITION.contentRevealOverlapS +
      SITE_PAGE_TRANSITION.contentRevealStartPaddingS
  );
}
