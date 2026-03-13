import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 5000, suffix: "+", label: "Stores installés" },
  { value: 4.9, suffix: "/5", label: "Note Trustpilot", decimals: 1 },
  { value: 173, suffix: "", label: "Coloris disponibles" },
];

function AnimatedCounter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
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
    <div ref={ref} className="text-center">
      <p className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("fr-FR")}
        {suffix}
      </p>
    </div>
  );
}

const ConfiguratorCTASection = () => (
  <section id="configurator" className="py-20 lg:py-28 bg-card">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              <p className="text-muted-foreground text-sm uppercase tracking-[0.15em] mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src="/images/real-sunset-terrasse.webp"
              alt="Store coffre au coucher de soleil sur une terrasse"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              Configurateur en ligne
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Votre store en<br />
              <span className="text-accent-light">quelques clics</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
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
