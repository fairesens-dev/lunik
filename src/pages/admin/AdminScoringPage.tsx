import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plus, Trash2, RefreshCw, GripVertical, Loader2, User } from "lucide-react";
import { toast } from "sonner";

// ── Types ──
interface ScoringRule {
  id: string;
  action: string;
  condition: string | null;
  points: number;
  active: boolean;
}

interface PipelineContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  lead_score: number;
  pipeline_stage: string;
  estimated_revenue: number;
  last_seen_at: string | null;
}

const DEFAULT_RULES: Omit<ScoringRule, "id">[] = [
  { action: "page_view", condition: null, points: 1, active: true },
  { action: "form_submit", condition: null, points: 10, active: true },
  { action: "email_opened", condition: null, points: 5, active: true },
  { action: "email_clicked", condition: null, points: 10, active: true },
  { action: "purchase", condition: null, points: 50, active: true },
  { action: "page_view", condition: "/configurateur", points: 15, active: true },
  { action: "job_title_contains", condition: "CEO,Director,Manager,Directeur,Gérant", points: 20, active: true },
  { action: "unsubscribed", condition: null, points: -30, active: true },
];

const ACTION_LABELS: Record<string, string> = {
  page_view: "Page vue",
  form_submit: "Soumission formulaire",
  email_opened: "Email ouvert",
  email_clicked: "Email cliqué",
  purchase: "Achat",
  job_title_contains: "Titre contient",
  unsubscribed: "Désabonnement",
  note: "Note ajoutée",
  call: "Appel",
};

const PIPELINE_STAGES = [
  { key: "new_lead", label: "Nouveau Lead", color: "bg-blue-100 text-blue-800" },
  { key: "contacted", label: "Contacté", color: "bg-yellow-100 text-yellow-800" },
  { key: "qualified", label: "Qualifié", color: "bg-purple-100 text-purple-800" },
  { key: "proposal", label: "Proposition", color: "bg-orange-100 text-orange-800" },
  { key: "won", label: "Gagné", color: "bg-green-100 text-green-800" },
  { key: "lost", label: "Perdu", color: "bg-red-100 text-red-800" },
];

