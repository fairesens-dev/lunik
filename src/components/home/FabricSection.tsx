import AnimatedSection from "@/components/AnimatedSection";
import { Check } from "lucide-react";

const specs = [
  { label: "Composition", value: "100 % acrylique teint masse" },
  { label: "Poids", value: "290 g/m²" },
  { label: "Laize", value: "120 cm" },
  { label: "Certification", value: "OEKO-TEX Standard 100 – classe II" },
  { label: "Garantie", value: "10 ans" },
];

const benefits = [
  "Protection UV, chaleur et luminosité",
  "Traitement Cleanguard anti-salissures",
  "Résistance intempéries et déchirures",
  "Entretien simple à l'eau savonneuse",
  "Contact direct avec la peau certifié",
  "173 coloris disponibles",
];

const FabricSection = () => (
  <section className="py-16 lg:py-20 bg-card">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src="/images/store-toile-detail.webp"
              alt="Détail de la toile Orchestra Dickson sur store coffre"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-sans font-medium">
              Toile Orchestra by Dickson
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight">
              LA référence en matière
              <br />
              <span className="italic">de protection solaire</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              La toile Orchestra est composée de fibre acrylique teint masse avec traitement 
              Cleanguard, lui conférant une durabilité exceptionnelle des couleurs et une résistance 
              remarquable aux intempéries. Certifiée OEKO-TEX classe II, elle est adaptée au 
              contact direct avec la peau.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((s) => (
                  <div key={s.label}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-medium text-foreground mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default FabricSection;
