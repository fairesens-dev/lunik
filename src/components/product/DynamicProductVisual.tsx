import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface DynamicProductVisualProps {
  toileColor: { hex: string; label: string; photoUrl?: string };
  armatureColor: { hex: string; label: string };
  options: { motorisation: boolean; led: boolean; packConnect: boolean };
  width: number;
  projection: number;
  className?: string;
  compact?: boolean;
  fillContainer?: boolean;
  onLedToggle?: (led: boolean) => void;
}

// In-memory cache for generated images
const imageCache = new Map<string, string>();

function cacheKey(toileHex: string, armatureHex: string, led: boolean, photoUrl?: string) {
  return `${toileHex}-${armatureHex}-${led}-${photoUrl || ""}`;
}

const DynamicProductVisual = ({
  toileColor,
  armatureColor,
  options,
  className,
  compact = false,
  fillContainer = false,
}: DynamicProductVisualProps) => {
  const showLed = options.led || options.packConnect;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  const generateImage = useCallback(async (toileHex: string, toileLabel: string, armatureHex: string, armatureLabel: string, led: boolean, photoUrl?: string) => {
    const key = cacheKey(toileHex, armatureHex, led, photoUrl);

    // Check cache first
    if (imageCache.has(key)) {
      setImageUrl(imageCache.get(key)!);
      setImageLoaded(true);
      setLoading(false);
      setError(false);
      return;
    }

    // Abort previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setImageLoaded(false);
    setError(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-store-image", {
        body: {
          toileColorHex: toileHex,
          toileColorLabel: toileLabel,
          armatureColorHex: armatureHex,
          armatureColorLabel: armatureLabel,
          led,
          toilePhotoUrl: photoUrl,
        },
      });

      if (fnError) throw fnError;
      if (data?.imageUrl) {
        imageCache.set(key, data.imageUrl);
        setImageUrl(data.imageUrl);
        // Don't set loading=false yet — wait for onLoad
        setError(false);
      } else {
        throw new Error("No image returned");
      }
    } catch (e) {
      console.error("Image generation failed:", e);
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (compact) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      generateImage(toileColor.hex, toileColor.label, armatureColor.hex, armatureColor.label, showLed, toileColor.photoUrl);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [toileColor.hex, toileColor.label, toileColor.photoUrl, armatureColor.hex, armatureColor.label, showLed, compact, generateImage]);

  // Compact mode: show simple color preview
  if (compact) {
    return (
      <div className={cn("relative w-full overflow-hidden rounded-sm", className)} style={{ aspectRatio: "4/3" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-stone-200" />
        <div className="absolute top-[35%] left-[15%] w-[70%] h-[30%] transition-colors duration-300" style={{ backgroundColor: toileColor.hex, opacity: 0.9 }} />
      </div>
    );
  }

  const isVisible = imageUrl && imageLoaded && !loading;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-sm transition-all duration-300",
        className
      )}
      style={{ aspectRatio: "1.5/2" }}
    >
      {/* Loading skeleton — shown until image is fully loaded */}
      {!isVisible && !error && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Génération en cours…</span>
            </div>
          </div>
        </div>
      )}

      {/* AI-generated image (hidden until onLoad fires) */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Store banne avec toile ${toileColor.label} et armature ${armatureColor.label}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => {
            setImageLoaded(true);
            setLoading(false);
          }}
        />
      )}

      {/* Fallback on error */}
      {error && !imageUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
          <img
            src="/images/store-vue-ensemble.webp"
            alt="Store banne"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 bg-background/80 backdrop-blur-sm rounded px-4 py-2">
            <p className="text-xs text-muted-foreground">Aperçu indisponible</p>
          </div>
        </div>
      )}

      {/* LED indicator */}
      {showLed && isVisible && (
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm z-20">
          <span className="text-xs">💡</span>
          <span className="text-xs font-medium text-foreground">LED</span>
        </div>
      )}
    </div>
  );
};

export default DynamicProductVisual;
