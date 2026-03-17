import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";
import atelierBg from "@/assets/store-atelier.jpg";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pb-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl min-h-[420px] md:min-h-[300px] flex flex-col items-center justify-end">
          {/* Background image */}
          <img
            src={atelierBg}
            alt="Atelier de fabrication de stores en Normandie"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          {/* Content */}
          <div className="relative z-10 max-w-sm p-6 md:p-8 text-center">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/80 font-semibold">
                Fabrication locale
              </span>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
              Conçu et assemblé en{" "}
              <span className="text-white/60">Normandie</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Notre atelier normand sélectionne chaque composant et assemble votre store à la main — un savoir-faire artisanal, sans intermédiaire.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default NormandySection;
