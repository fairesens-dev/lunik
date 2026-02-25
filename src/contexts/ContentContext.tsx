import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ──────────────────────────────────────────────

export interface FeaturedReview {
  trustpilotId: string;
  title: string;
  text: string;
  author: string;
  rating: number;
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  active: boolean;
}

export interface GlobalContent {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  siret: string;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  trustpilotUrl: string;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroOverline: string;
  heroCTA1: string;
  heroCTA2: string;
  marqueeText: string;
  productSectionTitle: string;
  productSectionSubtitle: string;
  testimonials: Testimonial[];
  faqItems: FAQItem[];
  featuredReviews: FeaturedReview[];
}

export interface ProductPageContent {
  heroTitle: string;
  heroOverline: string;
  heroSubtitle: string;
  configuratorTitle: string;
  configuratorSubtitle: string;
  stepLabels: string[];
  orderConfirmationMessage: string;
  faqItems: FAQItem[];
}

export interface SAVContent {
  heroTitle: string;
  heroSubtitle: string;
  hours: string;
  responseDelay: string;
  faqItems: FAQItem[];
}

export interface PromoBannerContent {
  active: boolean;
  text: string;
  bgColor: string;
  textColor: string;
  ctaText: string;
  ctaUrl: string;
}

export interface SiteContent {
  global: GlobalContent;
  homepage: HomepageContent;
  productPage: ProductPageContent;
  sav: SAVContent;
  promoBanner: PromoBannerContent;
}

// ── Defaults ───────────────────────────────────────────

const defaultContent: SiteContent = {
  global: {
    brandName: "Mon Store",
    tagline: "Protection solaire sur-mesure · Fabrication française",
    phone: "03 68 38 10 30",
    email: "contact@monstore.fr",
    address: "12 rue de l'Atelier, 67000 Strasbourg",
    siret: "XXX XXX XXX 00001",
    socialInstagram: "https://instagram.com/",
    socialFacebook: "https://facebook.com/",
    socialPinterest: "https://pinterest.com/",
    trustpilotUrl: "https://fr.trustpilot.com/",
  },
  homepage: {
    heroTitle: "Vivez dehors,\nsans compromis.",
    heroSubtitle: "Nos stores bannes et coffres sont conçus sur-mesure, fabriqués en France, et livrés chez vous en 4 à 5 semaines.",
    heroOverline: "Protection solaire sur-mesure · Fabrication française",
    heroCTA1: "Configurer mon store",
    heroCTA2: "Voir le produit",
    marqueeText: "FABRIQUÉ EN FRANCE · SUR-MESURE · LIVRAISON 4-5 SEMAINES · GARANTIE 5 ANS · MOTORISATION SOMFY · TOILE DICKSON · MADE IN FRANCE · ",
    productSectionTitle: "Le Store Coffre\nrepensé de A à Z",
    productSectionSubtitle: "Un seul produit. Le meilleur de sa catégorie.",
    testimonials: [],
    faqItems: [],
    featuredReviews: [],
  },
  productPage: {
    heroTitle: "Le store qui\nredéfinit l'extérieur.",
    heroOverline: "Store Coffre · Fabrication Française Sur-Mesure",
    heroSubtitle: "",
    configuratorTitle: "Créez votre store\nsur-mesure",
    configuratorSubtitle: "",
    stepLabels: ["VOS DIMENSIONS", "COULEUR DE TOILE", "COULEUR DE L'ARMATURE", "OPTIONS"],
    orderConfirmationMessage: "",
    faqItems: [],
  },
  sav: {
    heroTitle: "Un SAV qui vous ressemble",
    heroSubtitle: "",
    hours: "Lundi – Vendredi : 9h – 18h",
    responseDelay: "sous 24h",
    faqItems: [],
  },
  promoBanner: {
    active: false,
    text: "",
    bgColor: "#4A5E3A",
    textColor: "#FFFFFF",
    ctaText: "En profiter",
    ctaUrl: "/store-coffre",
  },
};

// ── Context ────────────────────────────────────────────

