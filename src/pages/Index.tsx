import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { Sun, Shield, Palette, Zap, Wind, Star } from "lucide-react";

const features = [
  { icon: Zap, title: "Motorisation silencieuse", desc: "Moteur Somfy intégré pour un confort absolu" },
  { icon: Shield, title: "Résistance aux intempéries", desc: "Toile acrylique traitée anti-UV et imperméable" },
  { icon: Palette, title: "300+ coloris", desc: "Une palette infinie pour s'adapter à votre façade" },
  { icon: Sun, title: "Protection solaire optimale", desc: "Réduction de la chaleur jusqu'à 95%" },
  { icon: Wind, title: "Capteur vent intégré", desc: "Rétraction automatique en cas de vent fort" },
  { icon: Star, title: "Garantie 10 ans", desc: "Qualité premium, fabrication française certifiée" },
];

const testimonials = [
  {
    quote: "Un store d'une qualité exceptionnelle. La motorisation est d'un silence remarquable et la toile est magnifique.",
    author: "Marie-Claire D.",
    location: "Aix-en-Provence",
  },
  {
    quote: "Du conseil à l'installation, tout était parfait. Notre terrasse a été complètement transformée.",
    author: "Jean-Pierre L.",
    location: "Lyon",
  },
  {
    quote: "Troisième store que nous commandons chez eux. La qualité est constante et le service irréprochable.",
    author: "Sophie & Marc R.",
    location: "Bordeaux",
  },
];

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-background" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 font-sans font-medium">
              Fabrication française depuis 2003
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-8 text-foreground">
              L'art du store
              <br />
              <span className="italic font-normal">sur mesure</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Des stores bannes d'exception, conçus et fabriqués en France pour sublimer votre extérieur.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.45}>
            <Link to="/store-coffre">
              <Button className="bg-primary text-primary-foreground px-10 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-accent-light transition-colors h-auto">
                Configurer mon store
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection>
              <div className="aspect-[4/5] bg-secondary overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                  alt="Terrasse avec store banne"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="lg:max-w-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
                  Notre savoir-faire
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 leading-tight">
                  Une tradition
                  <br />
                  <span className="italic">d'excellence</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Depuis plus de vingt ans, notre atelier français conçoit des stores sur mesure
                  alliant esthétique raffinée et performance technique. Chaque store est le fruit
                  d'un savoir-faire artisanal transmis de génération en génération.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Nous sélectionnons les meilleurs matériaux — toiles acryliques Dickson,
                  motorisations Somfy, aluminium laqué haute qualité — pour vous offrir un
                  produit durable et élégant.
                </p>
                <Link
                  to="/store-coffre"
                  className="story-link text-xs uppercase tracking-[0.2em] font-medium text-primary"
                >
                  Découvrir nos stores
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Product Highlight Section */}
      <section className="py-28 lg:py-36 bg-card">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
                Notre produit phare
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light">
                Le Store <span className="italic">Coffre</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-border group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
                Témoignages
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light">
                Ce qu'ils en <span className="italic">disent</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.author} delay={i * 0.15}>
                <blockquote className="border border-border p-8 lg:p-10 h-full flex flex-col">
                  <p className="font-serif text-lg italic leading-relaxed flex-1 mb-6">
                    "{t.quote}"
                  </p>
                  <footer>
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </footer>
                </blockquote>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-28 lg:py-36 bg-primary">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-primary-foreground mb-6 leading-tight">
              Créez le store de <span className="italic">vos rêves</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Utilisez notre configurateur en ligne pour personnaliser chaque détail et recevoir un devis sur mesure.
            </p>
            <Link to="/store-coffre">
              <Button className="bg-primary-foreground text-primary px-10 py-5 rounded-none tracking-[0.2em] uppercase text-sm font-medium hover:bg-primary-foreground/90 transition-colors h-auto">
                Configurer mon store
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
};

export default Index;
