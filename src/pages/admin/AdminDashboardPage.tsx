import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, Lightbulb, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LineChart, Line, ComposedChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const statusColor: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-700",
  "En fabrication": "bg-orange-100 text-orange-700",
  Expédié: "bg-purple-100 text-purple-700",
  Livré: "bg-green-100 text-green-700",
};

const PIE_COLORS = ["#4A5E3A", "#8FA07A", "#C8B89A", "#1A1A1A"];

const AdminDashboardPage = () => {
  const { admin } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [totalCA, setTotalCA] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [unprocessedLeads, setUnprocessedLeads] = useState(0);

  useEffect(() => {
    (async () => {
      // Recent orders
      const { data: ordersData } = await supabase.from("orders" as any).select("*").order("created_at", { ascending: false }).limit(5) as any;
      if (ordersData) {
        setRecentOrders(ordersData.map((o: any) => ({
          ref: o.ref,
          client: o.client_name,
          dim: `${o.width}×${o.projection} cm`,
          montant: `${o.amount?.toLocaleString("fr-FR")} €`,
          statut: o.status,
          date: new Date(o.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
        })));
      }

      // All orders for KPIs
      const { data: allOrders } = await supabase.from("orders" as any).select("amount, status") as any;
      if (allOrders) {
        setOrderCount(allOrders.length);
        setTotalCA(allOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0));
      }

      // Recent leads
      const { data: leadsData } = await supabase.from("leads" as any).select("*").order("created_at", { ascending: false }).limit(5) as any;
      if (leadsData) {
        setRecentLeads(leadsData.map((l: any) => ({
          name: `${l.first_name} ${l.last_name}`,
          email: l.email,
          phone: l.phone || "",
          config: `${l.width || 0}×${l.projection || 0} cm · ${l.toile_color || ""}`,
          date: new Date(l.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
          processed: l.processed,
        })));
      }

      // Lead KPIs
      const { data: allLeads } = await supabase.from("leads" as any).select("processed") as any;
      if (allLeads) {
        setLeadCount(allLeads.length);
        setUnprocessedLeads(allLeads.filter((l: any) => !l.processed).length);
      }
    })();
  }, []);

  const kpis = [
    { label: "Commandes", value: String(orderCount), color: "#4A5E3A" },
    { label: "Chiffre d'affaires", value: `${totalCA.toLocaleString("fr-FR")} €`, color: "#4A5E3A" },
    { label: "Leads", value: String(leadCount), color: "#4A5E3A" },
    { label: "Leads non traités", value: String(unprocessedLeads), color: unprocessedLeads > 0 ? "#dc2626" : "#4A5E3A" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue, {admin?.name || "Admin"}. Voici un résumé de votre activité.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-gray-200">
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">Dernières commandes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Réf</TableHead>
                  <TableHead className="text-xs">Client</TableHead>
                  <TableHead className="text-xs">Dim.</TableHead>
                  <TableHead className="text-xs">Montant</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Aucune commande</TableCell></TableRow>
                )}
                {recentOrders.map((o) => (
                  <TableRow key={o.ref}>
                    <TableCell className="text-xs font-mono">{o.ref}</TableCell>
                    <TableCell className="text-xs">{o.client}</TableCell>
                    <TableCell className="text-xs">{o.dim}</TableCell>
                    <TableCell className="text-xs font-medium">{o.montant}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${statusColor[o.statut] || ""}`} variant="secondary">{o.statut}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-3 border-t">
              <Link to="/admin/commandes" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                Voir toutes les commandes <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">Derniers leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.length === 0 && (
              <p className="text-center text-muted-foreground py-6">Aucun lead</p>
            )}
            {recentLeads.map((l) => (
              <div key={l.email + l.date} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.email} · {l.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.config} · {l.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <a href={`mailto:${l.email}`} className="text-gray-400 hover:text-gray-700"><Mail className="w-4 h-4" /></a>
                  {l.processed && <Badge variant="secondary" className="text-[10px]">Traité</Badge>}
                </div>
              </div>
            ))}
            <Link to="/admin/leads" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
              Voir tous les leads <ExternalLink className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">Alertes & points d'attention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {unprocessedLeads > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-orange-400 bg-orange-50">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">{unprocessedLeads} lead{unprocessedLeads > 1 ? "s" : ""} non traité{unprocessedLeads > 1 ? "s" : ""}</p>
            </div>
          )}
          {unprocessedLeads === 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-green-400 bg-green-50">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">Tous les leads sont traités</p>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-blue-400 bg-blue-50">
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">Les données affichées sont en temps réel depuis Supabase.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
