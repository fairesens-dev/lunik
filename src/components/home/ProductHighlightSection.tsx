import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { ShieldCheck, Sun, Droplets } from "lucide-react";

const blocks = [
  {
    overline: "Structure",
    title: "Coffre intégral,\nprotection maximale",
    desc: "Notre coffre intégral en aluminium thermolaqué protège la toile et le mécanisme des intempéries. Zéro entretien, durabilité maximale.",
    features: [
      { icon: ShieldCheck, text: "Aluminium extrudé anti-corrosion" },
      { icon: Sun, text: "Coffre étanche, toile protégée" },
      { icon: Droplets, text: "Sans entretien" },
    ],
    image: "/images/store-salon-vide.webp",
    imageAlt: "Store coffre déployé au-dessus d'un salon de jardin",
    cta: { label: "Configurer mon store →", href: "/configurateur" },
  },
  {
    overline: "Toile",
    title: "Toile Dickson,\nla référence mondiale",
    desc: "Toile Orchestra by Dickson disponible en 173 coloris. Acrylique teint masse avec traitement Cleanguard anti-salissures. Résistance UV classement 5/5.",
    features: [
      { icon: Sun, text: "Protection UV 5/5" },
      { icon: ShieldCheck, text: "Garantie toile 10 ans" },
      { icon: Droplets, text: "Traitement Cleanguard" },
    ],
    image: "/images/store-toile-detail.webp",
    imageAlt: "Détail de la toile Dickson du store coffre",
  },
];

const ProductHighlightSection = () => {
  const { content } = useContent();

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 space-y-24">
        {blocks.map((block, idx) => {
          const reversed = idx % 2 !== 0;
          return (
            <div
              key={block.overline}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reversed ? "lg:[direction:rtl]" : ""}`}
            >
              {/* Image */}
              <AnimatedSection delay={reversed ? 0.15 : 0}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl lg:[direction:ltr]">
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>

              {/* Content */}
              <AnimatedSection delay={reversed ? 0 : 0.15}>
                <div className="space-y-6 lg:[direction:ltr]">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                    {block.overline}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]">
                    {block.title.split("\n").map((line, i) => (
                      <span key={i}>{i > 0 && <br />}{line}</span>
                    ))}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    {block.desc}
                  </p>

                  {/* Feature list */}
                  <div className="space-y-3 pt-2">
                    {block.features.map((f) => (
                      <div key={f.text} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <f.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {block.cta && (
                    <a href={block.cta.href}>
                      <Button className="px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto mt-2">
                        {block.cta.label}
                      </Button>
                    </a>
                  )}
                </div>
              </AnimatedSection>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductHighlightSection;
