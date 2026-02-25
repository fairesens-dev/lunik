import { useEffect, useRef, useCallback } from "react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "lunik_session_id";
const SNAPSHOT_KEY = "lunik_cart_snapshot";

export interface CartSnapshot {
  cart: CartItem;
  savedAt: string;
  sessionId: string;
  email: string | null;
  stage: string;
}

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getSnapshot(): CartSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSnapshot(snapshot: CartSnapshot) {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function useCartAbandonment() {
  const { item: cart } = useCart();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const sessionId = useRef(getOrCreateSessionId());

  // Sync cart to localStorage + Supabase (debounced)
  useEffect(() => {
    if (!cart || !cart.configuration.width) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const existing = getSnapshot();
      const snapshot: CartSnapshot = {
        cart,
        savedAt: new Date().toISOString(),
        sessionId: sessionId.current,
        email: existing?.email || null,
        stage: existing?.stage || "configurateur",
      };
      saveSnapshot(snapshot);

      // Upsert to Supabase (fire and forget)
      supabase
        .from("abandoned_carts")
        .upsert(
          {
            session_id: sessionId.current,
            email: snapshot.email,
            cart_data: cart as any,
            abandonment_stage: snapshot.stage,
          },
          { onConflict: "session_id" }
        )
        .then(() => {});
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [cart]);

  const captureEmail = useCallback((email: string) => {
    const snapshot = getSnapshot();
    if (snapshot) {
      snapshot.email = email;
      saveSnapshot(snapshot);
    }
    // Update in Supabase
    supabase
      .from("abandoned_carts")
      .update({ email })
      .eq("session_id", sessionId.current)
      .then(() => {});
  }, []);

  const setStage = useCallback((stage: string) => {
    const snapshot = getSnapshot();
    if (snapshot) {
      snapshot.stage = stage;
      saveSnapshot(snapshot);
    }
    supabase
      .from("abandoned_carts")
      .update({ abandonment_stage: stage })
      .eq("session_id", sessionId.current)
      .then(() => {});
  }, []);

  const restoreCart = useCallback((): CartItem | null => {
    const snapshot = getSnapshot();
    return snapshot?.cart || null;
  }, []);

  const markConverted = useCallback((orderId?: string) => {
    localStorage.removeItem(SNAPSHOT_KEY);
    supabase
      .from("abandoned_carts")
      .update({
        converted: true,
        converted_order_id: orderId || null,
      })
      .eq("session_id", sessionId.current)
      .then(() => {});
  }, []);

  return { captureEmail, setStage, restoreCart, markConverted, sessionId: sessionId.current };
}
