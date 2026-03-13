import AnimatedSection from "@/components/AnimatedSection";

const bentoItems = [
  {
    title: "Coffre intégral",
    desc: "Protection totale de la toile et du mécanisme",
    image: "/images/store-coffre-ouvert.webp",
    span: "md:col-span-2 md:row-span-2",
    height: "h-80 md:h-full",
  },
  {
    title: "Toile Dickson",
    desc: "173 coloris, traitement Cleanguard",
    image: "/images/store-toile-detail.webp",
    span: "",
    height: "h-64",
  },
  {
    title: "Motorisation Somfy",
    desc: "Télécommande & capteur vent intégrés",
    image: "/images/store-bras-fixations.webp",
    span: "",
    height: "h-64",
  },
  {
    title: "Éclairage LED",
    desc: "Ambiance prolongée en soirée",
    image: "/images/store-led-nuit.webp",
    span: "",
    height: "h-64",
  },
  {
    title: "Bras articulés",
    desc: "Aluminium extrudé haute résistance",
    image: "/images/store-bras-detail.webp",
    span: "",
    height: "h-64",
  },
  {
    title: "100% sur-mesure",
    desc: "Dimensions exactes, fabriqué pour vous",
    image: "/images/store-salon-vide.webp",
    span: "md:col-span-2",
    height: "h-64 md:h-72",
  },
];

const ProductHighlightSection = () => (
  <section className="py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <AnimatedSection>
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
            Nos points forts
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Chaque détail<br />
            <span className="text-accent-light">a été pensé</span>
          </h2>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {bentoItems.map((item, i) => (
          <AnimatedSection key={item.title} delay={i * 0.08} className={item.span}>
            <div className={`relative ${item.height} overflow-hidden rounded-2xl group cursor-pointer`}>
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProductHighlightSection;
