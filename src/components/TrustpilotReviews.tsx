import { useTrustpilot } from "@/hooks/useTrustpilot";
import { useContent } from "@/contexts/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, CheckCircle2, Star } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

// ── Helpers ───────────────────────────────────────────

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
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const FilledStars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= count ? "fill-[#00b67a] text-[#00b67a]" : "fill-muted text-muted"}`}
      />
    ))}
  </div>
);

// ── Fallback static carousel ────────────────────────

function FallbackTestimonials() {
  const { content } = useContent();
  const testimonials = content.homepage.testimonials.filter(t => t.active);
  const featured = (content.homepage as any).featuredReviews as any[] | undefined;

  const items = featured?.length
    ? featured.map(r => ({
        name: r.author,
        text: r.text,
        rating: r.rating,
        date: r.date,
        title: r.title,
      }))
    : testimonials.map(t => ({
        name: t.name,
        text: t.text,
        rating: t.rating ?? 5,
        date: "",
        title: "",
      }));

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.slice(0, 6).map((item, i) => (
        <div key={i} className="bg-card p-6 shadow-sm rounded-sm">
          <FilledStars count={item.rating} />
          {item.title && (
            <p className="font-semibold text-foreground mt-3 mb-1">{item.title}</p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">"{item.text}"</p>
          <p className="text-xs text-muted-foreground mt-4 font-medium">{item.name}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────

interface TrustpilotReviewsProps {
  maxItems?: number;
  showFilters?: boolean;
  showLoadMore?: boolean;
  className?: string;
}

const TrustpilotReviews = ({
  maxItems,
  showFilters = true,
  showLoadMore = true,
  className = "",
}: TrustpilotReviewsProps) => {
  const { summary, reviews, loading, error, hasMore, loadMore, starsFilter, filterByStars } =
    useTrustpilot(maxItems ?? 6);
  const { content } = useContent();

  // Loading skeleton
  if (loading && reviews.length === 0) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Fallback
  if (error || reviews.length === 0) {
    return (
      <div className={className}>
        <FallbackTestimonials />
      </div>
    );
  }

  const trustpilotUrl = content.global.trustpilotUrl || "https://fr.trustpilot.com/";

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Summary banner */}
      {summary && (
        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <svg viewBox="0 0 126 31" className="h-6 w-auto" aria-label="Trustpilot">
              <path
                d="M33.3 0h-6.2L23 10.8 18.6 0H0l15.3 10.8L9.6 31 23 20.2 36.4 31l-5.7-20.2L33.3 0zm46.5 13.8H68.1l-3.6-11.3-3.6 11.3H49.2l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9zm17.8 0h-11.7l-3.6-11.3-3.6 11.3H66.9l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9zm17.9 0H103.8l-3.6-11.3-3.6 11.3H84.9l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9zm17.8 0h-11.7l-3.6-11.3-3.6 11.3h-11.7l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9z"
                fill="#00b67a"
              />
            </svg>
            <FilledStars count={Math.round(summary.stars)} />
            <span className="text-muted-foreground">
              {summary.trustScore}/5 · {summary.numberOfReviews?.total ?? 0} avis vérifiés
            </span>
            <a
              href={trustpilotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Voir tous les avis <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </AnimatedSection>
      )}

      {/* Star filter bar */}
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-2">
          {[null, 5, 4, 3].map(star => (
            <button
              key={star ?? "all"}
              onClick={() => filterByStars(star)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                starsFilter === star
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {star ? `${"★".repeat(star)} (${star})` : "Tous"}
            </button>
          ))}
        </div>
      )}

      {/* Reviews grid */}
      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-card p-6 shadow-sm rounded-sm flex flex-col">
              <FilledStars count={review.stars} />
              {review.title && (
                <p className="font-semibold text-foreground mt-3 mb-1 text-sm">{review.title}</p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mt-1">
                {review.text}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {initials(review.consumer.displayName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {review.consumer.displayName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(review.createdAt)}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#00b67a] font-medium whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3" /> Vérifié
                </span>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Load more */}
      {showLoadMore && hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium border border-border rounded-sm hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "Chargement…" : "Voir plus d'avis"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TrustpilotReviews;
