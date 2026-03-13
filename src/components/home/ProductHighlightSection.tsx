import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";

const tags1 = ["Coffre intégral", "Aluminium thermolaqué", "Sans entretien"];
const tags2 = ["173 coloris Dickson", "Traitement Cleanguard", "Garantie 10 ans toile"];

const ProductHighlightSection = () => {
  const { content } = useContent();

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Block 1 — Image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <AnimatedSection>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src="/images/store-salon-vide.webp"
                alt="Store coffre déployé au-dessus d'un salon de jardin"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="space-y-6">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                {content.homepage.productSectionTitle.split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Notre store coffre allie performance technique et design épuré. Son coffre intégral 
                protège la toile et le mécanisme des intempéries, pour une durabilité maximale.
              </p>
              <div className="flex flex-wrap gap-2">
                {tags1.map((tag) => (
                  <span key={tag} className="border border-border rounded-full px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="/configurateur">
                <Button className="px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto mt-2">
                  Configurer mon store →
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>

        {/* Block 2 — Text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection delay={0.1}>
            <div className="space-y-6 lg:order-1">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Toile Dickson,<br />la référence mondiale
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Toile Orchestra by Dickson disponible en 173 coloris. Acrylique teint masse avec 
                traitement Cleanguard anti-salissures. Résistance UV classement 5/5.
              </p>
              <div className="flex flex-wrap gap-2">
                {tags2.map((tag) => (
                  <span key={tag} className="border border-border rounded-full px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <img
                src="/images/store-toile-detail.webp"
                alt="Détail de la toile Dickson du store coffre"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlightSection;
