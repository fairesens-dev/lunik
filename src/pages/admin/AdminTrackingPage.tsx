import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Copy, Check, Code, Activity, List, CheckCircle2, Circle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type TagPlan = Tables<"tag_plan">;

const STATUS_COLORS: Record<string, string> = {
  planned: "bg-yellow-100 text-yellow-800 border-yellow-200",
  implemented: "bg-blue-100 text-blue-800 border-blue-200",
  verified: "bg-green-100 text-green-800 border-green-200",
};

const DEST_COLORS: Record<string, string> = {
  internal: "bg-muted text-muted-foreground",
  ga4: "bg-orange-100 text-orange-800",
  meta: "bg-blue-100 text-blue-800",
  google_ads: "bg-emerald-100 text-emerald-800",
};

const EMPTY_FORM = {
  event_name: "",
  event_category: "",
  description: "",
  trigger_description: "",
  expected_value: "",
  implementation_status: "planned" as "planned" | "implemented" | "verified",
  destination: "internal" as "internal" | "ga4" | "meta" | "google_ads",
};

// ─── Tab 1: Tag Plan Table ───────────────────────────────────────────────────

function TagPlanTab() {
  const [tags, setTags] = useState<TagPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDest, setFilterDest] = useState("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchTags = useCallback(async () => {
    const { data, error } = await supabase.from("tag_plan").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erreur chargement tag plan");
    else setTags(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  const filtered = tags.filter((t) => {
    if (filterStatus !== "all" && t.implementation_status !== filterStatus) return false;
    if (filterDest !== "all" && t.destination !== filterDest) return false;
    if (search && !t.event_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setDialogOpen(true); };
  const openEdit = (t: TagPlan) => {
    setForm({
      event_name: t.event_name,
      event_category: t.event_category || "",
      description: t.description || "",
      trigger_description: t.trigger_description || "",
      expected_value: t.expected_value || "",
      implementation_status: t.implementation_status,
      destination: t.destination,
    });
    setEditingId(t.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.event_name.trim()) { toast.error("Le nom de l'événement est requis"); return; }
    if (editingId) {
      const { error } = await supabase.from("tag_plan").update(form).eq("id", editingId);
      if (error) toast.error("Erreur mise à jour");
      else toast.success("Événement mis à jour");
    } else {
      const { error } = await supabase.from("tag_plan").insert(form);
      if (error) toast.error("Erreur création");
      else toast.success("Événement ajouté");
    }
    setDialogOpen(false);
    fetchTags();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tag_plan").delete().eq("id", id);
    if (error) toast.error("Erreur suppression");
    else { toast.success("Supprimé"); fetchTags(); }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Plan de taggage</CardTitle>
            <CardDescription>{tags.length} événement{tags.length !== 1 ? "s" : ""} configuré{tags.length !== 1 ? "s" : ""}</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input placeholder="Rechercher un événement…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-[220px]" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDest} onValueChange={setFilterDest}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Destination" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="ga4">GA4</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
              <SelectItem value="google_ads">Google Ads</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Aucun événement trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Événement</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium font-mono text-xs">{t.event_name}</TableCell>
                    <TableCell className="text-sm">{t.event_category || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{t.trigger_description || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={DEST_COLORS[t.destination] || ""}>{t.destination}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_COLORS[t.implementation_status] || ""}>
                        {t.implementation_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'événement" : "Ajouter un événement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nom de l'événement *</Label>
              <Input value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} placeholder="page_view" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Catégorie</Label>
                <Input value={form.event_category} onChange={(e) => setForm({ ...form, event_category: e.target.value })} placeholder="ecommerce" />
              </div>
              <div className="space-y-1">
                <Label>Valeur attendue</Label>
                <Input value={form.expected_value} onChange={(e) => setForm({ ...form, expected_value: e.target.value })} placeholder="URL, montant…" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description du trigger</Label>
              <Input value={form.trigger_description} onChange={(e) => setForm({ ...form, trigger_description: e.target.value })} placeholder="Au chargement de la page" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Statut</Label>
                <Select value={form.implementation_status} onValueChange={(v) => setForm({ ...form, implementation_status: v as typeof form.implementation_status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Destination</Label>
                <Select value={form.destination} onValueChange={(v) => setForm({ ...form, destination: v as typeof form.destination })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="ga4">GA4</SelectItem>
                    <SelectItem value="meta">Meta</SelectItem>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editingId ? "Mettre à jour" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ─── Tab 2: Tracking Script Generator ────────────────────────────────────────

function TrackingScriptTab() {
  const [copied, setCopied] = useState(false);

  const SUPABASE_URL = "https://gejgtkgqyzdfbsbxujgl.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlamd0a2dxeXpkZmJzYnh1amdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NzI0NzQsImV4cCI6MjA4NzU0ODQ3NH0.f8CjuMpWZZj8Drgo8GBzENwofDSPerDGXqwXAGDaXEc";

  const script = `<script>
(function() {
  var SB_URL = "${SUPABASE_URL}";
  var SB_KEY = "${SUPABASE_KEY}";

  // Session ID
  var sid = localStorage.getItem("lk_session_id");
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    localStorage.setItem("lk_session_id", sid);
  }

  // UTM params
  var params = new URLSearchParams(window.location.search);
  var utms = {};
  ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(function(k) {
    if (params.get(k)) utms[k] = params.get(k);
  });

  // Contact email lookup
  var contactEmail = localStorage.getItem("contact_email") || null;

  function post(table, body) {
    fetch(SB_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SB_KEY,
        "Authorization": "Bearer " + SB_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(body)
    }).catch(function(e) {
      if (params.get("debug")) console.warn("[LuniK Track]", e);
    });
  }

  // Auto page view
  post("page_views", Object.assign({
    session_id: sid,
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer || null,
    device_type: /Mobi/i.test(navigator.userAgent) ? "mobile" : "desktop",
    user_agent: navigator.userAgent
  }, utms));

  // Global trackEvent
  window.trackEvent = function(eventName, category, value, metadata) {
    post("conversions", {
      session_id: sid,
      event_name: eventName,
      event_category: category || null,
      event_value: value || null,
      page_url: window.location.href,
      metadata: metadata || {}
    });
  };

  if (params.get("debug")) console.log("[LuniK Track] Initialized", { sid: sid, utms: utms });
})();
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Script copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Code className="w-5 h-5" /> Script de tracking</CardTitle>
          <CardDescription>Copiez ce script et collez-le dans votre site avant la balise &lt;/body&gt;.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto border">
              {script}
            </pre>
            <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Checklist d'intégration</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Ajoutez le script avant </body> sur toutes les pages",
              "Testez avec ?debug=1 dans l'URL pour voir les logs console",
              "Utilisez window.trackEvent('purchase', 'ecommerce', 149.99) pour les conversions",
              "Stockez l'email du contact dans localStorage.setItem('contact_email', email) pour l'identification",
              "Vérifiez les données dans l'onglet Flux en temps réel ci-dessus",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 3: Live Event Stream ────────────────────────────────────────────────

type StreamEvent = {
  id: string;
  type: "page_view" | "conversion";
  created_at: string;
  page_url: string | null;
  session_id: string | null;
  event_name?: string;
  contact_id?: string | null;
};

function LiveStreamTab() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load
    const load = async () => {
      const [pvRes, cvRes] = await Promise.all([
        supabase.from("page_views").select("id, created_at, page_url, session_id, contact_id").order("created_at", { ascending: false }).limit(50),
        supabase.from("conversions").select("id, created_at, page_url, session_id, event_name, contact_id").order("created_at", { ascending: false }).limit(50),
      ]);
      const pvs: StreamEvent[] = (pvRes.data || []).map((r) => ({ ...r, type: "page_view" as const }));
      const cvs: StreamEvent[] = (cvRes.data || []).map((r) => ({ ...r, type: "conversion" as const }));
      const merged = [...pvs, ...cvs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 50);
      setEvents(merged);
    };
    load();

    // Realtime subscription
    const channel = supabase.channel("tracking-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_views" }, (payload) => {
        const ev: StreamEvent = { ...(payload.new as any), type: "page_view" };
        setEvents((prev) => [ev, ...prev].slice(0, 50));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversions" }, (payload) => {
        const ev: StreamEvent = { ...(payload.new as any), type: "conversion" };
        setEvents((prev) => [ev, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!paused && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [events, paused]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5" /> Flux en temps réel</CardTitle>
            <CardDescription>Derniers 50 événements — {paused ? "En pause" : "Auto-scroll actif"}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Circle className={`w-3 h-3 ${paused ? "text-muted-foreground" : "text-green-500 animate-pulse"}`} fill="currentColor" />
            <span className="text-xs text-muted-foreground">{paused ? "Pause" : "Live"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="max-h-[500px] overflow-y-auto space-y-1"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Aucun événement pour le moment. Les nouveaux événements apparaîtront ici en temps réel.</p>
          ) : (
            events.map((ev) => (
              <div key={`${ev.type}-${ev.id}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground w-[130px] shrink-0 font-mono">
                  {format(new Date(ev.created_at), "dd/MM HH:mm:ss")}
                </span>
                <Badge variant="outline" className={ev.type === "page_view" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}>
                  {ev.type === "page_view" ? "page_view" : ev.event_name || "conversion"}
                </Badge>
                <span className="truncate flex-1 text-xs">{ev.page_url || "—"}</span>
                <span className="text-xs font-mono text-muted-foreground w-[70px] shrink-0">{ev.session_id?.slice(0, 8) || "—"}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans">Tracking</h1>
        <p className="text-muted-foreground text-sm">Plan de taggage, script d'intégration et flux d'événements en temps réel.</p>
      </div>

      <Tabs defaultValue="tag-plan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tag-plan" className="gap-1.5"><List className="w-4 h-4" /> Tag Plan</TabsTrigger>
          <TabsTrigger value="script" className="gap-1.5"><Code className="w-4 h-4" /> Script</TabsTrigger>
          <TabsTrigger value="live" className="gap-1.5"><Activity className="w-4 h-4" /> Flux live</TabsTrigger>
        </TabsList>

        <TabsContent value="tag-plan"><TagPlanTab /></TabsContent>
        <TabsContent value="script"><TrackingScriptTab /></TabsContent>
        <TabsContent value="live"><LiveStreamTab /></TabsContent>
      </Tabs>
    </div>
  );
}
