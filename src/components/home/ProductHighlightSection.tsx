import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const features = [
  { emoji: "🎨", label: "Toile Dickson sur-mesure", desc: "Plus de 200 coloris disponibles, résistante aux UV et aux intempéries" },
  { emoji: "⚙️", label: "Motorisation Somfy", desc: "Pilotez votre store depuis votre smartphone ou télécommande" },
  { emoji: "💡", label: "Éclairage LED intégré", desc: "Profitez de vos soirées en extérieur avec un éclairage doux et discret" },
  { emoji: "📐", label: "Dimensions sur-mesure", desc: "De 150 cm à 600 cm de largeur, fabriqué selon vos côtes exactes" },
];

const ProductHighlightSection = () => (
  <section className="py-28 lg:py-36">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
            Le Store Coffre
            <br />
            <span className="italic">repensé de A à Z</span>
          </h2>
          <p className="text-muted-foreground text-lg">Un seul produit. Le meilleur de sa catégorie.</p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection>
          <div className="aspect-[4/3] bg-stone-200 flex items-center justify-center">
            <span className="text-stone-400 uppercase tracking-widest text-sm font-sans">Photo produit hero</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="space-y-8">
            {features.map((f) => (
              <div key={f.label} className="flex gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{f.emoji}</span>
                <div>
                  <p className="font-medium text-foreground mb-1">{f.label}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
            <Link
              to="/store-coffre"
              className="story-link text-xs uppercase tracking-[0.2em] font-medium text-primary inline-block mt-4"
            >
              Configurer le mien →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default ProductHighlightSection;
