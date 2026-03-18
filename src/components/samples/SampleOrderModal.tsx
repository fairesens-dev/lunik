import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useConfiguratorSettings } from "@/contexts/ConfiguratorSettingsContext";
import { useSampleCart, type SampleItem } from "@/contexts/SampleCartContext";
import { categorizeAndSortColors, CATEGORY_LABELS } from "@/lib/classifyToileColor";
import SampleColorCard from "./SampleColorCard";
import SampleCart from "./SampleCart";

interface SampleOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SampleOrderModal = ({ open, onOpenChange }: SampleOrderModalProps) => {
  const navigate = useNavigate();
  const { settings } = useConfiguratorSettings();
  const { items, addItem, removeItem, isInCart, totalItems, unitPrice, shippingCost, totalAmount, promoMessage, maxSamples } = useSampleCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState("");

  const toileColors = useMemo(() =>
    settings.toileColors.filter((c) => c.active).map((c) => ({
      ...c,
      name: c.label,
    })),
    [settings.toileColors]
  );

  const categorized = useMemo(() => categorizeAndSortColors(toileColors), [toileColors]);

  const filtered = useMemo(() => {
    if (!searchQuery) return categorized;
    const q = searchQuery.toLowerCase();
    return categorized
      .map((group) => ({
        ...group,
        colors: group.colors.filter(
          (c) => c.name.toLowerCase().includes(q) || (c.refCode && c.refCode.toLowerCase().includes(q))
        ),
      }))
      .filter((group) => group.colors.length > 0);
  }, [categorized, searchQuery]);

  const handleToggle = (color: typeof toileColors[0]) => {
    const item: SampleItem = {
      name: color.name,
      hex: color.hex,
      type: color.type,
      colors: color.colors,
      refCode: color.refCode,
      photoUrl: color.photoUrl,
    };
    if (isInCart(color.name)) {
      removeItem(color.name);
    } else {
      addItem(item);
    }
  };

  const handleOrder = () => {
    onOpenChange(false);
    navigate("/checkout?type=samples");
  };

  const formatPrice = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[780px] h-[85vh] flex flex-col p-0 gap-0 sm:rounded-xl overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f9f7f4] flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#4A5E3A]" />
              </div>
              <div>
                <DialogTitle className="font-serif text-[22px] text-[#2d2d2d]">
                  Commander des échantillons
                </DialogTitle>
                <DialogDescription className="text-[14px] text-[#8a7e6b] mt-1">
                  Recevez chez vous les coloris qui vous intéressent pour faire votre choix en toute confiance.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Search + Counter */}
          <div className="px-6 pb-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un coloris ou une référence..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalItems} sélectionné{totalItems > 1 ? "s" : ""}
              {maxSamples ? ` / ${maxSamples}` : ""}
            </span>
          </div>

          {/* Color list — scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6">
            <Accordion type="single" collapsible defaultValue={filtered[0]?.category} className="w-full">
              {filtered.map((group) => (
                <AccordionItem key={group.category} value={group.category} className="border-border">
                  <AccordionTrigger className="text-sm py-3 hover:no-underline">
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{CATEGORY_LABELS[group.category]}</span>
                      <span className="text-muted-foreground text-xs">({group.colors.length})</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                      {group.colors.map((c) => (
                        <SampleColorCard
                          key={c.name}
                          name={c.name}
                          hex={c.hex}
                          type={c.type}
                          colors={c.colors}
                          refCode={c.refCode}
                          photoUrl={c.photoUrl}
                          isSelected={isInCart(c.name)}
                          onToggle={() => handleToggle(c)}
                          onZoom={c.photoUrl ? () => { setLightboxUrl(c.photoUrl!); setLightboxName(c.name); } : undefined}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Sticky Cart Summary */}
          <div className="flex-shrink-0">
            <SampleCart
              items={items}
              unitPrice={unitPrice}
              shippingCost={shippingCost}
              totalAmount={totalAmount}
              promoMessage={promoMessage}
              onRemove={removeItem}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-[#e8e2d8] flex gap-2 sm:gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#4A5E3A] text-[#4A5E3A]">
              Annuler
            </Button>
            <Button
              onClick={handleOrder}
              disabled={totalItems === 0}
              className="bg-[#4A5E3A] hover:bg-[#3d4e30] text-white"
            >
              Commander — {formatPrice(totalAmount)} €
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden sm:rounded-xl">
          <div className="relative">
            <img src={lightboxUrl || ""} alt={lightboxName} className="w-full h-auto max-h-[70vh] object-contain bg-[#f9f7f4]" />
            <DialogClose className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors">
              <X className="w-4 h-4" />
            </DialogClose>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-sm font-medium text-foreground">{lightboxName}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleOrderModal;
