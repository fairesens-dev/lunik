import { useState } from "react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const DIMENSIONS = {
  widths: [3, 3.5, 4, 4.5, 5, 5.5, 6],
  projections: [2, 2.5, 3, 3.5],
};

const TOILES = [
  { name: "Ivoire", color: "#F5F0E0" },
  { name: "Sable", color: "#D4C9A8" },
  { name: "Gris perle", color: "#B8B8B0" },
  { name: "Anthracite", color: "#4A4A4A" },
  { name: "Terracotta", color: "#C17A56" },
  { name: "Olive", color: "#7A8A5A" },
  { name: "Bleu nuit", color: "#2C3E5A" },
  { name: "Bordeaux", color: "#6B2D3E" },
];

const COFFRE_COLORS = [
  { name: "Blanc", color: "#FFFFFF" },
  { name: "Gris clair", color: "#C8C8C8" },
  { name: "Anthracite", color: "#3A3A3A" },
  { name: "Noir", color: "#1A1A1A" },
  { name: "Marron", color: "#5C3D2E" },
];

const MOTORISATIONS = [
  { id: "manual", name: "Manuelle", desc: "Manivelle classique", price: 0 },
  { id: "motor", name: "Motorisé", desc: "Moteur Somfy intégré", price: 350 },
  { id: "motor-remote", name: "Motorisé + Télécommande", desc: "Moteur Somfy + télécommande io", price: 500 },
];

const OPTIONS = [
  { id: "wind-sensor", name: "Capteur vent", price: 180 },
  { id: "led", name: "Éclairage LED intégré", price: 250 },
  { id: "auvent", name: "Lambrequin déroulable", price: 150 },
];

const BASE_PRICE = 1800;

