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

const ContactPage = () => {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
              Contact
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">
              Parlons de votre <span className="italic">projet</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Besoin de conseils ou d'un devis personnalisé ? Remplissez le formulaire ci-dessous
              et nous vous répondrons sous 24h.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          <AnimatedSection className="lg:col-span-2">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Prénom" className="rounded-none border-border bg-transparent h-12 text-sm" />
                <Input placeholder="Nom" className="rounded-none border-border bg-transparent h-12 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Email" type="email" className="rounded-none border-border bg-transparent h-12 text-sm" />
                <Input placeholder="Téléphone" type="tel" className="rounded-none border-border bg-transparent h-12 text-sm" />
              </div>
              <Select>
                <SelectTrigger className="rounded-none border-border bg-transparent h-12 text-sm">
                  <SelectValue placeholder="Objet de votre demande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="devis">Demande de devis</SelectItem>
                  <SelectItem value="info">Renseignements</SelectItem>
                  <SelectItem value="sav">Service après-vente</SelectItem>
                  <SelectItem value="partenariat">Partenariat</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Votre message..."
                className="rounded-none border-border bg-transparent min-h-[180px] text-sm resize-none"
              />
              <Button className="bg-primary text-primary-foreground px-10 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-accent-light transition-colors h-auto">
                Envoyer
              </Button>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-10">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans font-medium">
                  Coordonnées
                </h3>
                <div className="space-y-2 text-sm">
                  <p>contact@brand-store.fr</p>
                  <p>+33 (0)4 XX XX XX XX</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans font-medium">
                  Horaires
                </h3>
                <div className="space-y-2 text-sm">
                  <p>Lundi – Vendredi : 9h – 18h</p>
                  <p>Samedi : 9h – 12h</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans font-medium">
                  Showroom
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Zone Industrielle des Oliviers</p>
                  <p>13100 Aix-en-Provence</p>
                  <p>France</p>
                </div>
              </div>
              {/* Map placeholder */}
              <div className="aspect-video bg-secondary border border-border flex items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Carte interactive</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
