import AnimatedSection from "@/components/AnimatedSection";
import { Banknote, ShieldCheck, Truck, Sun, Droplets, Palette } from "lucide-react";

const values = [
  {
    icon: Banknote,
    title: "Le juste prix",
    desc: "Vente directe 100% sur internet, sans intermédiaire. Vous payez le produit, pas les frais de vitrine.",
    image: "/images/store-salon-apero.webp",
  },
  {
    icon: Truck,
    title: "Livré chez vous",
    desc: "Livraison offerte par transporteur spécialisé. Dans les 4 à 5 semaines suivant votre commande.",
    image: "/images/store-terrasse-work.webp",
  },
  {
    icon: ShieldCheck,
    title: "5 ans de garantie",
    desc: "Tous nos stores sont garantis 5 ans pièces et main d'œuvre. Nos produits sont 100% réparables.",
    image: "/images/store-coffre-ouvert.webp",
  },
  {
    icon: Sun,
    title: "Protection UV 5/5",
    desc: "Toile Dickson acrylique teint masse avec traitement Cleanguard anti-salissures.",
    image: "/images/store-led-toile.webp",
  },
  {
    icon: Droplets,
    title: "Résistance intempéries",
    desc: "Toile certifiée OEKO-TEX classe II, résistante aux intempéries et aux déchirures.",
    image: "/images/store-bras-detail.webp",
  },
  {
    icon: Palette,
    title: "173 coloris",
    desc: "Toile Orchestra by Dickson disponible en 173 coloris pour s'adapter à tous les styles.",
    image: "/images/store-toile-detail.webp",
  },
];

const ValuesSection = () => (
  <section className="py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <AnimatedSection>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-16">
          Pourquoi choisir<br />
          <span className="text-accent-light">notre store ?</span>
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.08}>
            <div className="bg-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="aspect-[3/2] overflow-hidden rounded-xl mb-5">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <v.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold">{v.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ValuesSection;
