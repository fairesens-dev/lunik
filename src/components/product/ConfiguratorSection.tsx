import { Check, TrendingUp, Lightbulb, Ruler, ArrowLeftRight, ArrowUpDown, RotateCcw } from "lucide-react";
import MeasurementDiagram from "@/components/product/MeasurementDiagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";
import DynamicProductVisual from "@/components/product/DynamicProductVisual";
import SaveConfigCTA from "@/components/product/SaveConfigCTA";
import ToileColorSelector from "@/components/product/ToileColorSelector";
import type { useConfigurator } from "@/hooks/useConfigurator";
import { MIN_WIDTH_CM, MAX_WIDTH_CM } from "@/lib/pricingTable";

type ConfiguratorProps = ReturnType<typeof useConfigurator> & {
  onOrder: () => void;
};

const ConfiguratorSection = (props: ConfiguratorProps) => {
  const {
    width, setWidth, widthValid, widthRangeLabel,
    projection, setProjection, validProjections,
    toileColor, setToileColor, armatureColor, setArmatureColor,
    motorisation, led, pack,
    selectedOptions, toggleOption,
    surfaceArea, price, basePrice, installmentPrice, optionsSummary,
    TOILE_COLORS, ARMATURE_COLORS, PRICING_OPTIONS, settings,
    onOrder,
  } = props;

  const { content } = useContent();
  const { productPage } = content;

  const clampWidth = (v: number) => setWidth(Math.min(MAX_WIDTH_CM, Math.max(MIN_WIDTH_CM, v || MIN_WIDTH_CM)));

  const selectedToile = TOILE_COLORS.find(c => c.name === toileColor);
  const selectedArmature = ARMATURE_COLORS.find(c => c.name === armatureColor);

  const currentToile = { hex: selectedToile?.hex || "#fff", label: toileColor, photoUrl: selectedToile?.photoUrl };
  const currentArmature = { hex: selectedArmature?.hex || "#333", label: armatureColor };
  const currentOptions = { motorisation, led, packConnect: pack };

  return (
    <section id="configurator" className="py-16 lg:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Intro */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-primary to-accent-light text-white px-5 py-1.5 rounded-full text-xs tracking-[0.2em] uppercase font-medium mb-6">
              Configurateur en ligne
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              {productPage.configuratorTitle.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{i > 0 ? <span className="text-primary">{line}</span> : line}</span>
              ))}
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              {productPage.configuratorSubtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Configurator card */}
        <AnimatedSection delay={0.15}>
          <div className="border border-border bg-background rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
              {/* LEFT — Visual */}
              <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                <DynamicProductVisual
                  toileColor={currentToile}
                  armatureColor={currentArmature}
                  options={currentOptions}
                  width={width * 10}
                  projection={projection}
                  className="mb-4"
                />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                  <span className="bg-secondary px-3 py-1 rounded-full">{width} cm × {projection / 10} cm</span>
                  {widthRangeLabel && <span className="bg-secondary px-3 py-1 rounded-full">Plage {widthRangeLabel}</span>}
                  <span className="bg-secondary px-3 py-1 rounded-full">Toile {toileColor}</span>
                  <span className="bg-secondary px-3 py-1 rounded-full">{armatureColor}</span>
                  {optionsSummary !== "Aucune" && <span className="bg-secondary px-3 py-1 rounded-full">+ {optionsSummary}</span>}
                </div>

                {/* Fiche technique toile */}
                <div className="border-t border-border pt-4 mt-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Fiche technique — Toile Dickson</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-secondary/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Composition</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">Acrylique teint masse</p>
                    </div>
                    <div className="bg-secondary/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Certification</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">OEKO-TEX classe II</p>
                    </div>
                    <div className="bg-secondary/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Garantie toile</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">10 ans</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Config inputs */}
              <div className="p-8 lg:p-10 space-y-10">
                {/* 01 Dimensions */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">01 — {productPage.stepLabels[0] || "VOS DIMENSIONS"}</p>
                  <p className="text-xs text-muted-foreground mb-4">Le prix s'adapte en temps réel selon vos dimensions · Motorisation SOMFY incluse</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Largeur (cm)</label>
                      <Input
                        type="number"
                        min={MIN_WIDTH_CM}
                        max={MAX_WIDTH_CM}
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value) || MIN_WIDTH_CM)}
                        onBlur={() => clampWidth(width)}
                        placeholder={`ex: 350`}
                        className="rounded-lg"
                      />
                      {!widthValid && width > 0 && (
                        <p className="text-[11px] text-destructive mt-1">Largeur hors plage ({MIN_WIDTH_CM}–{MAX_WIDTH_CM} cm)</p>
                      )}
                      {widthRangeLabel && (
                        <p className="text-[11px] text-muted-foreground mt-1">Plage tarifaire : {widthRangeLabel}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Avancée (cm)</label>
                      <Select value={String(projection)} onValueChange={(v) => setProjection(Number(v))}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Avancée" />
                        </SelectTrigger>
                        <SelectContent>
                          {validProjections.map((p) => (
                            <SelectItem key={p} value={String(p)}>{p / 10} cm</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Surface couverte : <strong>{surfaceArea} m²</strong></p>

                  {/* Astuces de mesure */}
                  <div className="mt-4 border border-primary/20 bg-primary/5 rounded-xl p-4">
                    <p className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-3">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Astuces pour bien mesurer
                    </p>
                    <MeasurementDiagram />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><ArrowLeftRight className="w-3 h-3 text-primary" /><strong>Largeur</strong> = zone + 40 cm/côté</span>
                      <span className="flex items-center gap-1"><Ruler className="w-3 h-3 text-primary" /><strong>Avancée</strong> = mur → bout déployé</span>
                      <span className="flex items-center gap-1"><ArrowUpDown className="w-3 h-3 text-primary" /><strong>Hauteur</strong> ≥ 2 m sous linteau</span>
                      <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3 text-primary" /><strong>Inclinaison</strong> ≥ 15°</span>
                    </div>
                  </div>
                </div>

                {/* 02 Armature */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">02 — {productPage.stepLabels[1] || "COULEUR DE L'ARMATURE"}</p>
                  <p className="text-xs text-muted-foreground mb-4">Aluminium thermolaqué · Sans entretien</p>
                  <div className="flex flex-wrap gap-4">
                    {ARMATURE_COLORS.map((c) => {
                      const swatchStyle: React.CSSProperties = c.photoUrl
                        ? { backgroundImage: `url(${c.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { backgroundColor: c.hex };
                      return (
                        <button key={c.name} onClick={() => setArmatureColor(c.name)} className="flex flex-col items-center gap-2 group">
                          <div
                            className={`w-20 h-8 rounded-lg border-2 relative transition-all ${
                              armatureColor === c.name ? "border-primary shadow-md" : "border-border group-hover:border-primary/50"
                            }`}
                            style={swatchStyle}
                          >
                            {armatureColor === c.name && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground drop-shadow" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[80px]">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 03 Toile */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">03 — {productPage.stepLabels[2] || "COULEUR DE TOILE"}</p>
                  <p className="text-xs text-muted-foreground mb-4">Toile Orchestra by Dickson · {TOILE_COLORS.length} coloris</p>
                  <ToileColorSelector colors={TOILE_COLORS} selected={toileColor} onSelect={setToileColor} />
                  <p className="text-xs text-muted-foreground italic mt-3">Sélectionnée : {toileColor}</p>
                </div>

                {/* 04 Options */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">04 — {productPage.stepLabels[3] || "OPTIONS"}</p>
                  <p className="text-xs text-muted-foreground mb-4">Motorisation SOMFY incluse de série · Personnalisez votre store</p>
                  <div className="space-y-3">
                    {PRICING_OPTIONS.map((opt) => {
                      const checked = selectedOptions.has(opt.id);
                      const isReduction = opt.price < 0;

                      return (
                        <div
                          key={opt.id}
                          className={`border rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden transition-all ${
                            checked
                              ? isReduction
                                ? "border-destructive/50 ring-1 ring-destructive/20 bg-destructive/[0.02]"
                                : "border-primary ring-1 ring-primary/20 bg-primary/[0.02]"
                              : opt.highlight
                                ? "border-primary/50 bg-primary/[0.01]"
                                : "border-border"
                          }`}
                        >
                          {opt.badge && (
                            <span className={`absolute -top-0.5 right-3 text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold rounded-b-lg ${
                              isReduction ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-4">
                            <Switch checked={checked} onCheckedChange={() => toggleOption(opt.id)} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{opt.label}</p>
                              <p className="text-xs text-muted-foreground">{opt.description}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-medium whitespace-nowrap ${isReduction ? "text-green-600" : ""}`}>
                                {isReduction ? "" : "+"}{opt.price.toLocaleString("fr-FR")} €
                              </span>
                            </div>
                          </div>
                          {opt.tip && (
                            <p className="text-[11px] text-primary/80 italic pl-14">{opt.tip}</p>
                          )}
                          {opt.socialProof && (
                            <p className="text-[11px] text-primary font-medium pl-14 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {opt.socialProof}
                            </p>
                          )}
                          {opt.price > 500 && (
                            <p className="text-[10px] text-muted-foreground pl-14">
                              soit ~{Math.round(opt.price / 12)} €/mois en 12×
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {widthValid && basePrice !== null && toileColor && armatureColor && (
                  <SaveConfigCTA
                    hasValidConfig={true}
                    width={width}
                    projection={projection}
                    toileColor={{ label: toileColor }}
                    armatureColor={{ label: armatureColor }}
                    options={{ motorisation, led, packConnect: pack }}
                    price={price}
                    basePrice={basePrice}
                  />
                )}

                {/* Price & CTA */}
                <div className="border-t border-border pt-8">
                  {basePrice === null ? (
                    <p className="text-sm text-destructive">Veuillez sélectionner des dimensions valides pour voir le prix.</p>
                  ) : (
                    <>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Votre prix TTC</p>
                      <p className="font-display text-3xl md:text-4xl text-primary font-extrabold transition-all duration-300">
                        {price.toLocaleString("fr-FR")} € <span className="text-lg font-normal text-muted-foreground">TTC</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        soit {installmentPrice.toLocaleString("fr-FR")} €/mois en {settings.pricing.installmentDivisor}× sans frais
                      </p>
                      <Button
                        onClick={onOrder}
                        variant="gradient"
                        className="w-full mt-6 py-5 rounded-full tracking-[0.15em] uppercase text-sm font-medium h-auto shadow-lg hover:shadow-xl"
                      >
                        Commander ce store
                      </Button>
                      <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="bg-secondary px-3 py-1.5 rounded-full">🔒 Paiement sécurisé</span>
                        <span className="bg-secondary px-3 py-1.5 rounded-full">🚚 Livraison 4-5 sem</span>
                        <span className="bg-secondary px-3 py-1.5 rounded-full">🇫🇷 Fabriqué en France</span>
                      </div>
                    </>
                  )}
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
