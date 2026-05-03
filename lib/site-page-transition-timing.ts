/**
 * Shared timings for `(site)` route transitions: wipe overlay, template exit,
 * optional per-route content entrance. Overlay and `SiteChrome` read this file;
 * each route can import the same values (e.g. `sitePageContentRevealDelayS`) so
 * local page motion stays synced with the wipe.
 */
export const SITE_PAGE_TRANSITION = {
  /** Top-led cover clip wipe grows downward (`cover` opens from top edge). */
  coverDurationS: 0.44,
  /**
   * Bottom-led cover wipes upward (`cover` opens from bottom). Slightly tighter so
   * it doesn’t read slower than the top-led wipe with the same ease curve.
   */
  coverDurationFromBottomLeadS: 0.34,
  briefHoldS: 0.06,
  coverEase: [0.65, 0, 0.35, 1] as const,
  /** Shear during cover; keep at 0 to avoid seams at the wipe edge vs shell. */
  coverSkewDeg: 0,
  /** Organic peel-away when lead is top clip retires toward bottom. */
  revealSpring: {
    type: "spring" as const,
    stiffness: 420,
    damping: 38,
    mass: 0.85,
  },
  /** Slightly tighter when clip retires toward top (paired with bottom-led cover). */
  revealSpringPeelTowardTop: {
    type: "spring" as const,
    stiffness: 560,
    damping: 40,
    mass: 0.72,
  },

  /** Extra wait after cover+hold before page content easing starts (feel + sync with peel). */
  contentRevealStartPaddingS: 0.02,
  /** Page body fade begins this many seconds *before* cover+hold end (overlap peel). Zero = starts only after hold. */
  contentRevealOverlapS: 0.06,
  contentRevealDurationS: 0.58,
  contentRevealEase: [0.25, 1, 0.55, 1] as const,
  /** Quick pre-navigation fade; keep short because the colour wipe follows it. */
  contentExitDurationS: 0.42,
  /** Gentle ease for the departing page shell. */
  contentExitEase: [0.45, 0, 0.75, 1] as const,
};

export function sitePageContentRevealDelayS(): number {
  const coverWorstDuration = Math.max(
    SITE_PAGE_TRANSITION.coverDurationS,
    SITE_PAGE_TRANSITION.coverDurationFromBottomLeadS
  );
  return Math.max(
    0,
    coverWorstDuration +
      SITE_PAGE_TRANSITION.briefHoldS -
      SITE_PAGE_TRANSITION.contentRevealOverlapS +
      SITE_PAGE_TRANSITION.contentRevealStartPaddingS
  );
}
