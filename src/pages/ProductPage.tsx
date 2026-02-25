import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useCart } from "@/contexts/CartContext";
import ProductHeroSection from "@/components/product/ProductHeroSection";
import ProductMarqueeSection from "@/components/product/ProductMarqueeSection";
import ProductFeaturesSection from "@/components/product/ProductFeaturesSection";
import ProductGallerySection from "@/components/product/ProductGallerySection";
import ConfiguratorSection from "@/components/product/ConfiguratorSection";
import ProductTestimonialsSection from "@/components/product/ProductTestimonialsSection";
import ProductProcessSection from "@/components/product/ProductProcessSection";
import ProductWarrantySection from "@/components/product/ProductWarrantySection";
import ProductFAQSection from "@/components/product/ProductFAQSection";
import ProductFinalCTA from "@/components/product/ProductFinalCTA";

const ProductPage = () => {
  const configurator = useConfigurator();
  const { setItem } = useCart();
  const navigate = useNavigate();

  const handleOrder = () => {
    const motorOption = configurator.settings.options.find(o => o.id === "motorisation");
    const ledOption = configurator.settings.options.find(o => o.id === "led");
    const packOption = configurator.settings.options.find(o => o.id === "pack-connect");

    const toileObj = configurator.TOILE_COLORS.find(c => c.name === configurator.toileColor);
    const armatureObj = configurator.ARMATURE_COLORS.find(c => c.name === configurator.armatureColor);

    const basePrice = Math.max(
      configurator.settings.pricing.minPrice,
      Math.round(configurator.surfaceArea * configurator.settings.pricing.baseRate)
    );

    const motorPrice = configurator.motorisation && !configurator.pack ? (motorOption?.price ?? 390) : 0;
    const ledPrice = configurator.led && !configurator.pack ? (ledOption?.price ?? 290) : 0;
    const packPrice = configurator.pack ? (packOption?.price ?? 590) : 0;

    setItem({
      productId: "store-coffre",
      productName: "Store Coffre Sur-Mesure",
      configuration: {
        width: configurator.width,
        projection: configurator.projection,
        surface: configurator.surfaceArea,
        toileColor: {
          id: configurator.toileColor,
          hex: toileObj?.hex || "#fff",
          label: configurator.toileColor,
        },
        armatureColor: {
          id: configurator.armatureColor,
          hex: armatureObj?.hex || "#333",
          label: configurator.armatureColor,
        },
        options: {
          motorisation: configurator.motorisation,
          led: configurator.led,
          packConnect: configurator.pack,
        },
      },
      pricing: {
        base: basePrice,
        motorisation: motorPrice,
        led: ledPrice,
        packConnect: packPrice,
        total: configurator.price,
      },
      quantity: 1,
    });

    navigate("/checkout");
  };

  return (
    <>
      <ProductHeroSection />
      <ProductMarqueeSection />
      <ProductFeaturesSection />
      <ProductGallerySection />
      <ConfiguratorSection {...configurator} onOrder={handleOrder} />
      <ProductTestimonialsSection />
      <ProductProcessSection />
      <ProductWarrantySection />
      <ProductFAQSection />
      <ProductFinalCTA />
    </>
  );
};

export default ProductPage;
