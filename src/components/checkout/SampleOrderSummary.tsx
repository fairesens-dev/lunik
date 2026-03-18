import type { SampleItem } from "@/contexts/SampleCartContext";

interface SampleOrderSummaryProps {
  items: SampleItem[];
  unitPrice: number;
  shippingCost: number;
  totalAmount: number;
  promoMessage?: string;
}

const SampleOrderSummary = ({ items, unitPrice, shippingCost, totalAmount, promoMessage }: SampleOrderSummaryProps) => {
  const subtotal = items.length * unitPrice;

  return (
    <div className="border border-border rounded-lg bg-card p-5 space-y-4">
      <h3 className="font-serif text-lg">Vos échantillons</h3>

      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-3 text-sm">
            {item.type === "striped" && item.colors ? (
              <div className="w-4 h-4 rounded-[3px] border border-border overflow-hidden flex flex-shrink-0">
                {item.colors.map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            ) : (
              <div
                className="w-4 h-4 rounded-[3px] border border-border flex-shrink-0"
                style={{ backgroundColor: item.hex }}
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="truncate block">{item.name}</span>
              {item.refCode && (
                <span className="text-[11px] text-muted-foreground">Réf. {item.refCode}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>{items.length} × {unitPrice.toFixed(2)} €</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Frais de port</span>
          <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : "Offerts"}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-1 border-t border-border">
          <span>Total</span>
          <span>{totalAmount.toFixed(2)} €</span>
        </div>
      </div>

      {promoMessage && (
        <p className="text-xs text-primary font-medium bg-primary/5 rounded px-3 py-2">{promoMessage}</p>
      )}
    </div>
  );
};

export default SampleOrderSummary;
