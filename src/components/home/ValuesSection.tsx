import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { Banknote, ShieldCheck, Truck, Sun, Droplets, Palette, ChevronLeft, ChevronRight, Lightbulb, Smartphone } from "lucide-react";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Banknote, ShieldCheck, Truck, Sun, Droplets, Palette, Lightbulb, Smartphone,
};

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
      <span className="font-display text-4xl md:text-5xl font-bold tracking-tight">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("fr-FR")}
        {suffix}
      </span>
    </div>
  );
}

const ValuesSection = () => {
  const { content } = useContent();
  const { valueCards, statsItems } = content.homepage;

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
    <section className="py-16 lg:py-20 bg-primary text-primary-foreground overflow-hidden">
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
          {valueCards.map((v) => {
            const Icon = ICON_MAP[v.icon] || Banknote;
            return (
              <div
                key={v.id}
                className="min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-start bg-white border border-primary-foreground/10 rounded-2xl overflow-hidden group"
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
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats + CTA */}
        <AnimatedSection delay={0.1}>
          <div className="mt-12 pt-12 border-t border-primary-foreground/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {statsItems.map((stat) => (
                <div key={stat.id} className="space-y-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  <p className="text-primary-foreground/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/configurateur">
                <Button className="px-12 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  Configurer mon store →
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ValuesSection;
