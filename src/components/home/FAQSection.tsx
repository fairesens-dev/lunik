import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContent } from "@/contexts/ContentContext";

const FAQSection = () => {
  const { content } = useContent();
  const faqs = content.homepage.faqItems.filter(f => f.active);

  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-16">
            Questions <span className="italic">fréquentes</span>
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="font-serif text-lg text-left">{faq.question}</AccordionTrigger>
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
