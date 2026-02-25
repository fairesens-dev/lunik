import AnimatedSection from "@/components/AnimatedSection";

const items = [
  { src: "/images/real-montagne-cepe.webp", alt: "Store coffre 530×400 cm toile Cèpe avec vue montagne", h: "h-80" },
  { src: "/images/real-vin-apero.webp", alt: "Apéro sous le store avec télécommande Somfy", h: "h-64" },
  { src: "/images/real-bordeaux.webp", alt: "Store coffre 592×350 cm toile Bordeaux sur terrasse bois", h: "h-72" },
  { src: "/images/real-paris-6eme.webp", alt: "Store blanc naturel posé au 6ème étage à Paris", h: "h-64" },
  { src: "/images/real-bardage-noir.webp", alt: "Store anthracite toile Jais sur bardage moderne", h: "h-80" },
  { src: "/images/real-lecture-piscine.webp", alt: "Détente au bord de la piscine sous le store", h: "h-72" },
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
