import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContent } from "@/contexts/ContentContext";

const FAQSection = () => {
  const { content } = useContent();
  const faqs = content.homepage.faqItems.filter(f => f.active);

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-center mb-16">
            Questions <span className="text-primary">fréquentes</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-xl px-4 hover:border-primary/40 transition-colors">
                <AccordionTrigger className="font-display text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQSection;
