import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const ProductHeroSection = () => (
  <section className="relative min-h-screen flex -mt-20">
    <div className="w-full lg:w-[55%] flex items-center px-6 lg:px-16 xl:px-24 pt-32 pb-20">
      <div className="max-w-xl">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 font-sans font-medium">
            Store Coffre · Fabrication Française Sur-Mesure
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-8 text-foreground">
            Le store qui
            <br />
            <span className="italic">redéfinit l'extérieur.</span>
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.25}>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
            Aluminium premium, toile Dickson, motorisation Somfy. Fabriqué sur-mesure en France selon vos dimensions exactes. Livré ou installé en 4 à 5 semaines.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.35}>
          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#configurator">
              <Button className="bg-primary text-primary-foreground px-8 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-accent-light transition-colors h-auto">
                Configurer maintenant
              </Button>
            </a>
            <a href="#features">
              <Button variant="outline" className="border-foreground text-foreground px-8 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-foreground hover:text-background transition-colors h-auto">
                Voir les caractéristiques
              </Button>
            </a>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.45}>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span>⭐ 4.9/5 Trustpilot</span>
            <span>🇫🇷 Made in France</span>
            <span>🔧 Garantie 5 ans</span>
          </div>
        </AnimatedSection>
      </div>
    </div>
    <div className="hidden lg:block w-[45%] relative">
      <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
        <span className="text-stone-400 uppercase tracking-widest text-sm font-sans">Photo hero produit</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-300/60 to-transparent" />
    </div>
  </section>
);

export default ProductHeroSection;
