import { useNavigate, Link } from "react-router-dom";
import { Check, ArrowLeft, Lock, Truck, Shield, Camera } from "lucide-react";
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
import logoLunik from "@/assets/logo-lunik.png";
import { useEffect, useState } from "react";
import SEOMeta from "@/components/SEOMeta";

const ConfigurateurPage = () => {
  const configurator = useConfigurator();
  const { setItem } = useCart();
  const navigate = useNavigate();
  const { setStage } = useCartAbandonment();
  const { content } = useContent();
  const { productPage } = content;

  useEffect(() => { setStage("configurateur"); }, [setStage]);

  const {
    width, setWidth, widthValid, widthRangeLabel,
    projection, setProjection, validProjections,
    toileColor, setToileColor, armatureColor, setArmatureColor,
    motorisation, led, pack,
    selectedOptions, toggleOption,
    surfaceArea, price, basePrice, installmentPrice, optionsSummary,
    TOILE_COLORS, ARMATURE_COLORS, PRICING_OPTIONS, settings,
  } = configurator;

  const clampWidth = (v: number) => setWidth(Math.min(MAX_WIDTH_CM, Math.max(MIN_WIDTH_CM, v || MIN_WIDTH_CM)));

  const selectedToile = TOILE_COLORS.find(c => c.name === toileColor);
  const selectedArmature = ARMATURE_COLORS.find(c => c.name === armatureColor);

  const currentToile = { hex: selectedToile?.hex || "#fff", label: toileColor, photoUrl: selectedToile?.photoUrl };
  const currentArmature = { hex: selectedArmature?.hex || "#333", label: armatureColor };
  const currentOptions = { motorisation, led, packConnect: pack };

  // Step navigation (not accordion — all config preserved)
  const [activeStep, setActiveStep] = useState<"01" | "02" | "03">("01");

  const goNext = () => {
    if (activeStep === "01") setActiveStep("02");
    else if (activeStep === "02") setActiveStep("03");
  };
  const goPrev = () => {
    if (activeStep === "03") setActiveStep("02");
    else if (activeStep === "02") setActiveStep("01");
  };

  const handleOrder = () => {
    const toileObj = TOILE_COLORS.find(c => c.name === toileColor);
    const armatureObj = ARMATURE_COLORS.find(c => c.name === armatureColor);

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

  return (
    <>
      <SEOMeta
        title="Configurateur Store Banne Sur-Mesure | LuniK"
        description="Configurez votre store banne sur-mesure en ligne. Choisissez dimensions, toile, armature et options. Prix en temps réel."
      />

      {/* Mini header */}
      <header className="sticky top-0 z-50 h-16 bg-background/90 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.15em] font-medium hidden sm:inline">Retour</span>
          </Link>
        </div>
        <Link to="/">
          <img src={logoLunik} alt="LuniK" className="h-7" />
        </Link>
        <div className="flex-1 flex justify-end">
          {basePrice !== null && (
            <Button
              onClick={handleOrder}
              variant="gradient"
              className="px-6 py-2.5 rounded-full tracking-[0.15em] uppercase text-xs font-medium h-auto"
            >
              Commander — {price.toLocaleString("fr-FR")} €
            </Button>
          )}
        </div>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] min-h-[calc(100vh-64px)]">

        {/* LEFT — Visual panel (no scroll) */}
        <div className="bg-secondary/30 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-hidden relative flex flex-col">
          {/* Visual fills all available space */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-10 pb-28">
            <DynamicProductVisual
              toileColor={currentToile}
              armatureColor={currentArmature}
              options={currentOptions}
              width={width * 10}
              projection={projection}
              fillContainer
              className="rounded-lg"
            />
          </div>

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

          {/* Fiche technique — fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 lg:px-10 py-3 z-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-2">Fiche technique — Toile Dickson</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { label: "Composition", value: "Acrylique teint masse" },
                { label: "Poids", value: "290 g/m²" },
                { label: "Certification", value: "OEKO-TEX classe II" },
                { label: "Garantie toile", value: "10 ans" },
              ].map(item => (
                <div key={item.label} className="bg-background/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Config panel */}
        <div className="bg-background border-l border-border flex flex-col">
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
                <p className="text-xs text-muted-foreground">Le prix s'adapte en temps réel · Motorisation SOMFY incluse</p>
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
                      <p className="text-[11px] text-destructive mt-1">Largeur hors plage ({MIN_WIDTH_CM}–{MAX_WIDTH_CM} cm)</p>
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
                          <SelectItem key={p} value={String(p)}>{p / 10} cm</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Surface : <strong>{surfaceArea} m²</strong></p>
                {basePrice !== null && (
                  <p className="text-xs text-primary font-medium">Prix de base : {basePrice.toLocaleString("fr-FR")} € TTC</p>
                )}
                <div className="pt-4">
                  <Button onClick={goNext} className="w-full rounded-full">Suivant — Couleurs →</Button>
                </div>
              </div>
            )}

            {/* 02 Couleurs (Toile + Armature) */}
            {activeStep === "02" && (
              <div className="space-y-6">
                {/* Toile sub-section */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1">Toile</p>
                  <p className="text-xs text-muted-foreground mb-4">Orchestra by Dickson · {TOILE_COLORS.length} coloris</p>
                  <ToileColorSelector colors={TOILE_COLORS} selected={toileColor} onSelect={setToileColor} />
                  <p className="text-xs text-muted-foreground mt-3">Sélectionnée : {toileColor}</p>
                </div>

                <div className="border-t border-border/50" />

                {/* Armature sub-section */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1">Armature</p>
                  <p className="text-xs text-muted-foreground mb-4">Aluminium thermolaqué · Sans entretien</p>
                  <div className="flex flex-wrap gap-4">
                    {ARMATURE_COLORS.map((c) => (
                      <button key={c.name} onClick={() => setArmatureColor(c.name)} className="flex flex-col items-center gap-2 group">
                        <div
                          className={`w-20 h-8 rounded-lg border-2 relative transition-all ${
                            armatureColor === c.name ? "border-primary shadow-md" : "border-border group-hover:border-primary/50"
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

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={goPrev} className="flex-1 rounded-full">← Dimensions</Button>
                  <Button onClick={goNext} className="flex-1 rounded-full">Suivant — Options →</Button>
                </div>
              </div>
            )}

            {/* 03 Options */}
            {activeStep === "03" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground mb-4">Motorisation SOMFY incluse de série · Personnalisez votre store</p>
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
                          <p className="text-sm font-medium">{opt.icon} {opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium whitespace-nowrap ${isReduction ? "text-green-600" : ""}`}>
                            {isReduction ? "" : "+"}{opt.price.toLocaleString("fr-FR")} €
                          </span>
                        </div>
                      </div>
                      {opt.tip && (
                        <p className="text-[11px] text-primary/80 pl-14">{opt.tip}</p>
                      )}
                    </div>
                  );
                })}
                <div className="pt-4">
                  <Button variant="outline" onClick={goPrev} className="w-full rounded-full mb-3">← Couleurs</Button>
                </div>
              </div>
            )}

            <SaveConfigCTA hasValidConfig={widthValid && basePrice !== null} />
          </div>

          {/* Sticky price bar */}
          <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-xl p-4 lg:p-6">
            {basePrice === null ? (
              <p className="text-sm text-destructive text-center">Sélectionnez des dimensions valides pour voir le prix.</p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-display text-2xl lg:text-3xl text-primary font-extrabold leading-none">
                    {price.toLocaleString("fr-FR")} €
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    soit {installmentPrice.toLocaleString("fr-FR")} €/mois en {settings.pricing.installmentDivisor}× sans frais
                  </p>
                </div>
                <Button
                  onClick={handleOrder}
                  variant="gradient"
                  className="px-8 py-4 rounded-full tracking-[0.15em] uppercase text-sm font-medium h-auto shadow-lg hover:shadow-xl"
                >
                  Commander
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-secondary/50 border-t border-border py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Paiement sécurisé</span>
          <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Livraison 4-5 semaines</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Garantie 5 ans</span>
          <span className="flex items-center gap-1.5">🇫🇷 Fabriqué en France</span>
        </div>
      </div>
    </>
  );
};

export default ConfigurateurPage;
