import AnimatedSection from "@/components/AnimatedSection";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <AnimatedSection>
        <div className="flex items-center justify-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 300 260" className="w-full h-full" fill="none">
              <path
                d="M45 180 L30 160 L15 155 L10 140 L20 125 L15 110 L25 95 L40 90 L55 80 L50 65 L60 55 L75 50 L90 55 L100 45 L115 50 L130 42 L145 48 L160 40 L175 45 L185 55 L200 50 L215 55 L230 48 L245 55 L255 65 L260 80 L270 90 L275 105 L265 120 L270 135 L260 148 L250 155 L240 170 L225 178 L210 185 L195 190 L180 195 L165 192 L150 198 L135 195 L120 200 L105 195 L90 200 L75 195 L60 190 L45 180Z"
                className="fill-primary/10 stroke-primary/25"
                strokeWidth="2"
              />
              <circle cx="155" cy="120" r="8" className="fill-primary/50" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Fabriqué en <span className="text-primary">Normandie</span>
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default NormandySection;
