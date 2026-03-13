import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useTrustpilot } from "@/hooks/useTrustpilot";
import { useContent } from "@/contexts/ContentContext";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

// utils
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  return `il y a ${Math.floor(months / 12)} an(s)`;
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const FilledStars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`w-5 h-5 ${i <= count ? "fill-[#00b67a] text-[#00b67a]" : "fill-muted text-muted"}`} />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const { content } = useContent();
  const { reviews, loading } = useTrustpilot(9);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackItems = content.homepage.testimonials.filter(t => t.active).map(t => ({
    id: t.name, stars: t.rating ?? 5, title: "", text: t.text,
    consumer: { displayName: t.name }, createdAt: "",
  }));

  const items = reviews.length > 0 ? reviews : fallbackItems;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 400;
    setCurrentIndex(Math.round(el.scrollLeft / (cardWidth + 24)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [items]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 400;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  if (loading && items.length === 0) return null;

  return (
    <section className="pt-6 pb-20 lg:pt-6 lg:pb-28 bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
                Avis vérifiés
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Ce que nos clients<br />en pensent
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-mono text-muted-foreground">
                {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((review, i) => (
            <div
              key={review.id || i}
              className="min-w-[340px] max-w-[400px] flex-shrink-0 snap-start bg-card border border-border rounded-2xl p-8 flex flex-col"
            >
              <FilledStars count={review.stars} />
              {review.title && (
                <p className="font-bold text-foreground mt-4 mb-1">{review.title}</p>
              )}
              <p className="text-muted-foreground line-clamp-5 flex-1 mt-3 leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                  {initials(review.consumer.displayName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{review.consumer.displayName}</p>
                  {review.createdAt && (
                    <p className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#00b67a] font-medium whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Vérifié
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
