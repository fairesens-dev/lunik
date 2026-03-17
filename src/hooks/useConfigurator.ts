import { useState, useMemo, useEffect } from "react";
import { useConfiguratorSettings } from "@/contexts/ConfiguratorSettingsContext";
import {
  lookupPrice,
  getValidProjections,
  isValidWidth,
  getWidthRangeLabel,
  PRICING_OPTIONS as FALLBACK_PRICING_OPTIONS,
  MIN_WIDTH_CM,
  MAX_WIDTH_CM,
  type PricingOption,
} from "@/lib/pricingTable";

export function useConfigurator() {
  const { settings } = useConfiguratorSettings();

  const activeToileColors = useMemo(() => settings.toileColors.filter(c => c.active), [settings.toileColors]);
  const activeArmatureColors = useMemo(() => settings.armatureColors.filter(c => c.active), [settings.armatureColors]);

  const TOILE_COLORS_COMPAT = useMemo(() => activeToileColors.map(c => ({ name: c.label, hex: c.hex, type: c.type, colors: c.colors, photoUrl: c.photoUrl, refCode: c.refCode })), [activeToileColors]);
  const ARMATURE_COLORS_COMPAT = useMemo(() => activeArmatureColors.map(c => ({ name: c.label, hex: c.hex, type: c.type, colors: c.colors, photoUrl: c.photoUrl })), [activeArmatureColors]);

  // Use admin options if available, otherwise fallback to hardcoded
  const RESOLVED_OPTIONS: PricingOption[] = useMemo(() => {
    if (settings.options && settings.options.length > 0) {
      return settings.options
        .filter(o => o.active)
        .map((o, i) => ({
          id: o.id,
          label: o.label,
          description: o.description,
          price: o.price,
          highlight: o.highlight,
          badge: o.savingsLabel || undefined,
          tip: o.tip || undefined,
          socialProof: o.socialProof || undefined,
          imageUrl: o.imageUrl,
          order: i + 1,
          defaultSelected: o.defaultSelected,
          incompatibleWith: o.incompatibleWith,
        }));
    }
    return FALLBACK_PRICING_OPTIONS;
  }, [settings.options]);

  // Dimensions — width in cm, projection in mm
  const [widthCm, setWidthCm] = useState(350);
  const [projectionMm, setProjectionMm] = useState(1500);

  // Colors
  const [toileColor, setToileColor] = useState(activeToileColors[0]?.label || "Blanc Écru");
  const [armatureColor, setArmatureColor] = useState(activeArmatureColors[0]?.label || "Blanc RAL 9016");

  // Options — set of selected option IDs, init with defaultSelected
  const defaultSelectedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const opt of RESOLVED_OPTIONS) {
      if (opt.defaultSelected) ids.add(opt.id);
    }
    return ids;
  }, [RESOLVED_OPTIONS]);

  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(defaultSelectedIds);

  // Sync defaults when RESOLVED_OPTIONS change (e.g. after admin settings load)
  useEffect(() => {
    setSelectedOptions(prev => {
      if (prev.size === 0 && defaultSelectedIds.size > 0) return defaultSelectedIds;
      return prev;
    });
  }, [defaultSelectedIds]);

  const widthMm = widthCm * 10;

  // Valid projections for current width
  const validProjections = useMemo(() => getValidProjections(widthMm), [widthMm]);

  // Auto-adjust projection when width changes and current projection is invalid
  useEffect(() => {
    if (validProjections.length > 0 && !validProjections.includes(projectionMm)) {
      setProjectionMm(validProjections[0]);
    }
  }, [validProjections, projectionMm]);

  const widthRangeLabel = useMemo(() => getWidthRangeLabel(widthMm), [widthMm]);
  const widthValid = useMemo(() => isValidWidth(widthMm), [widthMm]);

  // Base price from grid
  const basePrice = useMemo(() => lookupPrice(widthMm, projectionMm), [widthMm, projectionMm]);

  // Ensure selectedOptions is always a Set
  const safeSelectedOptions = useMemo(
    () => (selectedOptions instanceof Set ? selectedOptions : new Set<string>()),
    [selectedOptions]
  );

  // Options total
  const optionsTotal = useMemo(() => {
    let total = 0;
    for (const opt of RESOLVED_OPTIONS) {
      if (safeSelectedOptions.has(opt.id)) total += opt.price;
    }
    return total;
  }, [safeSelectedOptions, RESOLVED_OPTIONS]);

  // Final price
  const price = useMemo(() => (basePrice ?? 0) + optionsTotal, [basePrice, optionsTotal]);

  const installmentPrice = useMemo(() => Math.round(price / (settings.pricing.installmentDivisor || 3)), [price, settings.pricing.installmentDivisor]);

  // Toggle an option with incompatibility logic
  const toggleOption = (id: string) => {
    setSelectedOptions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Remove incompatible options (bidirectional)
        const toggled = RESOLVED_OPTIONS.find(o => o.id === id);
        if (toggled?.incompatibleWith) {
          for (const incompId of toggled.incompatibleWith) next.delete(incompId);
        }
        // Also check other options that declare this one as incompatible
        for (const opt of RESOLVED_OPTIONS) {
          if (opt.id !== id && opt.incompatibleWith?.includes(id) && next.has(opt.id)) {
            next.delete(opt.id);
          }
        }
      }
      return next;
    });
  };

  // Build incompatibility map for UI hints
  const getIncompatibleReason = useMemo(() => {
    return (optId: string): string | null => {
      for (const sel of Array.from(safeSelectedOptions)) {
        const selOpt = RESOLVED_OPTIONS.find(o => o.id === sel);
        if (selOpt?.incompatibleWith?.includes(optId)) return selOpt.label;
      }
      const opt = RESOLVED_OPTIONS.find(o => o.id === optId);
      if (opt?.incompatibleWith) {
        for (const incompId of opt.incompatibleWith) {
          if (safeSelectedOptions.has(incompId)) {
            return RESOLVED_OPTIONS.find(o => o.id === incompId)?.label || null;
          }
        }
      }
      return null;
    };
  }, [safeSelectedOptions, RESOLVED_OPTIONS]);

  // Surface area for display
  const surfaceArea = useMemo(() => parseFloat(((widthCm / 100) * (projectionMm / 1000)).toFixed(2)), [widthCm, projectionMm]);

  // Options summary string
  const optionsSummary = useMemo(() => {
    const parts = RESOLVED_OPTIONS.filter(o => safeSelectedOptions.has(o.id)).map(o => o.label);
    return parts.join(" + ") || "Aucune";
  }, [safeSelectedOptions, RESOLVED_OPTIONS]);

  // Compat: motorisation/led/pack booleans for DynamicProductVisual
  const motorisation = safeSelectedOptions.has("motorisation-somfy");
  const led = safeSelectedOptions.has("led-coffre") || safeSelectedOptions.has("led-bras");
  const pack = false;

  return {
    // Dimensions
    width: widthCm,
    setWidth: setWidthCm,
    widthMm,
    widthValid,
    widthRangeLabel,
    projection: projectionMm,
    setProjection: setProjectionMm,
    validProjections,
    // Colors
    toileColor, setToileColor,
    armatureColor, setArmatureColor,
    // Options
    selectedOptions: safeSelectedOptions,
    toggleOption,
    // Compat flags for visual
    motorisation, led, pack,
    getIncompatibleReason,
    handleMotorisationToggle: () => {},
    handleLedToggle: () => {},
    handlePackToggle: () => {},
    // Pricing
    basePrice,
    price,
    installmentPrice,
    optionsTotal,
    surfaceArea,
    optionsSummary,
    // Data
    TOILE_COLORS: TOILE_COLORS_COMPAT,
    ARMATURE_COLORS: ARMATURE_COLORS_COMPAT,
    PRICING_OPTIONS: RESOLVED_OPTIONS,
    settings,
  };
}

// Re-export static defaults for backward compat
import { DEFAULT_SETTINGS } from "@/contexts/ConfiguratorSettingsContext";
export { DEFAULT_SETTINGS };
export const TOILE_COLORS = DEFAULT_SETTINGS.toileColors.map(c => ({ name: c.label, hex: c.hex }));
export const ARMATURE_COLORS = DEFAULT_SETTINGS.armatureColors.map(c => ({ name: c.label, hex: c.hex }));
