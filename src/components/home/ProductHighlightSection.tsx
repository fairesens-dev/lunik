import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";

const ProductHighlightSection = () => {
  const { content } = useContent();

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
              {content.homepage.productSectionTitle.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{i > 0 ? <span className="italic">{line}</span> : line}</span>
              ))}
            </h2>
            <p className="text-muted-foreground text-lg">{content.homepage.productSectionSubtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="/images/store-salon-vide.webp"
                alt="Store coffre déployé au-dessus d'un salon de jardin"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Notre store coffre allie performance technique et design épuré. Conçu pour s'intégrer 
                à toutes les architectures, il protège votre terrasse du soleil tout en sublimant 
                votre façade. Son coffre intégral préserve la toile et le mécanisme des intempéries, 
                pour une durabilité maximale.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Toile Dickson résistante aux UV avec plus de 200 coloris, armature en aluminium 
                thermolaqué sans entretien, motorisation Somfy pilotable depuis votre smartphone 
                et éclairage LED intégré pour prolonger vos soirées en extérieur.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Chaque store est fabriqué en France selon vos dimensions exactes, de 150 à 600 cm 
                de largeur. Un produit sur-mesure, au juste prix, livré chez vous en 4 à 5 semaines.
              </p>
              <a href="#configurator">
                <Button className="bg-primary text-primary-foreground px-8 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-accent-light transition-colors h-auto mt-2">
                  Configurer mon store →
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlightSection;
