import AnimatedSection from "@/components/AnimatedSection";

const features = [
  {
    num: "01",
    label: "Toile",
    title: "Toile Orchestra by Dickson",
    body: "173 coloris en acrylique teint masse avec traitement Cleanguard. Certifiée OEKO-TEX classe II, garantie 10 ans. La référence mondiale de la protection solaire.",
    specs: ["Traitement anti-taches et anti-moisissures", "Résistance UV classement 5/5", "Garantie 5 ans"],
    image: "/images/store-toile-detail.webp",
    imageAlt: "Détail de la toile Dickson du store coffre",
  },
  {
    num: "02",
    label: "Structure",
    title: "Armature aluminium extrudé",
    body: "Profilés aluminium extrudé thermolaqué, traitement anti-corrosion. Notre coffre intégral protège la toile des intempéries quand le store est replié.",
    specs: ["Aluminium extrudé haute résistance", "Coffre intégral étanche", "Sans entretien"],
    image: "/images/store-bras-fixations.webp",
    imageAlt: "Détail des fixations aluminium du store coffre",
  },
  {
    num: "03",
    label: "Motorisation",
    title: "Motorisation Somfy io",
    body: "Pilotez votre store depuis une télécommande, un interrupteur mural ou votre smartphone via l'application TaHoma de Somfy. Compatible assistants vocaux.",
    specs: ["Application TaHoma iOS & Android", "Compatible Google Home & Alexa", "Détecteur de vent en option"],
    image: "/images/store-led-nuit.webp",
    imageAlt: "Store coffre avec éclairage LED intégré de nuit",
  },
];

const ProductFeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-24 bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-16">
            Conçu pour durer.<br />
            <span className="text-accent-light">Pensé pour vous.</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.num} delay={i * 0.1}>
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
                    <span className="text-xs font-mono text-accent-light">{feature.num}.</span>
                    <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-background/60 text-sm leading-relaxed">{feature.body}</p>
                  <div className="space-y-1.5 pt-2">
                    {feature.specs.map((spec) => (
                      <p key={spec} className="text-xs text-accent-light">→ {spec}</p>
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
