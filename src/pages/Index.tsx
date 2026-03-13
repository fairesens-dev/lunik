import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useCart } from "@/contexts/CartContext";
import { useCartAbandonment } from "@/hooks/useCartAbandonment";
import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import ProductHighlightSection from "@/components/home/ProductHighlightSection";
import ProductFeaturesSection from "@/components/product/ProductFeaturesSection";
import ValuesSection from "@/components/home/ValuesSection";
import ConfiguratorCTASection from "@/components/home/ConfiguratorCTASection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

import FAQSection from "@/components/home/FAQSection";
import ContactCTASection from "@/components/home/ContactCTASection";
import StickyCTABar from "@/components/home/StickyCTABar";
import SocialProofToast from "@/components/SocialProofToast";
import SEOMeta from "@/components/SEOMeta";

const Index = () => {
  const configurator = useConfigurator();
  const { setItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setStage, restoreCart } = useCartAbandonment();

  useEffect(() => { setStage("configurateur"); }, [setStage]);

  // Restore cart from email link
  useEffect(() => {
    if (searchParams.get("restore") === "true") {
      const saved = restoreCart();
      if (saved) {
        setItem(saved);
        configurator.setWidth(saved.configuration.width);
        configurator.setProjection(saved.configuration.projection);
        if (saved.configuration.toileColor?.label) configurator.setToileColor(saved.configuration.toileColor.label);
        if (saved.configuration.armatureColor?.label) configurator.setArmatureColor(saved.configuration.armatureColor.label);
        navigate("/configurateur");
      }
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SEOMeta
        title="Store Banne Sur-Mesure | Fabrication Française | LuniK"
        description="Découvrez nos stores bannes et coffres 100% sur-mesure, fabriqués en France. Prix transparent, livraison en 4-5 semaines. Configurez le vôtre en ligne."
      />
      <HeroSection />
      <MarqueeSection />
      <ProductHighlightSection />
      <ProductFeaturesSection />
      <ValuesSection />
      <ConfiguratorCTASection />
      <GallerySection />
      <TestimonialsSection />
      
      <FAQSection />
      <ContactCTASection />
      <StickyCTABar />
      <SocialProofToast />
    </>
  );
};

export default Index;
