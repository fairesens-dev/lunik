import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const ContactCTASection = () => (
  <section className="py-28 lg:py-36 bg-[hsl(0,0%,10%)]">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <AnimatedSection>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
          Une question avant de <span className="italic">configurer</span> ?
        </h2>
        <p className="text-white/50 text-lg mb-10">
          Notre équipe est disponible du lundi au vendredi, de 9h à 18h.
        </p>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+33100000000">
            <Button variant="ghost" className="text-white border border-white/20 px-8 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-white/10 transition-colors h-auto">
              Nous appeler
            </Button>
          </a>
          <Link to="/contact">
            <Button className="bg-primary text-primary-foreground px-8 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-accent-light transition-colors h-auto">
              Envoyer un message
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ContactCTASection;
