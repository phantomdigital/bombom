# Site Navigation and Colour System

This document describes the `(site)` navigation shell, page transition wipe, revealed page background system, and seam-aware header logo colouring.

## Mental Model

The site separates three colours that are easy to confuse:

1. **Route palette** - the transition wipe and persistent shell/chrome colour.
2. **Revealed page surface** - the actual page background after content appears.
3. **Header/logo chrome** - logo and CTA colours derived from what is visually behind them.

For example, `/specials` currently uses:

- Route palette: chocolate (`--color-bom-chocolate`) for wipe/chrome.
- Revealed surface: orange (`--color-bom-orange`) for the final page.
- Logo after reveal: white, because orange maps to a white BomBom mark.

That means route colour and page colour are intentionally independent.

## Persistent Site Shell

`app/(site)/layout.tsx` renders `SiteChrome` once around all `(site)` routes.

`components/site/site-chrome.tsx` owns the persistent navigation transition state:

- `shellHex` - background colour behind route content and header chrome.
- `isNavigationLocked` - disables header interaction while a route transition is running.
- `isContentRevealed` - provided via `SitePageTransitionProvider`; pages fade in/out from this.
- `pageSurfaceHexOverride` - lets a rendered page explicitly tell the persistent header its real surface colour, important for 404s.

The persistent header (`SiteHeaderLogoOutside`) and transition overlay live outside route children, so they survive route changes.

## Click-Driven Navigation Flow

Internal same-origin links are intercepted in `SiteChrome.handleClickCapture`.

The click path is:

1. Prevent native navigation.
2. Compute the cover colour with `getSiteCoverHex(currentPath, nextPath)`.
3. Lock navigation with `setIsNavigationLocked(true)`.
4. Ask `SitePageTransitionOverlay.cover(coverHex)` to cover the viewport.
5. Briefly hold the cover.
6. `flushSync`:
   - Set `shellHex` to the same cover colour.
   - Set `isContentRevealed(false)`.
7. Store `pendingClickRevealPathRef`.
8. `router.push(href, { scroll: true })`.
9. When the new route renders, a second effect sees `pendingClickRevealPathRef.current === pathname`.
10. Wait two RAFs so the new tree is painted.
11. Scroll to top.
12. Peel the overlay away.
13. Reveal content with `setIsContentRevealed(true)`.
14. Unlock navigation.

Browser back/forward uses a similar `pathname` effect fallback: cover, hold, set shell colour, peel, reveal.

## Transition Overlay

`components/site/site-page-transition-overlay.tsx` is an imperative Framer Motion overlay.

It exposes:

- `cover(hex)` - sets the overlay colour and expands from a clipped edge to full screen.
- `peel()` - retreats the full-screen colour off the opposite edge.

The overlay alternates lead edges:

- First cycle: cover from top, peel toward bottom.
- Next cycle: cover from bottom, peel toward top.

Timing lives in `lib/site-page-transition-timing.ts`.

Bottom-led movement has separate timing:

- `coverDurationFromBottomLeadS`
- `revealSpringPeelTowardTop`

This exists because bottom-to-top movement read slower with the same timings as top-to-bottom.

## Route Palette

`lib/site-route-theme.ts` defines route palettes.

These palettes are for the wipe and persistent shell/chrome, not necessarily the final page background.

Current examples:

```ts
{
  match: "/menu",
  palette: {
    css: "var(--color-bom-berry)",
    hex: "#7a0000",
  },
}

{
  match: "/specials",
  palette: {
    css: "var(--color-bom-chocolate)",
    hex: "#6f4227",
  },
}
```

The default unmatched route palette is lime. That affects 404 transition/chrome, not the rendered 404 surface.

## Revealed Page Surface

`lib/site-page-reveal-surface.ts` maps routes to their real final page surface.

Examples:

```ts
{ match: "/menu", surface: { css: "var(--color-bom-musk)", hex: "#f7b7d3" } }
{ match: "/specials", surface: { css: "var(--color-bom-orange)", hex: "#ff7040" } }
{ match: "/story", surface: MARBLE_SURFACE }
```

This is intentionally separate from `site-route-theme`.

Surfaces are exact-match by default. A path like `/menu/soft-serve` does not inherit `/menu` unless that entry opts into:

```ts
includeChildren: true
```

That is deliberate. Unknown nested URLs should render the 404 marble surface, not accidentally inherit `/menu` musk.

