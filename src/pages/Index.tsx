import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import ProductHighlightSection from "@/components/home/ProductHighlightSection";
import ValuesSection from "@/components/home/ValuesSection";
import ConfiguratorCTASection from "@/components/home/ConfiguratorCTASection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ProcessSection from "@/components/home/ProcessSection";
import FAQSection from "@/components/home/FAQSection";
import ContactCTASection from "@/components/home/ContactCTASection";
import SEOMeta from "@/components/SEOMeta";

const Index = () => (
  <>
    <SEOMeta
      title="Store Banne Sur-Mesure | Fabrication Française | Mon Store"
      description="Découvrez nos stores bannes et coffres 100% sur-mesure, fabriqués en France. Prix transparent, livraison en 4-5 semaines. Configurez le vôtre en ligne."
    />
    <HeroSection />
    <MarqueeSection />
    <ProductHighlightSection />
    <ValuesSection />
    <ConfiguratorCTASection />
    <GallerySection />
    <TestimonialsSection />
    <ProcessSection />
    <FAQSection />
    <ContactCTASection />
  </>
);

export default Index;
