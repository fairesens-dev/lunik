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
            <svg viewBox="0 0 500 500" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
              <defs>
                <clipPath id="factory-circle-clip">
                  <circle cx="280" cy="100" r="55" />
                </clipPath>
              </defs>

              {/* France silhouette - larger, filling background */}
              <path
                d="M180 10 L200 8 L225 5 L250 12 L275 8 L300 15 L325 12 L350 20 L375 18 L400 30 L420 45 L435 65 L440 85 L438 105 L445 130 L442 155 L435 175 L428 195 L420 215 L425 240 L432 265 L435 290 L430 315 L418 340 L405 360 L390 378 L375 392 L355 405 L335 415 L315 425 L295 430 L275 428 L255 420 L235 410 L215 395 L198 380 L182 360 L170 340 L160 315 L152 290 L148 265 L150 240 L155 215 L150 190 L142 170 L135 150 L130 130 L132 110 L138 90 L148 72 L160 55 L172 40 L185 25 Z"
                className="fill-primary/[0.05] stroke-primary/[0.10]"
                strokeWidth="1.5"
              />

              {/* Factory image in circle */}
              <image
                xlinkHref={factoryImg}
                href={factoryImg}
                x="220"
                y="40"
                width="120"
                height="120"
                clipPath="url(#factory-circle-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="280" cy="100" r="55" className="stroke-primary/20" strokeWidth="2" fill="none" />

              {/* Workshop marker + label (Normandie) */}
              <circle cx="265" cy="175" r="5" fill="white" fillOpacity="0.9" />
              <circle cx="265" cy="175" r="3" className="fill-accent" />
              <text x="278" y="180" className="fill-accent" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="600">Notre atelier</text>

              {/* --- Villes --- */}
              {/* Paris */}
              <circle cx="320" cy="190" r="3.5" className="fill-muted-foreground/40" />
              <text x="330" y="194" className="fill-muted-foreground/60" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Paris</text>

              {/* Lille */}
              <circle cx="310" cy="140" r="2.5" className="fill-muted-foreground/30" />
              <text x="320" y="144" className="fill-muted-foreground/45" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Lille</text>

              {/* Strasbourg */}
              <circle cx="420" cy="180" r="2.5" className="fill-muted-foreground/30" />
              <text x="395" y="172" className="fill-muted-foreground/45" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Strasbourg</text>

              {/* Rennes */}
              <circle cx="185" cy="215" r="2.5" className="fill-muted-foreground/30" />
              <text x="152" y="228" className="fill-muted-foreground/45" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Rennes</text>

              {/* Nantes */}
              <circle cx="190" cy="260" r="2.5" className="fill-muted-foreground/30" />
              <text x="155" y="264" className="fill-muted-foreground/45" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Nantes</text>

              {/* Tours */}
              <circle cx="270" cy="250" r="2.5" className="fill-muted-foreground/25" />
              <text x="280" y="254" className="fill-muted-foreground/40" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Tours</text>

              {/* Dijon */}
              <circle cx="380" cy="240" r="2.5" className="fill-muted-foreground/25" />
              <text x="390" y="244" className="fill-muted-foreground/40" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Dijon</text>

              {/* Lyon */}
              <circle cx="380" cy="310" r="3" className="fill-muted-foreground/35" />
              <text x="390" y="314" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Lyon</text>

              {/* Bordeaux */}
              <circle cx="225" cy="350" r="3" className="fill-muted-foreground/35" />
              <text x="188" y="364" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Bordeaux</text>

              {/* Toulouse */}
              <circle cx="280" cy="395" r="2.5" className="fill-muted-foreground/30" />
              <text x="290" y="399" className="fill-muted-foreground/45" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Toulouse</text>

              {/* Montpellier */}
              <circle cx="335" cy="390" r="2.5" className="fill-muted-foreground/30" />
              <text x="345" y="394" className="fill-muted-foreground/45" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Montpellier</text>

              {/* Marseille */}
              <circle cx="375" cy="400" r="3" className="fill-muted-foreground/30" />
              <text x="385" y="404" className="fill-muted-foreground/45" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Marseille</text>

              {/* Nice */}
              <circle cx="420" cy="380" r="2.5" className="fill-muted-foreground/25" />
              <text x="430" y="384" className="fill-muted-foreground/40" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">Nice</text>
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
