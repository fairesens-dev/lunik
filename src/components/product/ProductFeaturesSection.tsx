import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const ProductFeaturesSection = () => {
  const { content } = useContent();
  const { productFeaturesTitle1, productFeaturesTitle2, productFeatures } = content.homepage;

  return (
    <section id="features" className="py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-16">
            <span className="text-primary">{productFeaturesTitle1}</span><br />
            <span className="text-muted-foreground">{productFeaturesTitle2}</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {productFeatures.map((feature, i) => (
            <AnimatedSection key={feature.id} delay={i * 0.1}>
              <div className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.body}</p>
                  <div className="space-y-1.5 pt-2">
                    {feature.specs.map((spec) => (
                      <p key={spec} className="text-xs text-primary">→ {spec}</p>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeaturesSection;
