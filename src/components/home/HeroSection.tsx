import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const HeroSection = () => {
  const { content } = useContent();
  const { homepage } = content;

  return (
    <section className="relative pt-32 pb-8 lg:pt-40 lg:pb-12 -mt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-24">
        {/* Overline */}
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 font-sans font-medium">
            {homepage.heroOverline}
          </p>
        </AnimatedSection>

        {/* Giant headline */}
        <AnimatedSection delay={0.1}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[0.95] tracking-tight mb-10 text-foreground max-w-5xl">
            {homepage.heroTitle.split("\n").map((line, i, arr) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === arr.length - 1 ? <span className="text-accent-light">{line}</span> : line}
              </span>
            ))}
          </h1>
        </AnimatedSection>

        {/* Subtitle + CTA row */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="max-w-md">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{homepage.heroSubtitle}</p>
              <Link to="/configurateur">
                <Button className="px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto">
                  {homepage.heroCTA1}
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="border border-border px-4 py-2 rounded-full text-sm text-muted-foreground">⭐ 4.9/5 Trustpilot</span>
              <span className="border border-border px-4 py-2 rounded-full text-sm text-muted-foreground">🇫🇷 Made in France</span>
              <span className="border border-border px-4 py-2 rounded-full text-sm text-muted-foreground">🔧 Garantie 5 ans</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Panoramic image */}
        <AnimatedSection delay={0.3}>
          <div className="aspect-[21/9] overflow-hidden rounded-2xl">
            <img
              src="/images/store-vue-ensemble.webp"
              alt="Store coffre sur-mesure déployé sur une terrasse"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
