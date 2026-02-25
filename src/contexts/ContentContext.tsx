import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────

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
    testimonials: [
      { id: "t1", name: "David M.", city: "Lyon", text: "Livraison rapide, produit conforme, équipe réactive. Je recommande sans hésiter.", rating: 5, active: true },
      { id: "t2", name: "Alain R.", city: "Bordeaux", text: "Très bien conseillé, rdv téléphonique tenu, équipe d'installation au top.", rating: 5, active: true },
      { id: "t3", name: "Xavier P.", city: "Strasbourg", text: "Deuxième commande, troisième store. Toujours aussi satisfait.", rating: 5, active: true },
      { id: "t4", name: "Marie L.", city: "Nantes", text: "Excellent rapport qualité/prix, belle finition, parfait pour notre terrasse.", rating: 5, active: true },
    ],
    faqItems: [
      { id: "hf1", question: "Puis-je me faire livrer partout en France ?", answer: "Oui, nous livrons sur l'ensemble du territoire métropolitain. La livraison est assurée par nos transporteurs partenaires, avec prise de rendez-vous.", active: true },
      { id: "hf2", question: "Quelle est la taille maximum de mon store ?", answer: "Nos stores sont disponibles de 150 cm à 600 cm de largeur, avec une avancée pouvant aller jusqu'à 400 cm selon les modèles.", active: true },
      { id: "hf3", question: "La motorisation Somfy est-elle incluse ?", answer: "La motorisation Somfy est disponible en option lors de la configuration. Elle inclut un moteur silencieux, une télécommande et la compatibilité avec les assistants vocaux.", active: true },
      { id: "hf4", question: "Comment se passe l'installation ?", answer: "Vous pouvez installer votre store vous-même grâce à notre guide détaillé, ou opter pour notre service de pose par un installateur certifié dans votre région.", active: true },
      { id: "hf5", question: "Quels délais de fabrication ?", answer: "Comptez 4 à 5 semaines entre votre commande et la livraison. Votre store est fabriqué sur-mesure dans notre atelier en France.", active: true },
      { id: "hf6", question: "Y a-t-il une garantie ?", answer: "Tous nos stores sont garantis 5 ans pièces et main d'œuvre. La toile Dickson bénéficie d'une garantie fabricant de 10 ans.", active: true },
    ],
  },
  productPage: {
    heroTitle: "Le store qui\nredéfinit l'extérieur.",
    heroOverline: "Store Coffre · Fabrication Française Sur-Mesure",
    heroSubtitle: "Aluminium premium, toile Dickson, motorisation Somfy. Fabriqué sur-mesure en France selon vos dimensions exactes. Livré ou installé en 4 à 5 semaines.",
    configuratorTitle: "Créez votre store\nsur-mesure",
    configuratorSubtitle: "Renseignez vos dimensions, choisissez vos coloris et vos options. Votre prix s'affiche immédiatement, sans engagement.",
    stepLabels: ["VOS DIMENSIONS", "COULEUR DE TOILE", "COULEUR DE L'ARMATURE", "OPTIONS"],
    orderConfirmationMessage: "Merci pour votre commande ! Notre équipe vous contactera sous 24h pour confirmer les détails.",
    faqItems: [
      { id: "pf1", question: "Quelles sont les dimensions maximales du store ?", answer: "La largeur maximale est de 600 cm et l'avancée maximale de 400 cm. Pour des configurations supérieures, contactez-nous.", active: true },
      { id: "pf2", question: "La motorisation Somfy est-elle difficile à installer ?", answer: "Non. La motorisation Somfy io est plug & play. Elle est précâblée et configurée avant expédition.", active: true },
      { id: "pf3", question: "Puis-je commander des échantillons de toile ?", answer: "Oui, nous envoyons des échantillons Dickson gratuitement sous 48h. Utilisez le lien présent dans le configurateur.", active: true },
      { id: "pf4", question: "Quel est le délai de fabrication et de livraison ?", answer: "Votre store est fabriqué et livré en 4 à 5 semaines après confirmation de votre commande et validation du paiement.", active: true },
      { id: "pf5", question: "Puis-je l'installer moi-même ?", answer: "Oui. Chaque store est livré avec un guide d'installation détaillé. Une option d'installation par nos poseurs certifiés est également disponible.", active: true },
      { id: "pf6", question: "Quelles garanties ai-je sur mon achat ?", answer: "Garantie légale de conformité, garantie commerciale 5 ans pièces et main d'œuvre, et droit de rétractation de 14 jours.", active: true },
    ],
  },
  sav: {
    heroTitle: "Un SAV qui vous ressemble",
    heroSubtitle: "Une équipe dédiée, basée en France, à votre écoute du lundi au vendredi. Réponse garantie sous 24h ouvrées.",
    hours: "Lundi – Vendredi : 9h – 18h",
    responseDelay: "sous 24h",
    faqItems: [
      { id: "sf1", question: "Que couvre exactement la garantie ?", answer: "La garantie couvre les défauts de fabrication et de matériaux : 10 ans sur la structure aluminium, 5 ans sur la toile Dickson, et 5 ans sur la motorisation Somfy. Elle ne couvre pas l'usure normale, les dommages causés par une utilisation non conforme ou les intempéries exceptionnelles (grêle, tempête).", active: true },
      { id: "sf2", question: "Comment demander une réparation ?", answer: "Remplissez le formulaire ci-dessus en sélectionnant « Demande de réparation » et en joignant des photos du problème. Notre équipe vous recontacte sous 24h avec un diagnostic et un devis si nécessaire. Pour les interventions sous garantie, aucun frais ne vous sera facturé.", active: true },
      { id: "sf3", question: "Comment commander des pièces détachées ?", answer: "Contactez-nous avec votre numéro de commande et la référence de la pièce souhaitée. Toutes les pièces de nos stores sont disponibles : toile, bras articulés, moteur, télécommande, coffre, supports muraux. Expédition sous 48h en France métropolitaine.", active: true },
      { id: "sf4", question: "Puis-je remplacer la toile de mon store ?", answer: "Oui. Nous proposons un service de retoilage pour tous nos modèles. Envoyez-nous les dimensions de votre toile actuelle et le coloris souhaité. Nous vous adressons un devis sous 48h. La nouvelle toile est livrée prête à poser avec un guide d'installation.", active: true },
      { id: "sf5", question: "Intervenez-vous dans toute la France ?", answer: "Oui, notre réseau de techniciens couvre l'ensemble de la France métropolitaine. Les délais d'intervention varient selon votre localisation : 48 à 72h en zone urbaine, 5 à 7 jours en zone rurale. Les DOM-TOM sont couverts pour l'envoi de pièces détachées uniquement.", active: true },
      { id: "sf6", question: "Mon moteur ou ma télécommande ne fonctionne plus, que faire ?", answer: "Commencez par vérifier l'alimentation électrique et remplacer les piles de la télécommande. Si le problème persiste, effectuez une réinitialisation en coupant le courant 10 secondes puis en le rétablissant. Si cela ne résout pas le problème, contactez notre SAV avec votre numéro de commande.", active: true },
    ],
  },
  promoBanner: {
    active: false,
    text: "🎉 PROMO PRÉSAISON — 10% de remise ce mois !",
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
  updateHomepage: (data: Partial<Omit<HomepageContent, "testimonials" | "faqItems">>) => void;
  updateProductPage: (data: Partial<Omit<ProductPageContent, "faqItems">>) => void;
  updateSAV: (data: Partial<Omit<SAVContent, "faqItems">>) => void;
  updatePromoBanner: (data: Partial<PromoBannerContent>) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateHomepageFAQ: (items: FAQItem[]) => void;
  updateProductFAQ: (items: FAQItem[]) => void;
  updateSAVFAQ: (items: FAQItem[]) => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const STORAGE_KEY = "site_content";

function loadFromStorage(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deep merge with defaults to handle new fields
      return {
        global: { ...defaultContent.global, ...parsed.global },
        homepage: { ...defaultContent.homepage, ...parsed.homepage },
        productPage: { ...defaultContent.productPage, ...parsed.productPage },
        sav: { ...defaultContent.sav, ...parsed.sav },
        promoBanner: { ...defaultContent.promoBanner, ...parsed.promoBanner },
      };
    }
  } catch { /* ignore */ }
  return defaultContent;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const updateGlobal = useCallback((data: Partial<GlobalContent>) => {
    setContent(prev => ({ ...prev, global: { ...prev.global, ...data } }));
  }, []);

  const updateHomepage = useCallback((data: Partial<Omit<HomepageContent, "testimonials" | "faqItems">>) => {
    setContent(prev => ({ ...prev, homepage: { ...prev.homepage, ...data } }));
  }, []);

  const updateProductPage = useCallback((data: Partial<Omit<ProductPageContent, "faqItems">>) => {
    setContent(prev => ({ ...prev, productPage: { ...prev.productPage, ...data } }));
  }, []);

  const updateSAV = useCallback((data: Partial<Omit<SAVContent, "faqItems">>) => {
    setContent(prev => ({ ...prev, sav: { ...prev.sav, ...data } }));
  }, []);

  const updatePromoBanner = useCallback((data: Partial<PromoBannerContent>) => {
    setContent(prev => ({ ...prev, promoBanner: { ...prev.promoBanner, ...data } }));
  }, []);

  const updateTestimonials = useCallback((testimonials: Testimonial[]) => {
    setContent(prev => ({ ...prev, homepage: { ...prev.homepage, testimonials } }));
  }, []);

  const updateHomepageFAQ = useCallback((items: FAQItem[]) => {
    setContent(prev => ({ ...prev, homepage: { ...prev.homepage, faqItems: items } }));
  }, []);

  const updateProductFAQ = useCallback((items: FAQItem[]) => {
    setContent(prev => ({ ...prev, productPage: { ...prev.productPage, faqItems: items } }));
  }, []);

  const updateSAVFAQ = useCallback((items: FAQItem[]) => {
    setContent(prev => ({ ...prev, sav: { ...prev.sav, faqItems: items } }));
  }, []);

  return (
    <ContentContext.Provider value={{
      content, updateGlobal, updateHomepage, updateProductPage,
      updateSAV, updatePromoBanner, updateTestimonials,
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
