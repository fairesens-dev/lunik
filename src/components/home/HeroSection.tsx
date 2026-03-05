import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const HeroSection = () => {
  const { content } = useContent();
  const { homepage } = content;

  return (
    <section className="relative min-h-screen flex -mt-20">
      {/* Left content — 55% */}
      <div className="w-full lg:w-[55%] flex items-center px-6 lg:px-16 xl:px-24 pt-32 pb-20 relative">
        {/* Warm radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="max-w-xl relative z-10">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 font-sans font-medium">
              {homepage.heroOverline}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-8 text-foreground">
              {homepage.heroTitle.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === arr.length - 1 ? <span className="text-primary">{line}</span> : line}
                </span>
              ))}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">{homepage.heroSubtitle}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.35}>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#configurator">
                <Button variant="gradient" className="px-8 py-5 rounded-full tracking-[0.2em] uppercase text-sm font-medium h-auto shadow-lg hover:shadow-xl">
                  {homepage.heroCTA1}
                </Button>
              </a>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.45}>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="bg-primary/10 px-4 py-2 rounded-full">⭐ 4.9/5 Trustpilot</span>
              <span className="bg-primary/10 px-4 py-2 rounded-full">🇫🇷 Made in France</span>
              <span className="bg-primary/10 px-4 py-2 rounded-full">🔧 Garantie 5 ans</span>
            </div>
          </AnimatedSection>
        </div>
      </div>
      {/* Right image — 45% */}
      <div className="hidden lg:block w-[45%] relative">
        <img
          src="/images/store-vue-ensemble.webp"
          alt="Store coffre sur-mesure déployé sur une terrasse"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/30" />
      </div>
    </section>
  );
};

export default HeroSection;
