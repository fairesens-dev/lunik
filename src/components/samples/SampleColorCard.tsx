import React from "react";
import { Plus, Check, Search } from "lucide-react";

interface SampleColorCardProps {
  name: string;
  hex: string;
  type?: string;
  colors?: string[];
  refCode?: string;
  photoUrl?: string;
  isSelected: boolean;
  onToggle: () => void;
  onZoom?: () => void;
}

const SampleColorCard = ({ name, hex, type, colors, refCode, photoUrl, isSelected, onToggle, onZoom }: SampleColorCardProps) => {
  const getSwatchStyle = (): React.CSSProperties => {
    if (photoUrl) {
      return { backgroundImage: `url(${photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (type === "striped" && colors && colors.length >= 2) {
      return { background: `repeating-linear-gradient(45deg, ${colors[0]}, ${colors[0]} 6px, ${colors[1]} 6px, ${colors[1]} 12px)` };
    }
    return { backgroundColor: hex };
  };

  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 w-full text-left p-2.5 rounded-lg border transition-all ${
        isSelected
          ? "border-[#4A5E3A] bg-[#e8f5e9]/50"
          : "border-transparent hover:bg-secondary/50"
      }`}
    >
      <div className="relative group flex-shrink-0">
        <div
          className="w-8 h-8 rounded-md border border-border"
          style={getSwatchStyle()}
        />
        {photoUrl && onZoom && (
          <div
            onClick={(e) => { e.stopPropagation(); onZoom(); }}
            className="absolute inset-0 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{name}</p>
        {refCode && <p className="text-[10px] text-muted-foreground">{refCode}</p>}
      </div>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          isSelected
            ? "bg-[#4A5E3A] text-white"
            : "border border-border text-muted-foreground hover:border-[#4A5E3A]/50"
        }`}
      >
        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </div>
    </button>
  );
};

export default SampleColorCard;
