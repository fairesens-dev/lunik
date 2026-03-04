/**
 * Extract a human-readable label from a toile-colors bucket filename.
 *
 * Examples:
 *   hi_orc_0001_120_ecru_RVBjpgLR.jpg        → "Écru"
 *   hi_orc_7330_120_charcoal_tweed_RVBjpgLR.jpg → "Charcoal Tweed"
 *   hi_ORC_D532_120_LITTORAL_Argent_sur_laize.jpg → "Littoral Argent"
 *   hi_orc_8553_120_BS_jaune_RVBjpgLR.jpg      → "BS Jaune"
 */

// Tokens to strip (noise from the naming convention)
const NOISE = new Set([
  "hi", "orc", "rvbjpglr", "rvb", "jpg", "lr", "sur", "laize", "120",
]);

export function parseToileColorLabel(filename: string): string {
  // Remove extension
  const base = filename.replace(/\.[^.]+$/, "");

  // Split on underscores
  const parts = base.split("_");

  // Drop first 4 segments (hi_orc_XXXX_120) if they match the pattern
  // Pattern: hi, orc/ORC, code (alphanumeric), 120
  let meaningful = parts;
  if (
    parts.length >= 5 &&
    parts[0].toLowerCase() === "hi" &&
    parts[1].toLowerCase() === "orc" &&
    /^[a-zA-Z0-9]+$/.test(parts[2]) &&
    parts[3] === "120"
  ) {
    meaningful = parts.slice(4);
  }

  // Filter noise tokens and empty strings
  const filtered = meaningful.filter(
    (t) => t.length > 0 && !NOISE.has(t.toLowerCase())
  );

  if (filtered.length === 0) {
    // Fallback: use the code part
    return parts[2] || base;
  }

  // Capitalize each word
  return filtered
    .map((w) => {
      // Keep fully uppercase short tokens (BS, UV...) as-is
      if (w.length <= 3 && w === w.toUpperCase()) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}
