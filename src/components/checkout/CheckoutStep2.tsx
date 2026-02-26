import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Truck, Wrench } from "lucide-react";
import { addWeeks, format } from "date-fns";
import { fr } from "date-fns/locale";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/contexts/CartContext";

interface Props {
  onNext: (deliveryOption: string) => void;
  onBack: () => void;
}

const CheckoutStep2 = ({ onNext, onBack }: Props) => {
  const { item } = useCart();
  const [delivery, setDelivery] = useState("standard");

  if (!item) return null;

  const now = new Date();
  const estimatedFrom = format(addWeeks(now, delivery === "standard" ? 4 : 5), "d MMMM", { locale: fr });
  const estimatedTo = format(addWeeks(now, delivery === "standard" ? 5 : 6), "d MMMM yyyy", { locale: fr });

  const steps = ["Commande validée", "Fabrication (3-4 sem)", "Expédition", "Livraison"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-8">
        <h3 className="font-serif text-xl">Mode de livraison</h3>

        <div className="space-y-4">
          {/* Standard */}
          <button
            type="button"
            onClick={() => setDelivery("standard")}
            className={`w-full text-left border p-5 transition-colors ${
              delivery === "standard" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-start gap-4">
              <Truck className="w-5 h-5 mt-0.5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Livraison standard à domicile</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Livraison par transporteur spécialisé. Vous serez contacté pour convenir d'un créneau.
                </p>
                <p className="text-xs text-muted-foreground mt-1">Délai : 4 à 5 semaines</p>
              </div>
              <span className="text-sm font-medium text-primary whitespace-nowrap">OFFERTE</span>
            </div>
          </button>

          {/* Installation */}
          <button
            type="button"
            onClick={() => setDelivery("installation")}
            className={`w-full text-left border p-5 transition-colors ${
              delivery === "installation" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-start gap-4">
              <Wrench className="w-5 h-5 mt-0.5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Livraison + Installation par nos poseurs</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Un de nos installateurs certifiés se déplace et installe votre store le jour de la livraison.
                </p>
                <p className="text-xs text-muted-foreground mt-1">Délai : 5 à 6 semaines</p>
              </div>
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sur devis</span>
            </div>
          </button>
        </div>

        {/* Estimated date */}
        <div className="bg-secondary p-4">
          <p className="text-sm">
            📦 Livraison estimée entre le <strong>{estimatedFrom}</strong> et le <strong>{estimatedTo}</strong>
          </p>
        </div>


        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="rounded-none tracking-[0.15em] uppercase text-xs h-auto py-4 px-6">
            ← Retour
          </Button>
          <Button
            onClick={() => onNext(delivery)}
            className="flex-1 py-5 rounded-none tracking-[0.15em] uppercase text-sm font-medium h-auto"
          >
            Continuer vers le paiement →
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-8">
          <OrderSummary item={item} deliveryOption={delivery} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep2;
