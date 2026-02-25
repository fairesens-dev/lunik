import AnimatedSection from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Puis-je me faire livrer partout en France ?", a: "Oui, nous livrons sur l'ensemble du territoire métropolitain. La livraison est assurée par nos transporteurs partenaires, avec prise de rendez-vous." },
  { q: "Quelle est la taille maximum de mon store ?", a: "Nos stores sont disponibles de 150 cm à 600 cm de largeur, avec une avancée pouvant aller jusqu'à 400 cm selon les modèles." },
  { q: "La motorisation Somfy est-elle incluse ?", a: "La motorisation Somfy est disponible en option lors de la configuration. Elle inclut un moteur silencieux, une télécommande et la compatibilité avec les assistants vocaux." },
  { q: "Comment se passe l'installation ?", a: "Vous pouvez installer votre store vous-même grâce à notre guide détaillé, ou opter pour notre service de pose par un installateur certifié dans votre région." },
  { q: "Quels délais de fabrication ?", a: "Comptez 4 à 5 semaines entre votre commande et la livraison. Votre store est fabriqué sur-mesure dans notre atelier en France." },
  { q: "Y a-t-il une garantie ?", a: "Tous nos stores sont garantis 5 ans pièces et main d'œuvre. La toile Dickson bénéficie d'une garantie fabricant de 10 ans." },
];

const FAQSection = () => (
  <section className="py-28 lg:py-36">
    <div className="max-w-3xl mx-auto px-6">
      <AnimatedSection>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-16">
          Questions <span className="italic">fréquentes</span>
        </h2>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="font-serif text-lg text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </div>
  </section>
);

export default FAQSection;
