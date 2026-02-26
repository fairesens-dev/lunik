import AnimatedSection from "@/components/AnimatedSection";
import { useTrustpilot } from "@/hooks/useTrustpilot";
import { useContent } from "@/contexts/ContentContext";
import { Star, ExternalLink } from "lucide-react";

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

const TrustpilotBanner = () => {
  const { summary } = useTrustpilot(6);
  const { content } = useContent();
  const trustpilotUrl = content.global.trustpilotUrl || "https://fr.trustpilot.com/";

  return (
    <section className="py-8 bg-background">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <svg viewBox="0 0 126 31" className="h-6 w-auto" aria-label="Trustpilot">
              <path
                d="M33.3 0h-6.2L23 10.8 18.6 0H0l15.3 10.8L9.6 31 23 20.2 36.4 31l-5.7-20.2L33.3 0zm46.5 13.8H68.1l-3.6-11.3-3.6 11.3H49.2l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9zm17.8 0h-11.7l-3.6-11.3-3.6 11.3H66.9l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9zm17.9 0H103.8l-3.6-11.3-3.6 11.3H84.9l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9zm17.8 0h-11.7l-3.6-11.3-3.6 11.3h-11.7l9.5 6.9-3.6 11.3 9.5-6.9 9.5 6.9-3.6-11.3 9.5-6.9z"
                fill="#00b67a"
              />
            </svg>
            {summary && (
              <>
                <FilledStars count={Math.round(summary.stars)} />
                <span className="text-muted-foreground">
                  {summary.trustScore}/5 · {summary.numberOfReviews?.total ?? 0} avis vérifiés
                </span>
              </>
            )}
            {!summary && (
              <span className="text-muted-foreground">4.9/5 · Avis vérifiés</span>
            )}
            <a
              href={trustpilotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Voir les avis <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TrustpilotBanner;
