import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Eye, Pencil, Copy, Monitor, Smartphone, RefreshCw, Send, CheckCircle2, XCircle, Search, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

// ─── TYPES ─────────────────────────────────────────────────────────

interface EmailTemplate {
  id: string;
  subject_override: string | null;
  intro_text_override: string | null;
  cta_text_override: string | null;
  footer_note_override: string | null;
  is_active: boolean;
  updated_at: string;
}

interface EmailLogEntry {
  type: string;
  sent_at: string;
  resend_id: string | null;
  orderId: string;
  orderRef: string;
  clientName: string;
  clientEmail: string;
}

// ─── TEMPLATE DEFINITIONS ──────────────────────────────────────────

const TEMPLATE_DEFS = [
  { id: "order_received", name: "Commande reçue", emoji: "✅", defaultSubject: "✅ Commande confirmée — Réf. LK-DEMO | LuniK", badgeClass: "bg-green-100 text-green-700" },
  { id: "in_production", name: "En production", emoji: "🏭", defaultSubject: "🏭 Votre store est en fabrication — Réf. LK-DEMO | LuniK", badgeClass: "bg-orange-100 text-orange-700" },
  { id: "ready_to_ship", name: "Prêt à expédier", emoji: "📦", defaultSubject: "📦 Votre store est prêt ! — Réf. LK-DEMO | LuniK", badgeClass: "bg-blue-100 text-blue-700" },
  { id: "in_delivery", name: "Livraison en cours", emoji: "🚚", defaultSubject: "🚚 Votre store est en route ! — Réf. LK-DEMO | LuniK", badgeClass: "bg-indigo-100 text-indigo-700" },
  { id: "delivered", name: "Livré", emoji: "☀️", defaultSubject: "☀️ Votre store est livré — profitez-en ! — Réf. LK-DEMO | LuniK", badgeClass: "bg-yellow-100 text-yellow-700" },
  { id: "sav_requested", name: "Demande SAV", emoji: "🔧", defaultSubject: "🔧 Votre demande SAV a bien été reçue — Réf. LK-DEMO | LuniK", badgeClass: "bg-red-100 text-red-700" },
] as const;

const TYPE_BADGE: Record<string, string> = {
  order_received: "bg-green-100 text-green-700",
  in_production: "bg-orange-100 text-orange-700",
  ready_to_ship: "bg-blue-100 text-blue-700",
  in_delivery: "bg-indigo-100 text-indigo-700",
  delivered: "bg-yellow-100 text-yellow-700",
  sav_requested: "bg-red-100 text-red-700",
};

const TYPE_LABELS: Record<string, string> = {
  order_received: "Commande reçue",
  in_production: "En production",
  ready_to_ship: "Prêt à expédier",
  in_delivery: "Livraison en cours",
  delivered: "Livré",
  sav_requested: "Demande SAV",
};

// ─── DEMO HTML GENERATOR ──────────────────────────────────────────

function generateDemoHtml(templateId: string): string {
  const demoOrder = {
    ref: "LK-DEMO-2026",
    client_name: "M. Jean Dupont",
    client_email: "jean.dupont@example.com",
    width: 400,
    projection: 350,
    toile_color: "Sable",
    armature_color: "Gris anthracite RAL 7016",
    options: ["Motorisation Somfy io", "Éclairage LED"],
    amount: 289900,
    created_at: new Date().toISOString(),
    client_address: "15 Rue de la Paix",
    client_postal_code: "75002",
    client_city: "Paris",
    client_country: "France",
  };

  const prenom = "Jean";
  const formatPrice = (n: number) => (n / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 });

  const wrapper = (content: string) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>LuniK</title></head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background-color:#f5f0e8;padding:32px 32px 24px;text-align:center;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#4A5E3A;letter-spacing:2px;">LUNIK</h1>
