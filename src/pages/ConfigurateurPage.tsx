import { useNavigate, Link } from "react-router-dom";
import { Check, ArrowLeft, Lock, Truck, Shield, Camera, ZoomIn, Star, ChevronRight, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicProductVisual from "@/components/product/DynamicProductVisual";
import SaveConfigCTA from "@/components/product/SaveConfigCTA";
import ToileColorSelector from "@/components/product/ToileColorSelector";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useCart } from "@/contexts/CartContext";
import { useCartAbandonment } from "@/hooks/useCartAbandonment";
import { MIN_WIDTH_CM, MAX_WIDTH_CM } from "@/lib/pricingTable";
import { useContent } from "@/contexts/ContentContext";
import logoLunik from "@/assets/logo-lunik.svg";
import { useEffect, useState } from "react";
import SEOMeta from "@/components/SEOMeta";
import VisualizeAtHomeDialog from "@/components/product/VisualizeAtHomeDialog";
import ToileCloseUpDialog from "@/components/product/ToileCloseUpDialog";

/* ── Témoignage pour la fiche technique ────────────────────────── */
const TESTIMONIAL = {
  quote: "« Après 3 étés, la toile n'a pas bougé. Qualité irréprochable. »",
  author: "Isabelle, Montpellier",
  stars: 5,
};

