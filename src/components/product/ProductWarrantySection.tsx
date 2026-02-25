import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const cards = [
  { icon: "🔧", title: "Garantie 5 ans", desc: "Pièces et main d'œuvre sur l'ensemble de nos produits. Nos stores sont 100% réparables." },
  { icon: "🇫🇷", title: "SAV France", desc: "Une équipe dédiée, disponible du lundi au vendredi de 9h à 18h. Réponse sous 24h." },
  { icon: "📦", title: "Pièces détachées", desc: "Toutes les pièces de remplacement sont disponibles. Votre store vous accompagne pour des décennies." },
];

const ProductWarrantySection = () => (
  <section className="py-28 lg:py-36 bg-card">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {cards.map((card, i) => (
          <AnimatedSection key={card.title} delay={i * 0.1}>
            <div className="border border-border bg-background p-8 text-center">
              <span className="text-3xl mb-4 block">{card.icon}</span>
              <h3 className="font-serif text-xl mb-3">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <div className="text-center">
        <Link to="/service-apres-vente" className="story-link text-xs uppercase tracking-[0.2em] font-medium text-primary">
          Consulter notre service après-vente →
        </Link>
      </div>
    </div>
  </section>
);

export default ProductWarrantySection;
