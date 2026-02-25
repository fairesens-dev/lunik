import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import AnimatedSection from "@/components/AnimatedSection";
import type { useConfigurator } from "@/hooks/useConfigurator";

type ConfiguratorProps = ReturnType<typeof useConfigurator> & {
  onOrder: () => void;
};

const ConfiguratorSection = (props: ConfiguratorProps) => {
  const {
    width, setWidth, projection, setProjection,
    toileColor, setToileColor, armatureColor, setArmatureColor,
    motorisation, handleMotorisationToggle,
    led, handleLedToggle,
    pack, handlePackToggle,
    surfaceArea, price, installmentPrice, optionsSummary,
    TOILE_COLORS, ARMATURE_COLORS, settings,
    onOrder,
  } = props;

  const { dimensions, pricing } = settings;
  const activeOptions = settings.options.filter(o => o.active);

  const clampWidth = (v: number) => setWidth(Math.min(dimensions.width.max, Math.max(dimensions.width.min, v || dimensions.width.min)));
  const clampProjection = (v: number) => setProjection(Math.min(dimensions.projection.max, Math.max(dimensions.projection.min, v || dimensions.projection.min)));

  const selectedToile = TOILE_COLORS.find(c => c.name === toileColor);
  const selectedArmature = ARMATURE_COLORS.find(c => c.name === armatureColor);

  return (
    <section id="configurator" className="py-28 lg:py-36 bg-card">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Intro */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs tracking-[0.2em] uppercase font-medium mb-6">
              Configurateur en ligne
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
              Créez votre store
              <br />
              <span className="italic">sur-mesure</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Renseignez vos dimensions, choisissez vos coloris et vos options. Votre prix s'affiche immédiatement, sans engagement.
            </p>
          </div>
        </AnimatedSection>

        {/* Configurator card */}
        <AnimatedSection delay={0.15}>
          <div className="border border-border bg-background shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
              {/* LEFT — Visual */}
              <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border">
                <div className="aspect-[4/3] bg-stone-200 flex items-center justify-center mb-6">
                  <span className="text-stone-400 uppercase tracking-widest text-xs font-sans">Aperçu produit</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                  <span className="bg-secondary px-3 py-1">{width} × {projection} cm</span>
                  <span className="bg-secondary px-3 py-1">Toile {toileColor}</span>
                  <span className="bg-secondary px-3 py-1">{armatureColor}</span>
                  {optionsSummary !== "Aucune" && <span className="bg-secondary px-3 py-1">+ {optionsSummary}</span>}
                </div>
                <div className="flex gap-3">
                  {selectedToile && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: selectedToile.hex }} />
                      <span className="text-xs text-muted-foreground">Toile</span>
                    </div>
                  )}
                  {selectedArmature && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: selectedArmature.hex }} />
                      <span className="text-xs text-muted-foreground">Armature</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — Config inputs */}
              <div className="p-8 lg:p-10 space-y-10">
                {/* 01 Dimensions */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">01 — Vos dimensions</p>
                  <p className="text-xs text-muted-foreground mb-4">Le prix s'adapte en temps réel selon votre surface</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Largeur (cm)</label>
                      <Input
                        type="number" min={dimensions.width.min} max={dimensions.width.max} value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value) || dimensions.width.min)}
                        onBlur={() => clampWidth(width)}
                        placeholder="ex: 350"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Avancée (cm)</label>
                      <Input
                        type="number" min={dimensions.projection.min} max={dimensions.projection.max} value={projection}
                        onChange={(e) => setProjection(parseInt(e.target.value) || dimensions.projection.min)}
                        onBlur={() => clampProjection(projection)}
                        placeholder="ex: 250"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Surface couverte : <strong>{surfaceArea} m²</strong></p>
                  <p className="text-xs text-muted-foreground mt-1">Largeur max {dimensions.width.max} cm · Avancée max {dimensions.projection.max} cm</p>
                </div>

                {/* 02 Toile */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">02 — Couleur de toile</p>
                  <p className="text-xs text-muted-foreground mb-4">Toile Dickson · Plus de 200 coloris</p>
                  <div className="grid grid-cols-6 gap-3 mb-3">
                    {TOILE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setToileColor(c.name)}
                        title={c.name}
                        className={`w-11 h-11 rounded-full border-2 transition-all ${
                          toileColor === c.name
                            ? "ring-2 ring-primary ring-offset-2 border-primary shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">Sélectionnée : {toileColor}</p>
                  <a href="#" className="text-xs text-primary story-link mt-1 inline-block">Commander des échantillons gratuits →</a>
                </div>

                {/* 03 Armature */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">03 — Couleur de l'armature</p>
                  <p className="text-xs text-muted-foreground mb-4">Aluminium thermolaqué · Sans entretien</p>
                  <div className="flex flex-wrap gap-4">
                    {ARMATURE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setArmatureColor(c.name)}
                        className={`flex flex-col items-center gap-2 group`}
                      >
                        <div
                          className={`w-20 h-8 border-2 relative transition-all ${
                            armatureColor === c.name
                              ? "border-primary shadow-md"
                              : "border-border group-hover:border-primary/50"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {armatureColor === c.name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground drop-shadow" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[80px]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 04 Options — dynamic from context */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">04 — Options</p>
                  <div className="space-y-3">
                    {activeOptions.map((opt) => {
                      const isPack = (opt.includesIds && opt.includesIds.length > 0);
                      let checked = false;
                      let onToggle: (v: boolean) => void = () => {};
                      let disabled = false;

                      if (opt.id === "motorisation") { checked = motorisation; onToggle = handleMotorisationToggle; disabled = pack; }
                      else if (opt.id === "led") { checked = led; onToggle = handleLedToggle; disabled = pack; }
                      else if (opt.id === "pack-connect") { checked = pack; onToggle = handlePackToggle; }
                      else { checked = false; onToggle = () => {}; }

                      return (
                        <div key={opt.id} className={`border border-border p-4 flex items-center gap-4 ${opt.highlight ? "ring-1 ring-primary/20" : ""}`}>
                          <Switch checked={checked} onCheckedChange={onToggle} disabled={disabled} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{opt.icon} {opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium whitespace-nowrap">+{opt.price} €</span>
                            {opt.savingsLabel && <span className="block text-[10px] text-primary font-medium mt-0.5">{opt.savingsLabel}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="border-t border-border pt-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Votre prix estimé</p>
                  <p className="font-serif text-4xl md:text-5xl text-foreground transition-all duration-300">
                    {price.toLocaleString("fr-FR")} €
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Soit {installmentPrice.toLocaleString("fr-FR")} €/mois en {pricing.installmentDivisor}× sans frais
                  </p>
                  <Button
                    onClick={onOrder}
                    className="w-full mt-6 bg-primary text-primary-foreground py-5 rounded-none tracking-[0.15em] uppercase text-sm font-medium hover:bg-accent-light transition-colors h-auto"
                  >
                    Commander ce store
                  </Button>
                  <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span>🔒 Paiement sécurisé</span>
                    <span>🚚 Livraison 4-5 sem</span>
                    <span>🇫🇷 Fabriqué en France</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ConfiguratorSection;
