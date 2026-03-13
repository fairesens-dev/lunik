import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Download, Check, X, Mail, MousePointerClick, Eye, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { Tables } from "@/integrations/supabase/types";

type Campaign = Tables<"campaigns">;

interface RecipientRow {
  contact_id: string;
  email: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  unsubscribed_at: string | null;
}

const AdminCampaignReportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<RecipientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const [{ data: camp }, { data: cc }] = await Promise.all([
        supabase.from("campaigns").select("*").eq("id", id).single(),
        supabase
          .from("campaign_contacts")
          .select("contact_id, sent_at, opened_at, clicked_at, unsubscribed_at, contacts(email)")
          .eq("campaign_id", id)
          .order("sent_at", { ascending: false }),
      ]);
      setCampaign(camp);
      setRecipients(
        (cc || []).map((r: any) => ({
          contact_id: r.contact_id,
          email: r.contacts?.email || "—",
          sent_at: r.sent_at,
          opened_at: r.opened_at,
          clicked_at: r.clicked_at,
          unsubscribed_at: r.unsubscribed_at,
        }))
      );
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-sm text-muted-foreground text-center py-12">Chargement…</p>;
  if (!campaign) return <p className="text-center py-12 text-muted-foreground">Campagne introuvable</p>;

  const sent = campaign.recipients_count;
  const opens = campaign.opens_count;
  const clicks = campaign.clicks_count;
  const unsubs = campaign.unsubscribes_count;
  const openRate = sent > 0 ? Math.round((opens / sent) * 100) : 0;
  const ctr = sent > 0 ? Math.round((clicks / sent) * 100) : 0;

  // Build chart data from recipients
  const buildChartData = () => {
    const openMap = new Map<string, number>();
    const clickMap = new Map<string, number>();
    recipients.forEach((r) => {
      if (r.opened_at) {
        const key = format(new Date(r.opened_at), "dd/MM HH:00");
        openMap.set(key, (openMap.get(key) || 0) + 1);
      }
      if (r.clicked_at) {
        const key = format(new Date(r.clicked_at), "dd/MM HH:00");
        clickMap.set(key, (clickMap.get(key) || 0) + 1);
      }
    });
    const allKeys = new Set([...openMap.keys(), ...clickMap.keys()]);
    return Array.from(allKeys)
      .sort()
      .map((k) => ({ time: k, Ouvertures: openMap.get(k) || 0, Clics: clickMap.get(k) || 0 }));
  };

  const chartData = buildChartData();

  const exportCSV = () => {
    const header = "Email,Envoyé,Ouvert,Cliqué,Désinscrit\n";
    const rows = recipients.map((r) =>
      [r.email, r.sent_at || "", r.opened_at || "", r.clicked_at || "", r.unsubscribed_at || ""].join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-${campaign.name.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: "Envoyés", value: sent, icon: Mail },
    { label: "Ouvertures", value: opens, icon: Eye },
    { label: "Taux d'ouverture", value: `${openRate}%`, icon: Eye },
    { label: "Clics", value: clicks, icon: MousePointerClick },
    { label: "CTR", value: `${ctr}%`, icon: MousePointerClick },
    { label: "Désinscriptions", value: unsubs, icon: UserMinus },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/campaigns")} className="rounded-md">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{campaign.name}</h1>
          <p className="text-xs text-muted-foreground">
            {campaign.sent_at ? `Envoyée le ${format(new Date(campaign.sent_at), "dd MMMM yyyy à HH:mm", { locale: fr })}` : "Non envoyée"}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 text-center">
              <k.icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-[10px] text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Engagement dans le temps</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ouvertures" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Clics" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recipients table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Destinataires ({recipients.length})</CardTitle>
            <Button variant="outline" size="sm" className="rounded-md" onClick={exportCSV}>
              <Download className="w-3 h-3 mr-1" /> Exporter CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Ouvert</TableHead>
                <TableHead className="text-center">Cliqué</TableHead>
                <TableHead className="text-center">Désinscrit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucun destinataire</TableCell></TableRow>
              ) : recipients.map((r) => (
                <TableRow key={r.contact_id}>
                  <TableCell className="text-sm">{r.email}</TableCell>
                  <TableCell className="text-center">
                    {r.opened_at ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {r.clicked_at ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {r.unsubscribed_at ? <Check className="w-4 h-4 text-destructive mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampaignReportPage;
