import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useContent, type Testimonial, type FAQItem, type GalleryItem, type HighlightFeature, type ValueCard, type StatItem, type ProductGalleryItem } from "@/contexts/ContentContext";
import { ExternalLink, Trash2, ArrowUp, ArrowDown, Plus, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ImagePicker from "@/components/admin/ImagePicker";

const genId = () => Math.random().toString(36).slice(2, 10);

const ICON_OPTIONS = ["ShieldCheck", "Palette", "Smartphone", "Lightbulb", "Banknote", "Truck", "Sun", "Droplets"];

// ── Shared Field component ─────────────────────────────

const Field = ({
  label,
  value,
  onChange,
  textarea,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  helper?: string;
}) => (
  <div>
    <Label className="text-sm font-medium mb-1.5 block">{label}</Label>
    {textarea ? (
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
    ) : (
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    )}
    {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
  </div>
);

// ── Tab 1: Infos Globales ──────────────────────────────

const TabGlobal = () => {
  const { content, updateGlobal } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState(content.global);
  useEffect(() => setForm(content.global), [content.global]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const save = () => {
    updateGlobal(form);
    toast({ title: "✅ Infos globales mises à jour" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Identité de la marque</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Nom de la marque" value={form.brandName} onChange={(v) => set("brandName", v)} />
          <Field label="Accroche principale (tagline)" value={form.tagline} onChange={(v) => set("tagline", v)} />
          <Field label="Téléphone" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Email de contact" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Adresse" value={form.address} onChange={(v) => set("address", v)} />
          <Field label="SIRET" value={form.siret} onChange={(v) => set("siret", v)} />
          <Field label="URL Trustpilot" value={form.trustpilotUrl} onChange={(v) => set("trustpilotUrl", v)} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Réseaux sociaux</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Instagram URL" value={form.socialInstagram} onChange={(v) => set("socialInstagram", v)} />
          <Field label="Facebook URL" value={form.socialFacebook} onChange={(v) => set("socialFacebook", v)} />
          <Field label="Pinterest URL" value={form.socialPinterest} onChange={(v) => set("socialPinterest", v)} />
        </CardContent>
      </Card>
      <Button onClick={save}>Sauvegarder</Button>
    </div>
  );
};

// ── Tab 2: Page d'accueil ──────────────────────────────

const TabHomepage = () => {
  const { content, updateHomepage, updateProductPage } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    heroTitle: content.homepage.heroTitle,
    heroSubtitle: content.homepage.heroSubtitle,
    heroOverline: content.homepage.heroOverline,
    heroCTA1: content.homepage.heroCTA1,
    marqueeText: content.homepage.marqueeText,
    productSectionTitle: content.homepage.productSectionTitle,
    productSectionSubtitle: content.homepage.productSectionSubtitle,
    configuratorTitle: content.productPage.configuratorTitle,
    configuratorSubtitle: content.productPage.configuratorSubtitle,
    stepLabels: [...content.productPage.stepLabels],
    orderConfirmationMessage: content.productPage.orderConfirmationMessage,
    // New fields
    highlightTitle: content.homepage.highlightTitle,
    highlightSubtitle: content.homepage.highlightSubtitle,
    highlightDescription: content.homepage.highlightDescription,
    highlightImage: content.homepage.highlightImage,
    highlightFeatures: [...(content.homepage.highlightFeatures || [])],
    contactCTATitle: content.homepage.contactCTATitle,
    contactCTASubtitle: content.homepage.contactCTASubtitle,
    contactCTAImage: content.homepage.contactCTAImage,
    valueCards: [...(content.homepage.valueCards || [])],
    statsItems: [...(content.homepage.statsItems || [])],
  });

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const setStep = (i: number, v: string) => {
    const labels = [...form.stepLabels];
    labels[i] = v;
    setForm((p) => ({ ...p, stepLabels: labels }));
  };

  const updateHighlightFeature = (id: string, data: Partial<HighlightFeature>) =>
    set("highlightFeatures", form.highlightFeatures.map((f: HighlightFeature) => f.id === id ? { ...f, ...data } : f));

  const addHighlightFeature = () =>
    set("highlightFeatures", [...form.highlightFeatures, { id: genId(), icon: "ShieldCheck", title: "", desc: "" }]);

  const removeHighlightFeature = (id: string) =>
    set("highlightFeatures", form.highlightFeatures.filter((f: HighlightFeature) => f.id !== id));

  const updateValueCard = (id: string, data: Partial<ValueCard>) =>
    set("valueCards", form.valueCards.map((v: ValueCard) => v.id === id ? { ...v, ...data } : v));

  const addValueCard = () =>
    set("valueCards", [...form.valueCards, { id: genId(), icon: "Banknote", title: "", desc: "", image: "" }]);

  const removeValueCard = (id: string) =>
    set("valueCards", form.valueCards.filter((v: ValueCard) => v.id !== id));

  const updateStatItem = (id: string, data: Partial<StatItem>) =>
    set("statsItems", form.statsItems.map((s: StatItem) => s.id === id ? { ...s, ...data } : s));

  const addStatItem = () =>
    set("statsItems", [...form.statsItems, { id: genId(), value: 0, suffix: "", label: "", decimals: 0 }]);

  const removeStatItem = (id: string) =>
    set("statsItems", form.statsItems.filter((s: StatItem) => s.id !== id));

  const save = () => {
    updateHomepage({
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      heroOverline: form.heroOverline,
      heroCTA1: form.heroCTA1,
      marqueeText: form.marqueeText,
      productSectionTitle: form.productSectionTitle,
      productSectionSubtitle: form.productSectionSubtitle,
      highlightTitle: form.highlightTitle,
      highlightSubtitle: form.highlightSubtitle,
      highlightDescription: form.highlightDescription,
      highlightImage: form.highlightImage,
      highlightFeatures: form.highlightFeatures,
      contactCTATitle: form.contactCTATitle,
      contactCTASubtitle: form.contactCTASubtitle,
      contactCTAImage: form.contactCTAImage,
      valueCards: form.valueCards,
      statsItems: form.statsItems,
    });
    updateProductPage({
      configuratorTitle: form.configuratorTitle,
      configuratorSubtitle: form.configuratorSubtitle,
      stepLabels: form.stepLabels,
      orderConfirmationMessage: form.orderConfirmationMessage,
    });
    toast({ title: "✅ Page d'accueil mise à jour" });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card>
        <CardHeader><CardTitle>Section Hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Overline" value={form.heroOverline} onChange={(v) => set("heroOverline", v)} />
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Titre principal H1</Label>
            <Textarea value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} rows={3} />
            <p className="text-xs text-muted-foreground mt-1">{form.heroTitle.length} caractères · Utilisez Entrée pour les retours à la ligne</p>
          </div>
          <Field label="Sous-titre / description" value={form.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} textarea />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Texte CTA bouton 1" value={form.heroCTA1} onChange={(v) => set("heroCTA1", v)} />
          </div>
        </CardContent>
      </Card>

      {/* Marquee */}
      <Card>
        <CardHeader><CardTitle>Texte du bandeau défilant</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={form.marqueeText} onChange={(e) => set("marqueeText", e.target.value)} rows={2} />
          <p className="text-xs text-muted-foreground">Séparez les éléments avec le caractère · (point médian)</p>
        </CardContent>
      </Card>

      {/* Highlight features */}
      <Card>
        <CardHeader>
          <CardTitle>Section « Chaque détail a été pensé »</CardTitle>
          <CardDescription>Les points forts affichés avec l'image produit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Titre (ligne 1)" value={form.highlightTitle} onChange={(v) => set("highlightTitle", v)} />
            <Field label="Titre (ligne 2, couleur accent)" value={form.highlightSubtitle} onChange={(v) => set("highlightSubtitle", v)} />
          </div>
          <Field label="Description" value={form.highlightDescription} onChange={(v) => set("highlightDescription", v)} textarea />
          <Field label="URL image produit" value={form.highlightImage} onChange={(v) => set("highlightImage", v)} helper="Image affichée à droite de la section" />

          <div className="space-y-3 mt-4">
            <Label className="text-sm font-medium">Points forts</Label>
            {form.highlightFeatures.map((f: HighlightFeature) => (
              <div key={f.id} className="flex items-start gap-3 border rounded-lg p-3 bg-muted/30">
                <Select value={f.icon} onValueChange={(v) => updateHighlightFeature(f.id, { icon: v })}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex-1 space-y-2">
                  <Input placeholder="Titre" value={f.title} onChange={(e) => updateHighlightFeature(f.id, { title: e.target.value })} className="h-8 text-sm" />
                  <Input placeholder="Description" value={f.desc} onChange={(e) => updateHighlightFeature(f.id, { desc: e.target.value })} className="h-8 text-sm" />
                </div>
                <button onClick={() => removeHighlightFeature(f.id)} className="text-muted-foreground hover:text-destructive mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addHighlightFeature}>
              <Plus className="w-3 h-3 mr-1" /> Ajouter un point fort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Value cards (engagements) */}
      <Card>
        <CardHeader>
          <CardTitle>Section Engagements (carrousel)</CardTitle>
          <CardDescription>Les cartes avec image affichées dans le carrousel « Pourquoi choisir notre store ? »</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.valueCards.map((v: ValueCard) => (
            <div key={v.id} className="flex items-start gap-3 border rounded-lg p-3 bg-muted/30">
              <Select value={v.icon} onValueChange={(val) => updateValueCard(v.id, { icon: val })}>
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex-1 space-y-2">
                <Input placeholder="Titre" value={v.title} onChange={(e) => updateValueCard(v.id, { title: e.target.value })} className="h-8 text-sm" />
                <Input placeholder="Description" value={v.desc} onChange={(e) => updateValueCard(v.id, { desc: e.target.value })} className="h-8 text-sm" />
                <Input placeholder="URL image" value={v.image} onChange={(e) => updateValueCard(v.id, { image: e.target.value })} className="h-8 text-sm" />
              </div>
              <button onClick={() => removeValueCard(v.id)} className="text-muted-foreground hover:text-destructive mt-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addValueCard}>
            <Plus className="w-3 h-3 mr-1" /> Ajouter une carte
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffres clés</CardTitle>
          <CardDescription>Affichés dans le hero (2 premiers) et dans la section engagements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.statsItems.map((s: StatItem) => (
            <div key={s.id} className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30">
              <div className="flex-1 grid grid-cols-4 gap-2">
                <Input type="number" placeholder="Valeur" value={s.value} onChange={(e) => updateStatItem(s.id, { value: Number(e.target.value) })} className="h-8 text-sm" />
                <Input placeholder="Suffixe (ex: +, /5)" value={s.suffix} onChange={(e) => updateStatItem(s.id, { suffix: e.target.value })} className="h-8 text-sm" />
                <Input placeholder="Label" value={s.label} onChange={(e) => updateStatItem(s.id, { label: e.target.value })} className="h-8 text-sm col-span-2" />
              </div>
              <Select value={String(s.decimals)} onValueChange={(v) => updateStatItem(s.id, { decimals: Number(v) })}>
                <SelectTrigger className="w-20 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Entier</SelectItem>
                  <SelectItem value="1">1 déc.</SelectItem>
                </SelectContent>
              </Select>
              <button onClick={() => removeStatItem(s.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addStatItem}>
            <Plus className="w-3 h-3 mr-1" /> Ajouter un chiffre
          </Button>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card>
        <CardHeader><CardTitle>Section CTA Contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Titre" value={form.contactCTATitle} onChange={(v) => set("contactCTATitle", v)} />
          <Field label="Sous-titre" value={form.contactCTASubtitle} onChange={(v) => set("contactCTASubtitle", v)} />
          <Field label="URL image de fond" value={form.contactCTAImage} onChange={(v) => set("contactCTAImage", v)} />
        </CardContent>
      </Card>

      {/* Configurator section */}
      <Card>
        <CardHeader><CardTitle>Section configurateur</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Titre</Label>
            <Textarea value={form.configuratorTitle} onChange={(e) => set("configuratorTitle", e.target.value)} rows={2} />
          </div>
          <Field label="Sous-titre descriptif" value={form.configuratorSubtitle} onChange={(v) => set("configuratorSubtitle", v)} textarea />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Textes des étapes configurateur</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {form.stepLabels.map((label: string, i: number) => (
              <Field key={i} label={`Étape ${i + 1}`} value={label} onChange={(v) => setStep(i, v)} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Message de confirmation commande</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={form.orderConfirmationMessage} onChange={(e) => set("orderConfirmationMessage", e.target.value)} rows={3} />
        </CardContent>
      </Card>
      <Button onClick={save}>Sauvegarder</Button>
    </div>
  );
};

// ── Tab: Réalisations (Gallery) ────────────────────────

const TabGallery = () => {
  const { content, updateGalleryItems } = useContent();
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([...(content.homepage.galleryItems || [])]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const update = (id: string, data: Partial<GalleryItem>) =>
    setItems((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));

  const move = (i: number, dir: -1 | 1) => {
    const arr = [...items];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setItems(arr);
  };

  const add = () => setItems((prev) => [...prev, { id: genId(), src: "", alt: "", caption: "", active: true }]);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((g) => g.id !== id));
    setDeleting(null);
  };

  const handleUpload = async (id: string, file: File) => {
    setUploading(id);
    try {
      const ext = file.name.split(".").pop();
      const path = `gallery/${id}.${ext}`;
      const { error } = await supabase.storage.from("product-photos").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-photos").getPublicUrl(path);
      update(id, { src: urlData.publicUrl });
    } catch (e: any) {
      console.error("Upload error:", e);
    } finally {
      setUploading(null);
    }
  };

  const save = () => {
    updateGalleryItems(items);
    toast({ title: "✅ Réalisations mises à jour" });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Réalisations clients</CardTitle>
          <CardDescription>Gérez les photos de la galerie "Ils ont sauté le pas".</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((g, i) => (
            <div key={g.id} className="flex items-start gap-3 border border-gray-100 rounded-lg p-3 bg-white">
              {deleting === g.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-red-600">Supprimer ?</span>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(null)}>Annuler</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(g.id)}>Confirmer</Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {g.src ? (
                    <div className="relative w-24 h-16 shrink-0">
                      <img src={g.src} alt={g.alt} className="w-full h-full object-cover rounded border" />
                      <button onClick={() => update(g.id, { src: "" })} className="absolute -top-1 -right-1 bg-white rounded-full shadow p-0.5">
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-24 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-primary/50 shrink-0">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(g.id, f); }} />
                      {uploading === g.id && <span className="text-[10px] text-gray-400 ml-1">…</span>}
                    </label>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input placeholder="Caption (ex: Patrick, Strasbourg (67))" value={g.caption} onChange={(e) => update(g.id, { caption: e.target.value })} className="h-8 text-sm" />
                    <div className="flex gap-2">
                      <Input placeholder="URL de l'image (ou upload)" value={g.src} onChange={(e) => update(g.id, { src: e.target.value })} className="h-8 text-sm flex-1" />
                      <Input placeholder="Texte alt SEO" value={g.alt} onChange={(e) => update(g.id, { alt: e.target.value })} className="h-8 text-sm flex-1" />
                    </div>
                  </div>
                  <Switch checked={g.active} onCheckedChange={(v) => update(g.id, { active: v })} />
                  <button onClick={() => setDeleting(g.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={add}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter une réalisation
          </Button>
          <div><Button onClick={save}>Sauvegarder</Button></div>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Tab: SAV & Contact ─────────────────────────────────

const TabSAV = () => {
  const { content, updateSAV } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    heroTitle: content.sav.heroTitle,
    heroSubtitle: content.sav.heroSubtitle,
    hours: content.sav.hours,
    responseDelay: content.sav.responseDelay,
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const save = () => {
    updateSAV(form);
    toast({ title: "✅ SAV & Contact mis à jour" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Page SAV</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Titre hero SAV" value={form.heroTitle} onChange={(v) => set("heroTitle", v)} />
          <Field label="Sous-titre hero SAV" value={form.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} textarea />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Horaires & infos contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Horaires d'ouverture" value={form.hours} onChange={(v) => set("hours", v)} textarea />
          <Field label="Délai de réponse affiché" value={form.responseDelay} onChange={(v) => set("responseDelay", v)} helper='Ex: "sous 24h"' />
        </CardContent>
      </Card>
      <Button onClick={save}>Sauvegarder</Button>
    </div>
  );
};

// ── Tab: Témoignages ───────────────────────────────────

const TabTestimonials = () => {
  const { content, updateTestimonials } = useContent();
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([...content.homepage.testimonials]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const update = (id: string, data: Partial<Testimonial>) =>
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

  const add = () =>
    setItems((prev) => [...prev, { id: genId(), name: "", city: "", text: "", rating: 5, active: true }]);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  };

  const save = () => {
    updateTestimonials(items);
    toast({ title: "✅ Témoignages mis à jour" });
  };

  return (
    <div className="space-y-4">
      {items.map((t) => (
        <Card key={t.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Input className="flex-1 min-w-[120px]" placeholder="Prénom + Nom" value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} />
              <Input className="w-32" placeholder="Ville" value={t.city} onChange={(e) => update(t.id, { city: e.target.value })} />
              <Select value={String(t.rating)} onValueChange={(v) => update(t.id, { rating: Number(v) })}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{"★".repeat(n)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch checked={t.active} onCheckedChange={(v) => update(t.id, { active: v })} />
                <span className="text-xs text-muted-foreground">{t.active ? "Actif" : "Masqué"}</span>
              </div>
            </div>
            <Textarea placeholder="Texte du témoignage" value={t.text} onChange={(e) => update(t.id, { text: e.target.value })} rows={2} />
            {deleting === t.id ? (
              <div className="flex items-center gap-2 text-sm">
                <span>Supprimer ?</span>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(null)}>Annuler</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(t.id)}>Confirmer</Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleting(t.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Supprimer
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Ajouter un témoignage
      </Button>
      <div><Button onClick={save}>Sauvegarder</Button></div>
    </div>
  );
};

// ── Tab: FAQ ───────────────────────────────────────────

const FAQEditor = ({ items, onChange }: { items: FAQItem[]; onChange: (items: FAQItem[]) => void }) => {
  const [deleting, setDeleting] = useState<string | null>(null);

  const update = (id: string, data: Partial<FAQItem>) =>
    onChange(items.map((f) => (f.id === id ? { ...f, ...data } : f)));

  const move = (i: number, dir: -1 | 1) => {
    const arr = [...items];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  const add = () => onChange([...items, { id: genId(), question: "", answer: "", active: true }]);
  const remove = (id: string) => {
    onChange(items.filter((f) => f.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <Card key={f.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1 space-y-2">
                <Input placeholder="Question" value={f.question} onChange={(e) => update(f.id, { question: e.target.value })} />
                <Textarea placeholder="Réponse" value={f.answer} onChange={(e) => update(f.id, { answer: e.target.value })} rows={2} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Switch checked={f.active} onCheckedChange={(v) => update(f.id, { active: v })} />
                {deleting === f.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 text-xs px-1" onClick={() => setDeleting(null)}>✕</Button>
                    <Button size="sm" variant="destructive" className="h-6 text-xs px-1" onClick={() => remove(f.id)}>✓</Button>
                  </div>
                ) : (
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setDeleting(f.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Ajouter une question
      </Button>
    </div>
  );
};

const TabFAQ = () => {
  const { content, updateHomepageFAQ, updateProductFAQ } = useContent();
  const { toast } = useToast();
  const [homeFaq, setHomeFaq] = useState<FAQItem[]>([...content.homepage.faqItems]);
  const [productFaq, setProductFaq] = useState<FAQItem[]>([...content.productPage.faqItems]);

  const save = () => {
    updateHomepageFAQ(homeFaq);
    updateProductFAQ(productFaq);
    toast({ title: "✅ FAQ mises à jour" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>FAQ du site</CardTitle></CardHeader>
        <CardContent><FAQEditor items={homeFaq} onChange={setHomeFaq} /></CardContent>
      </Card>
      <Button onClick={save}>Sauvegarder</Button>
    </div>
  );
};

// ── Tab: Bannière promo ────────────────────────────────

const TabPromoBanner = () => {
  const { content, updatePromoBanner } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState(content.promoBanner);
  useEffect(() => setForm(content.promoBanner), [content.promoBanner]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const save = () => {
    updatePromoBanner(form);
    toast({ title: "✅ Bannière promo mise à jour" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bannière promotionnelle (header)</CardTitle>
          <CardDescription>Si activée, une bannière s'affiche en haut de toutes les pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
            <Label>{form.active ? "Activée" : "Désactivée"}</Label>
          </div>
          <Field label="Texte de la bannière" value={form.text} onChange={(v) => set("text", v)} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Couleur de fond</Label>
              <div className="flex gap-2">
                <input type="color" value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Couleur du texte</Label>
              <div className="flex gap-2">
                <input type="color" value={form.textColor} onChange={(e) => set("textColor", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={form.textColor} onChange={(e) => set("textColor", e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Texte du bouton CTA" value={form.ctaText} onChange={(v) => set("ctaText", v)} />
            <Field label="URL du CTA" value={form.ctaUrl} onChange={(v) => set("ctaUrl", v)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Aperçu</CardTitle></CardHeader>
        <CardContent>
          <div className="w-full py-2.5 px-4 text-center text-sm font-medium flex items-center justify-center gap-3 rounded" style={{ backgroundColor: form.bgColor, color: form.textColor }}>
            <span>{form.text}</span>
            {form.ctaText && <span className="underline underline-offset-2 font-semibold">{form.ctaText} →</span>}
          </div>
        </CardContent>
      </Card>
      <Button onClick={save}>Sauvegarder</Button>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────

const AdminContentPage = () => (
  <div className="space-y-6 font-sans">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion du contenu</h1>
        <p className="text-muted-foreground text-sm mt-1">Toute modification est appliquée immédiatement sur le site.</p>
      </div>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
      <span className="text-sm text-green-800">👁️ Aperçu en direct — Les modifications s'appliquent en temps réel sur le site.</span>
      <Link to="/" target="_blank" className="text-sm text-green-700 font-medium flex items-center gap-1 hover:underline">
        Voir le site <ExternalLink className="w-3 h-3" />
      </Link>
    </div>

    <Tabs defaultValue="global">
      <TabsList className="flex-wrap h-auto gap-1">
        <TabsTrigger value="global">Infos globales</TabsTrigger>
        <TabsTrigger value="homepage">Page d'accueil</TabsTrigger>
        <TabsTrigger value="gallery">Réalisations</TabsTrigger>
        <TabsTrigger value="sav">SAV & Contact</TabsTrigger>
        <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
        <TabsTrigger value="promo">Bannière promo</TabsTrigger>
      </TabsList>
      <TabsContent value="global"><TabGlobal /></TabsContent>
      <TabsContent value="homepage"><TabHomepage /></TabsContent>
      <TabsContent value="gallery"><TabGallery /></TabsContent>
      <TabsContent value="sav"><TabSAV /></TabsContent>
      <TabsContent value="testimonials"><TabTestimonials /></TabsContent>
      <TabsContent value="faq"><TabFAQ /></TabsContent>
      <TabsContent value="promo"><TabPromoBanner /></TabsContent>
    </Tabs>
  </div>
);

export default AdminContentPage;