const ProductPage = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    width: 4,
    projection: 3,
    toile: "Ivoire",
    coffreColor: "Blanc",
    motorisation: "manual",
    options: [] as string[],
  });

  const toggleOption = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      options: prev.options.includes(id)
        ? prev.options.filter((o) => o !== id)
        : [...prev.options, id],
    }));
  };

  const calculatePrice = () => {
    let price = BASE_PRICE;
    price += (config.width - 3) * 200;
    price += (config.projection - 2) * 150;
    const motor = MOTORISATIONS.find((m) => m.id === config.motorisation);
    if (motor) price += motor.price;
    config.options.forEach((optId) => {
      const opt = OPTIONS.find((o) => o.id === optId);
      if (opt) price += opt.price;
    });
    return price;
  };

  return (
    <>
      {/* Product Hero */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans font-medium">
                Store Coffre Premium
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                Votre store, <span className="italic">votre style</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Configurez votre store coffre sur mesure en quelques étapes.
                Choisissez dimensions, couleurs et options pour un résultat parfait.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Configurator */}
      <section className="pb-28 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Steps */}
            <div className="lg:col-span-2 space-y-12">
              {/* Step indicators */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    className={cn(
                      "flex-1 h-1 transition-colors",
                      step >= s ? "bg-primary" : "bg-border"
                    )}
                  />
                ))}
              </div>

              {/* Step 1: Dimensions */}
              {step === 1 && (
                <AnimatedSection>
                  <div>
                    <h2 className="font-serif text-3xl mb-2">Dimensions</h2>
                    <p className="text-muted-foreground text-sm mb-8">Sélectionnez la largeur et la projection de votre store.</p>

                    <div className="space-y-8">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3 block">
                          Largeur (m)
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {DIMENSIONS.widths.map((w) => (
                            <button
                              key={w}
                              onClick={() => setConfig({ ...config, width: w })}
                              className={cn(
                                "px-6 py-3 border text-sm transition-colors",
                                config.width === w
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:border-primary"
                              )}
                            >
                              {w}m
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3 block">
                          Projection (m)
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {DIMENSIONS.projections.map((p) => (
                            <button
                              key={p}
                              onClick={() => setConfig({ ...config, projection: p })}
                              className={cn(
                                "px-6 py-3 border text-sm transition-colors",
                                config.projection === p
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:border-primary"
                              )}
                            >
                              {p}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 2: Toile */}
              {step === 2 && (
                <AnimatedSection>
                  <div>
                    <h2 className="font-serif text-3xl mb-2">Toile</h2>
                    <p className="text-muted-foreground text-sm mb-8">Choisissez la couleur de votre toile acrylique Dickson.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {TOILES.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setConfig({ ...config, toile: t.name })}
                          className={cn(
                            "border p-4 text-center transition-all",
                            config.toile === t.name ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
                          )}
                        >
                          <div
                            className="w-full aspect-square mb-3 border border-border"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className="text-xs uppercase tracking-wider">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 3: Coffre Color */}
              {step === 3 && (
                <AnimatedSection>
                  <div>
                    <h2 className="font-serif text-3xl mb-2">Couleur du coffre</h2>
                    <p className="text-muted-foreground text-sm mb-8">Sélectionnez la couleur de votre coffre en aluminium laqué.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {COFFRE_COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setConfig({ ...config, coffreColor: c.name })}
                          className={cn(
                            "border p-4 text-center transition-all",
                            config.coffreColor === c.name ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
                          )}
                        >
                          <div
                            className="w-full aspect-square mb-3 border border-border rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="text-xs uppercase tracking-wider">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 4: Motorisation */}
              {step === 4 && (
                <AnimatedSection>
                  <div>
                    <h2 className="font-serif text-3xl mb-2">Motorisation</h2>
                    <p className="text-muted-foreground text-sm mb-8">Choisissez votre type de motorisation.</p>
                    <div className="space-y-4">
                      {MOTORISATIONS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setConfig({ ...config, motorisation: m.id })}
                          className={cn(
                            "w-full border p-6 text-left flex justify-between items-center transition-all",
                            config.motorisation === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          )}
                        >
                          <div>
                            <p className="font-medium text-sm">{m.name}</p>
                            <p className="text-muted-foreground text-xs mt-1">{m.desc}</p>
                          </div>
                          <span className="text-sm font-medium">
                            {m.price === 0 ? "Inclus" : `+${m.price}€`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 5: Options */}
              {step === 5 && (
                <AnimatedSection>
                  <div>
                    <h2 className="font-serif text-3xl mb-2">Options</h2>
                    <p className="text-muted-foreground text-sm mb-8">Ajoutez des options pour un confort optimal.</p>
                    <div className="space-y-4">
                      {OPTIONS.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => toggleOption(o.id)}
                          className={cn(
                            "w-full border p-6 text-left flex justify-between items-center transition-all",
                            config.options.includes(o.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium text-sm">{o.name}</span>
                          <span className="text-sm font-medium">+{o.price}€</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {step > 1 && (
                  <Button
                    onClick={() => setStep(step - 1)}
                    className="border border-foreground text-foreground bg-transparent px-8 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-foreground hover:text-background transition-colors h-auto"
                  >
                    Précédent
                  </Button>
                )}
                {step < 5 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-accent-light transition-colors h-auto"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-none tracking-[0.15em] uppercase text-xs font-medium hover:bg-accent-light transition-colors h-auto">
                    Demander un devis
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="border border-border p-8 bg-card">
                <h3 className="font-serif text-2xl mb-6">Récapitulatif</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span>{config.width}m × {config.projection}m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Toile</span>
                    <span>{config.toile}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Coffre</span>
                    <span>{config.coffreColor}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Motorisation</span>
                    <span>{MOTORISATIONS.find((m) => m.id === config.motorisation)?.name}</span>
                  </div>
                  {config.options.length > 0 && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Options</span>
                      <span className="text-right">
                        {config.options
                          .map((id) => OPTIONS.find((o) => o.id === id)?.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Estimation</span>
                    <span className="font-serif text-3xl">{calculatePrice().toLocaleString("fr-FR")}€</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Prix TTC indicatif, devis personnalisé sur demande.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Accordion */}
      <section className="pb-28 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Accordion type="single" collapsible className="max-w-3xl">
            <AccordionItem value="specs" className="border-border">
              <AccordionTrigger className="font-serif text-xl hover:no-underline py-6">
                Caractéristiques techniques
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                <ul className="space-y-2 text-sm">
                  <li>Structure en aluminium extrudé laqué</li>
                  <li>Toile acrylique Dickson teinte masse, 300g/m²</li>
                  <li>Coffre intégral étanche IP44</li>
                  <li>Bras articulés à câbles gainés inox</li>
                  <li>Motorisation Somfy io (option)</li>
                  <li>Résistance au vent jusqu'à 38 km/h (classe 2)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="install" className="border-border">
              <AccordionTrigger className="font-serif text-xl hover:no-underline py-6">
                Installation
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-sm">
                L'installation est réalisée par nos équipes de poseurs qualifiés dans toute la France métropolitaine. 
                Un rendez-vous de prise de mesures est inclus pour garantir un ajustement parfait. 
                Délai moyen : 4 à 6 semaines après validation du devis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="warranty" className="border-border">
              <AccordionTrigger className="font-serif text-xl hover:no-underline py-6">
                Garantie
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-sm">
                Garantie structure 10 ans, toile 5 ans, motorisation 5 ans. 
                Service après-vente basé en France avec intervention sous 48h en cas de panne.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
