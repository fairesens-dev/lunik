import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";
import { ShieldCheck, Palette, Smartphone, Lightbulb, Banknote, Truck, Sun, Droplets } from "lucide-react";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShieldCheck, Palette, Smartphone, Lightbulb, Banknote, Truck, Sun, Droplets,
};

const ProductHighlightSection = () => {
  const { content } = useContent();
  const { highlightFeatures, highlightImage, highlightTitle, highlightSubtitle, highlightDescription } = content.homepage;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text + features */}
          <div>
            <AnimatedSection>
              <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
                  Nos points forts
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  {highlightTitle}<br />
                  <span className="text-accent-light">{highlightSubtitle}</span>
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {highlightDescription}
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {highlightFeatures.map((feature, i) => {
                const Icon = ICON_MAP[feature.icon] || ShieldCheck;
                return (
                  <AnimatedSection key={feature.id} delay={i * 0.06}>
                    <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors duration-300 h-full">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-display text-base font-bold mb-1.5">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>

          {/* Right: product image */}
          <AnimatedSection delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
              <img
                src={highlightImage}
                alt="Store banne coffre intégral LuniK — vue d'ensemble"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlightSection;
