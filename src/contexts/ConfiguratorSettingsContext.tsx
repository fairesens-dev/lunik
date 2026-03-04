import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  photoUrl?: string;
  type?: "solid" | "textured" | "striped";
  colors?: string[];
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
    { id: "c_blanc", hex: "#F8F8F8", label: "Blanc", active: true, type: "solid" },
    { id: "c_vert_sapin", hex: "#1A4B3C", label: "Vert Sapin", active: true, type: "solid" },
    { id: "c_bleu_roi", hex: "#183E7A", label: "Bleu Roi", active: true, type: "solid" },
    { id: "c_orange_vif", hex: "#E55B13", label: "Orange Vif", active: true, type: "solid" },
    { id: "c_rouge_carmin", hex: "#A32020", label: "Rouge Carmin", active: true, type: "solid" },
    { id: "c_terre_cuite", hex: "#C67140", label: "Terre Cuite", active: true, type: "solid" },
    { id: "c_chocolat", hex: "#5C3A21", label: "Chocolat", active: true, type: "solid" },
    { id: "c_sable", hex: "#D2BCA2", label: "Sable", active: true, type: "solid" },
    { id: "c_bordeaux", hex: "#6E1E24", label: "Bordeaux", active: true, type: "solid" },
    { id: "c_noir", hex: "#111111", label: "Noir", active: true, type: "solid" },
    { id: "c_gris_souris", hex: "#8A8A8A", label: "Gris Souris", active: true, type: "solid" },
    { id: "c_taupe", hex: "#8B7D73", label: "Taupe", active: true, type: "solid" },
    { id: "c_bleu_ciel", hex: "#7B9ECE", label: "Bleu Ciel", active: true, type: "solid" },
    { id: "c_vert_olive", hex: "#6B7D3A", label: "Vert Olive", active: true, type: "solid" },
    { id: "c_turquoise", hex: "#4A9BA3", label: "Turquoise", active: true, type: "solid" },
    { id: "c_bleu_marine", hex: "#2A3654", label: "Bleu Marine", active: true, type: "solid" },
    { id: "t_gris_chine", hex: "#A9A9A9", label: "Gris Chiné", active: true, type: "textured" },
    { id: "t_anthracite", hex: "#3D3D3D", label: "Anthracite Texturé", active: true, type: "textured" },
    { id: "t_bleu_jean", hex: "#4C6A8D", label: "Bleu Jean", active: true, type: "textured" },
    { id: "r_jaune_blanc", hex: "#FFC300", label: "Rayé Jaune & Blanc", active: true, type: "striped", colors: ["#FFC300", "#F8F8F8"] },
    { id: "r_vert_blanc", hex: "#2E4F40", label: "Rayé Vert & Blanc", active: true, type: "striped", colors: ["#2E4F40", "#F8F8F8"] },
    { id: "r_bleu_blanc", hex: "#183E7A", label: "Rayé Bleu & Blanc", active: true, type: "striped", colors: ["#183E7A", "#F8F8F8"] },
    { id: "r_rouge_blanc", hex: "#A32020", label: "Rayé Rouge & Blanc", active: true, type: "striped", colors: ["#A32020", "#F8F8F8"] },
    { id: "r_gris_blanc", hex: "#8A8A8A", label: "Rayé Gris & Blanc", active: true, type: "striped", colors: ["#8A8A8A", "#F8F8F8"] },
    { id: "r_taupe_blanc", hex: "#8B7D73", label: "Rayé Taupe & Blanc", active: true, type: "striped", colors: ["#8B7D73", "#F8F8F8"] },
    { id: "r_bleu_gris", hex: "#4C6A8D", label: "Rayé Bleu & Gris", active: true, type: "striped", colors: ["#4C6A8D", "#8A8A8A"] },
    { id: "r_vert_gris", hex: "#5D7A68", label: "Rayé Vert & Gris", active: true, type: "striped", colors: ["#5D7A68", "#A9A9A9"] },
    { id: "r_multicolore_chaud", hex: "#E55B13", label: "Rayé Multicolore Chaud", active: true, type: "striped", colors: ["#E55B13", "#C67140"] },
  ],
  armatureColors: [],
  options: [],
};

/* ─── Supabase helpers ───────────────────────────────── */

async function upsertSetting(id: string, data: unknown) {
  await supabase.from("configurator_settings" as any).upsert({ id, data } as any, { onConflict: "id" });
}

