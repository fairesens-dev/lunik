import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const ProductFinalCTA = () => (
  <section className="py-28 lg:py-36 bg-gradient-to-br from-primary to-sage-dark text-primary-foreground">
    <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
      <AnimatedSection>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6">
          Prêt à transformer
          <br />
          <span className="text-primary">votre extérieur ?</span>
        </h2>
        <p className="text-white/80 text-sm mb-10 max-w-md mx-auto">
          Configurez votre store en 2 minutes. Prix immédiat, sans engagement.
        </p>
        <a href="#configurator">
          <Button className="bg-white text-foreground px-10 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-white/90 transition-colors h-auto">
            Configurer mon store
          </Button>
        </a>
      </AnimatedSection>
    </div>
  </section>
);

export default ProductFinalCTA;
