type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type RgbaColor = RgbColor & {
  a: number;
};

type BomColorToken =
  | "bom-white"
  | "bom-black"
  | "bom-ice"
  | "bom-dark-blue"
  | "bom-violet"
  | "bom-orange"
  | "bom-musk"
  | "bom-berry"
  | "bom-lime"
  | "bom-lemon";

type BackgroundLogoPair = {
  background: BomColorToken;
  logo: BomColorToken;
};

type ResolvedBackgroundLogoPair = {
  background: RgbColor;
  logo: RgbColor;
};

const COLOR_MAP_LOGO: BackgroundLogoPair[] = [
  // White sections -> ice logo.
  { background: "bom-white", logo: "bom-ice" },
  // Ice sections -> white logo.
  { background: "bom-ice", logo: "bom-white" },
  // Dark and saturated sections -> white logo.
  { background: "bom-black", logo: "bom-white" },
  { background: "bom-violet", logo: "bom-white" },
  // Brand pairings (matched to nearest section background).
  { background: "bom-musk", logo: "bom-berry" },
  { background: "bom-dark-blue", logo: "bom-white" },
  { background: "bom-orange", logo: "bom-white" },
  { background: "bom-lemon", logo: "bom-black" },
];

/** Logo map plus Order now overrides (white → dark blue; ice → dark blue; violet → lime; orange pill → dark blue; lemon pill → orange; dark-blue pill → lime). */
const COLOR_MAP_ORDER_NOW: BackgroundLogoPair[] = COLOR_MAP_LOGO.map((pair) => {
  if (pair.background === "bom-white") {
    return { background: "bom-white", logo: "bom-dark-blue" };
  }
  if (pair.background === "bom-ice") {
    return { background: "bom-ice", logo: "bom-dark-blue" };
  }
  if (pair.background === "bom-violet") {
    return { background: "bom-violet", logo: "bom-lime" };
  }
  if (pair.background === "bom-orange") {
    return { background: "bom-orange", logo: "bom-dark-blue" };
  }
  if (pair.background === "bom-lemon") {
    return { background: "bom-lemon", logo: "bom-orange" };
  }
  if (pair.background === "bom-dark-blue") {
    return { background: "bom-dark-blue", logo: "bom-lime" };
  }
  return pair;
});

export type SeamAwareChromeKind = "logo" | "orderNow";

const BOM_COLOR_FALLBACKS: Record<BomColorToken, RgbColor> = {
  "bom-white": { r: 255, g: 255, b: 255 },
  "bom-black": { r: 0, g: 0, b: 0 },
  "bom-ice": { r: 145, g: 196, b: 255 },
  "bom-dark-blue": { r: 38, g: 101, b: 214 },
  "bom-violet": { r: 105, g: 104, b: 222 },
  "bom-orange": { r: 255, g: 112, b: 64 },
  "bom-musk": { r: 247, g: 183, b: 211 },
  "bom-berry": { r: 122, g: 0, b: 0 },
  "bom-lime": { r: 176, g: 217, b: 53 },
  "bom-lemon": { r: 250, g: 209, b: 0 },
};

function parseCssColor(input: string): RgbaColor | null {
  const value = input.trim();
  if (!value) return null;

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      const r = Number.parseInt(hex[0] + hex[0], 16);
      const g = Number.parseInt(hex[1] + hex[1], 16);
      const b = Number.parseInt(hex[2] + hex[2], 16);
      if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
      return { r, g, b, a: 1 };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);
      const a = hex.length === 8
        ? Number.parseInt(hex.slice(6, 8), 16) / 255
        : 1;
      if ([r, g, b, a].some((channel) => Number.isNaN(channel))) return null;
      return { r, g, b, a };
    }
  }

  const match = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (!match) return null;

  const r = Number.parseFloat(match[1]);
  const g = Number.parseFloat(match[2]);
  const b = Number.parseFloat(match[3]);
  const alphaValue = match[4] ? Number.parseFloat(match[4]) : 1;

  if ([r, g, b, alphaValue].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return { r, g, b, a: alphaValue };
}

function colorDistance(a: RgbColor, b: RgbColor): number {
  const r = a.r - b.r;
  const g = a.g - b.g;
  const bDelta = a.b - b.b;
  return Math.sqrt(r * r + g * g + bDelta * bDelta);
}

