import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
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

  const [saveEmail, setSaveEmail] = useState("");
  const [saveSending, setSaveSending] = useState(false);
  const [saveSent, setSaveSent] = useState(false);

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

  const handleSaveQuote = async () => {
    if (!saveEmail || !saveEmail.includes("@")) return;
    setSaveSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-config-email", {
        body: {
          email: saveEmail,
          cart: { configuration: cfg, pricing },
        },
      });
      if (error) throw error;
      setSaveSent(true);
      toast.success("Devis envoyé à " + saveEmail);
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSaveSending(false);
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
        {(() => {
          const displayOptions = cfg.selectedOptions || [
            ...(cfg.options.motorisation && pricing.motorisation > 0 ? [{ id: "motorisation", label: "Motorisation", price: pricing.motorisation }] : []),
            ...(cfg.options.led && pricing.led > 0 ? [{ id: "led", label: "LED", price: pricing.led }] : []),
            ...(cfg.options.packConnect && pricing.packConnect > 0 ? [{ id: "pack", label: "Pack Connect", price: pricing.packConnect }] : []),
          ];
          return displayOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayOptions.map((opt) => (
                <span key={opt.id} className="text-xs bg-secondary px-2 py-0.5">
                  {opt.label} {opt.price > 0 ? `+${opt.price.toLocaleString("fr-FR")} €` : opt.price < 0 ? `${opt.price.toLocaleString("fr-FR")} €` : "inclus"}
                </span>
              ))}
            </div>
          ) : null;
        })()}
      </div>

      <div className="border-t border-border pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base store</span>
          <span>{pricing.base.toLocaleString("fr-FR")} €</span>
        </div>
        {(() => {
          const displayOptions = cfg.selectedOptions || [
            ...(cfg.options.motorisation && pricing.motorisation > 0 ? [{ id: "motorisation", label: "Motorisation", price: pricing.motorisation }] : []),
            ...(cfg.options.led && pricing.led > 0 ? [{ id: "led", label: "LED", price: pricing.led }] : []),
            ...(cfg.options.packConnect && pricing.packConnect > 0 ? [{ id: "pack", label: "Pack Connect", price: pricing.packConnect }] : []),
          ];
          return displayOptions.filter(o => o.price !== 0).map((opt) => (
            <div key={opt.id} className="flex justify-between">
              <span className="text-muted-foreground">{opt.label}</span>
              <span>{opt.price > 0 ? "+" : ""}{opt.price.toLocaleString("fr-FR")} €</span>
            </div>
          ));
        })()}
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

      {/* Save quote by email */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-medium">Recevoir mon devis par email</p>
          </div>
          {saveSent ? (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4" />
              Devis envoyé !
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="mon@email.com"
                value={saveEmail}
                onChange={(e) => setSaveEmail(e.target.value)}
                className="h-9 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saveSending || !saveEmail.includes("@")}
                onClick={handleSaveQuote}
              >
                {saveSending ? "…" : "Envoyer"}
              </Button>
            </div>
          )}
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
