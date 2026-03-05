import AnimatedSection from "@/components/AnimatedSection";
import { Banknote, ShieldCheck, Truck } from "lucide-react";

const values = [
  {
    icon: Banknote,
    title: "Le juste prix",
    desc: "Vente directe 100% sur internet, sans intermédiaire. Vous payez le produit, pas les frais de vitrine.",
  },
  {
    icon: Truck,
    title: "Livré chez vous",
    desc: "Livraison offerte par transporteur spécialisé. Dans les 4 à 5 semaines suivant votre commande.",
  },
  {
    icon: ShieldCheck,
    title: "5 ans de garantie",
    desc: "Tous nos stores sont garantis 5 ans pièces et main d'œuvre. Nos produits sont 100% réparables.",
  },
];

const ValuesSection = () => (
  <section className="py-16 lg:py-20 bg-card">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-14">
          Pourquoi choisir <span className="italic">notre store</span> ?
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {values.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.15}>
            <div className="flex flex-col items-start group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent-light/20 flex items-center justify-center mb-5">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
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
