import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/[0.06] border border-border/60 p-8 md:p-10">
          {/* Background decorative map */}
          <svg
            viewBox="0 0 300 260"
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-40 md:w-56 h-auto opacity-100"
            fill="none"
          >
            <path
              d="M45 180 L30 160 L15 155 L10 140 L20 125 L15 110 L25 95 L40 90 L55 80 L50 65 L60 55 L75 50 L90 55 L100 45 L115 50 L130 42 L145 48 L160 40 L175 45 L185 55 L200 50 L215 55 L230 48 L245 55 L255 65 L260 80 L270 90 L275 105 L265 120 L270 135 L260 148 L250 155 L240 170 L225 178 L210 185 L195 190 L180 195 L165 192 L150 198 L135 195 L120 200 L105 195 L90 200 L75 195 L60 190 L45 180Z"
              className="fill-primary/[0.06] stroke-primary/20"
              strokeWidth="1.5"
            />
            {/* Pulse marker for workshop location */}
            <circle cx="155" cy="115" r="18" className="fill-accent/10" />
            <circle cx="155" cy="115" r="10" className="fill-accent/20" />
            <circle cx="155" cy="115" r="4" className="fill-accent" />
          </svg>

          {/* Content */}
          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">
                Fabrication locale
              </span>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground mb-2">
              Conçu et assemblé en{" "}
              <span className="text-accent">Normandie</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Notre atelier normand sélectionne chaque composant et assemble votre store à la main — un savoir-faire artisanal, sans intermédiaire.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default NormandySection;
