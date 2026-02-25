import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Package, BookOpen, Upload } from "lucide-react";

const services = [
  {
    icon: Phone,
    title: "Nous contacter",
    description: "Par téléphone ou email, notre équipe répond sous 24h ouvrées.",
  },
  {
    icon: Package,
    title: "Pièces détachées",
    description: "Toutes les pièces disponibles, expédition sous 48h en France métropolitaine.",
  },
  {
    icon: BookOpen,
    title: "Guide d'installation",
    description: "Tutoriels et documentation complète pour installer et entretenir votre store.",
  },
];

const faqs = [
  {
    q: "Que couvre exactement la garantie ?",
    a: "La garantie couvre les défauts de fabrication et de matériaux : 10 ans sur la structure aluminium, 5 ans sur la toile Dickson, et 5 ans sur la motorisation Somfy. Elle ne couvre pas l'usure normale, les dommages causés par une utilisation non conforme ou les intempéries exceptionnelles (grêle, tempête).",
  },
  {
    q: "Comment demander une réparation ?",
    a: "Remplissez le formulaire ci-dessus en sélectionnant « Demande de réparation » et en joignant des photos du problème. Notre équipe vous recontacte sous 24h avec un diagnostic et un devis si nécessaire. Pour les interventions sous garantie, aucun frais ne vous sera facturé.",
  },
  {
    q: "Comment commander des pièces détachées ?",
    a: "Contactez-nous avec votre numéro de commande et la référence de la pièce souhaitée. Toutes les pièces de nos stores sont disponibles : toile, bras articulés, moteur, télécommande, coffre, supports muraux. Expédition sous 48h en France métropolitaine.",
  },
  {
    q: "Puis-je remplacer la toile de mon store ?",
    a: "Oui. Nous proposons un service de retoilage pour tous nos modèles. Envoyez-nous les dimensions de votre toile actuelle et le coloris souhaité. Nous vous adressons un devis sous 48h. La nouvelle toile est livrée prête à poser avec un guide d'installation.",
  },
  {
    q: "Intervenez-vous dans toute la France ?",
    a: "Oui, notre réseau de techniciens couvre l'ensemble de la France métropolitaine. Les délais d'intervention varient selon votre localisation : 48 à 72h en zone urbaine, 5 à 7 jours en zone rurale. Les DOM-TOM sont couverts pour l'envoi de pièces détachées uniquement.",
  },
  {
    q: "Mon moteur ou ma télécommande ne fonctionne plus, que faire ?",
    a: "Commencez par vérifier l'alimentation électrique et remplacer les piles de la télécommande. Si le problème persiste, effectuez une réinitialisation en coupant le courant 10 secondes puis en le rétablissant. Si cela ne résout pas le problème, contactez notre SAV avec votre numéro de commande.",
  },
];

const SAVPage = () => {
  return (
    <>
      {/* Hero */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
                Service Après-Vente
              </p>
              <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">
                Un SAV qui vous <span className="italic">ressemble</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Une équipe dédiée, basée en France, à votre écoute du lundi au vendredi.
                Réponse garantie sous 24h ouvrées.
              </p>
            </div>
          </AnimatedSection>

          {/* Service Cards */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="border border-border p-8 text-center space-y-4"
                >
                  <s.icon className="w-8 h-8 mx-auto text-accent" strokeWidth={1.5} />
                  <h3 className="font-serif text-xl">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact Form + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24 mb-24">
            <AnimatedSection className="lg:col-span-2">
              <div>
                <h2 className="font-serif text-3xl mb-8">Demande de support</h2>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Nom" className="rounded-none border-border bg-transparent h-12 text-sm" />
                    <Input placeholder="Email" type="email" className="rounded-none border-border bg-transparent h-12 text-sm" />
                  </div>
                  <Input placeholder="Numéro de commande (optionnel)" className="rounded-none border-border bg-transparent h-12 text-sm" />
                  <Select>
                    <SelectTrigger className="rounded-none border-border bg-transparent h-12 text-sm">
                      <SelectValue placeholder="Type de demande" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reparation">Demande de réparation</SelectItem>
                      <SelectItem value="pieces">Pièces détachées</SelectItem>
                      <SelectItem value="garantie">Garantie</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Décrivez votre problème..." className="rounded-none border-border bg-transparent min-h-[150px] text-sm resize-none" />
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 font-medium">
                      Photos du problème (optionnel)
                    </label>
                    <label className="flex items-center gap-3 border border-border px-4 py-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Ajouter des photos…</span>
                      <input type="file" accept="image/*" multiple className="hidden" />
                    </label>
                  </div>
                  <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-primary/90 transition-colors h-auto w-full">
                    Envoyer ma demande
                  </Button>
                </form>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans font-medium">
                    Téléphone
                  </h3>
                  <p className="text-sm">+33 (0)4 XX XX XX XX</p>
                  <p className="text-xs text-muted-foreground mt-1">Lundi – Vendredi : 9h – 18h</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans font-medium">
                    Email
                  </h3>
                  <p className="text-sm">sav@brand-store.fr</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans font-medium">
                    Engagement
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous nous engageons à vous répondre sous 24h ouvrées.
                    Nos techniciens interviennent sur toute la France métropolitaine.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* FAQ */}
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl mb-8 text-center">Questions fréquentes</h2>
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
        </div>
      </section>
    </>
  );
};

export default SAVPage;
