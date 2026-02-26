import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const features = [
  { emoji: "🎨", label: "Toile Dickson sur-mesure", desc: "Plus de 200 coloris disponibles, résistante aux UV et aux intempéries" },
  { emoji: "⚙️", label: "Motorisation Somfy", desc: "Pilotez votre store depuis votre smartphone ou télécommande" },
  { emoji: "💡", label: "Éclairage LED intégré", desc: "Profitez de vos soirées en extérieur avec un éclairage doux et discret" },
  { emoji: "📐", label: "Dimensions sur-mesure", desc: "De 150 cm à 600 cm de largeur, fabriqué selon vos côtes exactes" },
];

const ProductHighlightSection = () => {
  const { content } = useContent();

  return (
  <section className="py-16 lg:py-20">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
            {content.homepage.productSectionTitle.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{i > 0 ? <span className="italic">{line}</span> : line}</span>
            ))}
          </h2>
          <p className="text-muted-foreground text-lg">{content.homepage.productSectionSubtitle}</p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src="/images/store-salon-vide.webp"
              alt="Store coffre déployé au-dessus d'un salon de jardin"
              className="w-full h-full object-cover"
              loading="lazy"
            />
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
};

export default ProductHighlightSection;
