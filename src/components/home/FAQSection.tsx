import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContent } from "@/contexts/ContentContext";

const FAQSection = () => {
  const { content } = useContent();
  const faqs = content.homepage.faqItems.filter(f => f.active);

  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-16">
            Questions<br /><span className="text-accent-light">fréquentes</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-border py-2">
                <AccordionTrigger className="font-display text-lg font-bold text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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
