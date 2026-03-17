/* Configurator Settings Context — v3 */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseToileColorLabel, parseToileRefCode } from "@/lib/parseToileColorLabel";
import { setPriceGrid, getDefaultPriceGrid, setWidthRanges, setProjections, getDefaultWidthRanges, getDefaultProjections, type WidthRange } from "@/lib/pricingTable";

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
  refCode?: string;
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
  incompatibleWith?: string[];
  defaultSelected?: boolean;
  imageUrl?: string;
  tip?: string;
  socialProof?: string;
}

export interface ConfiguratorSettings {
  pricing: PricingSettings;
  dimensions: DimensionsSettings;
  toileColors: ColorEntry[];
  armatureColors: ColorEntry[];
  options: OptionEntry[];
  priceGrid: (number | null)[][];
  widthRanges: WidthRange[];
  projections: number[];
}

/* ─── Defaults ───────────────────────────────────────── */

export const DEFAULT_SETTINGS: ConfiguratorSettings = {
  pricing: { baseRate: 580, minPrice: 1890, installmentDivisor: 3 },
  dimensions: {
    width: { min: 150, max: 600, step: 1, unit: "cm" },
    projection: { min: 100, max: 400, step: 1, unit: "cm" },
  },
  toileColors: [],
  armatureColors: [],
  options: [],
  priceGrid: getDefaultPriceGrid(),
  widthRanges: getDefaultWidthRanges(),
  projections: getDefaultProjections(),
};

/* ─── Supabase helpers ───────────────────────────────── */

async function upsertSetting(id: string, data: unknown) {
  await supabase.from("configurator_settings" as any).upsert({ id, data } as any, { onConflict: "id" });
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
  updatePriceGrid: (grid: (number | null)[][]) => void;
  updateWidthRanges: (ranges: WidthRange[]) => void;
  updateProjections: (projections: number[]) => void;
  resetToDefaults: () => void;
}

const ConfiguratorSettingsContext = createContext<ConfiguratorSettingsContextType | null>(null);

export const ConfiguratorSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ConfiguratorSettings>(DEFAULT_SETTINGS);

  // Load from Supabase on mount + load toile colors from bucket
  useEffect(() => {
    (async () => {
      // 1. Load admin settings from DB
      const { data: rows } = await supabase.from("configurator_settings" as any).select("id, data") as any;
      const map: Record<string, any> = {};
      if (rows) for (const r of rows) map[r.id] = r.data;

      // 2. Load ALL toile colors from the storage bucket (paginate)
      let allFiles: { name: string }[] = [];
      const PAGE_SIZE = 100;
      let offset = 0;
      let hasMore = true;
      while (hasMore) {
        const { data: files } = await supabase.storage.from("toile-colors").list("", {
          limit: PAGE_SIZE,
          offset,
          sortBy: { column: "name", order: "asc" },
        });
        if (files && files.length > 0) {
          allFiles = allFiles.concat(files);
          offset += files.length;
          hasMore = files.length === PAGE_SIZE;
        } else {
          hasMore = false;
        }
      }

      let bucketColors: ColorEntry[] = [];
      if (allFiles.length > 0) {
        const SUPABASE_URL = "https://gejgtkgqyzdfbsbxujgl.supabase.co";
        bucketColors = allFiles
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .map(f => {
            const id = f.name.replace(/\.[^.]+$/, "");
            const label = parseToileColorLabel(f.name);
            const photoUrl = `${SUPABASE_URL}/storage/v1/object/public/toile-colors/${encodeURIComponent(f.name)}`;
            const refCode = parseToileRefCode(f.name);
            return { id, hex: "#888", label, active: true, type: "solid" as const, photoUrl, refCode };
          });
      }

      // 3. Merge toile colors
      let toileColors = bucketColors;
      if (map.toileColors && Array.isArray(map.toileColors) && map.toileColors.length > 0) {
        const bucketMap = new Map(bucketColors.map(c => [c.id, c]));
        toileColors = (map.toileColors as ColorEntry[]).map(dbColor => ({
          ...dbColor,
          photoUrl: dbColor.photoUrl || bucketMap.get(dbColor.id)?.photoUrl,
        }));
        for (const bc of bucketColors) {
          if (!toileColors.find(tc => tc.id === bc.id)) {
            toileColors.push(bc);
          }
        }
      }

      const loadedGrid = map.priceGrid ?? DEFAULT_SETTINGS.priceGrid;
      const loadedWidthRanges = map.widthRanges ?? DEFAULT_SETTINGS.widthRanges;
      const loadedProjections = map.projections ?? DEFAULT_SETTINGS.projections;

      setPriceGrid(loadedGrid);
      setWidthRanges(loadedWidthRanges);
      setProjections(loadedProjections);

      setSettings({
        pricing: map.pricing ?? DEFAULT_SETTINGS.pricing,
        dimensions: map.dimensions ?? DEFAULT_SETTINGS.dimensions,
        toileColors,
        armatureColors: map.armatureColors ?? DEFAULT_SETTINGS.armatureColors,
        options: map.options ?? DEFAULT_SETTINGS.options,
        priceGrid: loadedGrid,
        widthRanges: loadedWidthRanges,
        projections: loadedProjections,
      });
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

  const updatePriceGrid = useCallback((grid: (number | null)[][]) => {
    setPriceGrid(grid);
    setSettings(s => { upsertSetting("priceGrid", grid); return { ...s, priceGrid: grid }; });
  }, []);

  const updateWidthRangesCtx = useCallback((ranges: WidthRange[]) => {
    setWidthRanges(ranges);
    setSettings(s => { upsertSetting("widthRanges", ranges); return { ...s, widthRanges: ranges }; });
  }, []);

  const updateProjectionsCtx = useCallback((projections: number[]) => {
    setProjections(projections);
    setSettings(s => { upsertSetting("projections", projections); return { ...s, projections: projections }; });
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = {
      ...DEFAULT_SETTINGS,
      widthRanges: getDefaultWidthRanges(),
      projections: getDefaultProjections(),
      priceGrid: getDefaultPriceGrid(),
    };
    setPriceGrid(defaults.priceGrid);
    setWidthRanges(defaults.widthRanges);
    setProjections(defaults.projections);
    setSettings(defaults);
    // persist
    upsertSetting("pricing", defaults.pricing);
    upsertSetting("dimensions", defaults.dimensions);
    upsertSetting("toileColors", defaults.toileColors);
    upsertSetting("armatureColors", defaults.armatureColors);
    upsertSetting("options", defaults.options);
    upsertSetting("priceGrid", defaults.priceGrid);
    upsertSetting("widthRanges", defaults.widthRanges);
    upsertSetting("projections", defaults.projections);
  }, []);

  return (
    <ConfiguratorSettingsContext.Provider value={{
      settings, updatePricing, updateDimensions,
      updateToileColor, addToileColor, removeToileColor, reorderToileColors,
      updateArmatureColor, addArmatureColor, removeArmatureColor, reorderArmatureColors,
      updateOption, addOption, removeOption, updatePriceGrid,
      updateWidthRanges: updateWidthRangesCtx, updateProjections: updateProjectionsCtx,
      resetToDefaults,
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
