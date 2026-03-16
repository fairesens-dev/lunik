import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ToileCloseUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toileLabel: string;
  photoUrl?: string;
  hex: string;
}

const ToileCloseUpDialog = ({ open, onOpenChange, toileLabel, photoUrl, hex }: ToileCloseUpDialogProps) => {
  const [imgError, setImgError] = useState(false);

  const showImage = photoUrl && !imgError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Toile {toileLabel} — Gros plan</DialogTitle>

        <div className="relative">
          {showImage ? (
            <img
              src={photoUrl}
              alt={`Toile ${toileLabel} — vue rapprochée`}
              className="w-full h-auto max-h-[80vh] object-contain bg-secondary"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full aspect-square flex items-center justify-center"
              style={{ backgroundColor: hex }}
            >
              <div className="text-center space-y-2 p-8">
                <ZoomIn className="w-10 h-10 mx-auto text-foreground/50" />
                <p className="text-sm font-medium text-foreground/70">{toileLabel}</p>
                <p className="text-xs text-foreground/50">Coloris uni</p>
              </div>
            </div>
          )}


          <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border px-6 py-4">
            <p className="text-sm font-medium text-foreground">{toileLabel}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toile Orchestra by Dickson · Acrylique teint masse · Garantie 10 ans
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToileCloseUpDialog;
