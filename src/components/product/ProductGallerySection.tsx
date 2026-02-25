import AnimatedSection from "@/components/AnimatedSection";

const items = [
  { src: "/images/store-salon-vide.webp", alt: "Store coffre au-dessus d'un salon de jardin", h: "h-64" },
  { src: "/images/store-terrasse-work.webp", alt: "Télétravail en extérieur sous le store", h: "h-80" },
  { src: "/images/store-led-nuit.webp", alt: "Store avec LED intégrée la nuit", h: "h-72" },
  { src: "/images/store-coffre-ouvert.webp", alt: "Détail du coffre ouvert", h: "h-80" },
  { src: "/images/store-toile-detail.webp", alt: "Texture de la toile Dickson", h: "h-64" },
  { src: "/images/store-salon-apero.webp", alt: "Moment convivial sous le store", h: "h-72" },
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
          Lire les avis sur Trustpilot →
        </a>
      </div>
    </div>
  </section>
);

export default ProductGallerySection;
