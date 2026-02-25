import { useState, useMemo } from "react";
import { useConfiguratorSettings } from "@/contexts/ConfiguratorSettingsContext";

export function useConfigurator() {
  const { settings } = useConfiguratorSettings();
  const { pricing, dimensions } = settings;

  const activeToileColors = useMemo(() => settings.toileColors.filter(c => c.active), [settings.toileColors]);
  const activeArmatureColors = useMemo(() => settings.armatureColors.filter(c => c.active), [settings.armatureColors]);

  // Exported for backward compat
  const TOILE_COLORS_COMPAT = useMemo(() => activeToileColors.map(c => ({ name: c.label, hex: c.hex })), [activeToileColors]);
  const ARMATURE_COLORS_COMPAT = useMemo(() => activeArmatureColors.map(c => ({ name: c.label, hex: c.hex })), [activeArmatureColors]);

  const [width, setWidth] = useState(350);
  const [projection, setProjection] = useState(250);
  const [toileColor, setToileColor] = useState(activeToileColors[0]?.label || "Blanc Écru");
  const [armatureColor, setArmatureColor] = useState(activeArmatureColors[0]?.label || "Blanc RAL 9016");
  const [motorisation, setMotorisation] = useState(false);
  const [led, setLed] = useState(false);
  const [pack, setPack] = useState(false);

  const motorOption = settings.options.find(o => o.id === "motorisation");
  const ledOption = settings.options.find(o => o.id === "led");
  const packOption = settings.options.find(o => o.id === "pack-connect");

  const handlePackToggle = (checked: boolean) => {
    setPack(checked);
    if (checked) { setMotorisation(true); setLed(true); }
  };
  const handleMotorisationToggle = (checked: boolean) => { if (!pack) setMotorisation(checked); };
  const handleLedToggle = (checked: boolean) => { if (!pack) setLed(checked); };

  const surfaceArea = useMemo(() => parseFloat(((width / 100) * (projection / 100)).toFixed(2)), [width, projection]);

  const price = useMemo(() => {
    let p = Math.max(pricing.minPrice, Math.round(surfaceArea * pricing.baseRate));
    if (pack) p += (packOption?.price ?? 590);
    else {
      if (motorisation) p += (motorOption?.price ?? 390);
      if (led) p += (ledOption?.price ?? 290);
    }
    return p;
  }, [surfaceArea, motorisation, led, pack, pricing, motorOption, ledOption, packOption]);

  const installmentPrice = useMemo(() => Math.round(price / (pricing.installmentDivisor || 3)), [price, pricing.installmentDivisor]);

  const optionsSummary = useMemo(() => {
    const parts: string[] = [];
    if (pack) parts.push(packOption?.label || "Pack Connect");
    else {
      if (motorisation) parts.push(motorOption?.label || "Motorisation");
      if (led) parts.push(ledOption?.label || "LED");
    }
    return parts.join(" + ") || "Aucune";
  }, [motorisation, led, pack, motorOption, ledOption, packOption]);

  return {
    width, setWidth, projection, setProjection,
    toileColor, setToileColor, armatureColor, setArmatureColor,
    motorisation, handleMotorisationToggle, led, handleLedToggle, pack, handlePackToggle,
    surfaceArea, price, installmentPrice, optionsSummary,
    TOILE_COLORS: TOILE_COLORS_COMPAT,
    ARMATURE_COLORS: ARMATURE_COLORS_COMPAT,
    settings,
  };
}

// Re-export static defaults for backward compat
import { DEFAULT_SETTINGS } from "@/contexts/ConfiguratorSettingsContext";
export { DEFAULT_SETTINGS };
export const TOILE_COLORS = DEFAULT_SETTINGS.toileColors.map(c => ({ name: c.label, hex: c.hex }));
export const ARMATURE_COLORS = DEFAULT_SETTINGS.armatureColors.map(c => ({ name: c.label, hex: c.hex }));
