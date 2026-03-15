import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";
import { useContactWidget } from "@/contexts/ContactWidgetContext";

const ContactCTASection = () => {
  const { content } = useContent();
  const { contactCTATitle, contactCTASubtitle, contactCTAImage } = content.homepage;
  const { openWidget, setScreen } = useContactWidget();

  const handleCallbackClick = () => {
    setScreen("callback");
    openWidget();
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <img
        src={contactCTAImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {contactCTATitle}
          </h2>
          <p className="text-white/60 text-lg mb-12">
            {contactCTASubtitle}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleCallbackClick}
              className="border-white/30 text-white px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-white/10 h-auto bg-transparent"
            >
              Nous appeler
            </Button>
            <Button disabled className="bg-white/50 text-black/40 px-8 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto cursor-not-allowed">
              Bientôt
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactCTASection;
