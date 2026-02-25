import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { useConfiguratorSettings } from "@/contexts/ConfiguratorSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOMeta from "@/components/SEOMeta";

const MAX_COLORS = 5;

const EchantillonsPage = () => {
  const { settings } = useConfiguratorSettings();
  const { toast } = useToast();
  const activeColors = settings.toileColors.filter(c => c.active);

  const [form, setForm] = useState({
    prenom: "", nom: "", email: "",
    adresse: "", cp: "", ville: "", projet: "",
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleColor = (label: string) => {
    setSelectedColors(prev => {
      if (prev.includes(label)) return prev.filter(c => c !== label);
      if (prev.length >= MAX_COLORS) return prev;
      return [...prev, label];
    });
  };

  const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedColors.length === 0) {
      toast({ title: "Sélectionnez au moins un coloris", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("leads" as any).insert({
        first_name: form.prenom,
        last_name: form.nom,
        email: form.email,
        postal_code: form.cp,
        message: `ECHANTILLON: ${selectedColors.join(", ")}. Adresse: ${form.adresse}, ${form.cp} ${form.ville}. ${form.projet}`,
        options: selectedColors,
      } as any);
      setSubmitted(true);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer la demande.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-28 lg:py-36">
      <SEOMeta
        title="Échantillons Gratuits de Toile | Mon Store"
        description="Commandez jusqu'à 5 échantillons de toile Dickson gratuits. Livraison sous 48h en France métropolitaine."
      />
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
              Gratuit & sans engagement
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
              Commandez vos échantillons de toile <span className="italic">gratuits</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Recevez jusqu'à 5 échantillons Dickson chez vous sous 48h, totalement gratuits.
              Touchez et comparez les coloris avant de commander.
            </p>
          </div>
        </AnimatedSection>

        {submitted ? (
          <AnimatedSection>
            <div className="text-center py-16">
              <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-2xl mb-2">Demande envoyée !</h2>
              <p className="text-sm text-muted-foreground">
                Vos échantillons ({selectedColors.join(", ")}) seront expédiés sous 48h.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal info */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Prénom" required value={form.prenom} onChange={e => update("prenom", e.target.value)} className="rounded-none border-border h-12 text-sm" />
                  <Input placeholder="Nom" required value={form.nom} onChange={e => update("nom", e.target.value)} className="rounded-none border-border h-12 text-sm" />
                </div>
                <Input placeholder="Email" type="email" required value={form.email} onChange={e => update("email", e.target.value)} className="rounded-none border-border h-12 text-sm" />
                <Input placeholder="Adresse" required value={form.adresse} onChange={e => update("adresse", e.target.value)} className="rounded-none border-border h-12 text-sm" />
                <div className="grid grid-cols-[120px_1fr] gap-4">
                  <Input placeholder="Code postal" required value={form.cp} onChange={e => update("cp", e.target.value)} className="rounded-none border-border h-12 text-sm" />
                  <Input placeholder="Ville" required value={form.ville} onChange={e => update("ville", e.target.value)} className="rounded-none border-border h-12 text-sm" />
                </div>
              </div>

              {/* Color selector */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-2">
                  Choisissez jusqu'à {MAX_COLORS} coloris
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {selectedColors.length}/{MAX_COLORS} sélectionné{selectedColors.length > 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-3">
                  {activeColors.map((c) => {
                    const selected = selectedColors.includes(c.label);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleColor(c.label)}
                        title={c.label}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selected
                            ? "ring-2 ring-primary ring-offset-2 border-primary shadow-md"
                            : selectedColors.length >= MAX_COLORS
                            ? "border-border opacity-40 cursor-not-allowed"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        disabled={!selected && selectedColors.length >= MAX_COLORS}
                      />
                    );
                  })}
                </div>
                {selectedColors.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Sélection : {selectedColors.join(", ")}
                  </p>
                )}
              </div>

              {/* Project */}
              <Textarea
                placeholder="Votre projet (optionnel) — dimensions approximatives, emplacement..."
                value={form.projet}
                onChange={e => update("projet", e.target.value)}
                className="rounded-none border-border min-h-[100px] text-sm resize-none"
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-primary/90 transition-colors h-auto"
              >
                {submitting ? "Envoi en cours..." : "Commander mes échantillons gratuits"}
              </Button>
            </form>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default EchantillonsPage;
