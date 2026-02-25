import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Quelles sont les dimensions maximales du store ?", a: "La largeur maximale est de 600 cm et l'avancée maximale de 400 cm. Pour des configurations supérieures, contactez-nous." },
  { q: "La motorisation Somfy est-elle difficile à installer ?", a: "Non. La motorisation Somfy io est plug & play. Elle est précâblée et configurée avant expédition." },
  { q: "Puis-je commander des échantillons de toile ?", a: "Oui, nous envoyons des échantillons Dickson gratuitement sous 48h. Utilisez le lien présent dans le configurateur." },
  { q: "Quel est le délai de fabrication et de livraison ?", a: "Votre store est fabriqué et livré en 4 à 5 semaines après confirmation de votre commande et validation du paiement." },
  { q: "Puis-je l'installer moi-même ?", a: "Oui. Chaque store est livré avec un guide d'installation détaillé. Une option d'installation par nos poseurs certifiés est également disponible." },
  { q: "Quelles garanties ai-je sur mon achat ?", a: "Garantie légale de conformité, garantie commerciale 5 ans pièces et main d'œuvre, et droit de rétractation de 14 jours." },
];

const ProductFAQSection = () => (
  <section className="py-28 lg:py-36 bg-background">
    <div className="max-w-3xl mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-12">
          Vos questions <span className="italic">fréquentes</span>
        </h2>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="font-serif text-lg hover:no-underline py-5">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </div>
  </section>
);

export default ProductFAQSection;
