import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useEffect, useRef, useState } from "react";
import { Ruler, Palette, Settings2, CreditCard } from "lucide-react";

function AnimatedCounter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * value);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <span className="font-display text-5xl md:text-6xl font-bold tracking-tight">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("fr-FR")}
        {suffix}
      </span>
    </div>
  );
}

const stats = [
  { value: 5000, suffix: "+", label: "Stores installés en France", decimals: 0 },
  { value: 4.9, suffix: "/5", label: "Note moyenne Trustpilot", decimals: 1 },
  { value: 173, suffix: "", label: "Coloris Dickson disponibles", decimals: 0 },
  { value: 5, suffix: " ans", label: "De garantie pièces & main d'œuvre", decimals: 0 },
];

const steps = [
  { icon: Ruler, num: "01", title: "Dimensions", desc: "Choisissez largeur et avancée" },
  { icon: Palette, num: "02", title: "Couleurs", desc: "Toile et armature sur-mesure" },
  { icon: Settings2, num: "03", title: "Options", desc: "Motorisation, LED, capteur vent" },
  { icon: CreditCard, num: "04", title: "Prix & commande", desc: "Tarif instantané, paiement sécurisé" },
];

const ConfiguratorCTASection = () => (
  <section id="configurator" className="py-20 lg:py-28 bg-card">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      {/* Stats row */}
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Vertical CTA block */}
      <AnimatedSection delay={0.1}>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
            Configurateur en ligne
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
            Votre store en<br />
            <span className="text-accent-light">quelques clics</span>
          </h2>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-background/60 border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm font-bold">{step.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/configurateur">
            <Button className="px-12 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto mt-4">
              Lancer le configurateur →
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ConfiguratorCTASection;
