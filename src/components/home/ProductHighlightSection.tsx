import AnimatedSection from "@/components/AnimatedSection";
import { ShieldCheck, Palette, Smartphone, Lightbulb, Move, Ruler } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Coffre intégral",
    desc: "Protection totale de la toile et du mécanisme quand le store est replié. Étanchéité garantie.",
  },
  {
    icon: Palette,
    title: "Toile Dickson",
    desc: "173 coloris en acrylique teint masse avec traitement Cleanguard. Certifiée OEKO-TEX classe II.",
  },
  {
    icon: Smartphone,
    title: "Motorisation Somfy",
    desc: "Pilotage télécommande, smartphone ou assistants vocaux. Capteur vent en option.",
  },
  {
    icon: Lightbulb,
    title: "Éclairage LED",
    desc: "Bandeau LED intégré au coffre pour prolonger vos soirées en terrasse avec une lumière douce.",
  },
  {
    icon: Move,
    title: "Bras articulés",
    desc: "Aluminium extrudé haute résistance, thermolaqué anti-corrosion. Tension parfaite de la toile.",
  },
  {
    icon: Ruler,
    title: "100% sur-mesure",
    desc: "Dimensions exactes au centimètre près, fabriqué spécialement pour votre terrasse.",
  },
];

const ProductHighlightSection = () => (
  <section className="py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <AnimatedSection>
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
            Nos points forts
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Chaque détail<br />
            <span className="text-accent-light">a été pensé</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Notre store coffre intégral combine les meilleurs matériaux du marché — toile Dickson, aluminium extrudé, motorisation Somfy — dans un produit 100% fabriqué en France et conçu pour durer.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={i * 0.06}>
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors duration-300 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProductHighlightSection;
