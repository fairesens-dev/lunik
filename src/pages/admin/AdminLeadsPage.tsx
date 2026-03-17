import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mail, Phone, Check, Trash2, Eye, ExternalLink, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type LeadType = "Configurateur" | "Devis" | "Rappel" | "SAV" | "Panier abandonné" | "Échantillon" | "Autre";

interface UnifiedLead {
  id: string;
  source: "lead" | "abandoned_cart";
  type: LeadType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  width: number;
  projection: number;
  toileColor: string;
  armatureColor: string;
  options: string[];
  postalCode: string;
  date: string;
  message: string;
  processed: boolean;
  // abandoned cart specific
  cartData?: any;
  abandonmentStage?: string;
}

function classifyLead(r: any): LeadType {
  const msg = r.message || "";
  if (msg.startsWith("RAPPEL")) return "Rappel";
  if (msg.startsWith("SAV:")) return "SAV";
  if (msg.startsWith("ECHANTILLON:")) return "Échantillon";
  if (msg === "DEVIS_EMAIL") return "Devis";
  if ((r.width || 0) > 0) return "Configurateur";
  return "Autre";
}

function mapLeadRow(r: any): UnifiedLead {
  return {
    id: r.id,
    source: "lead",
    type: classifyLead(r),
    firstName: r.first_name || "",
    lastName: r.last_name || "",
    email: r.email,
    phone: r.phone || "",
    width: r.width || 0,
    projection: r.projection || 0,
    toileColor: r.toile_color || "",
    armatureColor: r.armature_color || "",
    options: r.options || [],
    postalCode: r.postal_code || "",
    date: r.created_at || "",
    message: r.message || "",
    processed: r.processed || false,
  };
}

function mapAbandonedCart(r: any): UnifiedLead {
  const cart = typeof r.cart_data === "object" ? r.cart_data : {};
  return {
    id: r.id,
    source: "abandoned_cart",
    type: "Panier abandonné",
    firstName: "",
    lastName: "",
    email: r.email || "",
    phone: "",
    width: cart.width || 0,
    projection: cart.projection || 0,
    toileColor: cart.toileColor || "",
    armatureColor: cart.armatureColor || "",
    options: cart.options || [],
    postalCode: "",
    date: r.created_at || "",
    message: `Étape: ${r.abandonment_stage}`,
    processed: false,
    cartData: cart,
    abandonmentStage: r.abandonment_stage,
  };
}

const typeBadgeColors: Record<LeadType, string> = {
  Configurateur: "bg-blue-100 text-blue-800",
  Devis: "bg-indigo-100 text-indigo-800",
  Rappel: "bg-amber-100 text-amber-800",
  SAV: "bg-red-100 text-red-800",
  "Panier abandonné": "bg-orange-100 text-orange-800",
  "Échantillon": "bg-teal-100 text-teal-800",
  Autre: "bg-muted text-muted-foreground",
};

const PER_PAGE = 15;

const AdminLeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [nonTraitesOnly, setNonTraitesOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [detailLead, setDetailLead] = useState<UnifiedLead | null>(null);
  const [detailOrders, setDetailOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    (async () => {
      const [leadsRes, cartsRes] = await Promise.all([
        supabase.from("leads" as any).select("*").order("created_at", { ascending: false }) as any,
        supabase.from("abandoned_carts" as any).select("*").eq("converted", false).not("email", "is", null).order("created_at", { ascending: false }) as any,
      ]);
      const allLeads: UnifiedLead[] = [];
      if (leadsRes.data) allLeads.push(...leadsRes.data.map(mapLeadRow));
      if (cartsRes.data) allLeads.push(...cartsRes.data.map(mapAbandonedCart));
      allLeads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLeads(allLeads);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    if (nonTraitesOnly) result = result.filter(l => !l.processed);
    if (typeFilter !== "Tous") result = result.filter(l => l.type === typeFilter);
    return result;
  }, [leads, search, nonTraitesOnly, typeFilter]);

  const totalThisMonth = leads.length;
  const nonTraites = leads.filter(l => !l.processed).length;
  const tauxTraitement = totalThisMonth > 0 ? Math.round(((totalThisMonth - nonTraites) / totalThisMonth) * 100) : 0;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleTraite = async (lead: UnifiedLead) => {
    if (lead.source !== "lead") return;
    const newVal = !lead.processed;
    await supabase.from("leads" as any).update({ processed: newVal } as any).eq("id", lead.id);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, processed: newVal } : l));
  };

  const deleteLead = async (lead: UnifiedLead) => {
    if (lead.source === "lead") {
      await supabase.from("leads" as any).delete().eq("id", lead.id);
    } else {
      await supabase.from("abandoned_carts" as any).delete().eq("id", lead.id);
    }
    setLeads(prev => prev.filter(l => l.id !== lead.id));
  };

  const openDetail = async (lead: UnifiedLead) => {
    setDetailLead(lead);
    setDetailOrders([]);
    if (lead.email && !lead.email.includes("@widget.local")) {
      setLoadingOrders(true);
      const { data } = await supabase
        .from("orders" as any)
        .select("id, ref, amount, status, created_at, width, projection")
        .eq("client_email", lead.email)
        .order("created_at", { ascending: false }) as any;
      setDetailOrders(data || []);
      setLoadingOrders(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement des leads...</div>;

  return (
    <div className="space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-foreground">Leads</h1>

      {/* Stat Banner */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="font-bold text-foreground">{totalThisMonth}</span> <span className="text-muted-foreground">leads</span></div>
            <div><span className="font-bold text-orange-600">{nonTraites}</span> <span className="text-muted-foreground">non traités</span></div>
            <div><span className="text-muted-foreground">Taux de traitement :</span> <Badge variant="secondary" className="ml-1">{tauxTraitement}%</Badge></div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher par nom, email, téléphone..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={nonTraitesOnly} onCheckedChange={(v) => { setNonTraitesOnly(v); setPage(1); }} />
              <span className="text-sm text-muted-foreground">Non traités uniquement</span>
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Tous", "Configurateur", "Devis", "Rappel", "SAV", "Panier abandonné", "Échantillon", "Autre"].map(p =>
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Nom</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Téléphone</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Configuration</TableHead>
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
                <TableRow key={`${l.source}-${l.id}`} className={l.processed ? "opacity-50" : ""}>
                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] ${typeBadgeColors[l.type]}`}>{l.type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {l.firstName || l.lastName ? `${l.firstName} ${l.lastName}`.trim() : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{l.email}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{l.phone || "—"}</TableCell>
                  <TableCell className="text-xs hidden lg:table-cell">
                    {l.width > 0 ? `${l.width}×${l.projection} cm · ${l.toileColor}` : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {l.date ? format(new Date(l.date), "dd MMM yyyy", { locale: fr }) : "—"}
                  </TableCell>
                  <TableCell>
                    {l.source === "lead" ? (
                      <Checkbox checked={l.processed} onCheckedChange={() => toggleTraite(l)} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDetail(l)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {l.email && !l.email.includes("@widget.local") && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={`mailto:${l.email}`}><Mail className="w-3.5 h-3.5" /></a>
                        </Button>
                      )}
                      {l.phone && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={`tel:${l.phone.replace(/\s/g, "")}`}><Phone className="w-3.5 h-3.5" /></a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteLead(l)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-xs text-muted-foreground">{filtered.length} lead{filtered.length > 1 ? "s" : ""} · Page {page}/{totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Préc.</Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Suiv.</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!detailLead} onOpenChange={(open) => { if (!open) setDetailLead(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-sans flex items-center gap-2">
              Détails du lead
              {detailLead && (
                <Badge variant="secondary" className={`text-xs ${typeBadgeColors[detailLead.type]}`}>
                  {detailLead.type}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {detailLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Nom</p>
                  <p className="font-medium">{detailLead.firstName || "—"} {detailLead.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium break-all">{detailLead.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Téléphone</p>
                  <p className="font-medium">{detailLead.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">{detailLead.date ? format(new Date(detailLead.date), "dd MMM yyyy HH:mm", { locale: fr }) : "—"}</p>
                </div>
                {detailLead.postalCode && (
                  <div>
                    <p className="text-muted-foreground text-xs">Code postal / Ville</p>
                    <p className="font-medium">{detailLead.postalCode}</p>
                  </div>
                )}
                {detailLead.width > 0 && (
                  <>
                    <div>
                      <p className="text-muted-foreground text-xs">Dimensions</p>
                      <p className="font-medium">{detailLead.width} × {detailLead.projection} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Toile</p>
                      <p className="font-medium">{detailLead.toileColor || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Armature</p>
                      <p className="font-medium">{detailLead.armatureColor || "—"}</p>
                    </div>
                  </>
                )}
              </div>

              {detailLead.options && detailLead.options.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Options</p>
                  <div className="flex flex-wrap gap-1">
                    {detailLead.options.map((o, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{o}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {detailLead.message && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Message / Détail</p>
                  <p className="text-sm bg-muted p-2 rounded">{detailLead.message}</p>
                </div>
              )}

              {detailLead.source === "abandoned_cart" && detailLead.abandonmentStage && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Étape d'abandon</p>
                  <Badge variant="outline">{detailLead.abandonmentStage}</Badge>
                </div>
              )}

              {/* Orders section */}
              {detailLead.email && !detailLead.email.includes("@widget.local") && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Commandes associées
                  </p>
                  {loadingOrders ? (
                    <p className="text-xs text-muted-foreground">Chargement...</p>
                  ) : detailOrders.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Aucune commande trouvée pour cet email</p>
                  ) : (
                    <div className="space-y-2">
                      {detailOrders.map((o: any) => (
                        <div key={o.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                          <div>
                            <span className="font-mono text-xs">{o.ref}</span>
                            <span className="text-muted-foreground text-xs ml-2">
                              {o.width}×{o.projection} cm · {(o.amount || 0).toLocaleString("fr-FR")} €
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">{o.status}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => { setDetailLead(null); navigate(`/admin/commandes/${o.id}`); }}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadsPage;
