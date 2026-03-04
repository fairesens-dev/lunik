import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";
import DynamicProductVisual from "@/components/product/DynamicProductVisual";
import SaveConfigCTA from "@/components/product/SaveConfigCTA";
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

  const { content } = useContent();
  const { productPage } = content;
  const { dimensions, pricing } = settings;
  const activeOptions = settings.options.filter(o => o.active);

  const clampWidth = (v: number) => setWidth(Math.min(dimensions.width.max, Math.max(dimensions.width.min, v || dimensions.width.min)));
  const clampProjection = (v: number) => setProjection(Math.min(dimensions.projection.max, Math.max(dimensions.projection.min, v || dimensions.projection.min)));

  const selectedToile = TOILE_COLORS.find(c => c.name === toileColor);
  const selectedArmature = ARMATURE_COLORS.find(c => c.name === armatureColor);

  const currentToile = { hex: selectedToile?.hex || "#fff", label: toileColor, photoUrl: selectedToile?.photoUrl };
  const currentArmature = { hex: selectedArmature?.hex || "#333", label: armatureColor };
  const currentOptions = { motorisation, led, packConnect: pack };

  // Marketing tips per option
  const optionMarketingTips: Record<string, { tip: string; badge?: string }> = {
    "motorisation": { tip: "💡 95% de nos clients choisissent la motorisation" },
    "led": { tip: "💬 \"L'éclairage LED a transformé nos soirées d'été !\" — Marie, Lyon" },
    "pack-connect": { tip: "🔥 Économisez par rapport aux options séparées", badge: "BEST SELLER" },
  };

  return (
    <section id="configurator" className="py-16 lg:py-20 bg-background">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Intro */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs tracking-[0.2em] uppercase font-medium mb-6">
              Configurateur en ligne
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
              {productPage.configuratorTitle.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{i > 0 ? <span className="italic">{line}</span> : line}</span>
              ))}
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              {productPage.configuratorSubtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Configurator card */}
        <AnimatedSection delay={0.15}>
          <div className="border border-border bg-background shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
              {/* LEFT — Visual (sticky on desktop) */}
              <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border lg:self-start lg:sticky lg:top-28">
                {/* Dynamic visual */}
                <DynamicProductVisual
                  toileColor={currentToile}
                  armatureColor={currentArmature}
                  options={currentOptions}
                  width={width}
                  projection={projection}
                  className="mb-4"
                />

                {/* Config badges */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                  <span className="bg-secondary px-3 py-1">{width} × {projection} cm</span>
                  <span className="bg-secondary px-3 py-1">Toile {toileColor}</span>
                  <span className="bg-secondary px-3 py-1">{armatureColor}</span>
                  {optionsSummary !== "Aucune" && <span className="bg-secondary px-3 py-1">+ {optionsSummary}</span>}
                </div>
              </div>

              {/* RIGHT — Config inputs */}
              <div className="p-8 lg:p-10 space-y-10">
                {/* 01 Dimensions */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">01 — {productPage.stepLabels[0] || "VOS DIMENSIONS"}</p>
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
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">02 — {productPage.stepLabels[1] || "COULEUR DE TOILE"}</p>
                  <p className="text-xs text-muted-foreground mb-4">Toile Orchestra by Dickson · {TOILE_COLORS.length} coloris</p>
                  <div className="flex flex-wrap gap-3">
                    {TOILE_COLORS.map((c) => {
                      const swatchStyle: React.CSSProperties = (c as any).photoUrl
                        ? { backgroundImage: `url(${(c as any).photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : c.type === "striped" && c.colors && c.colors.length >= 2
                          ? { background: `repeating-linear-gradient(45deg, ${c.colors[0]}, ${c.colors[0]} 10px, ${c.colors[1]} 10px, ${c.colors[1]} 20px)` }
                          : { backgroundColor: c.hex };

                      return (
                        <button
                          key={c.name}
                          onClick={() => setToileColor(c.name)}
                          className="flex flex-col items-center gap-1.5 group"
                          title={c.name}
                        >
                          <div
                            className={`w-16 h-16 border-2 relative transition-all rounded-sm ${
                              toileColor === c.name
                                ? "border-primary shadow-md ring-2 ring-primary/30"
                                : "border-border group-hover:border-primary/50"
                            }`}
                            style={swatchStyle}
                          >
                            {toileColor === c.name && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-sm">
                                <Check className="w-5 h-5 text-white drop-shadow" />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground text-center leading-tight max-w-[64px] truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-3">Sélectionnée : {toileColor}</p>
                </div>

                {/* 03 Armature */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">03 — {productPage.stepLabels[2] || "COULEUR DE L'ARMATURE"}</p>
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
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">04 — {productPage.stepLabels[3] || "OPTIONS"}</p>
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

                      const marketing = optionMarketingTips[opt.id];

                      return (
                        <div key={opt.id} className={`border p-4 flex flex-col gap-2 relative overflow-hidden ${
                          opt.highlight ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]" : "border-border"
                        }`}>
                          {marketing?.badge && (
                            <span className="absolute -top-0.5 right-3 bg-primary text-primary-foreground text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold">
                              {marketing.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-4">
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
                          {marketing && (
                            <p className="text-[11px] text-primary/80 italic pl-14">{marketing.tip}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Save config / devis par email */}
                <SaveConfigCTA hasValidConfig={width > 0 && projection > 0} />

                {/* Price & CTA */}
                <div className="border-t border-border pt-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Votre prix estimé</p>
                  <p className="font-serif text-3xl md:text-4xl text-primary font-medium transition-all duration-300">
                    {installmentPrice.toLocaleString("fr-FR")} €/mois <span className="text-lg font-normal text-muted-foreground">en {pricing.installmentDivisor}× sans frais</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou {price.toLocaleString("fr-FR")} € au comptant
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
