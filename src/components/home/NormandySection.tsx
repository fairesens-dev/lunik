import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";

const NormandySection = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Text */}
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-2">
                Fabrication française
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
                Fabriqué en Normandie
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Chaque store est assemblé dans notre atelier normand, avec un savoir-faire local et des matériaux sélectionnés pour durer.
              </p>
            </div>

            {/* Normandy map silhouette */}
            <div className="relative w-40 h-36 md:w-48 md:h-44 flex-shrink-0">
              <svg
                viewBox="0 0 300 260"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified Normandy silhouette */}
                <path
                  d="M45 180 L30 160 L15 155 L10 140 L20 125 L15 110 L25 95 L40 90 L55 80 L50 65 L60 55 L75 50 L90 55 L100 45 L115 50 L130 42 L145 48 L160 40 L175 45 L185 55 L200 50 L215 55 L230 48 L245 55 L255 65 L260 80 L270 90 L275 105 L265 120 L270 135 L260 148 L250 155 L240 170 L225 178 L210 185 L195 190 L180 195 L165 192 L150 198 L135 195 L120 200 L105 195 L90 200 L75 195 L60 190 L45 180Z"
                  className="fill-primary/[0.07] stroke-primary/20"
                  strokeWidth="1.5"
                />
                {/* Workshop marker */}
                <g transform="translate(155, 120)">
                  <circle r="12" className="fill-primary/15" />
                  <circle r="5" className="fill-primary/60" />
                  <circle r="2" className="fill-primary" />
                </g>
              </svg>
              {/* Label */}
              <div className="absolute bottom-1 right-2 flex items-center gap-1 text-primary/60">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-medium tracking-wide">Notre atelier</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default NormandySection;
