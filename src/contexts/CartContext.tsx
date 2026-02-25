import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItemConfig {
  width: number;
  projection: number;
  surface: number;
  toileColor: { id: string; hex: string; label: string };
  armatureColor: { id: string; hex: string; label: string };
  options: {
    motorisation: boolean;
    led: boolean;
    packConnect: boolean;
  };
}

export interface CartItemPricing {
  base: number;
  motorisation: number;
  led: number;
  packConnect: number;
  total: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  configuration: CartItemConfig;
  pricing: CartItemPricing;
  quantity: number;
}

interface CartContextType {
  item: CartItem | null;
  setItem: (item: CartItem) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "lunik-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [item, setItemState] = useState<CartItem | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (item) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [item]);

  const setItem = (newItem: CartItem) => setItemState(newItem);
  const clearCart = () => setItemState(null);

  return (
    <CartContext.Provider value={{ item, setItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
