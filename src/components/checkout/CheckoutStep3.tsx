import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/contexts/CartContext";
import type { Step1Data } from "./CheckoutStep1";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodsSettings {
  card: { enabled: boolean };
  transfer: {
    enabled: boolean;
    iban: string;
    bic: string;
    accountHolder: string;
    bank: string;
    instructions: string;
  };
  check: {
    enabled: boolean;
    orderTo: string;
    sendAddress: string;
    instructions: string;
  };
}

const defaultPaymentSettings: PaymentMethodsSettings = {
  card: { enabled: true },
  transfer: { enabled: false, iban: "", bic: "", accountHolder: "", bank: "", instructions: "" },
  check: { enabled: false, orderTo: "", sendAddress: "", instructions: "" },
};

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
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer" | "check">("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<PaymentMethodsSettings>(defaultPaymentSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("admin_settings").select("data").eq("id", "payment_methods").single();
      if (data?.data) setSettings({ ...defaultPaymentSettings, ...(data.data as any) });
      setSettingsLoaded(true);
    })();
  }, []);

  // Auto-select first enabled method
  useEffect(() => {
    if (!settingsLoaded) return;
    if (settings.card.enabled) setPaymentMethod("card");
    else if (settings.transfer.enabled) setPaymentMethod("transfer");
    else if (settings.check.enabled) setPaymentMethod("check");
  }, [settingsLoaded, settings]);

  if (!item) return null;

  const total = item.pricing.total - promoDiscount;

  const generateRef = () => "SC-" + Date.now().toString(36).toUpperCase();

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      const options: string[] = [];
      if (item.configuration.options.packConnect) options.push("Pack Connect");
      else {
        if (item.configuration.options.motorisation) options.push("Motorisation");
        if (item.configuration.options.led) options.push("LED");
      }

      const ref = generateRef();

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
        window.location.href = data.url;
      } else if (data?.redirect) {
        clearCart();
        navigate(`${data.redirect}`);
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

  const enabledMethods = [
    settings.card.enabled && "card",
    settings.transfer.enabled && "transfer",
    settings.check.enabled && "check",
  ].filter(Boolean) as string[];

  const buttonLabel = paymentMethod === "card"
    ? `Payer ${total.toLocaleString("fr-FR")} € maintenant`
    : paymentMethod === "transfer"
    ? `Confirmer — Paiement par virement (${total.toLocaleString("fr-FR")} €)`
    : `Confirmer — Paiement par chèque (${total.toLocaleString("fr-FR")} €)`;

  const buttonLabelMobile = paymentMethod === "card"
    ? `Payer ${total.toLocaleString("fr-FR")} €`
    : `Confirmer ${total.toLocaleString("fr-FR")} €`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8 w-full">
      <div className="min-w-0">
      <div className="space-y-8 w-full min-w-0">
        <h3 className="font-serif text-xl">Paiement</h3>

        <div className="space-y-4">
          {/* CB */}
          {settings.card.enabled && (
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`w-full text-left border p-5 transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground/40'}">
                  {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
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
            </button>
          )}

          {/* Virement */}
          {settings.transfer.enabled && (
            <button
              type="button"
              onClick={() => setPaymentMethod("transfer")}
              className={`w-full text-left border p-5 transition-colors ${paymentMethod === "transfer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                  {paymentMethod === "transfer" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">🏦 Virement bancaire</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Effectuez un virement depuis votre banque. Les coordonnées bancaires vous seront communiquées après confirmation.
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Virement details */}
          {paymentMethod === "transfer" && settings.transfer.enabled && (
            <div className="border border-primary/20 bg-primary/5 p-5 space-y-3">
              <p className="text-sm font-medium">Coordonnées bancaires :</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {settings.transfer.accountHolder && (
                  <div><span className="text-muted-foreground">Titulaire :</span> <span className="font-medium">{settings.transfer.accountHolder}</span></div>
                )}
                {settings.transfer.bank && (
                  <div><span className="text-muted-foreground">Banque :</span> <span className="font-medium">{settings.transfer.bank}</span></div>
                )}
                {settings.transfer.iban && (
                  <div className="col-span-2"><span className="text-muted-foreground">IBAN :</span> <span className="font-mono font-medium">{settings.transfer.iban}</span></div>
                )}
                {settings.transfer.bic && (
                  <div><span className="text-muted-foreground">BIC :</span> <span className="font-mono font-medium">{settings.transfer.bic}</span></div>
                )}
              </div>
              {settings.transfer.instructions && (
                <p className="text-xs text-muted-foreground mt-2">{settings.transfer.instructions}</p>
              )}
            </div>
          )}

          {/* Chèque */}
          {settings.check.enabled && (
            <button
              type="button"
              onClick={() => setPaymentMethod("check")}
              className={`w-full text-left border p-5 transition-colors ${paymentMethod === "check" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                  {paymentMethod === "check" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">📝 Paiement par chèque</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Envoyez un chèque par courrier. Les instructions vous seront communiquées après confirmation.
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Chèque details */}
          {paymentMethod === "check" && settings.check.enabled && (
            <div className="border border-primary/20 bg-primary/5 p-5 space-y-3">
              <p className="text-sm font-medium">Instructions pour le chèque :</p>
              <div className="text-sm space-y-1">
                {settings.check.orderTo && (
                  <p><span className="text-muted-foreground">À l'ordre de :</span> <span className="font-medium">{settings.check.orderTo}</span></p>
                )}
                {settings.check.sendAddress && (
                  <p><span className="text-muted-foreground">Adresse d'envoi :</span> <span className="font-medium whitespace-pre-line">{settings.check.sendAddress}</span></p>
                )}
              </div>
              {settings.check.instructions && (
                <p className="text-xs text-muted-foreground mt-2">{settings.check.instructions}</p>
              )}
            </div>
          )}

          {/* 3x sans frais — disabled */}
          <div className="w-full text-left border p-5 relative border-border opacity-60 cursor-not-allowed">
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
                <span className="hidden sm:inline">{buttonLabel}</span>
                <span className="sm:hidden">{buttonLabelMobile}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="lg:hidden mt-8">
        <OrderSummary item={item} deliveryOption={deliveryOption} promoCode={promoCode} promoDiscount={promoDiscount} />
      </div>
      </div>

      <div className="hidden lg:block min-w-0">
        <div className="sticky top-8">
          <OrderSummary item={item} deliveryOption={deliveryOption} promoCode={promoCode} promoDiscount={promoDiscount} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep3;
