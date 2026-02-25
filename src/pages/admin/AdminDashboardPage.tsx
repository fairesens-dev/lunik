import { useAuth } from "@/contexts/AuthContext";
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, Lightbulb, Package, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LineChart, Line, ComposedChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

const sparkData = {
  commandes: [{ v: 14 }, { v: 18 }, { v: 16 }, { v: 21 }, { v: 19 }, { v: 22 }, { v: 23 }],
  ca: [{ v: 32000 }, { v: 38000 }, { v: 35000 }, { v: 41000 }, { v: 44000 }, { v: 43000 }, { v: 47320 }],
  visiteurs: [{ v: 2100 }, { v: 2400 }, { v: 2800 }, { v: 3100 }, { v: 3300 }, { v: 3600 }, { v: 3847 }],
  conversion: [{ v: 3.1 }, { v: 3.0 }, { v: 3.2 }, { v: 2.9 }, { v: 3.0 }, { v: 3.0 }, { v: 2.8 }],
};

const kpis = [
  { label: "Commandes ce mois", value: "23", trend: "+12%", up: true, data: sparkData.commandes, color: "#4A5E3A" },
  { label: "Chiffre d'affaires", value: "47 320 €", trend: "+8%", up: true, data: sparkData.ca, color: "#4A5E3A" },
  { label: "Visiteurs (30j)", value: "3 847", trend: "+23%", up: true, data: sparkData.visiteurs, color: "#4A5E3A" },
  { label: "Taux de conversion", value: "2,8%", trend: "-0.2%", up: false, data: sparkData.conversion, color: "#dc2626" },
];

const monthlyData = [
  { month: "Jan", commandes: 12, ca: 28400 }, { month: "Fév", commandes: 15, ca: 33200 },
  { month: "Mar", commandes: 18, ca: 38100 }, { month: "Avr", commandes: 14, ca: 31500 },
  { month: "Mai", commandes: 21, ca: 44200 }, { month: "Jun", commandes: 19, ca: 41800 },
  { month: "Jul", commandes: 22, ca: 46300 }, { month: "Aoû", commandes: 17, ca: 37600 },
  { month: "Sep", commandes: 20, ca: 43100 }, { month: "Oct", commandes: 23, ca: 47320 },
  { month: "Nov", commandes: 16, ca: 35200 }, { month: "Déc", commandes: 24, ca: 50100 },
];

const pieData = [
  { name: "Sans option", value: 38 }, { name: "+ Motorisation", value: 35 },
  { name: "+ LED", value: 12 }, { name: "Pack Connect", value: 15 },
];
const PIE_COLORS = ["#4A5E3A", "#8FA07A", "#C8B89A", "#1A1A1A"];

const statusColor: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-700",
  "En fabrication": "bg-orange-100 text-orange-700",
  Expédié: "bg-purple-100 text-purple-700",
  Livré: "bg-green-100 text-green-700",
};

const recentOrders = [
  { ref: "CMD-2024-047", client: "Pierre Durand", dim: "400×300 cm", options: "⚡💡", montant: "3 210 €", statut: "Nouveau", date: "22/01" },
  { ref: "CMD-2024-046", client: "Marie Laurent", dim: "350×250 cm", options: "⚡", montant: "2 710 €", statut: "En fabrication", date: "20/01" },
  { ref: "CMD-2024-045", client: "Jean Moreau", dim: "300×200 cm", options: "—", montant: "1 890 €", statut: "Expédié", date: "18/01" },
  { ref: "CMD-2024-044", client: "Sophie Bernard", dim: "450×350 cm", options: "⚡💡📱", montant: "4 560 €", statut: "Livré", date: "15/01" },
  { ref: "CMD-2024-043", client: "Luc Petit", dim: "350×250 cm", options: "💡", montant: "2 320 €", statut: "En fabrication", date: "14/01" },
];

const recentLeads = [
  { name: "Camille Roux", email: "camille.roux@email.fr", phone: "06 12 34 56 78", config: "400×300 cm · Sauge", date: "23/01" },
  { name: "Antoine Lefevre", email: "a.lefevre@email.fr", phone: "07 98 76 54 32", config: "350×250 cm · Ivoire", date: "22/01" },
  { name: "Julie Martin", email: "julie.m@email.fr", phone: "06 45 67 89 01", config: "300×200 cm · Taupe", date: "21/01" },
  { name: "Thomas Girard", email: "t.girard@email.fr", phone: "06 23 45 67 89", config: "450×350 cm · Anthracite", date: "20/01" },
  { name: "Emma Dupont", email: "emma.d@email.fr", phone: "07 11 22 33 44", config: "350×250 cm · Sauge", date: "19/01" },
];

const AdminDashboardPage = () => {
  const { admin } = useAuth();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue, {admin?.name || "Admin"}. Voici un résumé de votre activité.</p>
      </div>

      {/* ROW 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-gray-200">
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                    {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {kpi.trend} vs mois dernier
                  </div>
                </div>
                <div className="w-20 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.data}>
                      <Line type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ROW 2: Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">Évolution des commandes & CA — 12 derniers mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} />
                  <Tooltip formatter={(value: number, name: string) => [name === "ca" ? `${value.toLocaleString("fr-FR")} €` : value, name === "ca" ? "CA" : "Commandes"]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="commandes" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Commandes" />
                  <Line yAxisId="right" type="monotone" dataKey="ca" stroke="#4A5E3A" strokeWidth={2} dot={{ r: 3 }} name="CA" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">Répartition par option</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend formatter={(value: string) => {
                    const item = pieData.find(d => d.name === value);
                    return `${value} (${item?.value}%)`;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: Recent Orders & Leads */}
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
            <CardTitle className="text-base font-semibold text-gray-900">Derniers leads non traités</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.map((l) => (
              <div key={l.email} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.email} · {l.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.config} · {l.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <a href={`mailto:${l.email}`} className="text-gray-400 hover:text-gray-700"><Mail className="w-4 h-4" /></a>
                  <Checkbox />
                </div>
              </div>
            ))}
            <Link to="/admin/leads" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
              Voir tous les leads <ExternalLink className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: Alerts */}
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">Alertes & points d'attention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-orange-400 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">3 leads datent de plus de 48h sans réponse</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-green-400 bg-green-50">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">Toutes les commandes en cours sont dans les délais</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-blue-400 bg-blue-50">
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">Votre taux de conversion est en baisse ce mois. Pensez à relancer vos leads abandonnés.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
