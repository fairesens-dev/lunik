import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

const AdminOrdersPage = () => (
  <div className="space-y-6 font-sans">
    <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
    <Card className="border-gray-200">
      <CardContent className="p-12 text-center">
        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Gestion des commandes — Coming soon</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminOrdersPage;
