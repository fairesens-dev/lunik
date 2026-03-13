import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users, Plus, Search, Download, ChevronLeft, ChevronRight, UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Contact = Tables<"contacts">;

const statusColors: Record<string, string> = {
  visitor: "bg-muted text-muted-foreground",
  lead: "bg-yellow-100 text-yellow-800",
  mql: "bg-orange-100 text-orange-800",
  sql: "bg-blue-100 text-blue-800",
  customer: "bg-green-100 text-green-800",
  churned: "bg-red-100 text-red-800",
};

const sourceColors: Record<string, string> = {
  organic: "bg-green-50 text-green-700",
  paid: "bg-purple-50 text-purple-700",
  email: "bg-blue-50 text-blue-700",
  social: "bg-pink-50 text-pink-700",
  referral: "bg-amber-50 text-amber-700",
  direct: "bg-muted text-muted-foreground",
};

const emptyForm = {
  first_name: "", last_name: "", email: "", phone: "",
  company: "", job_title: "", status: "visitor" as const, source: "direct" as const,
};

const AdminContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [bulkStatus, setBulkStatus] = useState("");

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Erreur chargement contacts"); return; }
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const filtered = useMemo(() => {
    let r = contacts;
    if (statusFilter !== "all") r = r.filter(c => c.status === statusFilter);
    if (sourceFilter !== "all") r = r.filter(c => c.source === sourceFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company || "").toLowerCase().includes(q)
      );
    }
    return r;
  }, [contacts, statusFilter, sourceFilter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice(page * perPage, (page + 1) * perPage);

  const toggleAll = () => {
    if (selected.size === pageData.length) setSelected(new Set());
    else setSelected(new Set(pageData.map(c => c.id)));
  };

  const toggleOne = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleAdd = async () => {
    if (!form.email || !form.first_name) { toast.error("Nom et email requis"); return; }
    const { error } = await supabase.from("contacts").insert(form);
    if (error) { toast.error("Erreur création"); return; }
    toast.success("Contact créé");
    setAddOpen(false);
    setForm(emptyForm);
    fetchContacts();
  };

  const exportCSV = () => {
    const rows = contacts.filter(c => selected.has(c.id));
    if (!rows.length) { toast.error("Sélectionnez des contacts"); return; }
    const header = "Prénom,Nom,Email,Téléphone,Entreprise,Statut,Source,Score\n";
    const csv = header + rows.map(c =>
      [c.first_name, c.last_name, c.email, c.phone || "", c.company || "", c.status, c.source, c.lead_score].join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "contacts.csv";
    a.click();
    toast.success(`${rows.length} contacts exportés`);
  };

  const bulkChangeStatus = async () => {
    if (!bulkStatus || !selected.size) return;
    const { error } = await supabase
      .from("contacts")
      .update({ status: bulkStatus as Contact["status"] })
      .in("id", Array.from(selected));
    if (error) { toast.error("Erreur mise à jour"); return; }
    toast.success(`${selected.size} contacts mis à jour`);
    setSelected(new Set());
    setBulkStatus("");
    fetchContacts();
  };

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    let totalScore = 0;
    contacts.forEach(c => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      totalScore += c.lead_score;
    });
    return { total: contacts.length, byStatus, avgScore: contacts.length ? Math.round(totalScore / contacts.length) : 0 };
  }, [contacts]);

  const initials = (c: Contact) =>
    `${(c.first_name || "?")[0]}${(c.last_name || "?")[0]}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground font-sans">Total contacts</p>
          <p className="text-2xl font-bold font-sans">{stats.total}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground font-sans">Customers</p>
          <p className="text-2xl font-bold text-green-600 font-sans">{stats.byStatus.customer || 0}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground font-sans">Leads</p>
          <p className="text-2xl font-bold text-yellow-600 font-sans">{stats.byStatus.lead || 0}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground font-sans">Score moyen</p>
          <p className="text-2xl font-bold font-sans">{stats.avgScore}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 font-sans">
            <Users className="w-5 h-5" /> Contacts
          </CardTitle>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-sans">Nouveau contact</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-sans">Prénom *</Label>
                  <Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
                <div><Label className="font-sans">Nom *</Label>
                  <Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
                <div className="col-span-2"><Label className="font-sans">Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label className="font-sans">Téléphone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label className="font-sans">Entreprise</Label>
                  <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                <div><Label className="font-sans">Poste</Label>
                  <Input value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} /></div>
                <div><Label className="font-sans">Statut</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["visitor","lead","mql","sql","customer","churned"].map(s =>
                        <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select></div>
                <div><Label className="font-sans">Source</Label>
                  <Select value={form.source} onValueChange={v => setForm({ ...form, source: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["organic","paid","email","social","referral","direct"].map(s =>
                        <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select></div>
              </div>
              <Button onClick={handleAdd} className="mt-2 w-full">Créer le contact</Button>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher nom, email, entreprise…" className="pl-9"
                value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                {["visitor","lead","mql","sql","customer","churned"].map(s =>
                  <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={v => { setSourceFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes sources</SelectItem>
                {["organic","paid","email","social","referral","direct"].map(s =>
                  <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(0); }}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}/page</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
              <span className="text-sm font-sans font-medium">{selected.size} sélectionné(s)</span>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-[140px] h-8"><SelectValue placeholder="Changer statut" /></SelectTrigger>
                <SelectContent>
                  {["visitor","lead","mql","sql","customer","churned"].map(s =>
                    <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {bulkStatus && <Button size="sm" variant="outline" onClick={bulkChangeStatus}><UserCheck className="w-3 h-3 mr-1" />Appliquer</Button>}
              <Button size="sm" variant="outline" onClick={exportCSV}><Download className="w-3 h-3 mr-1" />Export CSV</Button>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <p className="text-center text-muted-foreground py-8 font-sans">Chargement…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"><Checkbox checked={selected.size === pageData.length && pageData.length > 0} onCheckedChange={toggleAll} /></TableHead>
                  <TableHead className="font-sans">Contact</TableHead>
                  <TableHead className="font-sans">Email</TableHead>
                  <TableHead className="hidden md:table-cell font-sans">Téléphone</TableHead>
                  <TableHead className="font-sans">Statut</TableHead>
                  <TableHead className="hidden lg:table-cell font-sans">Score</TableHead>
                  <TableHead className="hidden md:table-cell font-sans">Source</TableHead>
                  <TableHead className="hidden lg:table-cell font-sans">Créé le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map(c => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/admin/contacts/${c.id}`)}>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleOne(c.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-sans">{initials(c)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm font-sans">{c.first_name} {c.last_name}</p>
                          {c.company && <p className="text-xs text-muted-foreground font-sans">{c.company}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-sans">{c.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm font-sans">{c.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${statusColors[c.status]} text-xs font-sans`}>{c.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={c.lead_score} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground font-sans">{c.lead_score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className={`${sourceColors[c.source]} text-xs font-sans`}>{c.source}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground font-sans">
                      {format(new Date(c.created_at), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                  </TableRow>
                ))}
                {pageData.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground font-sans">Aucun contact trouvé</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground font-sans">
                {filtered.length} résultat(s) — page {page + 1}/{totalPages}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactsPage;
