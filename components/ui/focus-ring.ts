/**
 * Shared keyboard focus treatment for interactive BOM UI.
 *
 * The transparent offset creates a clean 1-2px separation between the element
 * and the coloured ring without requiring each component to know its backdrop.
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bom-dark-blue focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

export const focusRingTight =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bom-dark-blue focus-visible:ring-offset-1 focus-visible:ring-offset-transparent";

export const focusRingInset =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-bom-dark-blue";