async function persistAll(s: ConfiguratorSettings) {
  const entries = [
    { id: "pricing", data: s.pricing },
    { id: "dimensions", data: s.dimensions },
    { id: "toileColors", data: s.toileColors },
    { id: "armatureColors", data: s.armatureColors },
    { id: "options", data: s.options },
  ];
  for (const e of entries) {
    await upsertSetting(e.id, e.data);
  }
}

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

export const ConfiguratorSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ConfiguratorSettings>(DEFAULT_SETTINGS);

  // Load from Supabase on mount
  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from("configurator_settings" as any).select("id, data") as any;
      if (rows && rows.length > 0) {
        const map: Record<string, any> = {};
        for (const r of rows) map[r.id] = r.data;
        setSettings({
          pricing: map.pricing ?? DEFAULT_SETTINGS.pricing,
          dimensions: map.dimensions ?? DEFAULT_SETTINGS.dimensions,
          toileColors: map.toileColors ?? DEFAULT_SETTINGS.toileColors,
          armatureColors: map.armatureColors ?? DEFAULT_SETTINGS.armatureColors,
          options: map.options ?? DEFAULT_SETTINGS.options,
        });
      }
    })();
  }, []);

  const updatePricing = useCallback((p: PricingSettings) => {
    setSettings(s => { upsertSetting("pricing", p); return { ...s, pricing: p }; });
  }, []);

  const updateDimensions = useCallback((d: DimensionsSettings) => {
    setSettings(s => { upsertSetting("dimensions", d); return { ...s, dimensions: d }; });
  }, []);

  const updateToileColor = useCallback((id: string, data: Partial<Omit<ColorEntry, "id">>) =>
    setSettings(s => {
      const toileColors = s.toileColors.map(c => c.id === id ? { ...c, ...data } : c);
      upsertSetting("toileColors", toileColors);
      return { ...s, toileColors };
    }), []);

  const addToileColor = useCallback((c: ColorEntry) =>
    setSettings(s => {
      const toileColors = [...s.toileColors, c];
      upsertSetting("toileColors", toileColors);
      return { ...s, toileColors };
    }), []);

  const removeToileColor = useCallback((id: string) =>
    setSettings(s => {
      const toileColors = s.toileColors.filter(c => c.id !== id);
      upsertSetting("toileColors", toileColors);
      return { ...s, toileColors };
    }), []);

  const reorderToileColors = useCallback((colors: ColorEntry[]) => {
    setSettings(s => { upsertSetting("toileColors", colors); return { ...s, toileColors: colors }; });
  }, []);

  const updateArmatureColor = useCallback((id: string, data: Partial<Omit<ColorEntry, "id">>) =>
    setSettings(s => {
      const armatureColors = s.armatureColors.map(c => c.id === id ? { ...c, ...data } : c);
      upsertSetting("armatureColors", armatureColors);
      return { ...s, armatureColors };
    }), []);

  const addArmatureColor = useCallback((c: ColorEntry) =>
    setSettings(s => {
      const armatureColors = [...s.armatureColors, c];
      upsertSetting("armatureColors", armatureColors);
      return { ...s, armatureColors };
    }), []);

  const removeArmatureColor = useCallback((id: string) =>
    setSettings(s => {
      const armatureColors = s.armatureColors.filter(c => c.id !== id);
      upsertSetting("armatureColors", armatureColors);
      return { ...s, armatureColors };
    }), []);

  const reorderArmatureColors = useCallback((colors: ColorEntry[]) => {
    setSettings(s => { upsertSetting("armatureColors", colors); return { ...s, armatureColors: colors }; });
  }, []);

  const updateOption = useCallback((id: string, data: Partial<Omit<OptionEntry, "id">>) =>
    setSettings(s => {
      const options = s.options.map(o => o.id === id ? { ...o, ...data } : o);
      upsertSetting("options", options);
      return { ...s, options };
    }), []);

  const addOption = useCallback((o: OptionEntry) =>
    setSettings(s => {
      const options = [...s.options, o];
      upsertSetting("options", options);
      return { ...s, options };
    }), []);

  const removeOption = useCallback((id: string) =>
    setSettings(s => {
      const options = s.options.filter(o => o.id !== id);
      upsertSetting("options", options);
      return { ...s, options };
    }), []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    persistAll(DEFAULT_SETTINGS);
  }, []);

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
