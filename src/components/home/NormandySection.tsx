import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";
import factoryImg from "@/assets/factory-normandy.jpg";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pb-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/[0.06] border border-border/60 min-h-[420px] md:min-h-[300px] flex flex-col">
          {/* SVG map as full background */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 500 440" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
              <defs>
                <clipPath id="factory-circle-clip">
                  <circle cx="320" cy="120" r="70" />
                </clipPath>
              </defs>

              {/* France silhouette */}
              <path
                d="M220 30 L260 25 L290 35 L310 30 L340 40 L370 38 L400 50 L420 65 L430 90 L425 120 L435 150 L430 180 L420 200 L410 230 L420 260 L430 290 L425 310 L410 330 L395 350 L380 370 L365 385 L340 400 L310 410 L280 405 L250 395 L220 380 L195 365 L175 345 L160 320 L150 295 L145 270 L148 245 L155 220 L150 195 L140 175 L130 155 L135 130 L145 110 L155 90 L170 70 L190 55 L205 42 Z"
                className="fill-primary/[0.04] stroke-primary/[0.08]"
                strokeWidth="1.5"
              />

              {/* Factory image in circle */}
              <image
                xlinkHref={factoryImg}
                href={factoryImg}
                x="245"
                y="45"
                width="150"
                height="150"
                clipPath="url(#factory-circle-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="320" cy="120" r="70" className="stroke-primary/20" strokeWidth="2" fill="none" />

              {/* Workshop marker + label */}
              <circle cx="290" cy="210" r="4" fill="white" fillOpacity="0.9" />
              <circle cx="290" cy="210" r="2.5" className="fill-accent" />
              <text x="302" y="215" className="fill-accent" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="600">Notre atelier</text>

              {/* City labels */}
              <circle cx="350" cy="220" r="3.5" className="fill-muted-foreground/40" />
              <text x="360" y="224" className="fill-muted-foreground/60" fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="500">Paris</text>

              <circle cx="180" cy="240" r="3" className="fill-muted-foreground/35" />
              <text x="148" y="255" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Rennes</text>

              <circle cx="400" cy="320" r="3" className="fill-muted-foreground/35" />
              <text x="410" y="324" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Lyon</text>

              <circle cx="220" cy="360" r="3" className="fill-muted-foreground/35" />
              <text x="183" y="375" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Bordeaux</text>

              <circle cx="370" cy="395" r="3" className="fill-muted-foreground/30" />
              <text x="380" y="399" className="fill-muted-foreground/45" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Marseille</text>
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-sm p-6 md:p-8 bg-card/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none rounded-xl m-4 md:m-0 mt-auto self-end">
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