const ConfigurateurPage = () => {
  const configurator = useConfigurator();
  const { setItem } = useCart();
  const navigate = useNavigate();
  const { setStage } = useCartAbandonment();
  const { content } = useContent();
  const { productPage } = content;

  useEffect(() => {
    setStage("configurateur");
  }, [setStage]);

  const {
    width,
    setWidth,
    widthValid,
    widthRangeLabel,
    projection,
    setProjection,
    validProjections,
    toileColor,
    setToileColor,
    armatureColor,
    setArmatureColor,
    motorisation,
    led,
    pack,
    selectedOptions,
    toggleOption,
    getIncompatibleReason,
    surfaceArea,
    price,
    basePrice,
    installmentPrice,
    optionsSummary,
    TOILE_COLORS,
    ARMATURE_COLORS,
    PRICING_OPTIONS,
    settings,
  } = configurator;

  const clampWidth = (v: number) => setWidth(Math.min(MAX_WIDTH_CM, Math.max(MIN_WIDTH_CM, v || MIN_WIDTH_CM)));

  const selectedToile = TOILE_COLORS.find((c) => c.name === toileColor);
  const selectedArmature = ARMATURE_COLORS.find((c) => c.name === armatureColor);

  const currentToile = { hex: selectedToile?.hex || "#fff", label: toileColor, photoUrl: selectedToile?.photoUrl };
  const currentArmature = { hex: selectedArmature?.hex || "#333", label: armatureColor };
  const currentOptions = { motorisation, led, packConnect: pack };

  const [activeStep, setActiveStep] = useState<"01" | "02" | "03">("01");
  const [visualizeOpen, setVisualizeOpen] = useState(false);
  const [closeUpOpen, setCloseUpOpen] = useState(false);

  const goNext = () => {
    if (activeStep === "01") setActiveStep("02");
    else if (activeStep === "02") setActiveStep("03");
  };

  const handleOrder = () => {
    const toileObj = TOILE_COLORS.find((c) => c.name === toileColor);
    const armatureObj = ARMATURE_COLORS.find((c) => c.name === armatureColor);

    setItem({
      productId: "store-coffre",
      productName: "Store Coffre Sur-Mesure",
      configuration: {
        width,
        projection,
        surface: surfaceArea,
        toileColor: { id: toileColor, hex: toileObj?.hex || "#fff", label: toileColor },
        armatureColor: { id: armatureColor, hex: armatureObj?.hex || "#333", label: armatureColor },
        options: { motorisation, led, packConnect: pack },
      },
      pricing: {
        base: basePrice ?? 0,
        motorisation: 0,
        led: 0,
        packConnect: 0,
        total: price,
      },
      quantity: 1,
    });

    navigate("/checkout");
  };

  // Sort options by order field
  const sortedOptions = [...PRICING_OPTIONS].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  // Contextual sticky bar button label & action
  const stickyButtonLabel =
    activeStep === "01" ? "Choisir mes couleurs" : activeStep === "02" ? "Personnaliser les options" : "Commander";

  const stickyButtonAction = activeStep === "03" ? handleOrder : goNext;

  return (
    <>
      <SEOMeta
        title="Configurateur Store Banne Sur-Mesure | LuniK"
        description="Configurez votre store banne sur-mesure en ligne. Choisissez dimensions, toile, armature et options. Prix en temps réel."
      />

      {/* Mini header */}
      <header className="sticky top-0 z-50 h-16 bg-background/90 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <Link
            to="/"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.15em] font-medium hidden sm:inline">Retour</span>
          </Link>
        </div>
        <Link to="/">
          <img src={logoLunik} alt="LuniK" className="h-[2.75rem]" />
        </Link>
        <div className="flex-1" />
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] bg-white">
        {/* LEFT — Visual panel */}
        <div className="bg-white h-[50vh] lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 lg:self-start overflow-hidden relative flex flex-col">
          <div className="absolute inset-0">
            <DynamicProductVisual
              toileColor={currentToile}
              armatureColor={currentArmature}
              options={currentOptions}
              width={width * 10}
              projection={projection}
              fillContainer
            />
          </div>

          {/* 2 boutons compacts — décalés à droite, au-dessus de la fiche technique */}
          <div className="absolute bottom-[100px] lg:bottom-[140px] right-4 flex gap-1.5 z-20">
            <div className="relative">
              <button
                disabled
                className="h-[34px] px-3 bg-background/60 backdrop-blur-sm border border-border rounded-lg flex items-center gap-1.5 shadow-sm cursor-not-allowed opacity-100"
              >
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">Tester LuniK IA</span>
              </button>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-muted/80 backdrop-blur-sm text-muted-foreground text-[8px] font-semibold uppercase tracking-[0.12em] px-1.5 py-px rounded-full whitespace-nowrap">
                Bientôt
              </span>
            </div>
            {activeStep !== "01" && (
              <button
                onClick={() => setCloseUpOpen(true)}
                className="h-[34px] px-3 bg-background/80 backdrop-blur-sm border border-border rounded-lg flex items-center gap-1.5 shadow-sm hover:bg-background hover:shadow-md transition-all group"
              >
                <ZoomIn className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium text-foreground">Toile</span>
              </button>
            )}
          </div>

          <VisualizeAtHomeDialog
            open={visualizeOpen}
            onOpenChange={setVisualizeOpen}
            toileColor={currentToile}
            armatureColor={currentArmature}
            options={currentOptions}
          />

          <ToileCloseUpDialog
            open={closeUpOpen}
            onOpenChange={setCloseUpOpen}
            toileLabel={toileColor}
            photoUrl={selectedToile?.photoUrl}
            hex={selectedToile?.hex || "#fff"}
          />

          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-xs font-medium text-foreground">
              {width} × {projection / 10} cm
            </span>
            <span className="bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-xs text-foreground">
              {toileColor}
            </span>
            <span className="bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-xs text-foreground">
              {armatureColor}
            </span>
            {optionsSummary !== "Aucune" && (
              <span className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs text-primary font-medium">
                + {optionsSummary}
              </span>
            )}
          </div>

          {/* Fiche technique + témoignage — aligned with right sticky bar */}
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 lg:px-10 py-4 lg:py-6 z-10">
            <div className="flex items-start gap-6">
              {/* Specs */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-2">
                  Fiche technique — Toile Dickson
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Composition", value: "Acrylique teint masse" },
                    { label: "Certification", value: "OEKO-TEX classe II" },
                    { label: "Garantie toile", value: "10 ans" },
                  ].map((item) => (
                    <div key={item.label} className="bg-background/60 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-[11px] font-medium text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Testimonial */}
              <div className="hidden lg:flex flex-col items-end shrink-0 max-w-[260px] pl-4 border-l border-border/50">
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: TESTIMONIAL.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground italic leading-relaxed text-right">{TESTIMONIAL.quote}</p>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">— {TESTIMONIAL.author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Config panel */}
        <div className="bg-white border-l border-border flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-0">
            {/* Step indicators */}
            <div className="flex gap-2 mb-8">
              {(["01", "02", "03"] as const).map((step, i) => {
                const labels = ["Dimensions", "Couleurs", "Options"];
                return (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium uppercase tracking-[0.1em] transition-all border ${
                      activeStep === step
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {step} · {labels[i]}
                  </button>
                );
              })}
            </div>

            {/* 01 Dimensions */}
            {activeStep === "01" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Le prix s'adapte en temps réel · Motorisation SOMFY incluse
                </p>
                <div className="grid grid-cols-2 gap-4">
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
                      <p className="text-[11px] text-destructive mt-1">
                        Largeur hors plage ({MIN_WIDTH_CM}–{MAX_WIDTH_CM} cm)
                      </p>
                    )}
                    {widthRangeLabel && (
                      <p className="text-[11px] text-muted-foreground mt-1">Plage : {widthRangeLabel}</p>
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
                          <SelectItem key={p} value={String(p)}>
                            {p / 10} cm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Surface : <strong>{surfaceArea} m²</strong>
                </p>
                {basePrice !== null && (
                  <p className="text-xs text-primary font-medium">
                    Prix de base : {basePrice.toLocaleString("fr-FR")} € TTC
                  </p>
                )}
              </div>
            )}

            {/* 02 Couleurs (Toile + Armature) */}
            {activeStep === "02" && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1">Armature</p>
                  <p className="text-xs text-muted-foreground mb-4">Aluminium thermolaqué · Sans entretien</p>
                  <div className="grid grid-cols-4 gap-3">
                    {ARMATURE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setArmatureColor(c.name)}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <div
                          className={`w-full aspect-[11/4] rounded-sm border-2 relative transition-all ${
                            armatureColor === c.name
                              ? "border-primary shadow-md ring-2 ring-primary/30"
                              : "border-border group-hover:border-primary/50"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {armatureColor === c.name && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-sm">
                              <Check className="w-5 h-5 text-white drop-shadow" />
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground text-center leading-tight w-full truncate">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/50" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1">Toile</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Orchestra by Dickson · {TOILE_COLORS.length} coloris
                  </p>
                  <ToileColorSelector colors={TOILE_COLORS} selected={toileColor} onSelect={setToileColor} />
                  <p className="text-xs text-muted-foreground mt-3">Sélectionnée : {toileColor}</p>
                </div>
              </div>
            )}

            {/* 03 Options — refonte marketing */}
            {activeStep === "03" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground mb-4">
                  Motorisation SOMFY incluse de série · Personnalisez votre store
                </p>
                {sortedOptions.map((opt) => {
                  const checked = selectedOptions.has(opt.id);
                  const isReduction = opt.price < 0;
                  const isPremium = opt.highlight || (opt.badge && !isReduction);
                  const isManual = opt.id === "manoeuvre-manuelle";
                  const incompatibleWith = getIncompatibleReason(opt.id);
                  const isBlocked = !checked && !!incompatibleWith;

                  return (
                    <div
                      key={opt.id}
                      className={`border rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden transition-all ${
                        isManual
                          ? checked
                            ? "border-muted-foreground/30 bg-muted/30"
                            : "border-border/60 bg-muted/10 opacity-80"
                          : checked
                            ? isPremium
                              ? "border-primary ring-1 ring-primary/20 bg-gradient-to-r from-primary/[0.04] to-transparent"
                              : "border-primary ring-1 ring-primary/20 bg-primary/[0.02]"
                            : isPremium
                              ? "border-primary/40 bg-primary/[0.02] hover:border-primary/60"
                              : "border-border hover:border-border/80"
                      }`}
                    >
                      {opt.badge && !isManual && (
                        <span className="absolute -top-0.5 right-3 text-[9px] px-2.5 py-0.5 uppercase tracking-wider font-bold rounded-b-lg bg-primary text-primary-foreground">
                          {opt.badge}
                        </span>
                      )}
                      {opt.imageUrl && (
                        <img
                          src={opt.imageUrl}
                          alt={opt.label}
                          className="w-full h-28 rounded-lg object-cover border border-border mb-2"
                        />
                      )}
                      <div className="flex items-center gap-4">
                        <Switch checked={checked} onCheckedChange={() => toggleOption(opt.id)} />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${isManual ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {opt.label}
                            {opt.defaultSelected && opt.price === 0 && (
                              <span className="ml-2 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">INCLUS</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                          {isBlocked && (
                            <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1">
                              ⚠ Incompatible avec {incompatibleWith}
                            </p>
                          )}
                          {opt.socialProof && !isManual && (
                            <p className="text-[11px] text-primary font-medium mt-1 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-primary text-primary" />
                              {opt.socialProof}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-semibold whitespace-nowrap ${
                              isReduction ? "text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {opt.price === 0 ? "Inclus" : `${isReduction ? "" : "+"}${opt.price.toLocaleString("fr-FR")} €`}
                          </span>
                        </div>
                      </div>
                      {opt.tip && (
                        <p
                          className={`text-[11px] pl-14 italic ${isManual ? "text-muted-foreground" : "text-foreground/60"}`}
                        >
                          {opt.tip}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeStep === "01" ? (
              <div className="mt-10 border-t border-border pt-8">
                <div className="border border-border rounded-xl bg-secondary/30 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Astuces pour bien mesurer</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>→ Prévoyez un débord de <strong>~40 cm</strong> de chaque côté de la zone à ombrager</li>
                    <li>→ L'avancée correspond à la profondeur d'ombre souhaitée au sol</li>
                    <li>→ Hauteur de pose recommandée : <strong>~2 m minimum</strong> sous le coffre</li>
                    <li>→ Inclinaison standard : environ <strong>15°</strong> pour un bon écoulement de l'eau</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-10 border-t border-border pt-8">
                <SaveConfigCTA
                  hasValidConfig={widthValid && basePrice !== null}
                  width={width}
                  projection={projection}
                  toileColor={{ label: toileColor }}
                  armatureColor={{ label: armatureColor }}
                  options={currentOptions}
                  price={price}
                  basePrice={basePrice}
                />
              </div>
            )}
          </div>

          {/* Sticky price bar — contextual button */}
          <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-xl p-3 sm:p-4 lg:p-6">
            {basePrice === null ? (
              <p className="text-sm text-destructive text-center">
                Sélectionnez des dimensions valides pour voir le prix.
              </p>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xl sm:text-2xl lg:text-3xl text-primary font-extrabold leading-none">
                    {price.toLocaleString("fr-FR")} €
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                    soit {installmentPrice.toLocaleString("fr-FR")} €/mois en {settings.pricing.installmentDivisor}×
                    sans frais
                  </p>
                </div>
                <Button
                  onClick={stickyButtonAction}
                  variant="gradient"
                  className="px-4 sm:px-8 py-3 sm:py-4 rounded-full tracking-[0.1em] sm:tracking-[0.15em] uppercase text-xs sm:text-sm font-medium h-auto shadow-lg hover:shadow-xl shrink-0"
                >
                  {stickyButtonLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurateurPage;