// ═══════════════════════════════════════════════
// TAB 1: SCORING RULES
// ═══════════════════════════════════════════════
function ScoringRulesTab() {
  const [rules, setRules] = useState<ScoringRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAction, setNewAction] = useState("page_view");
  const [newCondition, setNewCondition] = useState("");
  const [newPoints, setNewPoints] = useState("0");

  const fetchRules = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("scoring_rules").select("*").order("created_at");
    if (data && data.length > 0) {
      setRules(data);
    } else if (data && data.length === 0) {
      // Seed defaults
      const { data: seeded } = await supabase.from("scoring_rules").insert(DEFAULT_RULES).select();
      if (seeded) setRules(seeded);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const toggleActive = async (rule: ScoringRule) => {
    await supabase.from("scoring_rules").update({ active: !rule.active }).eq("id", rule.id);
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = async (id: string) => {
    await supabase.from("scoring_rules").delete().eq("id", id);
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success("Règle supprimée");
  };

  const addRule = async () => {
    const { data } = await supabase.from("scoring_rules").insert({
      action: newAction,
      condition: newCondition || null,
      points: parseInt(newPoints) || 0,
      active: true,
    }).select().single();
    if (data) {
      setRules(prev => [...prev, data]);
      setDialogOpen(false);
      setNewCondition("");
      setNewPoints("0");
      toast.success("Règle ajoutée");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Définissez les points attribués pour chaque action ou propriété de contact.</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter une règle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle règle de scoring</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Action</label>
                <Select value={newAction} onValueChange={setNewAction}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Condition (optionnel)</label>
                <Input value={newCondition} onChange={e => setNewCondition(e.target.value)} placeholder="ex: /configurateur ou CEO,Director" />
              </div>
              <div>
                <label className="text-sm font-medium">Points</label>
                <Input type="number" value={newPoints} onChange={e => setNewPoints(e.target.value)} />
              </div>
              <Button onClick={addRule} className="w-full">Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-center">Actif</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map(rule => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{ACTION_LABELS[rule.action] || rule.action}</TableCell>
                <TableCell className="text-muted-foreground">{rule.condition || "—"}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={rule.points >= 0 ? "default" : "destructive"}>
                    {rule.points > 0 ? `+${rule.points}` : rule.points}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={rule.active} onCheckedChange={() => toggleActive(rule)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 2: RECALCULATION
// ═══════════════════════════════════════════════
function RecalculationTab() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [lastRecalc, setLastRecalc] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("admin_settings").select("data").eq("id", "last_score_recalc").single()
      .then(({ data }) => {
        if (data?.data && typeof data.data === "object" && "timestamp" in data.data) {
          setLastRecalc(data.data.timestamp as string);
        }
      });
  }, []);

  const recalculate = async () => {
    setRunning(true);
    setProgress(0);
    setCurrent(0);

    // Fetch rules
    const { data: rules } = await supabase.from("scoring_rules").select("*").eq("active", true);
    if (!rules) { setRunning(false); return; }

    // Fetch all contacts
    const { data: contacts } = await supabase.from("contacts").select("id, job_title");
    if (!contacts) { setRunning(false); return; }

    setTotal(contacts.length);

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      let score = 0;

      // Fetch activities for this contact
      const { data: activities } = await supabase
        .from("activities")
        .select("type, metadata")
        .eq("contact_id", contact.id);

      // Fetch page views
      const { data: pageViews } = await supabase
        .from("page_views")
        .select("page_url")
        .eq("contact_id", contact.id);

      for (const rule of rules) {
        if (rule.action === "job_title_contains" && rule.condition && contact.job_title) {
          const keywords = rule.condition.split(",").map((k: string) => k.trim().toLowerCase());
          if (keywords.some((kw: string) => contact.job_title!.toLowerCase().includes(kw))) {
            score += rule.points;
          }
        } else if (rule.action === "page_view" && rule.condition && pageViews) {
          const matchingViews = pageViews.filter(pv => pv.page_url.includes(rule.condition!));
          score += matchingViews.length * rule.points;
        } else if (rule.action === "page_view" && !rule.condition && pageViews) {
          score += pageViews.length * rule.points;
        } else if (activities) {
          const matchingActivities = activities.filter(a => a.type === rule.action);
          score += matchingActivities.length * rule.points;
        }
      }

      await supabase.from("contacts").update({ lead_score: score }).eq("id", contact.id);
      setCurrent(i + 1);
      setProgress(Math.round(((i + 1) / contacts.length) * 100));
    }

    // Save timestamp
    const now = new Date().toISOString();
    await supabase.from("admin_settings").upsert({ id: "last_score_recalc", data: { timestamp: now } });
    setLastRecalc(now);
    setRunning(false);
    toast.success(`Scores recalculés pour ${contacts.length} contacts`);
  };

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recalculer les scores</CardTitle>
          <CardDescription>
            Parcourt chaque contact, évalue les activités et met à jour le lead_score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {running && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{current} / {total} contacts traités</p>
            </div>
          )}
          <Button onClick={recalculate} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {running ? "Recalcul en cours…" : "Recalculer tous les scores"}
          </Button>
          {lastRecalc && (
            <p className="text-xs text-muted-foreground">
              Dernier recalcul : {new Date(lastRecalc).toLocaleString("fr-FR")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 3: ATTRIBUTION REPORT
// ═══════════════════════════════════════════════
function AttributionTab() {
  const [mode, setMode] = useState<"first" | "last">("first");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttribution = async () => {
      setLoading(true);

      // Get contacts with their first/last page view source
      const { data: contacts } = await supabase
        .from("contacts")
        .select("id, status, email");

      if (!contacts) { setLoading(false); return; }

      // Get page views with UTM data
      const { data: pageViews } = await supabase
        .from("page_views")
        .select("contact_id, utm_source, utm_medium, utm_campaign, created_at")
        .not("contact_id", "is", null)
        .order("created_at", { ascending: mode === "first" });

      // Get orders for revenue
      const { data: orders } = await supabase
        .from("orders")
        .select("client_email, amount");

      if (!pageViews) { setLoading(false); return; }

      // Build source map: for each contact, pick first or last touch
      const contactSource: Record<string, { source: string; medium: string; campaign: string }> = {};
      for (const pv of pageViews) {
        if (!pv.contact_id || contactSource[pv.contact_id]) continue;
        contactSource[pv.contact_id] = {
          source: pv.utm_source || "direct",
          medium: pv.utm_medium || "(none)",
          campaign: pv.utm_campaign || "(none)",
        };
      }

      // Aggregate by source
      const sourceMap: Record<string, { leads: number; customers: number; revenue: number }> = {};

      for (const contact of contacts) {
        const src = contactSource[contact.id];
        if (!src) continue;
        const key = `${src.source} / ${src.medium}`;
        if (!sourceMap[key]) sourceMap[key] = { leads: 0, customers: 0, revenue: 0 };
        sourceMap[key].leads++;

        if (contact.status === "customer") {
          sourceMap[key].customers++;
          const order = orders?.find(o => o.client_email.toLowerCase() === contact.email.toLowerCase());
          if (order) sourceMap[key].revenue += order.amount / 100;
        }
      }

      setData(Object.entries(sourceMap).map(([source, stats]) => ({ source, ...stats })).sort((a, b) => b.leads - a.leads));
      setLoading(false);
    };

    fetchAttribution();
  }, [mode]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">Attribution :</span>
        <Button variant={mode === "first" ? "default" : "outline"} size="sm" onClick={() => setMode("first")}>First-touch</Button>
        <Button variant={mode === "last" ? "default" : "outline"} size="sm" onClick={() => setMode("last")}>Last-touch</Button>
      </div>

      {data.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" fill="hsl(var(--primary))" name="Leads" />
                <Bar dataKey="customers" fill="hsl(var(--accent))" name="Clients" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source / Medium</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">Clients</TableHead>
              <TableHead className="text-right">Revenu (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucune donnée d'attribution</TableCell></TableRow>
            ) : data.map(row => (
              <TableRow key={row.source}>
                <TableCell className="font-medium">{row.source}</TableCell>
                <TableCell className="text-right">{row.leads}</TableCell>
                <TableCell className="text-right">{row.customers}</TableCell>
                <TableCell className="text-right">{row.revenue.toLocaleString("fr-FR")} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB 4: SALES PIPELINE (KANBAN)
// ═══════════════════════════════════════════════
function PipelineTab() {
  const [contacts, setContacts] = useState<PipelineContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, company, lead_score, pipeline_stage, estimated_revenue, last_seen_at")
      .order("lead_score", { ascending: false });
    if (data) setContacts(data as PipelineContact[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleDrop = async (stage: string) => {
    if (!draggedId) return;
    await supabase.from("contacts").update({ pipeline_stage: stage }).eq("id", draggedId);
    setContacts(prev => prev.map(c => c.id === draggedId ? { ...c, pipeline_stage: stage } : c));
    setDraggedId(null);
    toast.success("Contact déplacé");
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px]">
        {PIPELINE_STAGES.map(stage => {
          const stageContacts = contacts.filter(c => c.pipeline_stage === stage.key);
          const totalRevenue = stageContacts.reduce((s, c) => s + (c.estimated_revenue || 0), 0);

          return (
            <div
              key={stage.key}
              className="flex-1 min-w-[200px]"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(stage.key)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={stage.color}>{stage.label}</Badge>
                  <span className="text-xs text-muted-foreground">{stageContacts.length}</span>
                </div>
                {totalRevenue > 0 && (
                  <span className="text-xs font-medium text-muted-foreground">{totalRevenue.toLocaleString("fr-FR")} €</span>
                )}
              </div>

              <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                {stageContacts.map(contact => (
                  <Card
                    key={contact.id}
                    draggable
                    onDragStart={() => setDraggedId(contact.id)}
                    className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${draggedId === contact.id ? "opacity-50" : ""}`}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {contact.first_name} {contact.last_name}
                            </p>
                            {contact.company && (
                              <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">{contact.lead_score}</Badge>
                      </div>
                      {contact.last_seen_at && (
                        <p className="text-[10px] text-muted-foreground">
                          Vu {new Date(contact.last_seen_at).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
const AdminScoringPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lead Scoring & Attribution</h1>
        <p className="text-muted-foreground">Gérez les règles de scoring, recalculez les scores et visualisez le pipeline commercial.</p>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles de scoring</TabsTrigger>
          <TabsTrigger value="recalc">Recalcul</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="rules"><ScoringRulesTab /></TabsContent>
        <TabsContent value="recalc"><RecalculationTab /></TabsContent>
        <TabsContent value="attribution"><AttributionTab /></TabsContent>
        <TabsContent value="pipeline"><PipelineTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminScoringPage;
