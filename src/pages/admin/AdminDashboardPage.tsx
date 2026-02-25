import { Package, TrendingUp, MessageSquare, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Commandes", value: "24", change: "+12%", icon: Package, color: "text-blue-600 bg-blue-50" },
  { label: "Chiffre d'affaires", value: "18 450 €", change: "+8%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
  { label: "Leads", value: "67", change: "+23%", icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
  { label: "Taux de conversion", value: "3.2%", change: "+0.5%", icon: BarChart3, color: "text-amber-600 bg-amber-50" },
];

const AdminDashboardPage = () => (
  <div className="space-y-6 font-sans">
    <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="border-gray-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                <p className="text-xs text-green-600 mt-1">{s.change} ce mois</p>
              </div>
              <div className={`p-3 rounded-lg ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminDashboardPage;