interface ContentContextValue {
  content: SiteContent;
  updateGlobal: (data: Partial<GlobalContent>) => void;
  updateHomepage: (data: Partial<Omit<HomepageContent, "testimonials" | "faqItems" | "featuredReviews">>) => void;
  updateProductPage: (data: Partial<Omit<ProductPageContent, "faqItems">>) => void;
  updateSAV: (data: Partial<Omit<SAVContent, "faqItems">>) => void;
  updatePromoBanner: (data: Partial<PromoBannerContent>) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateFeaturedReviews: (reviews: FeaturedReview[]) => void;
  updateHomepageFAQ: (items: FAQItem[]) => void;
  updateProductFAQ: (items: FAQItem[]) => void;
  updateSAVFAQ: (items: FAQItem[]) => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

async function upsertContent(id: string, data: unknown) {
  await supabase.from("site_content" as any).upsert({ id, data } as any, { onConflict: "id" });
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  // Load from Supabase on mount
  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from("site_content" as any).select("id, data") as any;
      if (rows && rows.length > 0) {
        const map: Record<string, any> = {};
        for (const r of rows) map[r.id] = r.data;
        setContent({
          global: { ...defaultContent.global, ...(map.global || {}) },
          homepage: { ...defaultContent.homepage, ...(map.homepage || {}) },
          productPage: { ...defaultContent.productPage, ...(map.productPage || {}) },
          sav: { ...defaultContent.sav, ...(map.sav || {}) },
          promoBanner: { ...defaultContent.promoBanner, ...(map.promoBanner || {}) },
        });
      }
    })();
  }, []);

  const updateGlobal = useCallback((data: Partial<GlobalContent>) => {
    setContent(prev => {
      const updated = { ...prev.global, ...data };
      upsertContent("global", updated);
      return { ...prev, global: updated };
    });
  }, []);

  const updateHomepage = useCallback((data: Partial<Omit<HomepageContent, "testimonials" | "faqItems" | "featuredReviews">>) => {
    setContent(prev => {
      const updated = { ...prev.homepage, ...data };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateProductPage = useCallback((data: Partial<Omit<ProductPageContent, "faqItems">>) => {
    setContent(prev => {
      const updated = { ...prev.productPage, ...data };
      upsertContent("productPage", updated);
      return { ...prev, productPage: updated };
    });
  }, []);

  const updateSAV = useCallback((data: Partial<Omit<SAVContent, "faqItems">>) => {
    setContent(prev => {
      const updated = { ...prev.sav, ...data };
      upsertContent("sav", updated);
      return { ...prev, sav: updated };
    });
  }, []);

  const updatePromoBanner = useCallback((data: Partial<PromoBannerContent>) => {
    setContent(prev => {
      const updated = { ...prev.promoBanner, ...data };
      upsertContent("promoBanner", updated);
      return { ...prev, promoBanner: updated };
    });
  }, []);

  const updateTestimonials = useCallback((testimonials: Testimonial[]) => {
    setContent(prev => {
      const updated = { ...prev.homepage, testimonials };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateFeaturedReviews = useCallback((featuredReviews: FeaturedReview[]) => {
    setContent(prev => {
      const updated = { ...prev.homepage, featuredReviews };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateHomepageFAQ = useCallback((items: FAQItem[]) => {
    setContent(prev => {
      const updated = { ...prev.homepage, faqItems: items };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateProductFAQ = useCallback((items: FAQItem[]) => {
    setContent(prev => {
      const updated = { ...prev.productPage, faqItems: items };
      upsertContent("productPage", updated);
      return { ...prev, productPage: updated };
    });
  }, []);

  const updateSAVFAQ = useCallback((items: FAQItem[]) => {
    setContent(prev => {
      const updated = { ...prev.sav, faqItems: items };
      upsertContent("sav", updated);
      return { ...prev, sav: updated };
    });
  }, []);

  return (
    <ContentContext.Provider value={{
      content, updateGlobal, updateHomepage, updateProductPage,
      updateSAV, updatePromoBanner, updateTestimonials, updateFeaturedReviews,
      updateHomepageFAQ, updateProductFAQ, updateSAVFAQ,
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
