import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Save, Palette, Target, Plug, BarChart3,
  Monitor, Smartphone, Copy, Code,
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SUPABASE_URL = "https://gejgtkgqyzdfbsbxujgl.supabase.co";

type ModalData = {
  name: string;
  type: string;
  status: string;
  title: string;
  body_text: string;
  button_text: string;
  button_url: string;
  image_url: string;
  html_content: string;
  background_color: string;
  text_color: string;
  width_size: string;
  trigger_type: string;
  trigger_value: string;
  target_pages: string[];
  show_to: string;
  display_frequency: string;
  form_enabled: boolean;
  form_fields: Record<string, boolean>;
  redirect_url: string;
  webhook_url: string;
  campaign_id: string | null;
  impressions_count: number;
  conversions_count: number;
};

const defaultModal: ModalData = {
  name: "",
  type: "popup",
  status: "draft",
  title: "",
  body_text: "",
  button_text: "En savoir plus",
  button_url: "",
  image_url: "",
  html_content: "",
  background_color: "#FFFFFF",
  text_color: "#000000",
  width_size: "medium",
  trigger_type: "time_delay",
  trigger_value: "5",
  target_pages: [],
  show_to: "all",
  display_frequency: "once",
  form_enabled: false,
  form_fields: { email: true, first_name: false, last_name: false, phone: false },
  redirect_url: "",
  webhook_url: "",
  campaign_id: null,
  impressions_count: 0,
  conversions_count: 0,
};

const widthMap: Record<string, string> = { small: "320px", medium: "480px", large: "640px", full: "100%" };

const AdminModalBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [modal, setModal] = useState<ModalData>({ ...defaultModal });
  const [saving, setSaving] = useState(false);
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [targetMode, setTargetMode] = useState<"all" | "specific">("all");
  const [targetPagesText, setTargetPagesText] = useState("");
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [capturedContacts, setCapturedContacts] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.from("campaigns").select("id, name").order("created_at", { ascending: false }).then(({ data }) => setCampaigns(data || []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    supabase.from("modals").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) { toast.error("Modal introuvable"); navigate("/admin/modals"); return; }
      const d = data as any;
      setModal({
        name: d.name || "",
        type: d.type || "popup",
        status: d.status || "draft",
        title: d.title || "",
        body_text: d.body_text || "",
        button_text: d.button_text || "",
        button_url: d.button_url || "",
        image_url: d.image_url || "",
        html_content: d.html_content || "",
        background_color: d.background_color || "#FFFFFF",
        text_color: d.text_color || "#000000",
        width_size: d.width_size || "medium",
        trigger_type: d.trigger_type || "time_delay",
        trigger_value: d.trigger_value || "5",
        target_pages: d.target_pages || [],
        show_to: d.show_to || "all",
        display_frequency: d.display_frequency || "once",
        form_enabled: d.form_enabled || false,
        form_fields: (d.form_fields && typeof d.form_fields === "object") ? d.form_fields as Record<string, boolean> : { email: true, first_name: false, last_name: false, phone: false },
        redirect_url: d.redirect_url || "",
        webhook_url: d.webhook_url || "",
        campaign_id: d.campaign_id || null,
        impressions_count: d.impressions_count || 0,
        conversions_count: d.conversions_count || 0,
      });
      if (d.target_pages && d.target_pages.length > 0) {
        setTargetMode("specific");
        setTargetPagesText(d.target_pages.join("\n"));
      }
    });
  }, [id]);

  const update = (patch: Partial<ModalData>) => setModal((p) => ({ ...p, ...patch }));

  const save = async () => {
    if (!modal.name.trim()) { toast.error("Nom requis"); return; }
    setSaving(true);
    const payload: any = {
      name: modal.name,
      type: modal.type,
      status: modal.status,
      title: modal.title,
      body_text: modal.body_text,
      button_text: modal.button_text,
      button_url: modal.button_url,
      image_url: modal.image_url || null,
      html_content: modal.html_content || null,
      background_color: modal.background_color,
      text_color: modal.text_color,
      width_size: modal.width_size,
      trigger_type: modal.trigger_type,
      trigger_value: modal.trigger_value,
      target_pages: targetMode === "specific" ? targetPagesText.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      show_to: modal.show_to,
      display_frequency: modal.display_frequency,
      form_enabled: modal.form_enabled,
      form_fields: modal.form_fields,
      redirect_url: modal.redirect_url || null,
      webhook_url: modal.webhook_url || null,
      campaign_id: modal.campaign_id || null,
    };

    if (isEdit) {
      const { error } = await supabase.from("modals").update(payload).eq("id", id);
      if (error) { toast.error("Erreur sauvegarde"); setSaving(false); return; }
      toast.success("Modal mis à jour");
    } else {
      const { error } = await supabase.from("modals").insert(payload);
      if (error) { toast.error("Erreur création"); setSaving(false); return; }
      toast.success("Modal créé");
      navigate("/admin/modals");
    }
    setSaving(false);
  };

  const cr = modal.impressions_count > 0 ? ((modal.conversions_count / modal.impressions_count) * 100).toFixed(1) : "0";

  const embedSnippet = isEdit
    ? `<script>
(function(){
  var s=document.createElement('script');
  s.src='${SUPABASE_URL}/functions/v1/load-modal?id=${id}';
  s.async=true;
  document.head.appendChild(s);
})();
</script>`
    : "<!-- Sauvegardez d'abord le modal pour obtenir le snippet -->";

  // Live preview HTML
  const previewHtml = `
<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,sans-serif}
body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:rgba(0,0,0,0.3)}
.modal{background:${modal.background_color};color:${modal.text_color};border-radius:12px;overflow:hidden;width:100%;max-width:${widthMap[modal.width_size] || "480px"};box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)}
.modal img{width:100%;height:160px;object-fit:cover}
.modal-body{padding:24px}
.modal h2{font-size:1.25rem;font-weight:700;margin-bottom:8px}
.modal p{font-size:0.875rem;line-height:1.5;opacity:0.8;margin-bottom:16px}
.modal .btn{display:inline-block;padding:10px 20px;background:#4A5E3A;color:#fff;border-radius:8px;text-decoration:none;font-size:0.875rem;font-weight:600;border:none;cursor:pointer}
.form-field{display:block;width:100%;padding:8px 12px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px;font-size:0.875rem}
</style></head><body>
<div class="modal">
  ${modal.image_url ? `<img src="${modal.image_url}" alt=""/>` : ""}
  <div class="modal-body">
    ${modal.title ? `<h2>${modal.title}</h2>` : ""}
    ${modal.body_text ? `<p>${modal.body_text}</p>` : ""}
    ${modal.form_enabled ? `
      <div style="margin-bottom:12px">
        <input class="form-field" placeholder="Email *" />
        ${modal.form_fields.first_name ? '<input class="form-field" placeholder="Prénom" />' : ""}
        ${modal.form_fields.last_name ? '<input class="form-field" placeholder="Nom" />' : ""}
        ${modal.form_fields.phone ? '<input class="form-field" placeholder="Téléphone" />' : ""}
      </div>
    ` : ""}
    ${modal.button_text ? `<button class="btn">${modal.button_text}</button>` : ""}
  </div>
</div>
</body></html>`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/modals")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-sans">{isEdit ? "Éditer le modal" : "Nouveau modal"}</h1>
            <p className="text-sm text-muted-foreground">Configurez l'apparence, le ciblage et les intégrations</p>
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? "Sauvegarde…" : "Sauvegarder"}
        </Button>
      </div>

      {/* Name field */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Nom interne</Label>
              <Input value={modal.name} onChange={(e) => update({ name: e.target.value })} placeholder="Ex: Popup été 2026" className="mt-1" />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={modal.status} onValueChange={(v) => update({ status: v })}>
                <SelectTrigger className="w-32 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="paused">Pause</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="design">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="design" className="gap-1"><Palette className="w-3 h-3" /> Design</TabsTrigger>
          <TabsTrigger value="targeting" className="gap-1"><Target className="w-3 h-3" /> Ciblage</TabsTrigger>
          <TabsTrigger value="integration" className="gap-1"><Plug className="w-3 h-3" /> Intégration</TabsTrigger>
          {isEdit && <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="w-3 h-3" /> Analytics</TabsTrigger>}
        </TabsList>

        {/* ===== DESIGN TAB ===== */}
        <TabsContent value="design">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Type selector */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Type de modal</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {(["popup", "slide_in", "banner", "exit_intent"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => update({ type: t })}
                      className={`p-3 rounded-lg border text-sm font-medium text-left transition-colors ${
                        modal.type === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {t === "popup" && "📌 Popup centré"}
                      {t === "slide_in" && "↗️ Slide-in"}
                      {t === "banner" && "📢 Bannière top"}
                      {t === "exit_intent" && "🚪 Exit Intent"}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Contenu</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Titre</Label>
                    <Input value={modal.title} onChange={(e) => update({ title: e.target.value })} placeholder="Titre du modal" className="mt-1" />
                  </div>
                  <div>
                    <Label>Texte</Label>
                    <Textarea value={modal.body_text} onChange={(e) => update({ body_text: e.target.value })} placeholder="Corps du message…" className="mt-1" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Texte du bouton</Label>
                      <Input value={modal.button_text} onChange={(e) => update({ button_text: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>URL du bouton</Label>
                      <Input value={modal.button_url} onChange={(e) => update({ button_url: e.target.value })} placeholder="https://…" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Image (URL)</Label>
                    <Input value={modal.image_url} onChange={(e) => update({ image_url: e.target.value })} placeholder="https://…/image.jpg" className="mt-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Style */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Style</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Couleur de fond</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={modal.background_color} onChange={(e) => update({ background_color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                        <Input value={modal.background_color} onChange={(e) => update({ background_color: e.target.value })} className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <Label>Couleur du texte</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={modal.text_color} onChange={(e) => update({ text_color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                        <Input value={modal.text_color} onChange={(e) => update({ text_color: e.target.value })} className="flex-1" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Largeur</Label>
                    <div className="flex gap-2 mt-1">
                      {["small", "medium", "large", "full"].map((w) => (
                        <button
                          key={w}
                          onClick={() => update({ width_size: w })}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                            modal.width_size === w ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/50"
                          }`}
                        >
                          {w === "small" && "Petit"}
                          {w === "medium" && "Moyen"}
                          {w === "large" && "Grand"}
                          {w === "full" && "Plein"}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Aperçu en direct</h3>
                <div className="flex gap-1">
                  <Button variant={previewDevice === "desktop" ? "default" : "ghost"} size="sm" onClick={() => setPreviewDevice("desktop")}>
                    <Monitor className="w-3 h-3" />
                  </Button>
                  <Button variant={previewDevice === "mobile" ? "default" : "ghost"} size="sm" onClick={() => setPreviewDevice("mobile")}>
                    <Smartphone className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden bg-muted/30 flex justify-center p-4" style={{ minHeight: 400 }}>
                <iframe
                  srcDoc={previewHtml}
                  className="border-0 rounded-lg bg-white"
                  style={{
                    width: previewDevice === "mobile" ? 320 : "100%",
                    height: 400,
                    maxWidth: "100%",
                  }}
                  title="Modal preview"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ===== TARGETING TAB ===== */}
        <TabsContent value="targeting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Déclencheur</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Type de déclencheur</Label>
                  <Select value={modal.trigger_type} onValueChange={(v) => update({ trigger_type: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_delay">⏱️ Délai (secondes)</SelectItem>
                      <SelectItem value="scroll_percent">📜 Pourcentage scroll</SelectItem>
                      <SelectItem value="exit_intent">🚪 Exit Intent</SelectItem>
                      <SelectItem value="page_load">⚡ Chargement page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(modal.trigger_type === "time_delay" || modal.trigger_type === "scroll_percent") && (
                  <div>
                    <Label>{modal.trigger_type === "time_delay" ? "Délai (secondes)" : "Scroll (%)"}</Label>
                    <Input
                      type="number"
                      value={modal.trigger_value}
                      onChange={(e) => update({ trigger_value: e.target.value })}
                      min={0}
                      max={modal.trigger_type === "scroll_percent" ? 100 : undefined}
                      className="mt-1 w-32"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Pages cibles</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setTargetMode("all")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${targetMode === "all" ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                  >
                    Toutes les pages
                  </button>
                  <button
                    onClick={() => setTargetMode("specific")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${targetMode === "specific" ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                  >
                    URLs spécifiques
                  </button>
                </div>
                {targetMode === "specific" && (
                  <Textarea
                    value={targetPagesText}
                    onChange={(e) => setTargetPagesText(e.target.value)}
                    placeholder={"/products/*\n/pricing\n/blog/*"}
                    rows={4}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Audience</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Afficher à</Label>
                  <Select value={modal.show_to} onValueChange={(v) => update({ show_to: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les visiteurs</SelectItem>
                      <SelectItem value="new">Nouveaux visiteurs uniquement</SelectItem>
                      <SelectItem value="returning">Visiteurs récurrents uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Fréquence</CardTitle></CardHeader>
              <CardContent>
                <Select value={modal.display_frequency} onValueChange={(v) => update({ display_frequency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Toujours</SelectItem>
                    <SelectItem value="once">Une seule fois</SelectItem>
                    <SelectItem value="once_per_session">Une fois par session</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== INTEGRATION TAB ===== */}
        <TabsContent value="integration">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Formulaire de capture</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Activer le formulaire</Label>
                  <Switch checked={modal.form_enabled} onCheckedChange={(v) => update({ form_enabled: v })} />
                </div>
                {modal.form_enabled && (
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center gap-2 opacity-60">
                      <Checkbox checked disabled /> <span className="text-sm">Email (requis)</span>
                    </div>
                    {(["first_name", "last_name", "phone"] as const).map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Checkbox
                          checked={!!modal.form_fields[f]}
                          onCheckedChange={(v) => update({ form_fields: { ...modal.form_fields, [f]: !!v } })}
                        />
                        <span className="text-sm">
                          {f === "first_name" && "Prénom"}
                          {f === "last_name" && "Nom"}
                          {f === "phone" && "Téléphone"}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">
                      À la soumission : un contact est créé dans le CRM et une activité est enregistrée.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Après soumission</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>URL de redirection (optionnel)</Label>
                    <Input value={modal.redirect_url} onChange={(e) => update({ redirect_url: e.target.value })} placeholder="https://…/merci" className="mt-1" />
                  </div>
                  <div>
                    <Label>Webhook URL (optionnel)</Label>
                    <Input value={modal.webhook_url} onChange={(e) => update({ webhook_url: e.target.value })} placeholder="https://hooks.zapier.com/…" className="mt-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Campagne</CardTitle></CardHeader>
                <CardContent>
                  <Label>Ajouter automatiquement à une campagne</Label>
                  <Select value={modal.campaign_id || "none"} onValueChange={(v) => update({ campaign_id: v === "none" ? null : v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Aucune" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {campaigns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ===== ANALYTICS TAB ===== */}
        {isEdit && (
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold">{modal.impressions_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold">{modal.conversions_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold">{cr}%</p>
                    <p className="text-xs text-muted-foreground">Taux de conversion</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-sm">Impressions vs Conversions (30 derniers jours)</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">Les données détaillées seront disponibles une fois le tracking en production activé.</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="impressions" name="Impressions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="conversions" name="Conversions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Embed instructions */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Code className="w-4 h-4" /> Instructions d'intégration</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">Collez ce snippet dans le &lt;head&gt; de votre site pour charger ce modal :</p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono">{embedSnippet}</pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => { navigator.clipboard.writeText(embedSnippet); toast.success("Snippet copié"); }}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>Mode test :</strong> ajoutez <code className="bg-muted px-1 rounded">?modal_test=true</code> à l'URL pour forcer l'affichage immédiat (ignore les règles de déclenchement).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModalBuilderPage;