## Wipe Collision Logic

`getSiteCoverHex(from, to)` chooses the actual overlay colour.

Default behaviour:

```ts
cover = getSitePalette(to).hex
```

But if the destination wipe colour matches the current page surface, the wipe would be invisible. In that case it uses the arriving page surface instead.

In plain English:

```ts
if destinationWipe === currentRevealedSurface:
  use destinationRevealedSurface
else:
  use destinationWipe
```

This preserves the "visible wipe" effect without adding a second transition layer.

## 404 Pages

404s are special because the URL may look like a real route prefix:

- `/menu/soft-serve`
- `/specials/missing`
- `/story/nope`

The rendered page is still the site 404, whose surface is marble.

`app/(site)/not-found.tsx` passes:

```tsx
<SitePlaceholderContent
  sectionClassName="bg-bom-marble"
  pageSurfaceHex="#f3f3f1"
  ...
/>
```

`SitePlaceholderContent` publishes `pageSurfaceHex` through `SitePageSurfaceSetterProvider`. `SiteChrome` stores it as `pageSurfaceHexOverride` and passes it to `SiteHeader`.

This makes the persistent header resolve logo colour from what actually rendered, not what the URL prefix implies.

## Header Logo Colour

The outside BomBom logo is a masked SVG fill controlled by:

```css
--seam-logo-color
```

`components/header/site-header.tsx` picks its idle value from:

```ts
pageSurfaceHexOverride ?? getSitePageRevealSurface(pathname).hex
```

Then it calls:

```ts
getDefaultSeamChromeForPaletteHex(surfaceHex, "logo")
```

So idle logo colour is based on the revealed page surface:

- Marble -> black.
- Orange -> white.
- Musk -> white.
- Lemon -> black.
- Ice -> white.

During transitions, when `interactionDisabled` is true, the header samples the actual seam under the logo every animation frame with `getSeamAwareLogoColor(...)`.

That sampler temporarily changes `--seam-logo-color` to match the moving wipe under the logo. When navigation unlocks, `SiteHeader` resets `--seam-logo-color` back to the final page surface colour. This avoids cases where a berry or orange transition leaves the logo white on a marble 404.

## Header Pill Handoff

The desktop header has two pill modes:

- Hero pill - the full header state.
- Compact pill - the centered/scrolled state.

When navigating from a scrolled position:

1. Compact pill is measured.
2. Hero pill is measured.
3. `compactPillHandoffDelta` moves the compact pill to where the hero pill will land.
4. The hero pill is invisible during its own slide-in.
5. The compact pill remains visible until the hero pill is in place.
6. The compact pill is suppressed/unmounted so it cannot visibly animate back left/up after pathname changes.

The important invariant: once the handoff delta is set, the compact pill stays visually locked until the suppression timer removes it.

## Adding a New `(site)` Page

When adding a page, decide two colours:

1. Transition/chrome colour:
   - Add to `SITE_ROUTE_THEME` in `lib/site-route-theme.ts`.
2. Revealed page surface:
   - Add to `SITE_PAGE_REVEAL_SURFACES` in `lib/site-page-reveal-surface.ts`.
   - Add `sectionClassName="bg-bom-..."` or a real hero background in page content.
   - Use `includeChildren: true` only for real nested pages that should inherit this surface.

If the page is a placeholder, use:

```tsx
<SitePlaceholderContent
  sectionClassName="bg-bom-orange"
  pageSurfaceHex="#ff7040"
  ...
/>
```

Use `pageSurfaceHex` when URL inference is not reliable, especially for shared catch-all UI like 404s.

## Current Route Summary

| Route | Wipe / Chrome | Revealed Surface | Logo After Reveal |
| --- | --- | --- | --- |
| `/home` | dark blue | ice | white |
| `/menu` | berry | musk | white |
| `/locations` | lemon | lemon | black |
| `/specials` | chocolate | orange | white |
| `/story` | lime | marble | black |
| `/about` | violet | violet | white |
| 404 / unmatched | lime | marble | black |

## Why This Design Exists

The goal is to keep transitions graphic and intentional without letting URL structure leak into visual state.

The route palette says "what colour should the wipe/chrome use to enter this route?"

The page surface says "what colour did the user actually land on?"

The header/logo system needs the second answer for idle state, but the first answer during the wipe. The seam sampler bridges that moment by looking at the real pixels under the logo while the overlay is moving.
