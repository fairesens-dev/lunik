import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DynamicProductVisualProps {
  toileColor: { hex: string; label: string; photoUrl?: string };
  armatureColor: { hex: string; label: string };
  options: { motorisation: boolean; led: boolean; packConnect: boolean };
  width: number;
  projection: number;
  className?: string;
  compact?: boolean;
}

const DynamicProductVisual = ({
  toileColor,
  armatureColor,
  options,
  width,
  projection,
  className,
  compact = false,
}: DynamicProductVisualProps) => {
  const aspectRatio = useMemo(
    () => Math.min(Math.max(projection / width, 0.3), 0.8),
    [projection, width]
  );

  const showLed = options.led || options.packConnect;
  const showMotor = options.motorisation || options.packConnect;
  const hasPhoto = !!toileColor.photoUrl;

  // SVG dynamic values
  const armHeight = Math.round(100 * aspectRatio);
  const frontBarY = 108 + armHeight;
  const toileHeight = `${28 * aspectRatio}%`;
  const toileTop = `37%`;
  const ledTop = `${35 + 28 * aspectRatio}%`;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-sm transition-all duration-300",
        className
      )}
      style={{ aspectRatio: "4/3" }}
    >
      {hasPhoto ? (
        /* Real photo mode */
        <img
          src={toileColor.photoUrl}
          alt={`Store avec toile ${toileColor.label}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          {/* Layer 0: Background scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-stone-200" />
          {/* Terrace floor */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-300 to-stone-200" />

          {/* Layer 1: Armature SVG */}
          <svg
            viewBox="0 0 400 300"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Wall mount brackets */}
            <rect x="48" y="72" width="20" height="44" fill={armatureColor.hex} rx="2" />
            <rect x="332" y="72" width="20" height="44" fill={armatureColor.hex} rx="2" />
            {/* Coffre box */}
            <rect x="55" y="80" width="290" height="28" fill={armatureColor.hex} rx="3" />
            {/* Coffre highlight */}
            <rect x="55" y="80" width="290" height="6" fill="white" opacity="0.15" rx="3" />
            {/* Left arm */}
            <rect x="72" y="108" width="10" height={armHeight} fill={armatureColor.hex} rx="1" />
            {/* Right arm */}
            <rect x="318" y="108" width="10" height={armHeight} fill={armatureColor.hex} rx="1" />
            {/* Front bar */}
            <rect x="55" y={frontBarY} width="290" height="8" fill={armatureColor.hex} rx="2" />
            {/* Front bar highlight */}
            <rect x="55" y={frontBarY} width="290" height="2" fill="white" opacity="0.2" rx="1" />
          </svg>

          {/* Layer 2: Toile fabric */}
          <div
            className="absolute transition-colors duration-300"
            style={{
              top: toileTop,
              left: "15%",
              width: "70%",
              height: toileHeight,
              backgroundColor: toileColor.hex,
              opacity: 0.92,
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 9px)`,
              transform: `perspective(400px) rotateX(${8 * aspectRatio}deg)`,
              transformOrigin: "top",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
        </>
      )}

      {/* Layer 3: LED glow */}
      {showLed && (
        <div
          className="absolute transition-opacity duration-500"
          style={{
            top: ledTop,
            left: "15%",
            width: "70%",
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, #FFF3B0, #FFFDE7, #FFF3B0, transparent)",
            boxShadow: "0 0 12px 4px rgba(255, 243, 176, 0.6)",
            borderRadius: "2px",
          }}
        />
      )}

      {/* Layer 4: Motor badge */}
      {showMotor && !compact && (
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
          <span className="text-xs">⚡</span>
          <span className="text-xs font-medium text-foreground">Motorisé</span>
        </div>
      )}

      {/* Layer 5: Dimension overlay */}
      {!compact && (
        <>
          <div className="absolute bottom-3 left-3 bg-foreground/40 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-background text-xs font-mono">
              {width} × {projection} cm
            </span>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-1">
            <div
              className="w-4 h-4 rounded-full border border-background/50 shadow"
              style={{ backgroundColor: toileColor.hex }}
              title={`Toile : ${toileColor.label}`}
            />
            <div
              className="w-4 h-4 rounded-full border border-background/50 shadow"
              style={{ backgroundColor: armatureColor.hex }}
              title={`Armature : ${armatureColor.label}`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicProductVisual;
