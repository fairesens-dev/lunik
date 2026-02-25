import { useState } from "react";
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
import { Phone, Mail, Clock, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOMeta from "@/components/SEOMeta";

const ContactPage = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", subject: "", message: "" });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.from("contact_messages" as any).insert({
        first_name: form.prenom,
        last_name: form.nom,
        email: form.email,
        phone: form.telephone,
        subject: form.subject,
        message: form.message,
      } as any);
      setSubmitted(true);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-28 lg:py-36">
      <SEOMeta title="Contact | Mon Store" description="Contactez notre équipe pour un conseil personnalisé ou un devis sur-mesure. Réponse garantie sous 24h." />
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
              Besoin de conseils ou d'un devis personnalisé ? Remplissez le formulaire
              et nous vous répondrons sous 24h.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Left — Info */}
          <AnimatedSection>
            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-0.5 text-accent" strokeWidth={1.5} />
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">Téléphone</h3>
                  <p className="text-sm">+33 (0)4 XX XX XX XX</p>
                  <p className="text-xs text-muted-foreground mt-1">Lundi – Vendredi : 9h – 18h</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-0.5 text-accent" strokeWidth={1.5} />
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">Email</h3>
                  <p className="text-sm">contact@brand-store.fr</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 mt-0.5 text-accent" strokeWidth={1.5} />
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">Horaires</h3>
                  <div className="text-sm space-y-1">
                    <p>Lundi – Vendredi : 9h – 18h</p>
                    <p>Samedi : 9h – 12h</p>
                    <p>Dimanche : Fermé</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" strokeWidth={1.5} />
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">Showroom</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Zone Industrielle des Oliviers</p>
                    <p>13100 Aix-en-Provence</p>
                    <p>France</p>
                  </div>
                </div>
              </div>
              {/* Map placeholder */}
              <div className="aspect-video bg-secondary border border-border flex items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Carte interactive</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Form */}
          <AnimatedSection delay={0.2} className="lg:col-span-2">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-2xl mb-2">Message envoyé !</h3>
                <p className="text-sm text-muted-foreground">Nous vous répondrons sous 24h.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Prénom" required value={form.prenom} onChange={e => update("prenom", e.target.value)} className="rounded-none border-border bg-transparent h-12 text-sm" />
                  <Input placeholder="Nom" required value={form.nom} onChange={e => update("nom", e.target.value)} className="rounded-none border-border bg-transparent h-12 text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Email" type="email" required value={form.email} onChange={e => update("email", e.target.value)} className="rounded-none border-border bg-transparent h-12 text-sm" />
                  <Input placeholder="Téléphone" type="tel" value={form.telephone} onChange={e => update("telephone", e.target.value)} className="rounded-none border-border bg-transparent h-12 text-sm" />
                </div>
                <Select value={form.subject} onValueChange={v => update("subject", v)}>
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
                  required
                  value={form.message}
                  onChange={e => update("message", e.target.value)}
                  className="rounded-none border-border bg-transparent min-h-[180px] text-sm resize-none"
                />
                <Button disabled={submitting} className="bg-primary text-primary-foreground px-10 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-primary/90 transition-colors h-auto w-full">
                  {submitting ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
