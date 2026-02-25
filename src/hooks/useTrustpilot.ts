import { useState, useEffect, useCallback } from "react";
import {
  fetchBusinessSummary,
  fetchReviews,
  type TrustpilotSummary,
  type TrustpilotReview,
} from "@/lib/trustpilot";

export function useTrustpilot(initialPerPage = 6) {
  const [summary, setSummary] = useState<TrustpilotSummary | null>(null);
  const [reviews, setReviews] = useState<TrustpilotReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [starsFilter, setStarsFilter] = useState<number | null>(null);

  const load = useCallback(
    async (p: number, stars: number | null, append: boolean) => {
      setLoading(true);
      try {
        const [summaryData, reviewsData] = await Promise.all([
          p === 1 ? fetchBusinessSummary() : Promise.resolve(summary),
          fetchReviews({ page: p, perPage: initialPerPage, stars }),
        ]);

        if (!reviewsData) {
          setError(true);
          setLoading(false);
          return;
        }

        if (summaryData) setSummary(summaryData);
        setReviews(prev =>
          append ? [...prev, ...reviewsData.reviews] : reviewsData.reviews
        );
        setHasMore(p < (reviewsData.pageCount ?? 1));
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [initialPerPage, summary]
  );

  useEffect(() => {
    load(1, null, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    load(next, starsFilter, true);
  }, [page, starsFilter, load]);

  const filterByStars = useCallback(
    (stars: number | null) => {
      setStarsFilter(stars);
      setPage(1);
      setReviews([]);
      load(1, stars, false);
    },
    [load]
  );

  return {
    summary,
    reviews,
    loading,
    error,
    hasMore,
    loadMore,
    starsFilter,
    filterByStars,
  };
}
