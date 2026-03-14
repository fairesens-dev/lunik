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

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  active: boolean;
}

export interface HighlightFeature {
  id: string;
  icon: string; // lucide icon name
  title: string;
  desc: string;
}

export interface ValueCard {
  id: string;
  icon: string;
  title: string;
  desc: string;
  image: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  decimals: number;
}

export interface ProductFeatureItem {
  id: string;
  label: string;
  title: string;
  body: string;
  specs: string[];
  image: string;
  imageAlt: string;
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
  marqueeText: string;
  productSectionTitle: string;
  productSectionSubtitle: string;
  testimonials: Testimonial[];
  faqItems: FAQItem[];
  featuredReviews: FeaturedReview[];
  galleryItems: GalleryItem[];
  galleryTitle: string;
  gallerySubtitle: string;
  highlightFeatures: HighlightFeature[];
  highlightImage: string;
  highlightTitle: string;
  highlightSubtitle: string;
  highlightDescription: string;
  valueCards: ValueCard[];
  statsItems: StatItem[];
  contactCTATitle: string;
  contactCTASubtitle: string;
  contactCTAImage: string;
  heroPosterImage: string;
  heroVideoUrl: string;
  fabricSectionImage: string;
  productFeaturesTitle1: string;
  productFeaturesTitle2: string;
  productFeatures: ProductFeatureItem[];
}

