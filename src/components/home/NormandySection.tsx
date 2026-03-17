import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";
import atelierImg from "@/assets/store-atelier.jpg";
import atelierMobileImg from "@/assets/store-atelier-mobile.jpg";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pb-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl min-h-[420px] md:min-h-[300px] flex flex-col">
          {/* Background images */}
          <img
            src={atelierMobileImg}
            alt="Atelier LuniK Perpignan"
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          />
          <img
            src={atelierImg}
            alt="Atelier LuniK Perpignan"
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 md:bg-gradient-to-r md:from-black/60 md:to-transparent" />

          {/* Content - centered on mobile, right-third on desktop */}
          <div className="relative z-10 flex items-end md:items-center justify-center md:justify-start p-6 md:p-8 flex-1">
            <div className="max-w-sm text-center md:text-left md:w-1/3">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-white/80 font-semibold">
                  Fabrication locale
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                Conçu et assemblé à <span className="text-accent">Perpignan</span>
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Notre atelier sélectionne chaque composant et assemble votre store à la main, un savoir-faire artisanal
                sans intermédiaire.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default NormandySection;
