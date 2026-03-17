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

const DEFAULT_WIDTH_RANGES: WidthRange[] = [
  { min: 1900, max: 2399, label: "190 – 239 cm" },
  { min: 2400, max: 2899, label: "240 – 289 cm" },
  { min: 2900, max: 3399, label: "290 – 339 cm" },
  { min: 3400, max: 3600, label: "340 – 360 cm" },
  { min: 3601, max: 3899, label: "361 – 389 cm" },
  { min: 3900, max: 4399, label: "390 – 439 cm" },
  { min: 4400, max: 4800, label: "440 – 480 cm" },
  { min: 4801, max: 5920, label: "481 – 592 cm" },
];

const DEFAULT_PROJECTIONS: number[] = [1500, 2000, 2500, 3000, 3500];

let WIDTH_RANGES: WidthRange[] = DEFAULT_WIDTH_RANGES.map(r => ({ ...r }));
let PROJECTIONS: number[] = [...DEFAULT_PROJECTIONS];

export { WIDTH_RANGES, PROJECTIONS };

export function setWidthRanges(ranges: WidthRange[]) {
  WIDTH_RANGES.length = 0;
  ranges.forEach(r => WIDTH_RANGES.push({ ...r }));
}

export function setProjections(projections: number[]) {
  PROJECTIONS.length = 0;
  projections.forEach(p => PROJECTIONS.push(p));
}

export function getDefaultWidthRanges(): WidthRange[] {
  return DEFAULT_WIDTH_RANGES.map(r => ({ ...r }));
}

export function getDefaultProjections(): number[] {
  return [...DEFAULT_PROJECTIONS];
}

// Grid: widthRangeIndex → projection → price TTC (€)
// null = combination not available
const DEFAULT_PRICE_GRID: (number | null)[][] = [
  /* 1900-2399 */ [2849, null, null, null, null],
  /* 2400-2899 */ [3159, 3239, null, null, null],
  /* 2900-3399 */ [3159, 3239, 3359, null, null],
  /* 3400-3600 */ [3159, 3239, 3359, 3499, null],
  /* 3601-3899 */ [3569, 3669, 3809, 3969, null],
  /* 3900-4399 */ [3569, 3669, 3809, 3969, 4089],
  /* 4400-4800 */ [3569, 3669, 3809, 3969, 4089],
  /* 4801-5920 */ [3789, 3919, 4079, 4269, null],
];

let PRICE_GRID: (number | null)[][] = DEFAULT_PRICE_GRID.map(r => [...r]);

/** Override the price grid at runtime (called from ConfiguratorSettingsContext). */
export function setPriceGrid(grid: (number | null)[][]) {
  PRICE_GRID = grid;
}

/** Get the current price grid (for admin display). */
export function getPriceGrid(): (number | null)[][] {
  return PRICE_GRID;
}

/** Get the default (hardcoded) price grid. */
export function getDefaultPriceGrid(): (number | null)[][] {
  return DEFAULT_PRICE_GRID.map(r => [...r]);
}

/** Options disponibles (prix TTC) */
export interface PricingOption {
  id: string;
  label: string;
  description: string;
  price: number; // positif = supplément, négatif = réduction
  highlight?: boolean;
  badge?: string;
  tip?: string;
  socialProof?: string;
  imageUrl?: string;
  order: number; // display order (lower = first)
  defaultSelected?: boolean;
  incompatibleWith?: string[];
}

