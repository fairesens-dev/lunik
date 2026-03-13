import { useState, useMemo, useEffect } from "react";
import { ExternalLink, Eye, ArrowUp, ArrowDown, Trash2, Plus, Save, Upload, X, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useConfiguratorSettings, type ColorEntry, type OptionEntry } from "@/contexts/ConfiguratorSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { WIDTH_RANGES, PROJECTIONS, lookupPrice, getDefaultPriceGrid } from "@/lib/pricingTable";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

/* ═══════════════════════════════════════════════════════ */

const AdminConfiguratorPage = () => {
  const { settings, updatePricing, updateDimensions, reorderToileColors, reorderArmatureColors, updateOption, addOption, removeOption, addToileColor, removeToileColor, updateToileColor, addArmatureColor, removeArmatureColor, updateArmatureColor, updatePriceGrid } = useConfiguratorSettings();
  const { toast } = useToast();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du configurateur</h1>
        <p className="text-sm text-gray-500 mt-1">Toute modification est appliquée immédiatement sur le site.</p>
      </div>

      {/* Sticky preview banner */}
      <div className="sticky top-0 z-10 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-800 text-sm">
          <Eye className="w-4 h-4" />
          <span>Aperçu en direct — Les modifications s'appliquent en temps réel.</span>
        </div>
        <a href="/#configurator" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900 font-medium">
          Voir le configurateur <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="toile">Couleurs de toile</TabsTrigger>
          <TabsTrigger value="armature">Couleurs armature</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing"><PricingTab settings={settings} onSave={updatePricing} toast={toast} /></TabsContent>
        <TabsContent value="dimensions"><DimensionsTab settings={settings} onSave={updateDimensions} toast={toast} /></TabsContent>
        <TabsContent value="toile">
          <ColorsTab
            title="Coloris de toile disponibles"
            subtitle="Activez ou désactivez les coloris affichés dans le configurateur"
            colors={settings.toileColors}
            swatchType="rectangle"
            showPhotoUpload
            onSave={(colors) => { reorderToileColors(colors); toast({ title: "✅ Couleurs de toile mises à jour" }); }}
            onAdd={addToileColor}
            onRemove={removeToileColor}
            onUpdate={updateToileColor}
          />
        </TabsContent>
        <TabsContent value="armature">
          <ColorsTab
            title="Coloris d'armature disponibles"
            subtitle="Activez ou désactivez les coloris affichés dans le configurateur"
            colors={settings.armatureColors}
            swatchType="rectangle"
            onSave={(colors) => { reorderArmatureColors(colors); toast({ title: "✅ Couleurs d'armature mises à jour" }); }}
            onAdd={addArmatureColor}
            onRemove={removeArmatureColor}
            onUpdate={updateArmatureColor}
          />
        </TabsContent>
        <TabsContent value="options">
          <OptionsTab settings={settings} onUpdate={updateOption} onAdd={addOption} onRemove={removeOption} toast={toast} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminConfiguratorPage;

/* ═══════════════════════════════════════════════════════
   TAB 1 — TARIFICATION
   ═══════════════════════════════════════════════════════ */

function PricingTab({ settings, onSave, toast }: { settings: any; onSave: any; toast: any }) {
  const [baseRate, setBaseRate] = useState(settings.pricing.baseRate);
  const [minPrice, setMinPrice] = useState(settings.pricing.minPrice);
  const [divisor, setDivisor] = useState(settings.pricing.installmentDivisor);
  const [simW, setSimW] = useState(350);
  const [simP, setSimP] = useState(250);

  const surface = parseFloat(((simW / 100) * (simP / 100)).toFixed(2));
  const simPrice = Math.max(minPrice, Math.round(surface * baseRate));
  const installment = Math.round(simPrice / (divisor || 1));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Formule de calcul du prix</CardTitle>
        <CardDescription>Prix = MAX(prix minimum, surface m² × tarif/m²)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — inputs */}
          <div className="space-y-5">
            <div>
              <Label>Tarif au m² (€)</Label>
              <Input type="number" value={baseRate} onChange={e => setBaseRate(Number(e.target.value))} className="mt-1" />
              <p className="text-xs text-gray-400 mt-1">Utilisé pour calculer le prix en fonction des dimensions</p>
            </div>
            <div>
              <Label>Prix minimum (€)</Label>
              <Input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} className="mt-1" />
              <p className="text-xs text-gray-400 mt-1">Plancher tarifaire — aucune commande ne peut être inférieure à ce montant</p>
            </div>
            <div>
              <Label>Paiement en N fois sans frais</Label>
              <Input type="number" min={1} max={6} value={divisor} onChange={e => setDivisor(Number(e.target.value))} className="mt-1" />
              <p className="text-xs text-gray-400 mt-1">Diviseur affiché sous le prix total (ex: 3 → affiche « Soit X €/mois en 3× »)</p>
            </div>
            <Button onClick={() => { onSave({ baseRate, minPrice, installmentDivisor: divisor }); toast({ title: "✅ Tarification mise à jour" }); }}>
              <Save className="w-4 h-4 mr-2" /> Sauvegarder
            </Button>
          </div>

          {/* Right — simulator */}
          <Card className="bg-gray-50 border-dashed">
            <CardHeader><CardTitle className="text-base">Simulateur de prix</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Largeur : {simW} cm</Label>
                <Slider value={[simW]} min={settings.dimensions.width.min} max={settings.dimensions.width.max} step={1} onValueChange={([v]) => setSimW(v)} className="mt-2" />
              </div>
              <div>
                <Label className="text-xs">Avancée : {simP} cm</Label>
                <Slider value={[simP]} min={settings.dimensions.projection.min} max={settings.dimensions.projection.max} step={1} onValueChange={([v]) => setSimP(v)} className="mt-2" />
              </div>
              <div className="pt-3 border-t space-y-1">
                <p className="text-sm text-gray-600">Surface : <strong>{surface} m²</strong></p>
                <p className="text-xl font-bold">{simPrice.toLocaleString("fr-FR")} €</p>
                <p className="text-xs text-gray-500">Soit {installment.toLocaleString("fr-FR")} €/mois en {divisor}× sans frais</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 2 — DIMENSIONS
   ═══════════════════════════════════════════════════════ */

