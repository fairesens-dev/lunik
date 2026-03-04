/**
 * Classify toile colors into categories and sort by hue.
 */

export type ToileCategory = "unis" | "rayes" | "motifs";

const RAYES_KEYWORDS = [
  "bs ", "bs_", "bloc", "rayé", "rayure", "stripe", "striped",
];

const MOTIFS_KEYWORDS = [
  "tweed", "chiné", "chine", "piqué", "pique", "fantaisie",
  "jacquard", "manosque", "littoral", "fleur", "flower",
  "damier", "losange", "vichy", "tartan", "provenc",
  "arabesque", "baroque", "botanic", "tropical",
];

/**
 * Classify a single toile color by its label and optional type field.
 */
export function classifyToileColor(
  label: string,
  type?: string,
): ToileCategory {
  const lower = label.toLowerCase();

  // Explicit type from settings takes precedence
  if (type === "striped") return "rayes";
  if (type === "patterned" || type === "textured") return "motifs";

  // Keyword matching
  if (RAYES_KEYWORDS.some((kw) => lower.includes(kw))) return "rayes";
  if (MOTIFS_KEYWORDS.some((kw) => lower.includes(kw))) return "motifs";

  return "unis";
}

// ── Hue sorting ──

const HUE_ORDER: { keywords: string[]; order: number }[] = [
  { keywords: ["blanc", "white", "écru", "ecru", "ivoire", "ivory", "crème", "creme", "cream"], order: 0 },
  { keywords: ["jaune", "yellow", "citron", "soleil", "sun", "moutarde", "mustard", "or ", "gold", "doré"], order: 1 },
  { keywords: ["orange", "abricot", "apricot", "corail", "coral", "saumon", "salmon", "mandarine", "peach", "pêche"], order: 2 },
  { keywords: ["rouge", "red", "cerise", "cherry", "bordeaux", "burgundy", "carmin", "vermillon", "grenat", "rubis"], order: 3 },
  { keywords: ["rose", "pink", "fuchsia", "magenta", "framboise"], order: 4 },
  { keywords: ["violet", "purple", "mauve", "lilas", "lavande", "prune", "aubergine"], order: 5 },
  { keywords: ["bleu", "blue", "azur", "marine", "navy", "turquoise", "cyan", "indigo", "cobalt", "océan", "ocean", "ciel", "denim"], order: 6 },
  { keywords: ["vert", "green", "olive", "emeraude", "émeraude", "kaki", "khaki", "sauge", "sage", "menthe", "mint", "anis"], order: 7 },
  { keywords: ["marron", "brown", "chocolat", "caramel", "noisette", "café", "cafe", "cognac", "tabac", "terre", "sienne", "cannelle", "brun"], order: 8 },
  { keywords: ["beige", "sable", "sand", "taupe", "lin", "linen", "naturel", "natural", "chanvre", "hemp", "ficelle"], order: 9 },
  { keywords: ["gris", "grey", "gray", "anthracite", "ardoise", "slate", "acier", "steel", "argent", "silver", "plomb", "zinc", "perle", "pearl", "souris", "charcoal", "cendre"], order: 10 },
  { keywords: ["noir", "black", "ébène", "ebene"], order: 11 },
];

export function getHueOrder(label: string): number {
  const lower = label.toLowerCase();
  for (const { keywords, order } of HUE_ORDER) {
    if (keywords.some((kw) => lower.includes(kw))) return order;
  }
  return 99; // unknown → end
}

export const CATEGORY_LABELS: Record<ToileCategory, string> = {
  unis: "Unis",
  rayes: "Rayés",
  motifs: "Motifs & Texturés",
};

export const CATEGORY_ORDER: ToileCategory[] = ["unis", "rayes", "motifs"];

export interface CategorizedColor<T> {
  category: ToileCategory;
  colors: T[];
}

/**
 * Group and sort an array of toile colors.
 */
export function categorizeAndSortColors<T extends { name: string; type?: string }>(
  colors: T[],
): CategorizedColor<T>[] {
  const groups: Record<ToileCategory, T[]> = { unis: [], rayes: [], motifs: [] };

  for (const c of colors) {
    const cat = classifyToileColor(c.name, c.type);
    groups[cat].push(c);
  }

  // Sort each group by hue
  for (const cat of CATEGORY_ORDER) {
    groups[cat].sort((a, b) => getHueOrder(a.name) - getHueOrder(b.name));
  }

  return CATEGORY_ORDER
    .filter((cat) => groups[cat].length > 0)
    .map((cat) => ({ category: cat, colors: groups[cat] }));
}
