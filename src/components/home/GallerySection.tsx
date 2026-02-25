import AnimatedSection from "@/components/AnimatedSection";

const items = [
  { src: "/images/store-vue-ensemble.webp", alt: "Vue d'ensemble store coffre déployé", h: "h-64" },
  { src: "/images/store-salon-apero.webp", alt: "Apéro entre amis sous le store", h: "h-80" },
  { src: "/images/store-terrasse-work.webp", alt: "Télétravail sous le store sur la terrasse", h: "h-72" },
  { src: "/images/store-led-toile.webp", alt: "Éclairage LED intégré au store", h: "h-80" },
  { src: "/images/store-bras-detail.webp", alt: "Détail du bras articulé du store", h: "h-64" },
  { src: "/images/store-coffre-ouvert.webp", alt: "Vue du coffre ouvert du store", h: "h-72" },
];

const GallerySection = () => (
  <section className="py-28 lg:py-36">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Ils ont sauté <span className="italic">le pas</span>
          </h2>
          <p className="text-muted-foreground text-sm">Quelques réalisations parmi nos clients satisfaits</p>
        </div>
      </AnimatedSection>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, i) => (
          <AnimatedSection key={item.alt} delay={i * 0.1}>
            <div className={`${item.h} overflow-hidden break-inside-avoid`}>
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="text-center mt-12">
        <a href="https://trustpilot.com" target="_blank" rel="noopener noreferrer" className="story-link text-xs uppercase tracking-[0.2em] font-medium text-primary">
          Voir tous les avis Trustpilot →
        </a>
      </div>
    </div>
  </section>
);

export default GallerySection;
