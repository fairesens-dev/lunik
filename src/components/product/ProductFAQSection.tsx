import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContent } from "@/contexts/ContentContext";

const ProductFAQSection = () => {
  const { content } = useContent();
  const faqs = content.productPage.faqItems.filter(f => f.active);

  return (
    <section className="py-28 lg:py-36 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-12">
            Vos questions <span className="text-primary">fréquentes</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductFAQSection;
