import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";

const rows = [
  {
    label: "TOILE",
    title: "Toile Dickson — Le meilleur de la protection solaire",
    body: "Plus de 200 coloris disponibles. Résistante aux UV, à la pluie et aux décolorations. La toile Dickson est la référence mondiale du secteur, utilisée par les plus grands fabricants.",
    specs: [
      "Traitement anti-taches et anti-moisissures",
      "Résistance UV classement 5/5",
      "Garantie 5 ans",
    ],
    imageLabel: "PHOTO TOILE DICKSON",
    reverse: false,
  },
  {
    label: "STRUCTURE",
    title: "Armature aluminium — Robustesse et élégance",
    body: "Profilés aluminium extrudé thermolaqué, traitement anti-corrosion. Notre coffre intégral protège la toile des intempéries quand le store est replié. Aucun entretien nécessaire.",
    specs: [
      "Aluminium extrudé haute résistance",
      "Coffre intégral étanche",
      "Sans entretien",
    ],
    imageLabel: "PHOTO ARMATURE DETAIL",
    reverse: true,
  },
  {
    label: "MOTORISATION",
    title: "Motorisation Somfy io — Confort absolu",
    body: "Pilotez votre store depuis une télécommande, un interrupteur mural ou votre smartphone via l'application TaHoma de Somfy. Compatible avec les assistants vocaux Google et Alexa.",
    specs: [
      "Application TaHoma iOS & Android",
      "Compatible Google Home & Alexa",
      "Détecteur de vent en option",
    ],
    imageLabel: "PHOTO MOTORISATION SOMFY",
    reverse: false,
  },
];

const ProductFeaturesSection = () => (
  <section id="features" className="py-28 lg:py-36 bg-card">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
            Conçu pour durer.
            <br />
            <span className="italic">Pensé pour vous.</span>
          </h2>
          <p className="text-muted-foreground text-sm">Un store coffre haut de gamme où chaque détail compte.</p>
        </div>
      </AnimatedSection>

      <div className="space-y-24">
        {rows.map((row, i) => (
          <AnimatedSection key={row.label} delay={i * 0.1}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${row.reverse ? "lg:direction-rtl" : ""}`}>
              <div className={`${row.reverse ? "lg:order-2" : ""}`}>
                <div className="aspect-[4/3] bg-stone-200 flex items-center justify-center">
                  <span className="text-stone-400 uppercase tracking-widest text-xs font-sans">{row.imageLabel}</span>
                </div>
              </div>
              <div className={`${row.reverse ? "lg:order-1" : ""}`}>
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-sans font-medium">{row.label}</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light mb-4">{row.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{row.body}</p>
                <div className="space-y-2">
                  {row.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-sm text-foreground">
                      <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProductFeaturesSection;
