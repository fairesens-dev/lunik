import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const ContactCTASection = () => (
  <section className="relative py-24 lg:py-32 overflow-hidden">
    {/* Background image */}
    <img
      src="/images/real-sunset-terrasse.webp"
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-black/60" />

    <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
      <AnimatedSection>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Une question avant de configurer ?
        </h2>
        <p className="text-white/60 text-lg mb-12">
          Notre équipe est disponible du lundi au vendredi, de 9h à 18h.
        </p>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+33368381030">
            <Button
              variant="outline"
              className="border-white/30 text-white px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-white/10 h-auto bg-transparent"
            >
              Nous appeler
            </Button>
          </a>
          <Link to="/contact">
            <Button className="bg-white text-black px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto hover:bg-white/90">
              Envoyer un message
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ContactCTASection;
