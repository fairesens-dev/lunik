import { supabase } from "@/integrations/supabase/client";

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

export function clearTrustpilotCache(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("tp_"));
  keys.forEach(k => localStorage.removeItem(k));
}

export interface TrustpilotSummary {
  trustScore: number;
  numberOfReviews: { total: number };
  stars: number;
  displayName: string;
  starsDistribution?: {
    oneStar: number;
    twoStars: number;
    threeStars: number;
    fourStars: number;
    fiveStars: number;
  };
}

export interface TrustpilotReview {
  id: string;
  title: string;
  text: string;
  stars: number;
  createdAt: string;
  consumer: {
    displayName: string;
  };
  isVerified?: boolean;
  links?: Array<{ href: string; rel: string }>;
}

export interface TrustpilotReviewsResponse {
  reviews: TrustpilotReview[];
  totalReviews?: number;
  pageCount?: number;
}

export async function fetchBusinessSummary(): Promise<TrustpilotSummary | null> {
  const cached = getCache<TrustpilotSummary>("tp_summary");
  if (cached) return cached;

  try {
    const { data, error } = await supabase.functions.invoke("trustpilot-proxy", {
      body: { action: "summary" },
    });

    if (error || !data || data?.error) return null;

    setCache("tp_summary", data);
    return data as TrustpilotSummary;
  } catch {
    return null;
  }
}

export async function fetchReviews(params?: {
  page?: number;
  perPage?: number;
  stars?: number | null;
  orderBy?: string;
}): Promise<TrustpilotReviewsResponse | null> {
  const page = params?.page ?? 1;
  const stars = params?.stars ?? null;
  const cacheKey = `tp_reviews_${page}_${stars ?? "all"}`;

  const cached = getCache<TrustpilotReviewsResponse>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase.functions.invoke("trustpilot-proxy", {
      body: { action: "reviews", params: { ...params, stars } },
    });

    if (error || !data || data?.error) return null;

    setCache(cacheKey, data);
    return data as TrustpilotReviewsResponse;
  } catch {
    return null;
  }
}
