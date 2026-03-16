import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Mail, Phone, Building2, Briefcase, Save, Trash2, Plus,
  StickyNote, PhoneCall, Eye, FileText, ShoppingCart, X, Wrench, MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Contact = Tables<"contacts">;
type Activity = Tables<"activities">;
type PageView = Tables<"page_views">;
type Conversion = Tables<"conversions">;
type ContactProp = Tables<"contact_properties">;
type CampaignContact = Tables<"campaign_contacts">;

const statusColors: Record<string, string> = {
  visitor: "bg-muted text-muted-foreground",
  lead: "bg-yellow-100 text-yellow-800",
  mql: "bg-orange-100 text-orange-800",
  sql: "bg-blue-100 text-blue-800",
  customer: "bg-green-100 text-green-800",
  churned: "bg-red-100 text-red-800",
};

const activityIcons: Record<string, React.ReactNode> = {
  email_sent: <Mail className="w-4 h-4" />,
  email_opened: <Eye className="w-4 h-4" />,
  email_clicked: <Eye className="w-4 h-4" />,
  sms_sent: <Phone className="w-4 h-4" />,
  page_view: <Eye className="w-4 h-4" />,
  form_submit: <FileText className="w-4 h-4" />,
  purchase: <ShoppingCart className="w-4 h-4" />,
  note: <StickyNote className="w-4 h-4" />,
  call: <PhoneCall className="w-4 h-4" />,
  sav_request: <Wrench className="w-4 h-4" />,
  callback_request: <PhoneCall className="w-4 h-4" />,
  chatbot_conversation: <MessageCircle className="w-4 h-4" />,
};

const AdminContactDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<Partial<Contact>>({});
  const [properties, setProperties] = useState<ContactProp[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [campaignContacts, setCampaignContacts] = useState<(CampaignContact & { campaign_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logForm, setLogForm] = useState({ type: "note" as Activity["type"], subject: "", body: "" });
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropVal, setNewPropVal] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [cRes, pRes, aRes, pvRes, cvRes, ccRes] = await Promise.all([
        supabase.from("contacts").select("*").eq("id", id).single(),
        supabase.from("contact_properties").select("*").eq("contact_id", id),
        supabase.from("activities").select("*").eq("contact_id", id).order("created_at", { ascending: false }).limit(100),
        supabase.from("page_views").select("*").eq("contact_id", id).order("created_at", { ascending: false }).limit(100),
        supabase.from("conversions").select("*").eq("contact_id", id).order("created_at", { ascending: false }).limit(100),
        supabase.from("campaign_contacts").select("*, campaigns(name)").eq("contact_id", id).order("sent_at", { ascending: false }),
      ]);
      if (cRes.error || !cRes.data) { toast.error("Contact introuvable"); navigate("/admin/contacts"); return; }
      setContact(cRes.data);
      setForm(cRes.data);
      setProperties(pRes.data || []);
      setActivities(aRes.data || []);
      setPageViews(pvRes.data || []);
      setConversions(cvRes.data || []);
      setCampaignContacts(
        (ccRes.data || []).map((cc: any) => ({ ...cc, campaign_name: cc.campaigns?.name || "—" }))
      );
      setLoading(false);
    };
    load();
  }, [id]);

  const saveContact = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase.from("contacts").update({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      job_title: form.job_title,
      status: form.status,
      source: form.source,
      lead_score: form.lead_score,
    }).eq("id", id);
    setSaving(false);
    if (error) { toast.error("Erreur sauvegarde"); return; }
    toast.success("Contact mis à jour");
    setContact({ ...contact!, ...form } as Contact);
  };

  const deleteContact = async () => {
    if (!id || !confirm("Supprimer ce contact ?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    toast.success("Contact supprimé");
    navigate("/admin/contacts");
  };

  const logActivity = async () => {
    if (!id || !logForm.subject) { toast.error("Sujet requis"); return; }
    const { error } = await supabase.from("activities").insert({
      contact_id: id,
      type: logForm.type,
      subject: logForm.subject,
      body: logForm.body || null,
    });
    if (error) { toast.error("Erreur"); return; }
    toast.success("Activité ajoutée");
    setLogOpen(false);
    setLogForm({ type: "note", subject: "", body: "" });
    const { data } = await supabase.from("activities").select("*").eq("contact_id", id).order("created_at", { ascending: false }).limit(100);
    setActivities(data || []);
  };

  const addProperty = async () => {
    if (!id || !newPropKey) return;
    const { error } = await supabase.from("contact_properties").insert({
      contact_id: id, property_key: newPropKey, property_value: newPropVal,
    });
    if (error) { toast.error("Erreur"); return; }
    setNewPropKey(""); setNewPropVal("");
    const { data } = await supabase.from("contact_properties").select("*").eq("contact_id", id);
    setProperties(data || []);
  };

  const deleteProp = async (propId: string) => {
    await supabase.from("contact_properties").delete().eq("id", propId);
    setProperties(properties.filter(p => p.id !== propId));
  };

  if (loading) return <p className="text-center py-12 text-muted-foreground font-sans">Chargement…</p>;
  if (!contact) return null;

  const initials = `${(contact.first_name || "?")[0]}${(contact.last_name || "?")[0]}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground font-sans">Contacts</p>
            <h1 className="text-lg font-bold font-sans">{contact.first_name} {contact.last_name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`mailto:${contact.email}`}>
            <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-1" />Email</Button>
          </a>
          <Button variant="destructive" size="sm" onClick={deleteContact}>
            <Trash2 className="w-4 h-4 mr-1" />Supprimer
          </Button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_2fr] gap-6">
        {/* Left panel */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-sans">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="flex gap-2">
                    <Input className="h-8 text-center font-medium font-sans" value={form.first_name || ""}
                      onChange={e => setForm({ ...form, first_name: e.target.value })} />
                    <Input className="h-8 text-center font-medium font-sans" value={form.last_name || ""}
                      onChange={e => setForm({ ...form, last_name: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input className="h-8 font-sans" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input className="h-8 font-sans" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input className="h-8 font-sans" placeholder="Entreprise" value={form.company || ""} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input className="h-8 font-sans" placeholder="Poste" value={form.job_title || ""} onChange={e => setForm({ ...form, job_title: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-sans">Statut</Label>
                  <Select value={form.status || "visitor"} onValueChange={v => setForm({ ...form, status: v as any })}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["visitor","lead","mql","sql","customer","churned"].map(s =>
                        <SelectItem key={s} value={s}><Badge className={`${statusColors[s]} text-xs`}>{s}</Badge></SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-sans">Source</Label>
                  <Select value={form.source || "direct"} onValueChange={v => setForm({ ...form, source: v as any })}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["organic","paid","email","social","referral","direct"].map(s =>
                        <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-sans">Lead Score</Label>
                <div className="flex items-center gap-2">
                  <Progress value={form.lead_score || 0} className="flex-1 h-2" />
                  <Input type="number" min={0} max={100} className="w-16 h-8 text-center font-sans"
                    value={form.lead_score || 0}
                    onChange={e => setForm({ ...form, lead_score: Math.min(100, Math.max(0, Number(e.target.value))) })} />
                </div>
              </div>

              <Button className="w-full" onClick={saveContact} disabled={saving}>
                <Save className="w-4 h-4 mr-1" />{saving ? "Sauvegarde…" : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>

          {/* Custom Properties */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-sans">Propriétés personnalisées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {properties.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground font-sans min-w-[80px]">{p.property_key}</span>
                  <span className="flex-1 font-sans">{p.property_value || "—"}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteProp(p.id)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input placeholder="Clé" className="h-7 text-xs font-sans" value={newPropKey} onChange={e => setNewPropKey(e.target.value)} />
                <Input placeholder="Valeur" className="h-7 text-xs font-sans" value={newPropVal} onChange={e => setNewPropVal(e.target.value)} />
                <Button size="sm" variant="outline" className="h-7 px-2" onClick={addProperty}><Plus className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="timeline" className="font-sans">Timeline</TabsTrigger>
            <TabsTrigger value="pageviews" className="font-sans">Pages vues ({pageViews.length})</TabsTrigger>
            <TabsTrigger value="conversions" className="font-sans">Conversions ({conversions.length})</TabsTrigger>
            <TabsTrigger value="campaigns" className="font-sans">Campagnes ({campaignContacts.length})</TabsTrigger>
          </TabsList>

          {/* Timeline */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-sans">Activités</CardTitle>
                <Dialog open={logOpen} onOpenChange={setLogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" />Logger</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-sans">Nouvelle activité</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label className="font-sans">Type</Label>
                        <Select value={logForm.type} onValueChange={v => setLogForm({ ...logForm, type: v as any })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["note","call","email_sent","sms_sent","form_submit","purchase","page_view"].map(t =>
                              <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label className="font-sans">Sujet *</Label>
                        <Input value={logForm.subject} onChange={e => setLogForm({ ...logForm, subject: e.target.value })} /></div>
                      <div><Label className="font-sans">Détails</Label>
                        <Textarea value={logForm.body} onChange={e => setLogForm({ ...logForm, body: e.target.value })} rows={3} /></div>
                      <Button onClick={logActivity} className="w-full">Ajouter</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 font-sans">Aucune activité</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map(a => (
                      <div key={a.id} className="flex gap-3 border-l-2 border-muted pl-3 py-1">
                        <div className="mt-0.5 text-muted-foreground">{activityIcons[a.type] || <StickyNote className="w-4 h-4" />}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] font-sans">{a.type}</Badge>
                            <span className="text-xs text-muted-foreground font-sans">
                              {format(new Date(a.created_at), "dd MMM yyyy HH:mm", { locale: fr })}
                            </span>
                          </div>
                          {a.subject && <p className="text-sm font-medium font-sans mt-0.5">{a.subject}</p>}
                          {a.body && <p className="text-xs text-muted-foreground font-sans line-clamp-2">{a.body}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Views */}
          <TabsContent value="pageviews">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sans">Date</TableHead>
                      <TableHead className="font-sans">Page</TableHead>
                      <TableHead className="hidden md:table-cell font-sans">Referrer</TableHead>
                      <TableHead className="hidden md:table-cell font-sans">UTM Source</TableHead>
                      <TableHead className="hidden lg:table-cell font-sans">Device</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageViews.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground font-sans">Aucune page vue</TableCell></TableRow>
                    ) : pageViews.map(pv => (
                      <TableRow key={pv.id}>
                        <TableCell className="text-xs font-sans">{format(new Date(pv.created_at), "dd/MM HH:mm")}</TableCell>
                        <TableCell className="text-sm font-sans max-w-[200px] truncate">{pv.page_url}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs font-sans truncate max-w-[150px]">{pv.referrer || "—"}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs font-sans">{pv.utm_source || "—"}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs font-sans">{pv.device_type || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversions */}
          <TabsContent value="conversions">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sans">Date</TableHead>
                      <TableHead className="font-sans">Événement</TableHead>
                      <TableHead className="font-sans">Catégorie</TableHead>
                      <TableHead className="font-sans">Valeur</TableHead>
                      <TableHead className="hidden md:table-cell font-sans">Page</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversions.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground font-sans">Aucune conversion</TableCell></TableRow>
                    ) : conversions.map(cv => (
                      <TableRow key={cv.id}>
                        <TableCell className="text-xs font-sans">{format(new Date(cv.created_at), "dd/MM HH:mm")}</TableCell>
                        <TableCell className="text-sm font-medium font-sans">{cv.event_name}</TableCell>
                        <TableCell className="text-xs font-sans">{cv.event_category || "—"}</TableCell>
                        <TableCell className="text-sm font-sans">{cv.event_value ? `${cv.event_value} ${cv.currency || "€"}` : "—"}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs font-sans truncate max-w-[150px]">{cv.page_url || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns */}
          <TabsContent value="campaigns">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sans">Campagne</TableHead>
                      <TableHead className="font-sans">Envoyé</TableHead>
                      <TableHead className="font-sans">Ouvert</TableHead>
                      <TableHead className="font-sans">Cliqué</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignContacts.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground font-sans">Aucune campagne</TableCell></TableRow>
                    ) : campaignContacts.map(cc => (
                      <TableRow key={cc.id}>
                        <TableCell className="text-sm font-medium font-sans">{cc.campaign_name}</TableCell>
                        <TableCell className="text-xs font-sans">{cc.sent_at ? format(new Date(cc.sent_at), "dd/MM HH:mm") : "—"}</TableCell>
                        <TableCell>{cc.opened_at ? <Badge className="bg-green-100 text-green-800 text-[10px]">Oui</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                        <TableCell>{cc.clicked_at ? <Badge className="bg-blue-100 text-blue-800 text-[10px]">Oui</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContactDetailPage;
