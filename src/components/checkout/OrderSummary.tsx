import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/contexts/CartContext";

interface OrderSummaryProps {
  item: CartItem;
  deliveryOption?: string;
  compact?: boolean;
  promoCode?: string;
  promoDiscount?: number;
  onPromoApplied?: (code: string, discount: number) => void;
}

const OrderSummary = ({ item, deliveryOption = "standard", compact = false, promoCode = "", promoDiscount = 0, onPromoApplied }: OrderSummaryProps) => {
  const { configuration: cfg, pricing } = item;
  const finalTotal = pricing.total - promoDiscount;
  const tva = Math.round((finalTotal / 1.2) * 0.2 * 100) / 100;

  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const applyPromo = async () => {
    setPromoLoading(true);
    setPromoError("");
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoInput)
        .eq("active", true)
        .lte("valid_from", now)
        .gte("valid_until", now)
        .single();

      if (error || !data) {
        setPromoError("Code invalide ou expiré");
        return;
      }
      if (data.max_uses && data.current_uses >= data.max_uses) {
        setPromoError("Ce code a atteint son nombre d'utilisations maximum");
        return;
      }

      const cartTotal = pricing.total;
      const discount = data.type === "percent"
        ? Math.round(cartTotal * Number(data.value) / 100)
        : Number(data.value);
      onPromoApplied?.(data.code, discount);
    } catch {
      setPromoError("Erreur de validation");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className={`border border-border bg-card ${compact ? "p-4" : "p-6"}`}>
      <h3 className="font-serif text-lg mb-4">Votre commande</h3>

      {/* Product */}
      <div className="mb-4">
        <p className="text-sm font-medium">{item.productName}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {cfg.width} × {cfg.projection} cm · Toile {cfg.toileColor.label} · Armature {cfg.armatureColor.label}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {cfg.options.motorisation && !cfg.options.packConnect && (
            <span className="text-xs bg-secondary px-2 py-0.5">⚡ Motorisation +{pricing.motorisation} €</span>
          )}
          {cfg.options.led && !cfg.options.packConnect && (
            <span className="text-xs bg-secondary px-2 py-0.5">💡 LED +{pricing.led} €</span>
          )}
          {cfg.options.packConnect && (
            <span className="text-xs bg-secondary px-2 py-0.5">🎁 Pack Connect +{pricing.packConnect} €</span>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base store</span>
          <span>{pricing.base.toLocaleString("fr-FR")} €</span>
        </div>
        {pricing.motorisation > 0 && !cfg.options.packConnect && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Motorisation</span>
            <span>+{pricing.motorisation} €</span>
          </div>
        )}
        {pricing.led > 0 && !cfg.options.packConnect && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">LED</span>
            <span>+{pricing.led} €</span>
          </div>
        )}
        {pricing.packConnect > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pack Connect</span>
            <span>+{pricing.packConnect} €</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span className="text-primary font-medium">
            {deliveryOption === "installation" ? "Sur devis" : "Offerte ✓"}
          </span>
        </div>
        {promoCode && promoDiscount > 0 && (
          <div className="flex justify-between text-primary">
            <span className="text-sm">Code {promoCode}</span>
            <span className="text-sm font-medium">-{promoDiscount.toLocaleString("fr-FR")} €</span>
          </div>
        )}
        <div className="border-t border-border pt-3 flex justify-between font-serif text-lg">
          <span>Total TTC</span>
          <span>
            {promoDiscount > 0 && (
              <span className="text-sm text-muted-foreground line-through mr-2">{pricing.total.toLocaleString("fr-FR")} €</span>
            )}
            {finalTotal.toLocaleString("fr-FR")} €
          </span>
        </div>
        <p className="text-xs text-muted-foreground">dont TVA 20% : {tva.toLocaleString("fr-FR")} €</p>
      </div>

      {/* Promo code */}
      {!compact && onPromoApplied && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium mb-2">Code promo</p>
          {promoCode && promoDiscount > 0 ? (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {promoCode} — -{promoDiscount.toLocaleString("fr-FR")} €
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onPromoApplied("", 0)}
              >
                Retirer
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="REVIENS10"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                className="h-9 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={promoLoading || !promoInput}
                onClick={applyPromo}
              >
                OK
              </Button>
            </div>
          )}
          {promoError && <p className="text-xs text-destructive mt-1">{promoError}</p>}
        </div>
      )}

      {!compact && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          <span>🔒 Paiement sécurisé</span>
          <span>🇫🇷 Fabriqué en France</span>
          <span>🔧 Garantie 5 ans</span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
