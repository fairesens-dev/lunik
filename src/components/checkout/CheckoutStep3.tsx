import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/contexts/CartContext";
import type { Step1Data } from "./CheckoutStep1";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Props {
  contactData: Step1Data;
  deliveryOption: string;
  onBack: () => void;
  promoCode?: string;
  promoDiscount?: number;
}

const CheckoutStep3 = ({ contactData, deliveryOption, onBack, promoCode = "", promoDiscount = 0 }: Props) => {
  const { item, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod] = useState<"card">("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) return null;

  const total = item.pricing.total - promoDiscount;
  const installment = Math.round(total / 3);

  const generateRef = () => "SC-" + Date.now().toString(36).toUpperCase();

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      // Build options array
      const options: string[] = [];
      if (item.configuration.options.packConnect) options.push("Pack Connect");
      else {
        if (item.configuration.options.motorisation) options.push("Motorisation");
        if (item.configuration.options.led) options.push("LED");
      }

      const ref = generateRef();

      // Call edge function to create Stripe checkout session
      const { data, error: fnError } = await supabase.functions.invoke("create-checkout", {
        body: {
          amount: total,
          ref,
          customerEmail: contactData.email,
          customerName: `${contactData.firstName} ${contactData.lastName}`,
          productName: item.productName,
          description: `${item.configuration.width}×${item.configuration.projection}cm · Toile ${item.configuration.toileColor.label} · ${item.configuration.armatureColor.label}`,
          paymentMethod,
          promoCode: promoCode || undefined,
          promoDiscount: promoDiscount || undefined,
          orderData: {
            ref,
            client_name: `${contactData.civility} ${contactData.firstName} ${contactData.lastName}`,
            client_email: contactData.email,
            client_phone: contactData.phone,
            client_postal_code: contactData.postalCode,
            client_address: contactData.address,
            client_address2: contactData.address2 || "",
            client_city: contactData.city,
            client_country: contactData.country,
            civility: contactData.civility,
            width: item.configuration.width,
            projection: item.configuration.projection,
            toile_color: item.configuration.toileColor.label,
            armature_color: item.configuration.armatureColor.label,
            options,
            amount: total,
            delivery_option: deliveryOption,
            payment_method: paymentMethod,
            message: contactData.note || "",
            newsletter_optin: contactData.newsletter || false,
          },
        },
      });

      if (fnError) throw new Error(fnError.message);

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Aucune URL de paiement retournée");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inattendue";
      setError(message);
      toast({
        title: "Erreur de paiement",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-8">
        <h3 className="font-serif text-xl">Paiement</h3>

        {/* Payment method selector */}
        <div className="space-y-4">
          {/* CB comptant */}
          <div
            className="w-full text-left border p-5 transition-colors border-primary bg-primary/5"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">💳 Paiement comptant par CB</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Paiement sécurisé via Stripe. Vos données ne sont jamais stockées sur nos serveurs.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-secondary px-2 py-0.5">Visa</span>
                  <span className="text-xs bg-secondary px-2 py-0.5">Mastercard</span>
                  <span className="text-xs bg-secondary px-2 py-0.5">Amex</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3x sans frais — disabled */}
          <div
            className="w-full text-left border p-5 relative border-border opacity-60 cursor-not-allowed"
          >
            <span className="absolute -top-2.5 right-4 bg-muted text-muted-foreground text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium">
              Bientôt
            </span>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">💳 Payer en 3× sans frais</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Étalez votre paiement sur 3 mois, sans intérêts, sans frais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>🔒 SSL 256-bit</span>
          <span>🛡️ Stripe Certified</span>
          <span>💳 3D Secure</span>
          <span>🇫🇷 Données hébergées en France</span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            ❌ {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="rounded-none tracking-[0.15em] uppercase text-xs h-auto py-4 px-6">
            ← Retour
          </Button>
          <Button
            onClick={handlePay}
            disabled={loading}
            className="flex-1 py-5 rounded-none tracking-[0.15em] uppercase text-sm font-medium h-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement en cours...
              </span>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {`Payer ${total.toLocaleString("fr-FR")} € ${paymentMethod === "4x" ? "(1ère échéance : " + installment.toLocaleString("fr-FR") + " €)" : "maintenant"}`}
                </span>
                <span className="sm:hidden">
                  {`Payer ${total.toLocaleString("fr-FR")} €`}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-8">
          <OrderSummary item={item} deliveryOption={deliveryOption} promoCode={promoCode} promoDiscount={promoDiscount} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep3;
