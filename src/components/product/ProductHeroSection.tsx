import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const ProductHeroSection = () => {
  const { content } = useContent();
  const { productPage } = content;
  const heroImage = productPage.heroImage || "/images/store-salon-apero.webp";

  return (
    <section className="relative min-h-screen flex -mt-20">
      <div className="w-full lg:w-[55%] flex items-center px-6 lg:px-16 xl:px-24 pt-32 pb-20">
        <div className="max-w-xl">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 font-sans font-medium">
              {productPage.heroOverline}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-8 text-foreground">
              {productPage.heroTitle.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === arr.length - 1 ? <span className="text-primary">{line}</span> : line}
                </span>
              ))}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
              {productPage.heroSubtitle}
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
        <img
          src={heroImage}
          alt="Amis trinquant sous un store coffre sur une terrasse"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-300/60 to-transparent" />
      </div>
    </section>
  );
};

export default ProductHeroSection;