function DimensionsTab({ settings, onSave, toast }: { settings: any; onSave: any; toast: any }) {
  const [wMin, setWMin] = useState(settings.dimensions.width.min);
  const [wMax, setWMax] = useState(settings.dimensions.width.max);
  const [wStep, setWStep] = useState(settings.dimensions.width.step);
  const [pMin, setPMin] = useState(settings.dimensions.projection.min);
  const [pMax, setPMax] = useState(settings.dimensions.projection.max);
  const [pStep, setPStep] = useState(settings.dimensions.projection.step);

  const wError = wMin >= wMax;
  const pError = pMin >= pMax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Limites de dimensions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Largeur */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Largeur</h3>
            <div><Label className="text-xs">Min (cm)</Label><Input type="number" value={wMin} onChange={e => setWMin(Number(e.target.value))} className="mt-1" /></div>
            <div><Label className="text-xs">Max (cm)</Label><Input type="number" value={wMax} onChange={e => setWMax(Number(e.target.value))} className="mt-1" /></div>
            <div><Label className="text-xs">Pas (cm)</Label><Input type="number" value={wStep} onChange={e => setWStep(Number(e.target.value))} className="mt-1" /></div>
            {wError && <p className="text-xs text-red-500">Le minimum doit être inférieur au maximum</p>}
          </div>
          {/* Avancée */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Avancée</h3>
            <div><Label className="text-xs">Min (cm)</Label><Input type="number" value={pMin} onChange={e => setPMin(Number(e.target.value))} className="mt-1" /></div>
            <div><Label className="text-xs">Max (cm)</Label><Input type="number" value={pMax} onChange={e => setPMax(Number(e.target.value))} className="mt-1" /></div>
            <div><Label className="text-xs">Pas (cm)</Label><Input type="number" value={pStep} onChange={e => setPStep(Number(e.target.value))} className="mt-1" /></div>
            {pError && <p className="text-xs text-red-500">Le minimum doit être inférieur au maximum</p>}
          </div>
          {/* Diagram */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center" style={{ width: 180, height: 120 }}>
              <div className="absolute -bottom-6 text-xs text-gray-500 font-medium">{wMin}–{wMax} cm</div>
              <div className="absolute -right-14 text-xs text-gray-500 font-medium rotate-90 origin-left">{pMin}–{pMax} cm</div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Vue de dessus</span>
            </div>
          </div>
        </div>
        <Button className="mt-6" disabled={wError || pError} onClick={() => {
          onSave({
            width: { min: wMin, max: wMax, step: wStep, unit: "cm" },
            projection: { min: pMin, max: pMax, step: pStep, unit: "cm" },
          });
          toast({ title: "✅ Dimensions mises à jour" });
        }}>
          <Save className="w-4 h-4 mr-2" /> Sauvegarder
        </Button>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 3 & 4 — COLORS (shared)
   ═══════════════════════════════════════════════════════ */

function ColorsTab({ title, subtitle, colors: initialColors, swatchType, showPhotoUpload, onSave, onAdd, onRemove, onUpdate }: {
  title: string; subtitle: string; colors: ColorEntry[]; swatchType: "circle" | "rectangle"; showPhotoUpload?: boolean;
  onSave: (c: ColorEntry[]) => void; onAdd: (c: ColorEntry) => void; onRemove: (id: string) => void; onUpdate: (id: string, d: Partial<Omit<ColorEntry, "id">>) => void;
}) {
  const [local, setLocal] = useState<ColorEntry[]>(initialColors);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Sync local state when initialColors changes (e.g. after bucket loading)
  useEffect(() => {
    if (initialColors.length > 0 && local.length === 0) {
      setLocal(initialColors);
    } else if (initialColors.length > 0 && initialColors.length !== local.length) {
      setLocal(initialColors);
    }
  }, [initialColors]);

  const filtered = useMemo(() => {
    if (!search.trim()) return local.map((c, i) => ({ color: c, originalIndex: i }));
    const q = search.toLowerCase();
    return local
      .map((c, i) => ({ color: c, originalIndex: i }))
      .filter(({ color }) => color.label.toLowerCase().includes(q) || color.id.toLowerCase().includes(q));
  }, [local, search]);

  const activeCount = local.filter(c => c.active).length;

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...local];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setLocal(next);
  };

  const updateField = (idx: number, field: keyof ColorEntry, value: any) => {
    const next = [...local];
    (next[idx] as any)[field] = value;
    setLocal(next);
  };

  const addNew = () => {
    const id = `color-${Date.now()}`;
    const newColor: ColorEntry = { id, hex: "#CCCCCC", label: "Nouveau coloris", active: true };
    setLocal([...local, newColor]);
  };

  const confirmDelete = (id: string) => {
    setLocal(local.filter(c => c.id !== id));
    setDeleting(null);
  };

  const toggleAll = (active: boolean) => {
    setLocal(local.map(c => ({ ...c, active })));
  };

  const handlePhotoUpload = async (idx: number, file: File) => {
    const colorId = local[idx].id;
    setUploading(colorId);
    try {
      const ext = file.name.split(".").pop();
      const path = `toile/${colorId}.${ext}`;
      const { error } = await supabase.storage.from("product-photos").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-photos").getPublicUrl(path);
      updateField(idx, "photoUrl" as keyof ColorEntry, urlData.publicUrl);
    } catch (e: any) {
      console.error("Upload error:", e);
    } finally {
      setUploading(null);
    }
  };

  const handlePhotoRemove = async (idx: number) => {
    const c = local[idx];
    if (c.photoUrl) {
      const pathMatch = c.photoUrl.match(/product-photos\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from("product-photos").remove([pathMatch[1]]);
      }
    }
    updateField(idx, "photoUrl" as keyof ColorEntry, undefined);
  };

  const save = () => {
    onSave(local);
  };

  const getSwatchStyle = (c: ColorEntry): React.CSSProperties => {
    if (c.photoUrl) {
      return { backgroundImage: `url(${c.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return { backgroundColor: c.hex };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{subtitle} — {activeCount} actifs sur {local.length} total</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search + bulk actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un coloris…"
              className="pl-9 h-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>Tout activer</Button>
          <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>Tout désactiver</Button>
        </div>

        {/* Color grid */}
        <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1">
          {filtered.map(({ color: c, originalIndex: i }) => (
            <div key={c.id} className={`flex items-center gap-3 border rounded-lg p-2.5 ${c.active ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100 opacity-60"}`}>
              {deleting === c.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-red-600">Supprimer ?</span>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(null)}>Annuler</Button>
                  <Button size="sm" variant="destructive" onClick={() => confirmDelete(c.id)}>Confirmer</Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => move(i, 1)} disabled={i === local.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                  </div>
                  {/* Swatch with photo support */}
                  <div
                    className="w-12 h-12 rounded border border-gray-200 shrink-0"
                    style={getSwatchStyle(c)}
                  />
                  <Input value={c.label} onChange={e => updateField(i, "label", e.target.value)} className="max-w-[160px] h-8 text-sm" />
                  {showPhotoUpload && (
                    <Select value={c.type || "solid"} onValueChange={v => updateField(i, "type", v)}>
                      <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Uni</SelectItem>
                        <SelectItem value="striped">Rayé</SelectItem>
                        <SelectItem value="textured">Motif</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Switch checked={c.active} onCheckedChange={v => updateField(i, "active", v)} />
                  <button onClick={() => setDeleting(c.id)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && search && (
          <p className="text-sm text-gray-400 text-center py-4">Aucun coloris trouvant « {search} »</p>
        )}

        <Button variant="outline" onClick={addNew} className="mt-2"><Plus className="w-4 h-4 mr-2" /> Ajouter un coloris</Button>
        <div className="pt-4">
          <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Sauvegarder ({activeCount} actifs)</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 5 — OPTIONS
   ═══════════════════════════════════════════════════════ */

function OptionsTab({ settings, onUpdate, onAdd, onRemove, toast }: { settings: any; onUpdate: any; onAdd: any; onRemove: any; toast: any }) {
  const [local, setLocal] = useState<OptionEntry[]>(settings.options);
  const [deleting, setDeleting] = useState<string | null>(null);

  const update = (idx: number, field: string, value: any) => {
    const next = [...local];
    (next[idx] as any)[field] = value;
    setLocal(next);
  };

  const toggleInclude = (idx: number, targetId: string) => {
    const next = [...local];
    const ids = next[idx].includesIds || [];
    next[idx].includesIds = ids.includes(targetId) ? ids.filter(i => i !== targetId) : [...ids, targetId];
    setLocal(next);
  };

  const addNew = () => {
    const id = `option-${Date.now()}`;
    setLocal([...local, { id, icon: "🔧", label: "Nouvelle option", description: "", price: 0, active: true, highlight: false }]);
  };

  const confirmDelete = (id: string) => {
    setLocal(local.filter(o => o.id !== id));
    setDeleting(null);
  };

  const save = () => {
    // Replace all options in context
    local.forEach(o => onUpdate(o.id, o));
    // Remove options no longer present
    settings.options.forEach((o: OptionEntry) => {
      if (!local.find(l => l.id === o.id)) onRemove(o.id);
    });
    // Add new options
    local.forEach(o => {
      if (!settings.options.find((s: OptionEntry) => s.id === o.id)) onAdd(o);
    });
    toast({ title: "✅ Options mises à jour" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Options disponibles dans le configurateur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {local.map((o, idx) => (
          <div key={o.id} className="border border-gray-200 rounded-lg p-5 space-y-4 bg-white">
            {deleting === o.id ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-600">Supprimer cette option ?</span>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(null)}>Annuler</Button>
                <Button size="sm" variant="destructive" onClick={() => confirmDelete(o.id)}>Confirmer</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch checked={o.active} onCheckedChange={v => update(idx, "active", v)} />
                    <span className="text-sm text-gray-500">{o.active ? "Visible dans le configurateur" : "Masquée"}</span>
                  </div>
                  <button onClick={() => setDeleting(o.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Icône emoji</Label>
                    <Input value={o.icon} onChange={e => update(idx, "icon", e.target.value)} className="mt-1 w-20" />
                  </div>
                  <div>
                    <Label className="text-xs">Prix additionnel (€)</Label>
                    <Input type="number" value={o.price} onChange={e => update(idx, "price", Number(e.target.value))} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">Label</Label>
                    <Input value={o.label} onChange={e => update(idx, "label", e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">Description</Label>
                    <Textarea value={o.description} onChange={e => update(idx, "description", e.target.value)} className="mt-1" rows={2} />
                  </div>
                  <div>
                    <Label className="text-xs">Badge promo (optionnel)</Label>
                    <Input value={o.savingsLabel || ""} onChange={e => update(idx, "savingsLabel", e.target.value || undefined)} className="mt-1" placeholder="ex: ÉCONOMISEZ 90 €" />
                  </div>
                  <div className="flex items-center gap-3 pt-5">
                    <Checkbox checked={o.highlight} onCheckedChange={v => update(idx, "highlight", !!v)} />
                    <Label className="text-xs">Mise en avant (highlight)</Label>
                  </div>
                </div>
                {/* includesIds */}
                <div>
                  <Label className="text-xs text-gray-500">Inclut les options :</Label>
                  <div className="flex gap-4 mt-1">
                    {local.filter(other => other.id !== o.id).map(other => (
                      <label key={other.id} className="flex items-center gap-1.5 text-xs">
                        <Checkbox checked={(o.includesIds || []).includes(other.id)} onCheckedChange={() => toggleInclude(idx, other.id)} />
                        {other.label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={addNew}><Plus className="w-4 h-4 mr-2" /> Ajouter une option</Button>
        <div className="pt-4">
          <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Sauvegarder toutes les options</Button>
        </div>
      </CardContent>
    </Card>
  );
}
