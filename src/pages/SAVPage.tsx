import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Comment entretenir la toile de mon store ?",
    a: "Nettoyez régulièrement à l'eau claire et au savon doux. Laissez sécher complètement avant de replier. Évitez les produits chimiques et le nettoyeur haute pression.",
  },
  {
    q: "Mon store ne se rétracte plus, que faire ?",
    a: "Vérifiez d'abord l'alimentation électrique et la télécommande. Si le problème persiste, contactez notre service technique qui interviendra sous 48h.",
  },
  {
    q: "Puis-je remplacer la toile de mon store ?",
    a: "Oui, nous proposons un service de retoilage pour tous nos modèles. Contactez-nous pour un devis de remplacement de toile.",
  },
  {
    q: "Quelle est la durée de garantie ?",
    a: "Nos stores sont garantis 10 ans sur la structure, 5 ans sur la toile et 5 ans sur la motorisation Somfy.",
  },
  {
    q: "Intervenez-vous dans toute la France ?",
    a: "Oui, notre réseau de techniciens couvre l'ensemble de la France métropolitaine pour l'installation et le SAV.",
  },
];

const SAVPage = () => {
  return (
    <>
      <section className="py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
                Service Après-Vente
              </p>
              <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">
                Nous sommes là <span className="italic">pour vous</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Une question, un problème technique ? Notre équipe SAV basée en France est à votre écoute.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* FAQ */}
            <AnimatedSection>
              <div>
                <h2 className="font-serif text-3xl mb-8">Questions fréquentes</h2>
                <Accordion type="single" collapsible>
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                      <AccordionTrigger className="text-sm font-medium hover:no-underline py-5 text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="font-serif text-3xl mb-8">Demande de support</h2>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Nom" className="rounded-none border-border bg-transparent h-12 text-sm" />
                    <Input placeholder="Email" type="email" className="rounded-none border-border bg-transparent h-12 text-sm" />
                  </div>
                  <Input placeholder="Numéro de commande (optionnel)" className="rounded-none border-border bg-transparent h-12 text-sm" />
                  <Textarea placeholder="Décrivez votre problème..." className="rounded-none border-border bg-transparent min-h-[150px] text-sm resize-none" />
                  <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-accent-light transition-colors h-auto w-full">
                    Envoyer ma demande
                  </Button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default SAVPage;
