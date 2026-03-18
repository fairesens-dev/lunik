import { X } from "lucide-react";
import type { SampleItem } from "@/contexts/SampleCartContext";

interface SampleCartProps {
  items: SampleItem[];
  unitPrice: number;
  shippingCost: number;
  totalAmount: number;
  promoMessage: string;
  onRemove: (name: string) => void;
}

const SampleCart = ({ items, unitPrice, shippingCost, totalAmount, promoMessage, onRemove }: SampleCartProps) => {
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
      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const swatchStyle: React.CSSProperties =
            item.type === "striped" && item.colors && item.colors.length >= 2
              ? { background: `repeating-linear-gradient(45deg, ${item.colors[0]}, ${item.colors[0]} 4px, ${item.colors[1]} 4px, ${item.colors[1]} 8px)` }
              : { backgroundColor: item.hex };

          return (
            <span
              key={item.name}
              className="inline-flex items-center gap-1.5 bg-[#e8f5e9] border border-[#4A5E3A]/30 rounded-full px-2.5 py-1 text-xs text-foreground"
            >
              <span className="w-3 h-3 rounded-full border border-border flex-shrink-0" style={swatchStyle} />
              <span className="truncate max-w-[120px]">{item.name}</span>
              <button onClick={() => onRemove(item.name)} className="hover:text-destructive transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
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