function getLuminance(color: RgbColor): number {
  return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
}

function resolveBomColor(token: BomColorToken): RgbColor {
  const cssVariableName = `--color-${token}`;
  const cssValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariableName);
  const parsed = parseCssColor(cssValue);
  if (parsed && parsed.a > 0) {
    return { r: parsed.r, g: parsed.g, b: parsed.b };
  }
  return BOM_COLOR_FALLBACKS[token];
}

function resolveColorMap(kind: SeamAwareChromeKind): ResolvedBackgroundLogoPair[] {
  const source =
    kind === "orderNow" ? COLOR_MAP_ORDER_NOW : COLOR_MAP_LOGO;
  return source.map((pair) => ({
    background: resolveBomColor(pair.background),
    logo: resolveBomColor(pair.logo),
  }));
}

function toRgbString(color: RgbColor): string {
  return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
}

function pickDominantColor(colors: RgbColor[]): RgbColor | null {
  if (colors.length === 0) return null;
  const counts = new Map<string, { color: RgbColor; count: number }>();

  for (const color of colors) {
    const key = toRgbString(color);
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { color, count: 1 });
    }
  }

  let dominant: { color: RgbColor; count: number } | null = null;
  for (const entry of counts.values()) {
    if (!dominant || entry.count > dominant.count) {
      dominant = entry;
    }
  }

  return dominant?.color ?? null;
}

/** Narrow horizontal seam position between coarse scan steps (smoother scroll). */
function refineTwoToneSeamRatio(
  seamStep: number,
  yScanSteps: number,
  topKey: string,
  getRowColorAtY: (yRatio: number) => RgbColor | null
): number {
  const denom = Math.max(1, yScanSteps - 1);
  let lo = Math.max(0, (seamStep - 1) / denom);
  let hi = Math.min(1, seamStep / denom);
  if (hi <= lo) return hi;

  for (let i = 0; i < 14; i += 1) {
    const mid = (lo + hi) / 2;
    const row = getRowColorAtY(mid);
    const key = row ? toRgbString(row) : topKey;
    if (key === topKey) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function selectLogoColor(
  background: RgbColor,
  colorMap: ResolvedBackgroundLogoPair[]
): RgbColor {
  let nearest = colorMap[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const pair of colorMap) {
    const distance = colorDistance(background, pair.background);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = pair;
    }
  }

  // If the surface is not near any known mapped section color,
  // fall back to contrast-safe black/white.
  if (nearestDistance > 70) {
    return getLuminance(background) > 0.58
      ? resolveBomColor("bom-black")
      : resolveBomColor("bom-white");
  }

  return nearest.logo;
}

type OverlayCover = {
  rect: DOMRect;
  backgroundColor: RgbColor;
  insetTopPx: number;
  insetRightPx: number;
  insetBottomPx: number;
  insetLeftPx: number;
};

function parseClipPathInsetLength(
  rawValue: string,
  referenceLengthPx: number
): number {
  const trimmed = rawValue.trim();
  if (trimmed.endsWith("%")) {
    const percent = Number.parseFloat(trimmed);
    if (Number.isNaN(percent)) return 0;
    return (percent / 100) * referenceLengthPx;
  }
  if (trimmed.endsWith("px")) {
    const pixels = Number.parseFloat(trimmed);
    return Number.isNaN(pixels) ? 0 : pixels;
  }
  const numeric = Number.parseFloat(trimmed);
  return Number.isNaN(numeric) ? 0 : numeric;
}

function readPageTransitionOverlayCover(): OverlayCover | null {
  if (typeof document === "undefined") return null;
  const overlay = document.querySelector(
    "[data-site-page-transition-overlay]"
  );
  if (!(overlay instanceof HTMLElement)) return null;

  const computedStyle = window.getComputedStyle(overlay);
  if (
    computedStyle.visibility === "hidden" ||
    computedStyle.display === "none" ||
    Number.parseFloat(computedStyle.opacity || "1") === 0
  ) {
    return null;
  }

  const parsedBackground = parseCssColor(computedStyle.backgroundColor);
  if (!parsedBackground || parsedBackground.a === 0) return null;

  const clipPathValue = computedStyle.clipPath || computedStyle.getPropertyValue("clip-path");
  const insetMatch = clipPathValue.match(/inset\(([^)]+)\)/i);
  const rect = overlay.getBoundingClientRect();

  let insetTopPx = 0;
  let insetRightPx = 0;
  let insetBottomPx = 0;
  let insetLeftPx = 0;

  if (insetMatch) {
    const insetSegment = insetMatch[1].split("round")[0].trim();
    const parts = insetSegment.split(/\s+/);
    if (parts.length === 1) {
      insetTopPx = insetBottomPx = parseClipPathInsetLength(parts[0], rect.height);
      insetRightPx = insetLeftPx = parseClipPathInsetLength(parts[0], rect.width);
    } else if (parts.length === 2) {
      insetTopPx = insetBottomPx = parseClipPathInsetLength(parts[0], rect.height);
      insetRightPx = insetLeftPx = parseClipPathInsetLength(parts[1], rect.width);
    } else if (parts.length === 3) {
      insetTopPx = parseClipPathInsetLength(parts[0], rect.height);
      insetRightPx = insetLeftPx = parseClipPathInsetLength(parts[1], rect.width);
      insetBottomPx = parseClipPathInsetLength(parts[2], rect.height);
    } else if (parts.length >= 4) {
      insetTopPx = parseClipPathInsetLength(parts[0], rect.height);
      insetRightPx = parseClipPathInsetLength(parts[1], rect.width);
      insetBottomPx = parseClipPathInsetLength(parts[2], rect.height);
      insetLeftPx = parseClipPathInsetLength(parts[3], rect.width);
    }
  }

  if (
    insetTopPx + insetBottomPx >= rect.height ||
    insetLeftPx + insetRightPx >= rect.width
  ) {
    return null;
  }

  return {
    rect,
    backgroundColor: {
      r: parsedBackground.r,
      g: parsedBackground.g,
      b: parsedBackground.b,
    },
    insetTopPx,
    insetRightPx,
    insetBottomPx,
    insetLeftPx,
  };
}

