import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";
import factoryImg from "@/assets/factory-normandy.jpg";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/[0.06] border border-border/60 p-8 md:p-10">
          {/* France + Normandy map */}
          <div className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-52 md:w-72">
            <svg viewBox="0 0 500 480" className="w-full h-full" fill="none">
              <defs>
                <clipPath id="normandy-clip">
                  <path d="M168 155 L155 140 L142 137 L138 125 L146 113 L142 100 L150 88 L162 84 L174 76 L170 64 L178 56 L190 52 L202 56 L210 47 L222 52 L232 45 L244 50 L254 43 L266 48 L274 56 L286 52 L298 56 L310 50 L322 56 L330 64 L334 76 L342 84 L346 96 L338 108 L342 120 L334 130 L326 136 L318 148 L306 154 L294 160 L280 164 L268 168 L256 166 L244 170 L232 168 L222 172 L210 168 L198 172 L186 168 L174 164 L168 155Z" />
                </clipPath>
              </defs>

              {/* France silhouette — subtle background */}
              <path
                d="M220 18 L240 12 L265 15 L285 8 L310 14 L335 10 L355 18 L370 30 L385 25 L400 35 L410 50 L420 68 L425 90 L430 110 L435 130 L440 150 L438 170 L442 190 L435 210 L440 230 L430 250 L420 268 L425 288 L415 305 L400 318 L385 330 L370 345 L355 355 L340 368 L325 380 L310 390 L295 398 L280 405 L265 415 L250 420 L235 425 L218 428 L200 430 L185 425 L170 418 L155 408 L142 395 L130 380 L120 365 L108 348 L100 330 L92 312 L85 295 L80 278 L78 260 L75 242 L78 225 L82 208 L80 190 L85 172 L90 155 L95 138 L100 122 L108 108 L115 95 L125 82 L135 70 L148 58 L160 48 L175 38 L190 28 L205 22 L220 18Z"
                className="fill-primary/[0.03] stroke-primary/[0.08]"
                strokeWidth="1"
              />

              {/* Normandy with factory image */}
              <image
                href={factoryImg}
                x="130"
                y="40"
                width="230"
                height="160"
                clipPath="url(#normandy-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              {/* Normandy border */}
              <path
                d="M168 155 L155 140 L142 137 L138 125 L146 113 L142 100 L150 88 L162 84 L174 76 L170 64 L178 56 L190 52 L202 56 L210 47 L222 52 L232 45 L244 50 L254 43 L266 48 L274 56 L286 52 L298 56 L310 50 L322 56 L330 64 L334 76 L342 84 L346 96 L338 108 L342 120 L334 130 L326 136 L318 148 L306 154 L294 160 L280 164 L268 168 L256 166 L244 170 L232 168 L222 172 L210 168 L198 172 L186 168 L174 164 L168 155Z"
                className="stroke-primary/30"
                fill="none"
                strokeWidth="2"
              />

              {/* Workshop marker */}
              <circle cx="250" cy="110" r="10" className="fill-accent/25" />
              <circle cx="250" cy="110" r="4" className="fill-accent" />

              {/* City labels — subtle */}
              {/* Paris */}
              <circle cx="305" cy="195" r="2.5" className="fill-muted-foreground/30" />
              <text x="313" y="198" className="fill-muted-foreground/40" fontSize="9" fontFamily="DM Sans, sans-serif">Paris</text>

              {/* Rouen */}
              <circle cx="262" cy="148" r="2" className="fill-primary/40" />
              <text x="269" y="151" className="fill-primary/50" fontSize="8" fontFamily="DM Sans, sans-serif">Rouen</text>

              {/* Caen */}
              <circle cx="195" cy="125" r="2" className="fill-primary/40" />
              <text x="175" y="137" className="fill-primary/50" fontSize="8" fontFamily="DM Sans, sans-serif">Caen</text>

              {/* Le Havre */}
              <circle cx="225" cy="98" r="2" className="fill-primary/40" />
              <text x="205" y="93" className="fill-primary/50" fontSize="7.5" fontFamily="DM Sans, sans-serif">Le Havre</text>

              {/* Rennes */}
              <circle cx="155" cy="210" r="2" className="fill-muted-foreground/25" />
              <text x="130" y="222" className="fill-muted-foreground/30" fontSize="8" fontFamily="DM Sans, sans-serif">Rennes</text>

              {/* Lyon */}
              <circle cx="365" cy="310" r="2" className="fill-muted-foreground/20" />
              <text x="373" y="313" className="fill-muted-foreground/25" fontSize="8" fontFamily="DM Sans, sans-serif">Lyon</text>

              {/* Bordeaux */}
              <circle cx="195" cy="345" r="2" className="fill-muted-foreground/20" />
              <text x="165" y="357" className="fill-muted-foreground/25" fontSize="8" fontFamily="DM Sans, sans-serif">Bordeaux</text>
            </svg>
          </div>

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
