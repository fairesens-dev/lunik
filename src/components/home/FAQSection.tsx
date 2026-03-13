import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContent } from "@/contexts/ContentContext";

const FAQSection = () => {
  const { content } = useContent();
  const faqs = content.homepage.faqItems.filter(f => f.active);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
              Besoin d'aide ?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Questions<br /><span className="text-accent-light">fréquentes</span>
            </h2>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-border py-2">
                <AccordionTrigger className="font-display text-base md:text-lg font-semibold text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQSection;
