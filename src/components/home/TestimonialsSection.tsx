import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useTrustpilot } from "@/hooks/useTrustpilot";
import { useContent } from "@/contexts/ContentContext";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

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
      <Star key={i} className={`w-4 h-4 ${i <= count ? "fill-[#00b67a] text-[#00b67a]" : "fill-muted text-muted"}`} />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const { content } = useContent();
  const { reviews, loading, error } = useTrustpilot(9);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fallback reviews from CMS
  const fallbackItems = content.homepage.testimonials.filter(t => t.active).map(t => ({
    id: t.name,
    stars: t.rating ?? 5,
    title: "",
    text: t.text,
    consumer: { displayName: t.name },
    createdAt: "",
  }));

  const items = reviews.length > 0 ? reviews : fallbackItems;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
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
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 340;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  if (loading && items.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-card">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              Ce que nos clients <span className="italic">en pensent</span>
            </h2>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
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
          {items.map((review, i) => (
            <div
              key={review.id || i}
              className="min-w-[300px] max-w-[340px] flex-shrink-0 snap-start bg-background p-6 shadow-sm flex flex-col"
            >
              <FilledStars count={review.stars} />
              {review.title && (
                <p className="font-semibold text-foreground mt-3 mb-1 text-sm">{review.title}</p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-4 flex-1 mt-2">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {initials(review.consumer.displayName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{review.consumer.displayName}</p>
                  {review.createdAt && (
                    <p className="text-[11px] text-muted-foreground">{timeAgo(review.createdAt)}</p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#00b67a] font-medium whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3" /> Vérifié
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
