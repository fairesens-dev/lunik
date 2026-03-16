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

        <TabsContent value="pricing"><PricingTab settings={settings} onSave={updatePricing} onSaveGrid={updatePriceGrid} toast={toast} /></TabsContent>
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
   TAB 1 — TARIFICATION (matrice de prix)
   ═══════════════════════════════════════════════════════ */

function PricingTab({ settings, onSave, onSaveGrid, toast }: { settings: any; onSave: any; onSaveGrid: (grid: (number | null)[][]) => void; toast: any }) {
  const [grid, setGrid] = useState<(number | null)[][]>(settings.priceGrid ?? getDefaultPriceGrid());
  const [divisor, setDivisor] = useState(settings.pricing.installmentDivisor);
  const [dirty, setDirty] = useState(false);

  // Sync when settings load from DB
  useEffect(() => {
    if (settings.priceGrid) setGrid(settings.priceGrid.map((r: any[]) => [...r]));
  }, [settings.priceGrid]);

  const updateCell = (wi: number, pi: number, value: string) => {
    const next = grid.map(r => [...r]);
    if (value === "" || value === "-") {
      next[wi][pi] = null;
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num)) next[wi][pi] = num;
    }
    setGrid(next);
    setDirty(true);
  };

  const toggleCell = (wi: number, pi: number) => {
    const next = grid.map(r => [...r]);
    const defaults = getDefaultPriceGrid();
    if (next[wi][pi] === null) {
      next[wi][pi] = defaults[wi][pi] ?? 3000;
    } else {
      next[wi][pi] = null;
    }
    setGrid(next);
    setDirty(true);
  };

  const resetGrid = () => {
    setGrid(getDefaultPriceGrid());
    setDirty(true);
  };

  const saveAll = () => {
    onSaveGrid(grid);
    onSave({ ...settings.pricing, installmentDivisor: divisor });
    setDirty(false);
    toast({ title: "✅ Grille tarifaire sauvegardée" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grille tarifaire 2026</CardTitle>
          <CardDescription>Prix TTC par combinaison largeur × avancée — motorisation SOMFY incluse. Cliquez sur une cellule grisée pour l'activer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px] font-semibold">Largeur ↓ / Avancée →</TableHead>
                  {PROJECTIONS.map(p => (
                    <TableHead key={p} className="text-center font-semibold min-w-[100px]">{p / 100} cm</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {WIDTH_RANGES.map((range, wi) => (
                  <TableRow key={range.label}>
                    <TableCell className="font-medium text-sm whitespace-nowrap">{range.label}</TableCell>
                    {PROJECTIONS.map((_, pi) => {
                      const val = grid[wi]?.[pi];
                      const isNull = val === null;
                      return (
                        <TableCell key={pi} className="p-1">
                          {isNull ? (
                            <button
                              onClick={() => toggleCell(wi, pi)}
                              className="w-full h-10 rounded-md bg-muted/50 border border-dashed border-muted-foreground/20 text-xs text-muted-foreground hover:bg-muted hover:border-muted-foreground/40 transition-colors"
                              title="Cliquer pour activer cette combinaison"
                            >
                              —
                            </button>
                          ) : (
                            <div className="relative group">
                              <Input
                                type="number"
                                value={val ?? ""}
                                onChange={e => updateCell(wi, pi, e.target.value)}
                                className="h-10 text-center text-sm font-mono pr-7"
                                min={0}
                              />
                              <button
                                onClick={() => toggleCell(wi, pi)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                                title="Désactiver cette combinaison"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center gap-4 mt-6 pt-4 border-t">
            <div className="flex-1">
              <Label className="text-sm">Paiement en N× sans frais</Label>
              <Input type="number" min={1} max={6} value={divisor} onChange={e => { setDivisor(Number(e.target.value)); setDirty(true); }} className="mt-1 w-24" />
            </div>
            <Button variant="outline" onClick={resetGrid}>Réinitialiser les prix par défaut</Button>
            <Button onClick={saveAll} disabled={!dirty}>
              <Save className="w-4 h-4 mr-2" /> Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
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
  const [uploading, setUploading] = useState<string | null>(null);

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

  const handleImageUpload = async (idx: number, file: File) => {
    const optionId = local[idx].id;
    setUploading(optionId);
    try {
      const ext = file.name.split(".").pop();
      const path = `options/${optionId}.${ext}`;
      const { error } = await supabase.storage.from("product-photos").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-photos").getPublicUrl(path);
      update(idx, "imageUrl", urlData.publicUrl);
      toast({ title: "✅ Image uploadée" });
    } catch (e: any) {
      console.error("Upload error:", e);
      toast({ title: "❌ Erreur d'upload", variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const handleImageRemove = async (idx: number) => {
    const o = local[idx];
    if (o.imageUrl) {
      const pathMatch = o.imageUrl.match(/product-photos\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from("product-photos").remove([pathMatch[1]]);
      }
    }
    update(idx, "imageUrl", undefined);
  };

  const save = () => {
    local.forEach(o => onUpdate(o.id, o));
    settings.options.forEach((o: OptionEntry) => {
      if (!local.find(l => l.id === o.id)) onRemove(o.id);
    });
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
                  {/* Image upload */}
                  <div className="md:col-span-2">
                    <Label className="text-xs">Image (optionnelle)</Label>
                    <div className="flex items-center gap-3 mt-1">
                      {o.imageUrl ? (
                        <div className="relative group">
                          <img src={o.imageUrl} alt={o.label} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                          <button
                            onClick={() => handleImageRemove(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                          {uploading === o.id ? (
                            <span className="text-[10px] text-gray-400">…</span>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span className="text-[9px] text-gray-400 mt-0.5">Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => { if (e.target.files?.[0]) handleImageUpload(idx, e.target.files[0]); }}
                          />
                        </label>
                      )}
                      <p className="text-[10px] text-gray-400">Petite image affichée à côté de l'option dans le configurateur</p>
                    </div>
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
