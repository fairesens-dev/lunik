import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus, LayoutGrid, List, Copy, Trash2, BarChart3, Pencil,
  Mail, Send, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Tables } from "@/integrations/supabase/types";

type Campaign = Tables<"campaigns">;

const typeColors: Record<string, string> = {
  newsletter: "bg-blue-100 text-blue-700",
  automation: "bg-purple-100 text-purple-700",
  transactional: "bg-gray-100 text-gray-600",
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  sent: "bg-green-100 text-green-700",
};

const typeLabels: Record<string, string> = {
  newsletter: "Newsletter",
  automation: "Automation",
  transactional: "Transactionnel",
};

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Planifiée",
  sent: "Envoyée",
};

const AdminCampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"cards" | "table">(() =>
    (localStorage.getItem("campaigns-view") as "cards" | "table") || "cards"
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Erreur chargement campagnes");
    else setCampaigns(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  useEffect(() => {
    localStorage.setItem("campaigns-view", view);
  }, [view]);

  const filtered = campaigns.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSent = campaigns.filter((c) => c.status === "sent").length;
  const avgOpen = totalSent > 0
    ? Math.round(
        campaigns
          .filter((c) => c.status === "sent" && c.recipients_count > 0)
          .reduce((a, c) => a + (c.opens_count / c.recipients_count) * 100, 0) /
          (totalSent || 1)
      )
    : 0;

  const handleDuplicate = async (c: Campaign) => {
    const { error } = await supabase.from("campaigns").insert({
      name: `${c.name} (copie)`,
      type: c.type,
      status: "draft" as const,
      sender_name: c.sender_name,
      sender_email: c.sender_email,
      subject: c.subject,
      preview_text: c.preview_text,
      html_content: c.html_content,
    });
    if (error) toast.error("Erreur duplication");
    else { toast.success("Campagne dupliquée"); fetchCampaigns(); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("campaign_contacts").delete().eq("campaign_id", deleteId);
    const { error } = await supabase.from("campaigns").delete().eq("id", deleteId);
    if (error) toast.error("Erreur suppression");
    else { toast.success("Campagne supprimée"); fetchCampaigns(); }
    setDeleteId(null);
  };

  const openRate = (c: Campaign) =>
    c.recipients_count > 0 ? Math.round((c.opens_count / c.recipients_count) * 100) : 0;
  const clickRate = (c: Campaign) =>
    c.recipients_count > 0 ? Math.round((c.clicks_count / c.recipients_count) * 100) : 0;

  const CampaignCard = ({ c }: { c: Campaign }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => c.status === "sent" ? navigate(`/admin/campaigns/${c.id}/report`) : navigate(`/admin/campaigns/${c.id}/edit`)}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm truncate flex-1">{c.name}</h3>
          <div className="flex gap-1.5 shrink-0">
            <Badge className={`${typeColors[c.type]} border-0 text-[10px]`}>{typeLabels[c.type]}</Badge>
            <Badge className={`${statusColors[c.status]} border-0 text-[10px]`}>{statusLabels[c.status]}</Badge>
          </div>
        </div>
        {c.subject && <p className="text-xs text-muted-foreground truncate">{c.subject}</p>}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold">{c.recipients_count}</p>
            <p className="text-[10px] text-muted-foreground">Destinataires</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{openRate(c)}%</p>
            <p className="text-[10px] text-muted-foreground">Ouvertures</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{clickRate(c)}%</p>
            <p className="text-[10px] text-muted-foreground">Clics</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-[10px] text-muted-foreground">
            {c.sent_at ? format(new Date(c.sent_at), "dd MMM yyyy", { locale: fr }) : c.scheduled_at ? `Planifiée : ${format(new Date(c.scheduled_at), "dd MMM yyyy HH:mm", { locale: fr })}` : format(new Date(c.created_at), "dd MMM yyyy", { locale: fr })}
          </span>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/admin/campaigns/${c.id}/edit`)}>
              <Pencil className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDuplicate(c)}>
              <Copy className="w-3 h-3" />
            </Button>
            {c.status === "sent" && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/admin/campaigns/${c.id}/report`)}>
                <BarChart3 className="w-3 h-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(c.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Mail className="w-8 h-8 text-muted-foreground" /><div><p className="text-2xl font-bold">{campaigns.length}</p><p className="text-xs text-muted-foreground">Campagnes</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Send className="w-8 h-8 text-muted-foreground" /><div><p className="text-2xl font-bold">{totalSent}</p><p className="text-xs text-muted-foreground">Envoyées</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><FileText className="w-8 h-8 text-muted-foreground" /><div><p className="text-2xl font-bold">{avgOpen}%</p><p className="text-xs text-muted-foreground">Taux d'ouverture moyen</p></div></CardContent></Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Rechercher une campagne…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="scheduled">Planifiée</SelectItem>
            <SelectItem value="sent">Envoyée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="automation">Automation</SelectItem>
            <SelectItem value="transactional">Transactionnel</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setView("cards")} className={view === "cards" ? "bg-muted" : ""}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setView("table")} className={view === "table" ? "bg-muted" : ""}>
            <List className="w-4 h-4" />
          </Button>
          <Button onClick={() => navigate("/admin/campaigns/new")} className="rounded-md">
            <Plus className="w-4 h-4 mr-1" /> Nouvelle campagne
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Aucune campagne trouvée</p>
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => <CampaignCard key={c.id} c={c} />)}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Destinataires</TableHead>
                <TableHead className="text-right">Ouvertures</TableHead>
                <TableHead className="text-right">Clics</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => c.status === "sent" ? navigate(`/admin/campaigns/${c.id}/report`) : navigate(`/admin/campaigns/${c.id}/edit`)}
                >
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge className={`${typeColors[c.type]} border-0 text-[10px]`}>{typeLabels[c.type]}</Badge></TableCell>
                  <TableCell><Badge className={`${statusColors[c.status]} border-0 text-[10px]`}>{statusLabels[c.status]}</Badge></TableCell>
                  <TableCell className="text-right">{c.recipients_count}</TableCell>
                  <TableCell className="text-right">{openRate(c)}%</TableCell>
                  <TableCell className="text-right">{clickRate(c)}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.sent_at ? format(new Date(c.sent_at), "dd/MM/yyyy") : c.scheduled_at ? format(new Date(c.scheduled_at), "dd/MM/yyyy HH:mm") : format(new Date(c.created_at), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/admin/campaigns/${c.id}/edit`)}><Pencil className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDuplicate(c)}><Copy className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette campagne ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCampaignsPage;
