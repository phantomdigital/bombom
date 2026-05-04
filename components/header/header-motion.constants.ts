/** Desktop-only dual-header swap threshold. */
export const DESKTOP_HEADER_MEDIA_QUERY = "(min-width: 1301px)";
export const HEADER_MODE_SLIDE_PX = 148;
export const COMPACT_HEADER_OFFSCREEN_Y = -260;
export const HEADER_MODE_SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as const,
};
export const HEADER_HANDOFF_COMPACT_HIDE_DELAY_MS = 880;
export const HEADER_HANDOFF_HERO_REVEAL_DELAY_MS = 820;

export const LOGO_TRANSIT_IDLE = { scale: 1, rotate: 0 };
export const LOGO_FIRST_WORD_LAYOUT_IDLE = {
  ...LOGO_TRANSIT_IDLE,
  marginRight: 0,
};
export const LOGO_HOVER_HOLD = { scale: 1.035, rotate: -1.4 };
export const LOGO_FIRST_WORD_LAYOUT_HOVER_HOLD = {
  ...LOGO_HOVER_HOLD,
  marginRight: 10,
};
export const LOGO_HOVER_APPROACH = {
  duration: 0.34,
  ease: [0.25, 1, 0.35, 1] as [number, number, number, number],
};
export const LOGO_WORD_STAGGER_S = 0.2;
export const LOGO_SECOND_WORD_HOVER_APPROACH = {
  ...LOGO_HOVER_APPROACH,
  delay: LOGO_WORD_STAGGER_S,
};
/** Short settle back to idle after hover/transition hold. */
export const LOGO_REST_SETTLE = {
  duration: 0.42,
  ease: [0.2, 1, 0.3, 1] as [number, number, number, number],
};

/** Hover-in completion window: stagger + approach + small cushion. */
export const LOGO_HOVER_APPROACH_TOTAL_MS =
  Math.ceil((LOGO_WORD_STAGGER_S + LOGO_HOVER_APPROACH.duration) * 1000) + 40;
