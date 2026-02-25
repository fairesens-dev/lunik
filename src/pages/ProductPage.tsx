import { useState } from "react";
import { useConfigurator } from "@/hooks/useConfigurator";
import ProductHeroSection from "@/components/product/ProductHeroSection";
import ProductMarqueeSection from "@/components/product/ProductMarqueeSection";
import ProductFeaturesSection from "@/components/product/ProductFeaturesSection";
import ProductGallerySection from "@/components/product/ProductGallerySection";
import ConfiguratorSection from "@/components/product/ConfiguratorSection";
import OrderModal from "@/components/product/OrderModal";
import ProductTestimonialsSection from "@/components/product/ProductTestimonialsSection";
import ProductProcessSection from "@/components/product/ProductProcessSection";
import ProductWarrantySection from "@/components/product/ProductWarrantySection";
import ProductFAQSection from "@/components/product/ProductFAQSection";
import ProductFinalCTA from "@/components/product/ProductFinalCTA";

const ProductPage = () => {
  const configurator = useConfigurator();
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <ProductHeroSection />
      <ProductMarqueeSection />
      <ProductFeaturesSection />
      <ProductGallerySection />
      <ConfiguratorSection {...configurator} onOrder={() => setOrderOpen(true)} />
      <OrderModal
        open={orderOpen}
        onOpenChange={setOrderOpen}
        width={configurator.width}
        projection={configurator.projection}
        toileColor={configurator.toileColor}
        armatureColor={configurator.armatureColor}
        optionsSummary={configurator.optionsSummary}
        price={configurator.price}
      />
      <ProductTestimonialsSection />
      <ProductProcessSection />
      <ProductWarrantySection />
      <ProductFAQSection />
      <ProductFinalCTA />
    </>
  );
};

export default ProductPage;
