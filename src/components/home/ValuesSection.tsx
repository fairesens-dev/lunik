import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Banknote, ShieldCheck, Truck, Sun, Droplets, Palette, ChevronLeft, ChevronRight } from "lucide-react";

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

const ValuesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => el.removeEventListener("scroll", update);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/40 font-medium mb-4">
                Nos engagements
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
                Pourquoi choisir<br />notre store ?
              </h2>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canLeft}
                className="w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors disabled:opacity-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canRight}
                className="w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors disabled:opacity-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </AnimatedSection>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {values.map((v, i) => (
            <div
              key={v.title}
              className="min-w-[320px] max-w-[340px] flex-shrink-0 snap-start bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl overflow-hidden group"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                    <v.icon className="w-5 h-5 text-primary-foreground/80" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{v.title}</h3>
                </div>
                <p className="text-primary-foreground/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
