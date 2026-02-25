import { useState, useMemo, useEffect } from "react";
import { Search, Mail, Phone, Check, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string; prenom: string; nom: string; email: string; telephone: string;
  width: number; projection: number; toileColor: string; armatureColor: string;
  options: string[]; codePostal: string; date: string; message: string; traite: boolean;
}

function mapRow(r: any): Lead {
  return {
    id: r.id,
    prenom: r.first_name,
    nom: r.last_name,
    email: r.email,
    telephone: r.phone || "",
    width: r.width || 0,
    projection: r.projection || 0,
    toileColor: r.toile_color || "",
    armatureColor: r.armature_color || "",
    options: r.options || [],
    codePostal: r.postal_code || "",
    date: r.created_at?.split("T")[0] || "",
    message: r.message || "",
    traite: r.processed || false,
  };
}

const PER_PAGE = 10;

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [nonTraitesOnly, setNonTraitesOnly] = useState(false);
  const [period, setPeriod] = useState("Ce mois");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("leads" as any).select("*").order("created_at", { ascending: false }) as any;
      if (data) setLeads(data.map(mapRow));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => `${l.prenom} ${l.nom}`.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.telephone.includes(q));
    }
    if (nonTraitesOnly) result = result.filter(l => !l.traite);
    return result;
  }, [leads, search, nonTraitesOnly]);

  const totalThisMonth = leads.length;
  const nonTraites = leads.filter(l => !l.traite).length;
  const tauxTraitement = totalThisMonth > 0 ? Math.round(((totalThisMonth - nonTraites) / totalThisMonth) * 100) : 0;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleTraite = async (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const newVal = !lead.traite;
    await supabase.from("leads" as any).update({ processed: newVal } as any).eq("id", id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, traite: newVal } : l));
  };

  const deleteLead = async (id: string) => {
    await supabase.from("leads" as any).delete().eq("id", id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement des leads...</div>;

  return (
    <div className="space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-gray-900">Leads</h1>

      {/* Stat Banner */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="font-bold text-gray-900">{totalThisMonth}</span> <span className="text-gray-500">leads</span></div>
            <div><span className="font-bold text-orange-600">{nonTraites}</span> <span className="text-gray-500">non traités</span></div>
            <div><span className="text-gray-500">Taux de traitement :</span> <Badge variant="secondary" className="ml-1">{tauxTraitement}%</Badge></div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Rechercher par nom, email, téléphone..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={nonTraitesOnly} onCheckedChange={(v) => { setNonTraitesOnly(v); setPage(1); }} />
              <span className="text-sm text-gray-600">Non traités uniquement</span>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Ce mois", "3 mois", "6 mois", "Cette année"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nom</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Téléphone</TableHead>
                <TableHead className="text-xs">Configuration</TableHead>
                <TableHead className="text-xs">CP</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Traité</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucun lead</TableCell></TableRow>
              )}
              {paginated.map(l => (
                <TableRow key={l.id} className={l.traite ? "opacity-50" : ""}>
                  <TableCell className="text-xs font-medium">{l.prenom} {l.nom}</TableCell>
                  <TableCell className="text-xs text-gray-500">{l.email}</TableCell>
                  <TableCell className="text-xs text-gray-500">{l.telephone}</TableCell>
                  <TableCell className="text-xs">{l.width}×{l.projection} cm · {l.toileColor}</TableCell>
                  <TableCell className="text-xs">{l.codePostal}</TableCell>
                  <TableCell className="text-xs text-gray-500">{new Date(l.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell><Checkbox checked={l.traite} onCheckedChange={() => toggleTraite(l.id)} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`mailto:${l.email}`}><Mail className="w-3.5 h-3.5" /></a></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`tel:${l.telephone.replace(/\s/g, "")}`}><Phone className="w-3.5 h-3.5" /></a></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleTraite(l.id)}><Check className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => deleteLead(l.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-xs text-gray-500">{filtered.length} lead{filtered.length > 1 ? "s" : ""} · Page {page}/{totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Préc.</Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Suiv.</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeadsPage;