<p style="margin:6px 0 0;font-size:12px;color:#8a7e6b;letter-spacing:1px;">Protection solaire sur-mesure</p>
</td></tr>
<tr><td style="background-color:#ffffff;padding:40px 32px;border-radius:4px;">${content}</td></tr>
<tr><td style="background-color:#ffffff;border-top:1px solid #e8e2d8;padding:24px 32px 32px;border-radius:0 0 4px 4px;text-align:center;">
<p style="margin:0;font-size:12px;color:#8a7e6b;">LuniK — 15 Chemin de la Loupe, 67420 Ranrupt, France</p>
</td></tr></table></td></tr></table></body></html>`;

  const summaryBlock = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;margin:20px 0;">
<tr><td style="padding:24px;">
<p style="margin:0 0 4px;font-size:11px;color:#8a7e6b;text-transform:uppercase;letter-spacing:1px;">VOTRE COMMANDE — Réf. ${demoOrder.ref}</p>
<p style="margin:0 0 12px;font-family:Georgia,serif;font-size:18px;color:#2d2d2d;">Store Coffre Sur-Mesure</p>
<p style="margin:0;font-size:14px;color:#555555;">${demoOrder.width} × ${demoOrder.projection} cm · Toile ${demoOrder.toile_color} · ${demoOrder.armature_color}</p>
<p style="margin:8px 0 0;font-size:13px;color:#4A5E3A;">+ Motorisation Somfy io<br>+ Éclairage LED</p>
<hr style="border:none;border-top:1px solid #e8e2d8;margin:16px 0;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#2d2d2d;">Total payé : ${formatPrice(demoOrder.amount)} €</p>
</td></tr></table>`;

  const templates: Record<string, string> = {
    order_received: wrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#e8f5e9;margin:0 auto 16px;line-height:60px;font-size:30px;">✅</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#2d2d2d;">Merci pour votre commande, ${prenom} !</h1></div>
<p style="font-size:14px;color:#555555;line-height:1.7;">Nous avons bien reçu votre commande et votre paiement. Votre store sur-mesure va bientôt être transmis à notre atelier de fabrication en France.</p>
${summaryBlock}`),
    in_production: wrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#fff3e0;margin:0 auto 16px;line-height:60px;font-size:30px;">🏭</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#2d2d2d;">Votre store est entre de bonnes mains, ${prenom} !</h1></div>
<p style="font-size:14px;color:#555555;line-height:1.7;">Bonne nouvelle ! Votre commande a été transmise à notre atelier partenaire en France.</p>
${summaryBlock}`),
    ready_to_ship: wrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#e3f2fd;margin:0 auto 16px;line-height:60px;font-size:30px;">📦</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#2d2d2d;">Votre store est terminé, ${prenom} !</h1></div>
<p style="font-size:14px;color:#555555;line-height:1.7;">La fabrication de votre store sur-mesure est terminée ! Il est désormais prêt et en attente de prise en charge par notre transporteur.</p>
${summaryBlock}`),
    in_delivery: wrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#e3f2fd;margin:0 auto 16px;line-height:60px;font-size:30px;">🚚</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#2d2d2d;">Votre store arrive bientôt, ${prenom} !</h1></div>
<p style="font-size:14px;color:#555555;line-height:1.7;">Votre store a été pris en charge par le transporteur et est en route vers chez vous !</p>
${summaryBlock}`),
    delivered: wrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#fff8e1;margin:0 auto 16px;line-height:60px;font-size:30px;">☀️</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#2d2d2d;">Bienvenue au soleil, ${prenom} !</h1></div>
<p style="font-size:14px;color:#555555;line-height:1.7;">Votre store LuniK a été livré avec succès. Nous espérons qu'il transformera vos moments en extérieur !</p>
${summaryBlock}`),
    sav_requested: wrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#f5f5f5;margin:0 auto 16px;line-height:60px;font-size:30px;">🔧</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#2d2d2d;">Nous avons bien reçu votre demande, ${prenom}</h1></div>
<p style="font-size:14px;color:#555555;line-height:1.7;">Nous avons bien pris en compte votre signalement concernant votre commande. Notre équipe SAV va analyser votre demande et vous recontacter dans les plus brefs délais.</p>
${summaryBlock}`),
  };

  return templates[templateId] || templates.order_received;
}

// ─── TEMPLATES TAB ────────────────────────────────────────────────

