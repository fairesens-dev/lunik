import AnimatedSection from "@/components/AnimatedSection";
import { MapPin } from "lucide-react";
import factoryImg from "@/assets/factory-normandy.jpg";

const NormandySection = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pb-6">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/[0.06] border border-border/60 md:p-8 md:min-h-[220px]">
          {/* France map + factory circle */}
          <div className="relative w-full md:absolute md:-right-4 md:top-1/2 md:-translate-y-[40%] md:w-[65%] order-2 md:order-none">
            <svg viewBox="30 -20 460 470" className="w-full h-full" fill="none">
              <defs>
                <clipPath id="factory-circle-clip">
                  <circle cx="245" cy="130" r="70" />
                </clipPath>
              </defs>

              {/* France silhouette — subtle background */}
              <path
                d="M220 18 C230 14 240 12 265 15 C275 10 285 8 310 14 C322 11 335 10 355 18 C362 24 370 30 385 25 C392 30 400 35 410 50 C415 58 420 68 425 90 C428 100 430 110 435 130 C437 140 440 150 438 170 C440 180 442 190 435 210 C438 220 440 230 430 250 C425 260 420 268 425 288 C420 296 415 305 400 318 C392 324 385 330 370 345 C362 350 355 355 340 368 C332 374 325 380 310 390 C302 394 295 398 280 405 C272 410 265 415 250 420 C242 422 235 425 218 428 C208 430 200 430 185 425 C178 422 170 418 155 408 C148 402 142 395 130 380 C125 372 120 365 108 348 C104 340 100 330 92 312 C88 304 85 295 80 278 C78 268 78 260 75 242 C76 234 78 225 82 208 C80 198 80 190 85 172 C88 164 90 155 95 138 C98 130 100 122 108 108 C112 102 115 95 125 82 C130 76 135 70 148 58 C154 52 160 48 175 38 C182 33 190 28 205 22 C212 20 220 18 220 18Z"
                className="fill-primary/[0.04] stroke-primary/[0.12]"
                strokeWidth="1.5"
              />

              {/* Factory image in circle */}
              <image
                href={factoryImg}
                x="170"
                y="55"
                width="150"
                height="150"
                clipPath="url(#factory-circle-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="245" cy="130" r="70" className="stroke-primary/20" strokeWidth="2" fill="none" />

              {/* Workshop marker + label */}
              <circle cx="248" cy="208" r="4" fill="white" fillOpacity="0.9" />
              <circle cx="248" cy="208" r="2.5" className="fill-accent" />
              <text x="260" y="213" className="fill-accent" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="600">Notre atelier</text>

              {/* City labels — more visible */}
              <circle cx="305" cy="210" r="3.5" className="fill-muted-foreground/40" />
              <text x="315" y="214" className="fill-muted-foreground/60" fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="500">Paris</text>

              <circle cx="155" cy="230" r="3" className="fill-muted-foreground/35" />
              <text x="122" y="245" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Rennes</text>

              <circle cx="365" cy="320" r="3" className="fill-muted-foreground/35" />
              <text x="375" y="324" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Lyon</text>

              <circle cx="195" cy="355" r="3" className="fill-muted-foreground/35" />
              <text x="158" y="370" className="fill-muted-foreground/50" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Bordeaux</text>

              <circle cx="340" cy="390" r="3" className="fill-muted-foreground/30" />
              <text x="350" y="394" className="fill-muted-foreground/45" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">Marseille</text>
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-sm p-6 md:p-0">
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
