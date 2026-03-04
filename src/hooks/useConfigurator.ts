import { useState, useMemo, useEffect } from "react";
import { useConfiguratorSettings } from "@/contexts/ConfiguratorSettingsContext";
import {
  lookupPrice,
  getValidProjections,
  isValidWidth,
  getWidthRangeLabel,
  PRICING_OPTIONS,
  MIN_WIDTH_CM,
  MAX_WIDTH_CM,
} from "@/lib/pricingTable";

export function useConfigurator() {
  const { settings } = useConfiguratorSettings();

  const activeToileColors = useMemo(() => settings.toileColors.filter(c => c.active), [settings.toileColors]);
  const activeArmatureColors = useMemo(() => settings.armatureColors.filter(c => c.active), [settings.armatureColors]);

  const TOILE_COLORS_COMPAT = useMemo(() => activeToileColors.map(c => ({ name: c.label, hex: c.hex, type: c.type, colors: c.colors, photoUrl: c.photoUrl })), [activeToileColors]);
  const ARMATURE_COLORS_COMPAT = useMemo(() => activeArmatureColors.map(c => ({ name: c.label, hex: c.hex, type: c.type, colors: c.colors })), [activeArmatureColors]);

  // Dimensions — width in cm, projection in mm
  const [widthCm, setWidthCm] = useState(350);
  const [projectionMm, setProjectionMm] = useState(1500);

  // Colors
  const [toileColor, setToileColor] = useState(activeToileColors[0]?.label || "Blanc Écru");
  const [armatureColor, setArmatureColor] = useState(activeArmatureColors[0]?.label || "Blanc RAL 9016");

  // Options — set of selected option IDs
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

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

  // Options total
  const optionsTotal = useMemo(() => {
    let total = 0;
    for (const opt of PRICING_OPTIONS) {
      if (selectedOptions.has(opt.id)) total += opt.price;
    }
    return total;
  }, [selectedOptions]);

  // Final price
  const price = useMemo(() => (basePrice ?? 0) + optionsTotal, [basePrice, optionsTotal]);

  const installmentPrice = useMemo(() => Math.round(price / (settings.pricing.installmentDivisor || 3)), [price, settings.pricing.installmentDivisor]);

  // Toggle an option
  const toggleOption = (id: string) => {
    setSelectedOptions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Surface area for display
  const surfaceArea = useMemo(() => parseFloat(((widthCm / 100) * (projectionMm / 1000)).toFixed(2)), [widthCm, projectionMm]);

  // Options summary string
  const optionsSummary = useMemo(() => {
    const parts = PRICING_OPTIONS.filter(o => selectedOptions.has(o.id)).map(o => o.label);
    return parts.join(" + ") || "Aucune";
  }, [selectedOptions]);

  // Compat: motorisation/led/pack booleans for DynamicProductVisual
  const motorisation = !selectedOptions.has("manoeuvre-manuelle");
  const led = selectedOptions.has("led-coffre") || selectedOptions.has("led-bras");
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
    selectedOptions,
    toggleOption,
    // Compat flags for visual
    motorisation, led, pack,
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
    PRICING_OPTIONS,
    settings,
  };
}

// Re-export static defaults for backward compat
import { DEFAULT_SETTINGS } from "@/contexts/ConfiguratorSettingsContext";
export { DEFAULT_SETTINGS };
export const TOILE_COLORS = DEFAULT_SETTINGS.toileColors.map(c => ({ name: c.label, hex: c.hex }));
export const ARMATURE_COLORS = DEFAULT_SETTINGS.armatureColors.map(c => ({ name: c.label, hex: c.hex }));