function TemplatesTab() {
  const queryClient = useQueryClient();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [editForm, setEditForm] = useState({ subject_override: "", intro_text_override: "", cta_text_override: "", footer_note_override: "", is_active: true });

  const { data: templates = [] } = useQuery({
    queryKey: ["email_templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("email_templates").select("*");
      if (error) throw error;
      return data as EmailTemplate[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (values: { id: string } & Partial<EmailTemplate>) => {
      const { error } = await supabase.from("email_templates").upsert({
        id: values.id,
        subject_override: values.subject_override || null,
        intro_text_override: values.intro_text_override || null,
        cta_text_override: values.cta_text_override || null,
        footer_note_override: values.footer_note_override || null,
        is_active: values.is_active ?? true,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email_templates"] });
      toast({ title: "Template mis à jour" });
      setEditId(null);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("email_templates").upsert({
        id,
        subject_override: null,
        intro_text_override: null,
        cta_text_override: null,
        footer_note_override: null,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email_templates"] });
      toast({ title: "Template réinitialisé" });
      setEditId(null);
    },
  });

  const openEdit = (id: string) => {
    const t = templates.find((t) => t.id === id);
    setEditForm({
      subject_override: t?.subject_override || "",
      intro_text_override: t?.intro_text_override || "",
      cta_text_override: t?.cta_text_override || "",
      footer_note_override: t?.footer_note_override || "",
      is_active: t?.is_active ?? true,
    });
    setEditId(id);
  };

  const copyHtml = (id: string) => {
    navigator.clipboard.writeText(generateDemoHtml(id));
    toast({ title: "HTML copié dans le presse-papiers" });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TEMPLATE_DEFS.map((def) => {
          const t = templates.find((t) => t.id === def.id);
          const isActive = t?.is_active ?? true;
          return (
            <Card key={def.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{def.emoji}</span>
                    <div>
                      <CardTitle className="text-sm font-semibold">{def.name}</CardTitle>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{def.id}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}>
                    {isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {t?.subject_override || def.defaultSubject}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreviewId(def.id)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Prévisualiser
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(def.id)}>
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewId} onOpenChange={() => setPreviewId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {TEMPLATE_DEFS.find((d) => d.id === previewId)?.emoji} Prévisualisation — {TEMPLATE_DEFS.find((d) => d.id === previewId)?.name}
            </DialogTitle>
            <DialogDescription>
              Objet : {TEMPLATE_DEFS.find((d) => d.id === previewId)?.defaultSubject}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant={viewMode === "desktop" ? "default" : "outline"} size="sm" onClick={() => setViewMode("desktop")}>
              <Monitor className="w-4 h-4 mr-1" /> Desktop
            </Button>
            <Button variant={viewMode === "mobile" ? "default" : "outline"} size="sm" onClick={() => setViewMode("mobile")}>
              <Smartphone className="w-4 h-4 mr-1" /> Mobile
            </Button>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => previewId && copyHtml(previewId)}>
              <Copy className="w-4 h-4 mr-1" /> Copier HTML
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-muted rounded-md flex justify-center p-4">
            {previewId && (
              <iframe
                srcDoc={generateDemoHtml(previewId)}
                title="Preview"
                className="border rounded bg-white"
                style={{ width: viewMode === "desktop" ? 600 : 320, height: "100%", minHeight: 500 }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier — {TEMPLATE_DEFS.find((d) => d.id === editId)?.name}</DialogTitle>
            <DialogDescription>Les surcharges remplacent les valeurs par défaut du template.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Sujet personnalisé</Label>
              <Input placeholder="Laisser vide pour la valeur par défaut" value={editForm.subject_override} onChange={(e) => setEditForm((f) => ({ ...f, subject_override: e.target.value }))} />
            </div>
            <div>
              <Label>Texte d'introduction</Label>
              <Textarea placeholder="Laisser vide pour la valeur par défaut" value={editForm.intro_text_override} onChange={(e) => setEditForm((f) => ({ ...f, intro_text_override: e.target.value }))} />
            </div>
            <div>
              <Label>Texte du bouton CTA</Label>
              <Input placeholder="Ex: Suivre ma commande" value={editForm.cta_text_override} onChange={(e) => setEditForm((f) => ({ ...f, cta_text_override: e.target.value }))} />
            </div>
            <div>
              <Label>Note de bas de page</Label>
              <Textarea placeholder="Laisser vide pour la valeur par défaut" value={editForm.footer_note_override} onChange={(e) => setEditForm((f) => ({ ...f, footer_note_override: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editForm.is_active} onCheckedChange={(v) => setEditForm((f) => ({ ...f, is_active: v }))} />
              <Label>Template actif</Label>
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => editId && resetMutation.mutate(editId)}>Réinitialiser</Button>
            <Button onClick={() => editId && upsertMutation.mutate({ id: editId, ...editForm })}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── ACTIVITY TAB ─────────────────────────────────────────────────

function ActivityTab() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["email_activity"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, ref, client_name, client_email, emails_sent")
        .not("emails_sent", "eq", "[]")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;

      const entries: EmailLogEntry[] = [];
      for (const order of orders || []) {
        const sent = (order.emails_sent as any[]) || [];
        for (const e of sent) {
          entries.push({
            type: e.type,
            sent_at: e.sent_at,
            resend_id: e.resend_id || null,
            orderId: order.id,
            orderRef: order.ref,
            clientName: order.client_name,
            clientEmail: order.client_email,
          });
        }
      }
      entries.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
      return entries;
    },
  });

  const filtered = useMemo(() => {
    let r = logs;
    if (typeFilter !== "all") r = r.filter((e) => e.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((e) => e.clientEmail.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q) || e.orderRef.toLowerCase().includes(q));
    }
    return r;
  }, [logs, typeFilter, search]);

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher par email, nom ou réf..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {TEMPLATE_DEFS.map((d) => <SelectItem key={d.id} value={d.id}>{d.emoji} {d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Destinataire</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Réf.</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chargement…</TableCell></TableRow>
            ) : paged.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun email trouvé</TableCell></TableRow>
            ) : paged.map((e, i) => (
              <TableRow key={`${e.orderId}-${e.type}-${i}`}>
                <TableCell className="text-sm whitespace-nowrap">
                  {format(new Date(e.sent_at), "dd MMM yyyy HH:mm", { locale: fr })}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{e.clientName}</p>
                  <p className="text-xs text-muted-foreground">{e.clientEmail}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={TYPE_BADGE[e.type] || ""}>{TYPE_LABELS[e.type] || e.type}</Badge>
                </TableCell>
                <TableCell>
                  <Link to={`/admin/commandes/${e.orderId}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                    {e.orderRef} <ExternalLink className="w-3 h-3" />
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Envoyé</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filtered.length} résultat(s) — Page {page + 1}/{totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Précédent</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Suivant</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────

function SettingsTab() {
  const queryClient = useQueryClient();
  const [testEmail, setTestEmail] = useState("");
  const [testType, setTestType] = useState("order_received");
  const [sending, setSending] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["admin_settings", "general"],
    queryFn: async () => {
      const { data } = await supabase.from("admin_settings").select("data").eq("id", "general").single();
      return data?.data as Record<string, any> | null;
    },
  });

  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("LuniK");
  const [replyTo, setReplyTo] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Sync form with DB once loaded
  if (settings && !initialized) {
    setFromEmail((settings as any)?.transactionalEmail || "");
    setFromName((settings as any)?.senderName || "LuniK");
    setReplyTo((settings as any)?.replyTo || "");
    setInitialized(true);
  }

  const { data: resendStatus } = useQuery({
    queryKey: ["resend_status"],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke("get-email-logs", {
        body: null,
        method: "GET",
      });
      return data;
    },
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const current = settings || {};
      const { error } = await supabase.from("admin_settings").upsert({
        id: "general",
        data: { ...current, transactionalEmail: fromEmail, senderName: fromName, replyTo },
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_settings", "general"] });
      toast({ title: "Paramètres enregistrés" });
    },
  });

  const sendTest = async () => {
    if (!testEmail) return;
    setSending(true);
    try {
      // Get the first order to use as demo
      const { data: orders } = await supabase.from("orders").select("id").limit(1).single();
      if (!orders) {
        toast({ title: "Aucune commande trouvée pour le test", variant: "destructive" });
        return;
      }
      const { data, error } = await supabase.functions.invoke("send-order-email", {
        body: { type: testType, orderId: orders.id, extra: { testRecipient: testEmail } },
      });
      if (error) throw error;
      toast({ title: `Email de test envoyé à ${testEmail}` });
    } catch (err: any) {
      toast({ title: "Erreur d'envoi", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      {/* Resend Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Statut Resend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {resendStatus?.connected ? (
              <><CheckCircle2 className="w-5 h-5 text-green-600" /><span className="text-sm text-green-700 font-medium">Connecté à Resend</span></>
            ) : (
              <><XCircle className="w-5 h-5 text-red-500" /><span className="text-sm text-red-600 font-medium">Non connecté</span></>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sender Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Expéditeur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email d'expédition</Label>
            <Input placeholder="contact@lunik-store.fr" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
          </div>
          <div>
            <Label>Nom d'expéditeur</Label>
            <Input placeholder="LuniK" value={fromName} onChange={(e) => setFromName(e.target.value)} />
          </div>
          <div>
            <Label>Email de réponse (reply-to)</Label>
            <Input placeholder="contact@lunik-store.fr" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} />
          </div>
          <Button onClick={() => saveMutation.mutate()}>Enregistrer</Button>
        </CardContent>
      </Card>

      {/* Test Send */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Envoyer un test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email de destination</Label>
            <Input type="email" placeholder="votre@email.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          </div>
          <div>
            <Label>Template</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TEMPLATE_DEFS.map((d) => <SelectItem key={d.id} value={d.id}>{d.emoji} {d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={sendTest} disabled={sending || !testEmail}>
            <Send className="w-4 h-4 mr-2" /> {sending ? "Envoi…" : "Envoyer un test"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────

const AdminEmailsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans">E-mails transactionnels</h1>
        <p className="text-muted-foreground text-sm">Gérez vos templates, consultez l'historique d'envoi et configurez les paramètres.</p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEmailsPage;
