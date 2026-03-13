import { useState, useMemo, Fragment } from "react";
import { Check, Search, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { categorizeAndSortColors, groupByHue, CATEGORY_LABELS, type ToileCategory } from "@/lib/classifyToileColor";

interface ToileColor {
  name: string;
  hex: string;
  type?: string;
  colors?: string[];
  photoUrl?: string;
}

interface ToileColorSelectorProps {
  colors: ToileColor[];
  selected: string;
  onSelect: (name: string) => void;
}

const ToileColorSelector = ({ colors, selected, onSelect }: ToileColorSelectorProps) => {
  const [lightboxColor, setLightboxColor] = useState<ToileColor | null>(null);

  const categorized = useMemo(() => categorizeAndSortColors(colors), [colors]);

  // Find which category contains the selected color to auto-open it
  const selectedCategory = useMemo(() => {
    for (const group of categorized) {
      if (group.colors.some((c) => c.name === selected)) return group.category;
    }
    return categorized[0]?.category || "unis";
  }, [categorized, selected]);

  const [openAccordion, setOpenAccordion] = useState<string>(selectedCategory);

  // If selected color's category changes, switch to it
  useMemo(() => {
    if (openAccordion !== selectedCategory) {
      setOpenAccordion(selectedCategory);
    }
  }, [selectedCategory]);

  const getSwatchStyle = (c: ToileColor): React.CSSProperties => {
    if (c.photoUrl) {
      return { backgroundImage: `url(${c.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (c.type === "striped" && c.colors && c.colors.length >= 2) {
      return { background: `repeating-linear-gradient(45deg, ${c.colors[0]}, ${c.colors[0]} 10px, ${c.colors[1]} 10px, ${c.colors[1]} 20px)` };
    }
    return { backgroundColor: c.hex };
  };

  return (
    <>
      <Accordion
        type="multiple"
        value={openAccordions}
        onValueChange={setOpenAccordions}
        className="w-full"
      >
        {categorized.map((group) => (
          <AccordionItem key={group.category} value={group.category} className="border-border">
            <AccordionTrigger className="text-sm py-3 hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="font-medium">{CATEGORY_LABELS[group.category]}</span>
                <span className="text-muted-foreground text-xs">({group.colors.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-3 pt-1 pb-2">
                {group.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => onSelect(c.name)}
                    className="flex flex-col items-center gap-1.5 group"
                    title={c.name}
                  >
                    <div
                      className={`w-full aspect-[11/4] border-2 relative transition-all rounded-sm ${
                        selected === c.name
                          ? "border-primary shadow-md ring-2 ring-primary/30"
                          : "border-border group-hover:border-primary/50"
                      }`}
                      style={getSwatchStyle(c)}
                    >
                      {selected === c.name && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-sm">
                          <Check className="w-5 h-5 text-white drop-shadow" />
                        </div>
                      )}
                      {c.photoUrl && (
                        <div
                          className="absolute bottom-0 right-0 w-5 h-5 bg-black/50 flex items-center justify-center rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-zoom-in"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxColor(c);
                          }}
                        >
                          <Search className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground text-center leading-tight w-full truncate">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxColor} onOpenChange={(open) => !open && setLightboxColor(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-background border-border">
          {lightboxColor && (
            <div className="flex flex-col">
              <div className="relative aspect-square w-full">
                <img
                  src={lightboxColor.photoUrl}
                  alt={lightboxColor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium">{lightboxColor.name}</p>
                <button
                  onClick={() => {
                    onSelect(lightboxColor.name);
                    setLightboxColor(null);
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Sélectionner ce coloris
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToileColorSelector;
