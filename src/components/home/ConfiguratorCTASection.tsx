import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const steps = ["Dimensions", "Toile", "Armature", "Options", "Commande"];

const ConfiguratorCTASection = () => (
  <section className="py-28 lg:py-36 bg-[hsl(0,0%,10%)]">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <AnimatedSection>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-6 font-sans font-medium">
          Configurateur en ligne
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
          Votre store en <span className="italic">quelques clics</span>
        </h2>
        <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Choisissez vos dimensions, votre couleur de toile, votre armature et vos options. Obtenez votre prix immédiatement.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="flex items-center justify-center gap-0 mb-14 flex-wrap">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white text-xs font-medium">
                  {i + 1}
                </span>
                <span className="text-white/50 text-xs uppercase tracking-wider">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 md:w-12 h-px bg-white/20 mx-2 mb-6" />
              )}
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <Link to="/store-coffre">
          <Button variant="outline" className="border-white text-white px-10 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-white hover:text-foreground transition-colors h-auto bg-transparent">
            Lancer le configurateur →
          </Button>
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default ConfiguratorCTASection;
