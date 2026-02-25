import AnimatedSection from "@/components/AnimatedSection";

const items = [
  { label: "Réalisation 1", h: "h-64" },
  { label: "Réalisation 2", h: "h-80" },
  { label: "Réalisation 3", h: "h-72" },
  { label: "Réalisation 4", h: "h-80" },
  { label: "Réalisation 5", h: "h-64" },
  { label: "Réalisation 6", h: "h-72" },
];

const ProductGallerySection = () => (
  <section className="py-28 lg:py-36 bg-background">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Ils ont transformé <span className="italic">leur extérieur</span>
          </h2>
          <p className="text-muted-foreground text-sm">Quelques réalisations parmi nos clients</p>
        </div>
      </AnimatedSection>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, i) => (
          <AnimatedSection key={item.label} delay={i * 0.1}>
            <div className={`${item.h} bg-stone-300 flex items-center justify-center break-inside-avoid`}>
              <span className="text-stone-500 uppercase tracking-widest text-xs font-sans">{item.label}</span>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="text-center mt-12">
        <a href="https://trustpilot.com" target="_blank" rel="noopener noreferrer" className="story-link text-xs uppercase tracking-[0.2em] font-medium text-primary">
          Lire les avis sur Trustpilot →
        </a>
      </div>
    </div>
  </section>
);

export default ProductGallerySection;