export const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "motorisation-somfy",
    label: "Motorisation SOMFY io",
    description: "Motorisation radio SOMFY io incluse de série : télécommande, smartphone et assistants vocaux",
    price: 0,
    highlight: true,
    badge: "INCLUS",
    defaultSelected: true,
    incompatibleWith: ["manoeuvre-manuelle"],
    order: 0,
  },
  {
    id: "led-coffre",
    label: "Éclairage LED sous coffre SOMFY",
    description: "Éclairage d'ambiance intégré sous le coffre du store, pilotable depuis votre télécommande",
    price: 859,
    highlight: true,
    badge: "POPULAIRE",
    tip: "« L'éclairage LED a transformé nos soirées d'été, on ne s'en passe plus. » — Marie, Lyon",
    socialProof: "78% des clients choisissent cette option",
    order: 1,
  },
  {
    id: "led-bras",
    label: "Éclairage LED sous les bras SOMFY",
    description: "Éclairage puissant sous les bras pour un rendu spectaculaire et une luminosité optimale",
    price: 959,
    badge: "COUP DE CŒUR",
    tip: "« L'effet est bluffant, tous nos invités nous demandent la référence. » — Thomas, Bordeaux",
    socialProof: "Option la mieux notée par nos clients",
    order: 2,
  },
  {
    id: "capteur-vent",
    label: "Automatisme Vent SOMFY 3D IO",
    description: "Capteur vent intégré : votre store se rétracte automatiquement pour se protéger",
    price: 199,
    highlight: true,
    badge: "RECOMMANDÉ",
    tip: "« Indispensable si vous n'êtes pas toujours à la maison, ça m'a sauvé le store. » — Pascal, Nantes",
    socialProof: "Recommandé par 9 installateurs sur 10",
    order: 3,
  },
  {
    id: "pose-plafond",
    label: "Pose plafond avec équerre",
    description: "Kit de fixation complet pour montage au plafond (sous-face, pergola, avancée de toit)",
    price: 289,
    tip: "Idéal si vous ne disposez pas de façade porteuse pour la fixation murale",
    order: 4,
  },
  {
    id: "radio-csi",
    label: "Manœuvre SOMFY RADIO CSI",
    description: "Commande radio SOMFY CSI pour pilotage avancé et intégration domotique",
    price: 199,
    order: 5,
  },
  {
    id: "manoeuvre-manuelle",
    label: "Manœuvre manuelle treuil + manivelle",
    description: "Remplace la motorisation SOMFY incluse de série (réduction de 619 €)",
    price: -619,
    tip: "Attention : retire la motorisation SOMFY incluse de série. Recommandé uniquement pour les petites largeurs.",
    incompatibleWith: ["motorisation-somfy"],
    order: 6,
  },
];

/* ─── Helpers ─────────────────────────────────── */

function getWidthRangeIndex(widthMm: number): number {
  return WIDTH_RANGES.findIndex(r => widthMm >= r.min && widthMm <= r.max);
}

function getProjectionIndex(projectionMm: number): number {
  return PROJECTIONS.indexOf(projectionMm);
}

/** Look up the base TTC price for a given width (mm) and projection (mm). Returns null if invalid. */
export function lookupPrice(widthMm: number, projectionMm: number): number | null {
  const wi = getWidthRangeIndex(widthMm);
  if (wi === -1) return null;
  const pi = getProjectionIndex(projectionMm);
  if (pi === -1) return null;
  return PRICE_GRID[wi]?.[pi] ?? null;
}

/** Get valid projection values (mm) for a given width (mm). */
export function getValidProjections(widthMm: number): number[] {
  const wi = getWidthRangeIndex(widthMm);
  if (wi === -1) return [];
  return PROJECTIONS.filter((_, pi) => PRICE_GRID[wi]?.[pi] !== null);
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

/** Min / max width in cm — computed dynamically */
export function getMinWidthCm(): number {
  return WIDTH_RANGES.length > 0 ? Math.floor(WIDTH_RANGES[0].min / 10) : 190;
}

export function getMaxWidthCm(): number {
  return WIDTH_RANGES.length > 0 ? Math.floor(WIDTH_RANGES[WIDTH_RANGES.length - 1].max / 10) : 592;
}

/** @deprecated Use getMinWidthCm() / getMaxWidthCm() for dynamic values */
export const MIN_WIDTH_CM = Math.floor(DEFAULT_WIDTH_RANGES[0].min / 10);
export const MAX_WIDTH_CM = Math.floor(DEFAULT_WIDTH_RANGES[DEFAULT_WIDTH_RANGES.length - 1].max / 10);
