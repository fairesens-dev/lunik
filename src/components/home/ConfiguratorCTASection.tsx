import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useEffect, useRef, useState } from "react";

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

const ConfiguratorCTASection = () => (
  <section id="configurator" className="py-20 lg:py-28 bg-card">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left — Stats */}
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Right — CTA */}
        <AnimatedSection delay={0.15}>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              Configurateur en ligne
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Votre store en<br />
              <span className="text-accent-light">quelques clics</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md text-lg">
              Choisissez vos dimensions, votre couleur de toile, votre armature et vos options.
              Obtenez votre prix immédiatement.
            </p>
            <Link to="/configurateur">
              <Button className="px-10 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto mt-2">
                Lancer le configurateur →
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default ConfiguratorCTASection;
