import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useSampleSettings } from "@/hooks/useSampleSettings";

export interface SampleItem {
  name: string;
  hex: string;
  type?: string;
  colors?: string[];
  refCode?: string;
  photoUrl?: string;
}

interface SampleCartContextType {
  items: SampleItem[];
  addItem: (item: SampleItem) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
  isInCart: (name: string) => boolean;
  totalItems: number;
  unitPrice: number;
  shippingCost: number;
  totalAmount: number;
  enabled: boolean;
  maxSamples: number | null;
  promoMessage: string;
}

const SampleCartContext = createContext<SampleCartContextType | undefined>(undefined);

const STORAGE_KEY = "lunik-sample-cart";

export const SampleCartProvider = ({ children }: { children: ReactNode }) => {
  const { data: settings } = useSampleSettings();

  const [items, setItems] = useState<SampleItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const enabled = settings?.enabled ?? false;
  const unitPrice = settings?.unitPrice ?? 2;
  const shippingCost = settings?.shippingCost ?? 0;
  const maxSamples = settings?.maxSamples ?? null;
  const promoMessage = settings?.promoMessage ?? "";

  const addItem = (item: SampleItem) => {
    if (items.some((i) => i.name === item.name)) return;
    if (maxSamples && items.length >= maxSamples) return;
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  };

  const clearCart = () => setItems([]);

  const isInCart = (name: string) => items.some((i) => i.name === name);

  const totalItems = items.length;
  const totalAmount = totalItems * unitPrice + shippingCost;

  return (
    <SampleCartContext.Provider
      value={{ items, addItem, removeItem, clearCart, isInCart, totalItems, unitPrice, shippingCost, totalAmount, enabled, maxSamples, promoMessage }}
    >
      {children}
    </SampleCartContext.Provider>
  );
};

export const useSampleCart = () => {
  const ctx = useContext(SampleCartContext);
  if (!ctx) throw new Error("useSampleCart must be used within SampleCartProvider");
  return ctx;
};
