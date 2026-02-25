import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const testimonials = [
  { quote: "Livraison rapide, produit conforme, équipe réactive. Je recommande sans hésiter.", author: "David M.", city: "Lyon", stars: "⭐⭐⭐⭐⭐" },
  { quote: "Très bien conseillé au téléphone, équipe d'installation professionnelle et ponctuelle.", author: "Alain R.", city: "Bordeaux", stars: "⭐⭐⭐⭐⭐" },
  { quote: "Deuxième commande, troisième store. Toujours aussi satisfait du produit et du service.", author: "Xavier P.", city: "Strasbourg", stars: "⭐⭐⭐⭐⭐" },
  { quote: "Belle finition, parfait rapport qualité/prix, notre terrasse est transformée.", author: "Marie L.", city: "Nantes", stars: "⭐⭐⭐⭐⭐" },
];

const ProductTestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-28 lg:py-36 bg-background">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">
              Ce que nos clients <span className="italic">disent</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>⭐⭐⭐⭐⭐</span>
              <span>4.9 / 5 sur Trustpilot · +850 avis</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
              {testimonials.map((t) => (
                <div key={t.author} className="w-full flex-shrink-0 px-4 md:px-8">
                  <blockquote className="bg-card p-10 lg:p-14 shadow-sm max-w-2xl mx-auto text-center">
                    <p className="text-sm mb-3">{t.stars}</p>
                    <p className="font-serif text-xl md:text-2xl italic leading-relaxed mb-6 text-foreground">"{t.quote}"</p>
                    <footer className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{t.author}</span> — {t.city}
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrent(Math.max(0, current - 1))} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Précédent">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrent(Math.min(testimonials.length - 1, current + 1))} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Suivant">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border"}`} aria-label={`Témoignage ${i + 1}`} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductTestimonialsSection;
