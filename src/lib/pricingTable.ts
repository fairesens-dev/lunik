/**
 * Grille tarifaire 2026 – Store LUNIK
 * Prix TTC, motorisation SOMFY incluse par défaut.
 * Largeurs en mm, avancées en mm.
 */

export interface WidthRange {
  min: number; // mm inclusive
  max: number; // mm inclusive
  label: string;
}

export const WIDTH_RANGES: WidthRange[] = [
  { min: 1900, max: 2399, label: "190 – 239 cm" },
  { min: 2400, max: 2899, label: "240 – 289 cm" },
  { min: 2900, max: 3399, label: "290 – 339 cm" },
  { min: 3400, max: 3600, label: "340 – 360 cm" },
  { min: 3601, max: 3899, label: "361 – 389 cm" },
  { min: 3900, max: 4399, label: "390 – 439 cm" },
  { min: 4400, max: 4800, label: "440 – 480 cm" },
  { min: 4801, max: 5920, label: "481 – 592 cm" },
];

export const PROJECTIONS = [1500, 2000, 2500, 3000, 3500] as const;
export type Projection = (typeof PROJECTIONS)[number];

// Grid: widthRangeIndex → projection → price TTC (€)
// null = combination not available
const PRICE_GRID: (number | null)[][] = [
  /* 1900-2399 */ [2849, null, null, null, null],
  /* 2400-2899 */ [3159, 3239, null, null, null],
  /* 2900-3399 */ [3159, 3239, 3359, null, null],
  /* 3400-3600 */ [3159, 3239, 3359, 3499, null],
  /* 3601-3899 */ [3569, 3669, 3809, 3969, null],
  /* 3900-4399 */ [3569, 3669, 3809, 3969, 4089],
  /* 4400-4800 */ [3569, 3669, 3809, 3969, 4089],
  /* 4801-5920 */ [3789, 3919, 4079, 4269, null],
];

/** Options disponibles (prix TTC) */
export interface PricingOption {
  id: string;
  label: string;
  description: string;
  price: number; // positif = supplément, négatif = réduction
  icon: string;
  highlight?: boolean;
  badge?: string;
  tip?: string;
}

export const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "led-coffre",
    label: "Éclairage LED sous coffre SOMFY",
    description: "Éclairage d'ambiance intégré sous le coffre du store",
    price: 859,
    icon: "💡",
    tip: "💬 \"L'éclairage LED a transformé nos soirées d'été !\" — Marie, Lyon",
  },
  {
    id: "led-bras",
    label: "Éclairage LED sous les bras SOMFY",
    description: "Éclairage puissant sous les bras pour un rendu maximal",
    price: 959,
    icon: "💡",
    tip: "🔥 L'option la plus spectaculaire pour vos soirées",
  },
  {
    id: "capteur-vent",
    label: "Automatisme Vent SOMFY 3D IO",
    description: "Capteur vent intégré pour rétraction automatique",
    price: 199,
    icon: "🌬️",
    tip: "💡 Protège votre store automatiquement en cas de vent",
  },
  {
    id: "pose-plafond",
    label: "Pose plafond avec équerre",
    description: "Kit de fixation pour montage au plafond",
    price: 289,
    icon: "🔧",
  },
  {
    id: "manoeuvre-manuelle",
    label: "Manœuvre manuelle treuil + manivelle",
    description: "Remplace la motorisation SOMFY incluse (−619 €)",
    price: -619,
    icon: "✋",
    badge: "ÉCONOMIE",
    tip: "⚠️ Retire la motorisation SOMFY incluse de série",
  },
  {
    id: "radio-csi",
    label: "Manœuvre SOMFY RADIO CSI",
    description: "Commande radio SOMFY CSI pour pilotage avancé",
    price: 199,
    icon: "📡",
  },
];

/* ─── Helpers ─────────────────────────────────── */

function getWidthRangeIndex(widthMm: number): number {
  return WIDTH_RANGES.findIndex(r => widthMm >= r.min && widthMm <= r.max);
}

function getProjectionIndex(projectionMm: number): number {
  return PROJECTIONS.indexOf(projectionMm as Projection);
}

/** Look up the base TTC price for a given width (mm) and projection (mm). Returns null if invalid. */
export function lookupPrice(widthMm: number, projectionMm: number): number | null {
  const wi = getWidthRangeIndex(widthMm);
  if (wi === -1) return null;
  const pi = getProjectionIndex(projectionMm);
  if (pi === -1) return null;
  return PRICE_GRID[wi][pi];
}

/** Get valid projection values (mm) for a given width (mm). */
export function getValidProjections(widthMm: number): number[] {
  const wi = getWidthRangeIndex(widthMm);
  if (wi === -1) return [];
  return PROJECTIONS.filter((_, pi) => PRICE_GRID[wi][pi] !== null);
}

/** Check if a width (mm) is within any valid range. */
export function isValidWidth(widthMm: number): boolean {
  return getWidthRangeIndex(widthMm) !== -1;
}

/** Get the width range label for a given width in mm */
export function getWidthRangeLabel(widthMm: number): string | null {
  const r = WIDTH_RANGES.find(r => widthMm >= r.min && widthMm <= r.max);
  return r?.label ?? null;
}

/** Min / max width in cm */
export const MIN_WIDTH_CM = Math.floor(WIDTH_RANGES[0].min / 10);
export const MAX_WIDTH_CM = Math.floor(WIDTH_RANGES[WIDTH_RANGES.length - 1].max / 10);
