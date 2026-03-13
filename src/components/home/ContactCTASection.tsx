import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const ContactCTASection = () => (
  <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <AnimatedSection>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Une question avant de configurer ?
        </h2>
        <p className="text-primary-foreground/50 text-lg mb-12">
          Notre équipe est disponible du lundi au vendredi, de 9h à 18h.
        </p>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+33100000000">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-primary-foreground/10 h-auto bg-transparent">
              Nous appeler
            </Button>
          </a>
          <Link to="/contact">
            <Button className="bg-primary-foreground text-primary px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto hover:bg-primary-foreground/90">
              Envoyer un message
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ContactCTASection;