function isPointCoveredByOverlay(x: number, y: number, overlay: OverlayCover): boolean {
  const visibleTop = overlay.rect.top + overlay.insetTopPx;
  const visibleBottom = overlay.rect.bottom - overlay.insetBottomPx;
  const visibleLeft = overlay.rect.left + overlay.insetLeftPx;
  const visibleRight = overlay.rect.right - overlay.insetRightPx;
  if (visibleTop >= visibleBottom) return false;
  if (visibleLeft >= visibleRight) return false;
  return x >= visibleLeft && x <= visibleRight && y >= visibleTop && y <= visibleBottom;
}

function resolveBackgroundAtPoint(
  x: number,
  y: number,
  excludedRoots: HTMLElement[],
  overlayCover: OverlayCover | null
): RgbColor | null {
  if (overlayCover && isPointCoveredByOverlay(x, y, overlayCover)) {
    return overlayCover.backgroundColor;
  }

  const elements = document.elementsFromPoint(x, y);

  elementLoop: for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue;

    for (const excludedRoot of excludedRoots) {
      if (excludedRoot.contains(element)) {
        continue elementLoop;
      }
    }

    const parsed = parseCssColor(window.getComputedStyle(element).backgroundColor);
    if (!parsed || parsed.a === 0) continue;
    return { r: parsed.r, g: parsed.g, b: parsed.b };
  }

  const bodyBackground = parseCssColor(
    window.getComputedStyle(document.body).backgroundColor
  );
  if (!bodyBackground || bodyBackground.a === 0) return null;
  return { r: bodyBackground.r, g: bodyBackground.g, b: bodyBackground.b };
}

