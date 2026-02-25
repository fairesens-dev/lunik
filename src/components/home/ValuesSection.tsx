import AnimatedSection from "@/components/AnimatedSection";

const values = [
  { num: "01", title: "Le juste prix", desc: "Vente directe 100% sur internet, sans intermédiaire. Vous payez le produit, pas les frais de vitrine." },
  { num: "02", title: "Livré ou installé", desc: "Formule livraison ou pose par nos installateurs certifiés. Dans les 4 à 5 semaines suivant votre commande." },
  { num: "03", title: "5 ans de garantie", desc: "Tous nos stores sont garantis 5 ans pièces et main d'œuvre. Nos produits sont 100% réparables." },
];

const ValuesSection = () => (
  <section className="py-28 lg:py-36 bg-card">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-20">
          Pourquoi choisir <span className="italic">notre store</span> ?
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {values.map((v, i) => (
          <AnimatedSection key={v.num} delay={i * 0.15}>
            <div>
              <p className="font-serif text-6xl text-primary/20 mb-4">{v.num}</p>
              <h3 className="font-serif text-2xl mb-3">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{v.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ValuesSection;
