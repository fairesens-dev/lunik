import { Gift } from "lucide-react";

interface SampleCartProps {
  items: { name: string }[];
  unitPrice: number;
  shippingCost: number;
  totalAmount: number;
  promoMessage: string;
  onRemove: (name: string) => void;
}

const SampleCart = ({ items, unitPrice, shippingCost, totalAmount, promoMessage }: SampleCartProps) => {
  const formatPrice = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (items.length === 0) {
    return (
      <div className="bg-[#f9f7f4] border-t border-[#e8e2d8] p-4 text-center">
        <p className="text-sm text-muted-foreground">Sélectionnez au moins un coloris ci-dessus</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f7f4] border-t border-[#e8e2d8] p-4 space-y-3">
      {/* Marketing block */}
      <div className="flex items-start gap-2.5 bg-[#e8f5e9]/60 border border-[#4A5E3A]/20 rounded-lg px-3 py-2.5">
        <Gift className="w-4 h-4 text-[#4A5E3A] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-[#4A5E3A]">
            Échantillons offerts pour tout achat d'un store LuniK
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            La commande d'échantillons génère un avoir du même montant, utilisable lors de votre commande de store LuniK.
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {items.length} échantillon{items.length > 1 ? "s" : ""} × {formatPrice(unitPrice)} €
        </span>
        <span className="font-semibold text-foreground">{formatPrice(totalAmount)} €</span>
      </div>

      {shippingCost === 0 ? (
        <p className="text-xs text-[#4A5E3A] font-medium">✓ Livraison offerte</p>
      ) : (
        <p className="text-xs text-muted-foreground">Frais de port : {formatPrice(shippingCost)} €</p>
      )}

      {promoMessage && (
        <p className="text-xs text-[#c17c3e] font-medium">{promoMessage}</p>
      )}
    </div>
  );
};

export default SampleCart;
