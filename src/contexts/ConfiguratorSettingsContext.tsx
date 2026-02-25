import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

/* ─── Types ──────────────────────────────────────────── */

export interface PricingSettings {
  baseRate: number;
  minPrice: number;
  installmentDivisor: number;
}

export interface DimensionRange {
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface DimensionsSettings {
  width: DimensionRange;
  projection: DimensionRange;
}

export interface ColorEntry {
  id: string;
  hex: string;
  label: string;
  active: boolean;
}

export interface OptionEntry {
  id: string;
  icon: string;
  label: string;
  description: string;
  price: number;
  active: boolean;
  highlight: boolean;
  savingsLabel?: string;
  includesIds?: string[];
}

export interface ConfiguratorSettings {
  pricing: PricingSettings;
  dimensions: DimensionsSettings;
  toileColors: ColorEntry[];
  armatureColors: ColorEntry[];
  options: OptionEntry[];
}

/* ─── Defaults ───────────────────────────────────────── */

export const DEFAULT_SETTINGS: ConfiguratorSettings = {
  pricing: { baseRate: 580, minPrice: 1890, installmentDivisor: 3 },
  dimensions: {
    width: { min: 150, max: 600, step: 1, unit: "cm" },
    projection: { min: 100, max: 400, step: 1, unit: "cm" },
  },
  toileColors: [
    { id: "blanc-ecru", hex: "#F5F0E8", label: "Blanc Écru", active: true },
    { id: "sable", hex: "#E8DCC8", label: "Sable", active: true },
    { id: "chanvre", hex: "#C8B89A", label: "Chanvre", active: true },
    { id: "havane", hex: "#8B7355", label: "Havane", active: true },
    { id: "moka", hex: "#5C4A32", label: "Moka", active: true },
    { id: "sauge", hex: "#4A5E3A", label: "Sauge", active: true },
    { id: "eucalyptus", hex: "#6B8C6B", label: "Eucalyptus", active: true },
    { id: "bleu-ardoise", hex: "#4A6B8A", label: "Bleu Ardoise", active: true },
    { id: "terracotta", hex: "#8A4A4A", label: "Terracotta", active: true },
    { id: "gris-clair", hex: "#C8C8C8", label: "Gris Clair", active: true },
    { id: "gris-anthracite", hex: "#5A5A5A", label: "Gris Anthracite", active: true },
    { id: "noir", hex: "#1A1A1A", label: "Noir", active: true },
  ],
  armatureColors: [
    { id: "blanc", hex: "#F0EDE8", label: "Blanc RAL 9016", active: true },
    { id: "anthracite", hex: "#5A5A5A", label: "Gris Anthracite RAL 7016", active: true },
    { id: "noir", hex: "#1A1A1A", label: "Noir RAL 9005", active: true },
    { id: "sable", hex: "#C8B48A", label: "Sable RAL 1015", active: true },
  ],
  options: [
    { id: "motorisation", icon: "⚡", label: "Motorisation Somfy io", description: "Télécommande + app smartphone TaHoma incluses.", price: 390, active: true, highlight: false },
    { id: "led", icon: "💡", label: "Éclairage LED sous store", description: "Bandeau LED intégré, lumière 3000K, télécommandé.", price: 290, active: true, highlight: false },
    { id: "pack-connect", icon: "📱", label: "Pack Connect", description: "Motorisation + LED + TaHoma. Tout dans un pack.", price: 590, active: true, highlight: true, savingsLabel: "ÉCONOMISEZ 90 €", includesIds: ["motorisation", "led"] },
  ],
};

const STORAGE_KEY = "configurator_settings";

/* ─── Context ────────────────────────────────────────── */

interface ConfiguratorSettingsContextType {
  settings: ConfiguratorSettings;
  updatePricing: (p: PricingSettings) => void;
  updateDimensions: (d: DimensionsSettings) => void;
  updateToileColor: (id: string, data: Partial<Omit<ColorEntry, "id">>) => void;
  addToileColor: (c: ColorEntry) => void;
  removeToileColor: (id: string) => void;
  reorderToileColors: (colors: ColorEntry[]) => void;
  updateArmatureColor: (id: string, data: Partial<Omit<ColorEntry, "id">>) => void;
  addArmatureColor: (c: ColorEntry) => void;
  removeArmatureColor: (id: string) => void;
  reorderArmatureColors: (colors: ColorEntry[]) => void;
  updateOption: (id: string, data: Partial<Omit<OptionEntry, "id">>) => void;
  addOption: (o: OptionEntry) => void;
  removeOption: (id: string) => void;
  resetToDefaults: () => void;
}

const ConfiguratorSettingsContext = createContext<ConfiguratorSettingsContextType | null>(null);

function loadSettings(): ConfiguratorSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function persist(s: ConfiguratorSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export const ConfiguratorSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ConfiguratorSettings>(loadSettings);

  useEffect(() => { persist(settings); }, [settings]);

  const updatePricing = useCallback((p: PricingSettings) => setSettings(s => ({ ...s, pricing: p })), []);
  const updateDimensions = useCallback((d: DimensionsSettings) => setSettings(s => ({ ...s, dimensions: d })), []);

  const updateToileColor = useCallback((id: string, data: Partial<Omit<ColorEntry, "id">>) =>
    setSettings(s => ({ ...s, toileColors: s.toileColors.map(c => c.id === id ? { ...c, ...data } : c) })), []);
  const addToileColor = useCallback((c: ColorEntry) => setSettings(s => ({ ...s, toileColors: [...s.toileColors, c] })), []);
  const removeToileColor = useCallback((id: string) => setSettings(s => ({ ...s, toileColors: s.toileColors.filter(c => c.id !== id) })), []);
  const reorderToileColors = useCallback((colors: ColorEntry[]) => setSettings(s => ({ ...s, toileColors: colors })), []);

  const updateArmatureColor = useCallback((id: string, data: Partial<Omit<ColorEntry, "id">>) =>
    setSettings(s => ({ ...s, armatureColors: s.armatureColors.map(c => c.id === id ? { ...c, ...data } : c) })), []);
  const addArmatureColor = useCallback((c: ColorEntry) => setSettings(s => ({ ...s, armatureColors: [...s.armatureColors, c] })), []);
  const removeArmatureColor = useCallback((id: string) => setSettings(s => ({ ...s, armatureColors: s.armatureColors.filter(c => c.id !== id) })), []);
  const reorderArmatureColors = useCallback((colors: ColorEntry[]) => setSettings(s => ({ ...s, armatureColors: colors })), []);

  const updateOption = useCallback((id: string, data: Partial<Omit<OptionEntry, "id">>) =>
    setSettings(s => ({ ...s, options: s.options.map(o => o.id === id ? { ...o, ...data } : o) })), []);
  const addOption = useCallback((o: OptionEntry) => setSettings(s => ({ ...s, options: [...s.options, o] })), []);
  const removeOption = useCallback((id: string) => setSettings(s => ({ ...s, options: s.options.filter(o => o.id !== id) })), []);

  const resetToDefaults = useCallback(() => { setSettings(DEFAULT_SETTINGS); }, []);

  return (
    <ConfiguratorSettingsContext.Provider value={{
      settings, updatePricing, updateDimensions,
      updateToileColor, addToileColor, removeToileColor, reorderToileColors,
      updateArmatureColor, addArmatureColor, removeArmatureColor, reorderArmatureColors,
      updateOption, addOption, removeOption, resetToDefaults,
    }}>
      {children}
    </ConfiguratorSettingsContext.Provider>
  );
};

export function useConfiguratorSettings() {
  const ctx = useContext(ConfiguratorSettingsContext);
  if (!ctx) throw new Error("useConfiguratorSettings must be used within ConfiguratorSettingsProvider");
  return ctx;
}