export function getSeamAwareLogoColor(
  logoElement: HTMLElement,
  excludedRoots: HTMLElement[],
  kind: SeamAwareChromeKind = "logo"
): string {
  const resolvedColorMap = resolveColorMap(kind);
  const rect = logoElement.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    const fallbackColor = resolveBomColor("bom-white");
    return `rgb(${fallbackColor.r}, ${fallbackColor.g}, ${fallbackColor.b})`;
  }

  const overlayCover = readPageTransitionOverlayCover();

  const xSamples = 9;
  const getRowColorAtY = (yRatio: number): RgbColor | null => {
    const clampedYRatio = Math.min(1, Math.max(0, yRatio));
    const y = rect.top + clampedYRatio * rect.height;
    const rowSamples: RgbColor[] = [];

    for (let xi = 0; xi < xSamples; xi += 1) {
      const x = rect.left + ((xi + 0.5) / xSamples) * rect.width;

      if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
        continue;
      }

      const background = resolveBackgroundAtPoint(x, y, excludedRoots, overlayCover);
      if (!background) continue;

      const logoColor = selectLogoColor(background, resolvedColorMap);
      rowSamples.push(logoColor);
    }

    return pickDominantColor(rowSamples);
  };

  const topColor = getRowColorAtY(0.1);
  const bottomColor = getRowColorAtY(0.9);

  if (!topColor && !bottomColor) {
    const fallbackColor = resolveBomColor("bom-white");
    return `rgb(${fallbackColor.r}, ${fallbackColor.g}, ${fallbackColor.b})`;
  }

  if (!topColor) return toRgbString(bottomColor!);
  if (!bottomColor) return toRgbString(topColor);

  const topKey = toRgbString(topColor);
  const bottomKey = toRgbString(bottomColor);

  if (topKey === bottomKey) {
    return topKey;
  }

  const yScanSteps = Math.max(
    48,
    Math.min(360, Math.round(rect.height * Math.min(2, window.devicePixelRatio + 0.5)))
  );
  let seamStep = -1;
  let previousKey = toRgbString(getRowColorAtY(0) ?? topColor);

  for (let step = 1; step < yScanSteps; step += 1) {
    const ratio = step / (yScanSteps - 1);
    const rowColor = getRowColorAtY(ratio);
    if (!rowColor) continue;
    const rowKey = toRgbString(rowColor);
    if (rowKey !== previousKey) {
      seamStep = step;
      break;
    }
    previousKey = rowKey;
  }

  if (seamStep < 0) {
    const fallbackColor = resolveBomColor("bom-white");
    return toRgbString(pickDominantColor([topColor, bottomColor]) ?? fallbackColor);
  }

  const seamRatio = refineTwoToneSeamRatio(
    seamStep,
    yScanSteps,
    topKey,
    getRowColorAtY
  );
  const seamPercent = seamRatio * 100;

  // Hairline blend (~0.5–1px) kills stair-stepping where the mask meets a hard gradient stop.
  const featherPx = Math.min(1.1, Math.max(0.45, 0.65 / Math.max(window.devicePixelRatio, 1)));
  const halfFeatherPct = (featherPx / (2 * Math.max(rect.height, 1))) * 100;
  const seamStart = Math.max(0, seamPercent - halfFeatherPct);
  const seamEnd = Math.min(100, seamPercent + halfFeatherPct);

  if (seamEnd - seamStart < 0.04) {
    return `linear-gradient(to bottom, ${topKey} 0%, ${topKey} ${seamPercent}%, ${bottomKey} ${seamPercent}%, ${bottomKey} 100%)`;
  }

  return `linear-gradient(to bottom, ${topKey} 0%, ${topKey} ${seamStart}%, ${bottomKey} ${seamEnd}%, ${bottomKey} 100%)`;
}

/**
 * Picks black or white label color from the average luminance of every `rgb(...)`
 * stop in a solid color or `linear-gradient(...)` fill string.
 */
export function contrastingForegroundForFill(fill: string): string {
  const matches = [...fill.matchAll(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g)];
  if (matches.length === 0) return "#ffffff";
  let sumLuminance = 0;
  for (const match of matches) {
    const r = Number(match[1]);
    const g = Number(match[2]);
    const b = Number(match[3]);
    sumLuminance += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  const average = sumLuminance / matches.length;
  return average > 0.55 ? "#000000" : "#ffffff";
}

/** Order now label: black on orange fills (luminance heuristic alone can pick white). */
export function contrastingForegroundForOrderNowFill(fill: string): string {
  const orangeRef = BOM_COLOR_FALLBACKS["bom-orange"];
  for (const match of fill.matchAll(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g)) {
    const sample: RgbColor = {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
    };
    if (colorDistance(sample, orangeRef) < 52) {
      return "#000000";
    }
  }
  return contrastingForegroundForFill(fill);
}
