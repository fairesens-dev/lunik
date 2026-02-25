import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useCart } from "@/contexts/CartContext";
import { useCartAbandonment } from "@/hooks/useCartAbandonment";
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
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SocialProofToast from "@/components/SocialProofToast";
import SEOMeta from "@/components/SEOMeta";

const ProductPage = () => {
  const configurator = useConfigurator();
  const { setItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setStage, restoreCart } = useCartAbandonment();

  // Track abandonment stage
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
      }
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

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

  const toileObj = configurator.TOILE_COLORS.find(c => c.name === configurator.toileColor);
  const armatureObj = configurator.ARMATURE_COLORS.find(c => c.name === configurator.armatureColor);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Store Coffre Sur-Mesure",
    "brand": { "@type": "Brand", "name": "Mon Store" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "1890",
      "highPrice": "4500",
      "offerCount": "1",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "850",
    },
  };

  return (
    <>
      <SEOMeta
        title={`Store Coffre Sur-Mesure ${configurator.width}×${configurator.projection}cm | Mon Store`}
        description={`Store coffre sur-mesure ${configurator.width}×${configurator.projection}cm, toile ${configurator.toileColor}, armature ${configurator.armatureColor}. Prix : ${configurator.price}€. Fabriqué en France.`}
        type="product"
        jsonLd={productJsonLd}
      />
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
      <ExitIntentPopup
        width={configurator.width}
        projection={configurator.projection}
        toileColor={configurator.toileColor}
        toileHex={toileObj?.hex || "#fff"}
        armatureColor={configurator.armatureColor}
        armatureHex={armatureObj?.hex || "#333"}
        price={configurator.price}
        motorisation={configurator.motorisation}
        led={configurator.led}
        pack={configurator.pack}
      />
      <SocialProofToast />
    </>
  );
};

export default ProductPage;
