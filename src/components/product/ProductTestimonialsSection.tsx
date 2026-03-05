import AnimatedSection from "@/components/AnimatedSection";
import TrustpilotReviews from "@/components/TrustpilotReviews";
import TrustpilotWidget from "@/components/TrustpilotWidget";

const ProductTestimonialsSection = () => {
  return (
    <section className="py-28 lg:py-36 bg-background">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
              Ce que nos clients <span className="text-primary">disent</span>
            </h2>
          </div>
        </AnimatedSection>

        <TrustpilotReviews maxItems={6} showFilters={true} showLoadMore={true} />

        <div className="mt-16">
          <TrustpilotWidget />
        </div>
      </div>
    </section>
  );
};

export default ProductTestimonialsSection;
