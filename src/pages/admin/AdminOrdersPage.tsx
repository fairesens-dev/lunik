import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Mail, Download, Search, Zap, Lightbulb, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string; ref: string;
  client: { name: string; email: string; phone: string; cp: string };
  width: number; projection: number;
  toileColor: string; armatureColor: string;
  options: string[]; montant: number; status: string; date: string;
  message: string;
  statusHistory: { status: string; date: string }[];
  notes: string;
}

function mapRow(r: any): Order {
  return {
    id: r.id,
    ref: r.ref,
    client: { name: r.client_name, email: r.client_email, phone: r.client_phone || "", cp: r.client_postal_code || "" },
    width: r.width,
    projection: r.projection,
    toileColor: r.toile_color || "",
    armatureColor: r.armature_color || "",
    options: r.options || [],
    montant: r.amount,
    status: r.status,
    date: r.created_at?.split("T")[0] || "",
    message: r.message || "",
    statusHistory: r.status_history || [],
    notes: r.notes || "",
  };
}

const STATUS_OPTIONS = ["Tous", "Nouveau", "En fabrication", "Prêt à expédier", "Expédié", "Livré", "Annulé"];
const PERIOD_OPTIONS = ["Ce mois", "3 mois", "6 mois", "Cette année", "Personnalisé"];

const statusColor: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-700",
  "En fabrication": "bg-orange-100 text-orange-700",
  "Prêt à expédier": "bg-cyan-100 text-cyan-700",
  Expédié: "bg-purple-100 text-purple-700",
  Livré: "bg-green-100 text-green-700",
  Annulé: "bg-red-100 text-red-700",
};

const optionIcon: Record<string, React.ReactNode> = {
  Motorisation: <Zap className="w-3.5 h-3.5" />,
  "Motorisation Somfy io": <Zap className="w-3.5 h-3.5" />,
  LED: <Lightbulb className="w-3.5 h-3.5" />,
  "Éclairage LED sous store": <Lightbulb className="w-3.5 h-3.5" />,
  "Pack Connect": <Smartphone className="w-3.5 h-3.5" />,
};

const PER_PAGE = 10;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [period, setPeriod] = useState("Ce mois");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("orders" as any).select("*").order("created_at", { ascending: false }) as any;
      if (data) setOrders(data.map(mapRow));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o => o.client.name.toLowerCase().includes(q) || o.client.email.toLowerCase().includes(q) || o.ref.toLowerCase().includes(q));
    }
    if (statusFilter !== "Tous") result = result.filter(o => o.status === statusFilter);
    return result;
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCSV = () => {
    const header = "Réf,Client,Email,Téléphone,Configuration,Options,Montant,Statut,Date\n";
    const rows = filtered.map(o =>
      `${o.ref},"${o.client.name}",${o.client.email},${o.client.phone},"${o.width}×${o.projection} cm · ${o.toileColor} · ${o.armatureColor}","${o.options.join(", ")}",${o.montant} €,${o.status},${o.date}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "commandes.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const newHistory = [...order.statusHistory, { status: newStatus, date: new Date().toLocaleDateString("fr-FR") }];
    await supabase.from("orders" as any).update({ status: newStatus, status_history: newHistory } as any).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus, statusHistory: newHistory } : o));
  };


  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement des commandes...</div>;

  return (
    <div className="space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Rechercher par nom, email, référence..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{PERIOD_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
            {period === "Personnalisé" && (
              <>
                <Input type="date" className="w-[150px]" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                <Input type="date" className="w-[150px]" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </>
            )}
            <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> Exporter CSV</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.size === paginated.length && paginated.length > 0} onCheckedChange={(c) => { if (c) setSelected(new Set(paginated.map(o => o.id))); else setSelected(new Set()); }} /></TableHead>
                <TableHead className="text-xs">Réf</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Configuration</TableHead>
                <TableHead className="text-xs">Options</TableHead>
                <TableHead className="text-xs">Montant</TableHead>
                <TableHead className="text-xs">Statut</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Aucune commande</TableCell></TableRow>
              )}
              {paginated.map(o => (
                <TableRow key={o.id}>
                  <TableCell><Checkbox checked={selected.has(o.id)} onCheckedChange={(c) => { const n = new Set(selected); if (c) n.add(o.id); else n.delete(o.id); setSelected(n); }} /></TableCell>
                  <TableCell className="text-xs font-mono">{o.ref}</TableCell>
                  <TableCell className="text-xs"><div>{o.client.name}</div><div className="text-gray-400">{o.client.email}</div></TableCell>
                  <TableCell className="text-xs">{o.width}×{o.projection} cm · {o.toileColor} · {o.armatureColor}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {o.options.length === 0 && <span className="text-xs text-gray-400">—</span>}
                      {o.options.map(opt => (
                        <span key={opt} className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-600" title={opt}>
                          {optionIcon[opt] || opt[0]}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{o.montant.toLocaleString("fr-FR")} €</TableCell>
                  <TableCell><Badge className={`text-[10px] ${statusColor[o.status] || ""}`} variant="secondary">{o.status}</Badge></TableCell>
                  <TableCell className="text-xs text-gray-500">{new Date(o.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild><Link to={`/admin/commandes/${o.id}`}><Eye className="w-3.5 h-3.5" /></Link></Button>
                      <Select value="" onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="h-7 w-20 text-[10px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                        <SelectContent>{STATUS_OPTIONS.filter(s => s !== "Tous" && s !== o.status).map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`mailto:${o.client.email}`}><Mail className="w-3.5 h-3.5" /></a></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-xs text-gray-500">{filtered.length} commande{filtered.length > 1 ? "s" : ""} · Page {page}/{totalPages}</p>
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

export default AdminOrdersPage;