export interface ProductGalleryItem {
  id: string;
  src: string;
  alt: string;
  height: string;
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
  heroImage: string;
  galleryItems: ProductGalleryItem[];
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

const defaultGalleryItems: GalleryItem[] = [
  { id: "g1", src: "/images/real-montagne-cepe.webp", alt: "Store coffre 530×400 cm toile Cèpe avec vue montagne", caption: "Jean-Pierre, Chamonix (74)", active: true },
  { id: "g2", src: "/images/real-vin-apero.webp", alt: "Apéro sous le store avec télécommande Somfy", caption: "Marie, Lyon (69)", active: true },
  { id: "g3", src: "/images/real-bordeaux.webp", alt: "Store coffre 592×350 cm toile Bordeaux sur terrasse bois", caption: "Thomas, Bordeaux (33)", active: true },
  { id: "g4", src: "/images/real-paris-6eme.webp", alt: "Store blanc naturel posé au 6ème étage à Paris", caption: "Sophie, Paris (75)", active: true },
  { id: "g5", src: "/images/real-bardage-noir.webp", alt: "Store anthracite toile Jais sur bardage moderne", caption: "Lucas, Strasbourg (67)", active: true },
  { id: "g6", src: "/images/real-lecture-piscine.webp", alt: "Détente au bord de la piscine sous le store", caption: "Anne, Aix-en-Provence (13)", active: true },
];

const defaultHighlightFeatures: HighlightFeature[] = [
  { id: "hf1", icon: "ShieldCheck", title: "Coffre intégral", desc: "Protection totale de la toile et du mécanisme quand le store est replié. Étanchéité garantie." },
  { id: "hf2", icon: "Palette", title: "Toile Dickson", desc: "173 coloris en acrylique teint masse avec traitement Cleanguard. Certifiée OEKO-TEX classe II." },
  { id: "hf3", icon: "Smartphone", title: "Motorisation Somfy", desc: "Pilotage télécommande, smartphone ou assistants vocaux. Capteur vent en option." },
  { id: "hf4", icon: "Lightbulb", title: "Éclairage LED", desc: "Bandeau LED intégré au coffre pour prolonger vos soirées en terrasse avec une lumière douce." },
];

const defaultValueCards: ValueCard[] = [
  { id: "v1", icon: "Banknote", title: "Le juste prix", desc: "Vente directe 100% sur internet, sans intermédiaire. Vous payez le produit, pas les frais de vitrine.", image: "/images/store-salon-apero.webp" },
  { id: "v2", icon: "Truck", title: "Livré chez vous", desc: "Livraison offerte par transporteur spécialisé. Dans les 4 à 5 semaines suivant votre commande.", image: "/images/store-terrasse-work.webp" },
  { id: "v3", icon: "ShieldCheck", title: "5 ans de garantie", desc: "Tous nos stores sont garantis 5 ans pièces et main d'œuvre. Nos produits sont 100% réparables.", image: "/images/store-coffre-ouvert.webp" },
  { id: "v4", icon: "Sun", title: "Protection UV 5/5", desc: "Toile Dickson acrylique teint masse avec traitement Cleanguard anti-salissures.", image: "/images/store-led-toile.webp" },
  { id: "v5", icon: "Droplets", title: "Résistance intempéries", desc: "Toile certifiée OEKO-TEX classe II, résistante aux intempéries et aux déchirures.", image: "/images/store-bras-detail.webp" },
  { id: "v6", icon: "Palette", title: "173 coloris", desc: "Toile Orchestra by Dickson disponible en 173 coloris pour s'adapter à tous les styles.", image: "/images/store-toile-detail.webp" },
];

const defaultStatsItems: StatItem[] = [
  { id: "s1", value: 5000, suffix: "+", label: "Stores installés en France", decimals: 0 },
  { id: "s2", value: 4.9, suffix: "/5", label: "Note moyenne Trustpilot", decimals: 1 },
  { id: "s3", value: 173, suffix: "", label: "Coloris Dickson disponibles", decimals: 0 },
  { id: "s4", value: 5, suffix: " ans", label: "De garantie pièces & main d'œuvre", decimals: 0 },
];

const defaultProductFeatures: ProductFeatureItem[] = [
  {
    id: "pf1",
    label: "Toile",
    title: "Toile Orchestra by Dickson",
    body: "173 coloris en acrylique teint masse avec traitement Cleanguard. Certifiée OEKO-TEX classe II, garantie 10 ans. La référence mondiale de la protection solaire.",
    specs: ["Traitement anti-taches et anti-moisissures", "Résistance UV classement 5/5", "Garantie 5 ans"],
    image: "/images/store-toile-detail.webp",
    imageAlt: "Détail de la toile Dickson du store coffre",
  },
  {
    id: "pf2",
    label: "Structure",
    title: "Armature aluminium extrudé",
    body: "Profilés aluminium extrudé thermolaqué, traitement anti-corrosion. Notre coffre intégral protège la toile des intempéries quand le store est replié.",
    specs: ["Aluminium extrudé haute résistance", "Coffre intégral étanche", "Sans entretien"],
    image: "/images/store-bras-fixations.webp",
    imageAlt: "Détail des fixations aluminium du store coffre",
  },
  {
    id: "pf3",
    label: "Motorisation",
    title: "Motorisation Somfy io",
    body: "Pilotez votre store depuis une télécommande, un interrupteur mural ou votre smartphone via l'application TaHoma de Somfy. Compatible assistants vocaux.",
    specs: ["Application TaHoma iOS & Android", "Compatible Google Home & Alexa", "Détecteur de vent en option"],
    image: "/images/store-led-nuit.webp",
    imageAlt: "Store coffre avec éclairage LED intégré de nuit",
  },
];

const defaultContent: SiteContent = {
  global: {
    brandName: "LuniK",
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
    marqueeText: "Trustpilot 4.9/5 · Fabriqué en France · Garantie 5 ans · Toile Dickson · Motorisation Somfy · Éclairage LED · Livraison 4-5 semaines · 100% Sur-Mesure",
    productSectionTitle: "Le Store Coffre\nrepensé de A à Z",
    productSectionSubtitle: "Un seul produit. Le meilleur de sa catégorie.",
    testimonials: [],
    faqItems: [],
    featuredReviews: [],
    galleryItems: defaultGalleryItems,
    highlightFeatures: defaultHighlightFeatures,
    highlightImage: "/images/store-vue-ensemble.webp",
    highlightTitle: "Chaque détail",
    highlightSubtitle: "a été pensé",
    highlightDescription: "Notre store coffre intégral combine les meilleurs matériaux du marché — toile Dickson, aluminium extrudé, motorisation Somfy — dans un produit 100% fabriqué en France et conçu pour durer.",
    valueCards: defaultValueCards,
    statsItems: defaultStatsItems,
    contactCTATitle: "Une question avant de configurer ?",
    contactCTASubtitle: "Notre équipe est disponible du lundi au vendredi, de 9h à 18h.",
    contactCTAImage: "/images/real-sunset-terrasse.webp",
    heroPosterImage: "/images/store-vue-ensemble.webp",
    heroVideoUrl: "/videos/hero-store.mp4",
    fabricSectionImage: "/images/store-toile-detail.webp",
    productFeaturesTitle1: "Conçu pour durer.",
    productFeaturesTitle2: "Pensé pour vous.",
    productFeatures: defaultProductFeatures,
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
    heroImage: "/images/store-salon-apero.webp",
    galleryItems: [
      { id: "pg1", src: "/images/real-sunset-terrasse.webp", alt: "Coucher de soleil sous le store sur terrasse", height: "h-64" },
      { id: "pg2", src: "/images/real-maison-platine.webp", alt: "Store coffre toile Platine sur maison", height: "h-80" },
      { id: "pg3", src: "/images/real-vin-apero.webp", alt: "Apéro sous le store avec télécommande Somfy", height: "h-72" },
      { id: "pg4", src: "/images/real-3stores-paris.webp", alt: "Triple store blanc posé au 3ème étage à Paris", height: "h-80" },
      { id: "pg5", src: "/images/real-montagne-cepe.webp", alt: "Store coffre avec vue montagne", height: "h-64" },
      { id: "pg6", src: "/images/real-bordeaux.webp", alt: "Store coffre toile Bordeaux sur balcon bois", height: "h-72" },
    ],
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
    bgColor: "#7B8E7B",
    textColor: "#FFFFFF",
    ctaText: "En profiter",
    ctaUrl: "/#configurator",
  },
};

// ── Context ────────────────────────────────────────────

interface ContentContextValue {
  content: SiteContent;
  updateGlobal: (data: Partial<GlobalContent>) => void;
  updateHomepage: (data: Partial<Omit<HomepageContent, "testimonials" | "faqItems" | "featuredReviews" | "galleryItems">>) => void;
  updateProductPage: (data: Partial<Omit<ProductPageContent, "faqItems">>) => void;
  updateSAV: (data: Partial<Omit<SAVContent, "faqItems">>) => void;
  updatePromoBanner: (data: Partial<PromoBannerContent>) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateFeaturedReviews: (reviews: FeaturedReview[]) => void;
  updateHomepageFAQ: (items: FAQItem[]) => void;
  updateProductFAQ: (items: FAQItem[]) => void;
  updateSAVFAQ: (items: FAQItem[]) => void;
  updateGalleryItems: (items: GalleryItem[]) => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

async function upsertContent(id: string, data: unknown) {
  await supabase.from("site_content" as any).upsert({ id, data } as any, { onConflict: "id" });
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    (async () => {
      const { data: rows } = (await supabase.from("site_content" as any).select("id, data")) as any;
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
    setContent((prev) => {
      const updated = { ...prev.global, ...data };
      upsertContent("global", updated);
      return { ...prev, global: updated };
    });
  }, []);

  const updateHomepage = useCallback(
    (data: Partial<Omit<HomepageContent, "testimonials" | "faqItems" | "featuredReviews" | "galleryItems">>) => {
      setContent((prev) => {
        const updated = { ...prev.homepage, ...data };
        upsertContent("homepage", updated);
        return { ...prev, homepage: updated };
      });
    },
    [],
  );

  const updateProductPage = useCallback((data: Partial<Omit<ProductPageContent, "faqItems">>) => {
    setContent((prev) => {
      const updated = { ...prev.productPage, ...data };
      upsertContent("productPage", updated);
      return { ...prev, productPage: updated };
    });
  }, []);

  const updateSAV = useCallback((data: Partial<Omit<SAVContent, "faqItems">>) => {
    setContent((prev) => {
      const updated = { ...prev.sav, ...data };
      upsertContent("sav", updated);
      return { ...prev, sav: updated };
    });
  }, []);

  const updatePromoBanner = useCallback((data: Partial<PromoBannerContent>) => {
    setContent((prev) => {
      const updated = { ...prev.promoBanner, ...data };
      upsertContent("promoBanner", updated);
      return { ...prev, promoBanner: updated };
    });
  }, []);

  const updateTestimonials = useCallback((testimonials: Testimonial[]) => {
    setContent((prev) => {
      const updated = { ...prev.homepage, testimonials };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateFeaturedReviews = useCallback((featuredReviews: FeaturedReview[]) => {
    setContent((prev) => {
      const updated = { ...prev.homepage, featuredReviews };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateHomepageFAQ = useCallback((items: FAQItem[]) => {
    setContent((prev) => {
      const updated = { ...prev.homepage, faqItems: items };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  const updateProductFAQ = useCallback((items: FAQItem[]) => {
    setContent((prev) => {
      const updated = { ...prev.productPage, faqItems: items };
      upsertContent("productPage", updated);
      return { ...prev, productPage: updated };
    });
  }, []);

  const updateSAVFAQ = useCallback((items: FAQItem[]) => {
    setContent((prev) => {
      const updated = { ...prev.sav, faqItems: items };
      upsertContent("sav", updated);
      return { ...prev, sav: updated };
    });
  }, []);

  const updateGalleryItems = useCallback((items: GalleryItem[]) => {
    setContent((prev) => {
      const updated = { ...prev.homepage, galleryItems: items };
      upsertContent("homepage", updated);
      return { ...prev, homepage: updated };
    });
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        updateGlobal,
        updateHomepage,
        updateProductPage,
        updateSAV,
        updatePromoBanner,
        updateTestimonials,
        updateFeaturedReviews,
        updateHomepageFAQ,
        updateProductFAQ,
        updateSAVFAQ,
        updateGalleryItems,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}