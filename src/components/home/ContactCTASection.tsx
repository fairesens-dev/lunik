import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const ContactCTASection = () => (
  <section className="py-16 lg:py-20 bg-gradient-to-br from-[hsl(20,15%,10%)] to-[hsl(25,20%,15%)]">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <AnimatedSection>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
          Une question avant de <span className="text-primary">configurer</span> ?
        </h2>
        <p className="text-white/50 text-lg mb-10">
          Notre équipe est disponible du lundi au vendredi, de 9h à 18h.
        </p>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+33100000000">
            <Button variant="ghost" className="text-white border border-white/20 px-8 py-5 rounded-full tracking-[0.2em] uppercase text-sm font-medium hover:bg-white/10 transition-colors h-auto">
              Nous appeler
            </Button>
          </a>
          <Link to="/contact">
            <Button variant="gradient" className="px-8 py-5 rounded-full tracking-[0.2em] uppercase text-sm font-medium h-auto">
              Envoyer un message
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ContactCTASection;
