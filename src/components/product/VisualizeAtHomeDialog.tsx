import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Download, Camera, X, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface VisualizeAtHomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toileColor: { hex: string; label: string; photoUrl?: string };
  armatureColor: { hex: string; label: string };
  options: { motorisation: boolean; led: boolean; packConnect: boolean };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const VisualizeAtHomeDialog = ({
  open,
  onOpenChange,
  toileColor,
  armatureColor,
  options,
}: VisualizeAtHomeDialogProps) => {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Format accepté : JPG, PNG ou WebP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Fichier trop volumineux (max 5 Mo)");
      return;
    }
    setError(null);
    setResultImage(null);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleGenerate = async () => {
    if (!uploadedPhoto) return;
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("project-store-on-photo", {
        body: {
          photo: uploadedPhoto,
          toileColorHex: toileColor.hex,
          toileColorLabel: toileColor.label,
          toilePhotoUrl: toileColor.photoUrl,
          armatureColorHex: armatureColor.hex,
          armatureColorLabel: armatureColor.label,
          led: options.led || options.packConnect,
        },
      });

      if (fnError) throw fnError;
      if (data?.imageUrl) {
        setResultImage(data.imageUrl);
      } else {
        throw new Error("No image returned");
      }
    } catch (e) {
      console.error("Projection failed:", e);
      setError("La génération a échoué. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `lunik-store-chez-moi.png`;
    link.click();
  };

  const reset = () => {
    setUploadedPhoto(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Visualiser mon store chez moi
          </DialogTitle>
          <DialogDescription>
            Uploadez une photo de votre terrasse et visualisez votre store configuré en situation réelle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload zone or preview */}
          {!uploadedPhoto ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors",
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <Upload className="w-10 h-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Glissez une photo de votre terrasse</p>
                <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir · JPG, PNG, WebP · Max 5 Mo</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show result or uploaded photo */}
              <div className="relative rounded-xl overflow-hidden border border-border">
                {loading && (
                  <div className="absolute inset-0 z-10">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-muted-foreground">Projection en cours…</span>
                      </div>
                    </div>
                  </div>
                )}
                <img
                  src={resultImage || uploadedPhoto}
                  alt={resultImage ? "Projection du store sur votre terrasse" : "Votre terrasse"}
                  className="w-full max-h-[50vh] object-contain"
                />
                {resultImage && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" />
                    Projection IA
                  </div>
                )}
              </div>

              {/* Configuration summary */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-secondary rounded-full px-3 py-1 text-xs">Toile : {toileColor.label}</span>
                <span className="bg-secondary rounded-full px-3 py-1 text-xs">Armature : {armatureColor.label}</span>
                {(options.led || options.packConnect) && (
                  <span className="bg-secondary rounded-full px-3 py-1 text-xs">💡 LED</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={reset} className="rounded-full gap-2">
                  <X className="w-4 h-4" />
                  Changer la photo
                </Button>
                {!resultImage && !loading && (
                  <Button onClick={handleGenerate} className="flex-1 rounded-full gap-2">
                    <Camera className="w-4 h-4" />
                    Générer la projection
                  </Button>
                )}
                {resultImage && (
                  <>
                    <Button onClick={handleGenerate} variant="outline" className="rounded-full gap-2">
                      Regénérer
                    </Button>
                    <Button onClick={handleDownload} className="flex-1 rounded-full gap-2">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizeAtHomeDialog;
