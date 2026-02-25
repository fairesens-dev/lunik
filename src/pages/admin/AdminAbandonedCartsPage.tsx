import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart, TrendingUp, DollarSign, BarChart3,
  Send, Eye, CheckCircle2, Trash2, RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AbandonedCart {
  id: string;
  session_id: string;
  email: string | null;
  cart_data: any;
  abandonment_stage: string;
  touch_count: number;
  last_email_sent_at: string | null;
  converted: boolean;
  converted_order_id: string | null;
  created_at: string;
  updated_at: string;
}

const STAGE_LABELS: Record<string, string> = {
  configurateur: "Configurateur",
  checkout_step_1: "Checkout Étape 1",
  checkout_step_2: "Checkout Étape 2",
  checkout_step_3: "Checkout Étape 3",
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getCartValue(cart: any): number {
  return cart?.pricing?.total || 0;
}

function getCartSummary(cart: any): string {
  const cfg = cart?.configuration;
  if (!cfg) return "—";
  return `${cfg.width}×${cfg.projection}cm · ${cfg.toileColor?.label || "—"}`;
}

const AdminAbandonedCartsPage = () => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewCart, setViewCart] = useState<AbandonedCart | null>(null);

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("abandoned_carts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) setCarts(data as AbandonedCart[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCarts(); }, [fetchCarts]);

  // Stats
  const thisMonth = carts.filter(c => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const abandonedThisMonth = thisMonth.filter(c => !c.converted);
  const convertedThisMonth = thisMonth.filter(c => c.converted);
  const estimatedValue = abandonedThisMonth.reduce((sum, c) => sum + getCartValue(c.cart_data), 0);
  const recoveredValue = convertedThisMonth.reduce((sum, c) => sum + getCartValue(c.cart_data), 0);
  const recoveryRate = thisMonth.length > 0
    ? ((convertedThisMonth.length / thisMonth.length) * 100).toFixed(1)
    : "0";

  // Filter
  const filtered = carts.filter(c => {
    if (filter === "not_converted") return !c.converted;
    if (filter === "configurateur") return c.abandonment_stage === "configurateur";
    if (filter === "checkout") return c.abandonment_stage.startsWith("checkout");
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(c => c.id)));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("abandoned_carts").delete().eq("id", id);
    toast.success("Panier supprimé");
    fetchCarts();
  };

  const handleMarkConverted = async (id: string) => {
    await supabase.from("abandoned_carts").update({ converted: true }).eq("id", id);
    toast.success("Marqué comme converti");
    fetchCarts();
  };

  const handleManualReminder = async (cart: AbandonedCart) => {
    if (!cart.email) {
      toast.error("Pas d'email capturé pour ce panier");
      return;
    }
    toast.info(`Relance envoyée à ${cart.email} (simulation)`);
    // In production, this would call the process-abandoned-carts function for a single cart
  };

  const handleBulkReminder = async () => {
    const targets = filtered.filter(c => selected.has(c.id) && c.email && !c.converted);
    toast.info(`Relance groupée envoyée à ${targets.length} contact(s) (simulation)`);
    setSelected(new Set());
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Paniers abandonnés</h1>
        <Button variant="outline" size="sm" onClick={fetchCarts}>
          <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{abandonedThisMonth.length}</p>
              <p className="text-xs text-muted-foreground">Abandonnés ce mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{estimatedValue.toLocaleString("fr-FR")} €</p>
              <p className="text-xs text-muted-foreground">Valeur estimée</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recoveryRate}%</p>
              <p className="text-xs text-muted-foreground">Taux de récupération</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recoveredValue.toLocaleString("fr-FR")} €</p>
              <p className="text-xs text-muted-foreground">CA récupéré</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: "Tous" },
          { key: "not_converted", label: "Non convertis" },
          { key: "configurateur", label: "Configurateur" },
          { key: "checkout", label: "Checkout" },
        ].map(f => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}

        {selected.size > 0 && (
          <Button size="sm" onClick={handleBulkReminder} className="ml-auto">
            <Send className="w-4 h-4 mr-2" />
            Relancer {selected.size} sélectionné(s)
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>Aucun panier abandonné</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Configuration</TableHead>
                  <TableHead className="text-right">Valeur</TableHead>
                  <TableHead>Étape</TableHead>
                  <TableHead className="text-center">Emails</TableHead>
                  <TableHead>Dernier contact</TableHead>
                  <TableHead className="text-center">Converti</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(cart => (
                  <TableRow key={cart.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(cart.id)}
                        onCheckedChange={() => toggleSelect(cart.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-sm">{cart.email || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                      {getCartSummary(cart.cart_data)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {getCartValue(cart.cart_data).toLocaleString("fr-FR")} €
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {STAGE_LABELS[cart.abandonment_stage] || cart.abandonment_stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={cart.touch_count > 0 ? "default" : "outline"} className="text-xs">
                        {cart.touch_count}/3
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(cart.last_email_sent_at || cart.updated_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      {cart.converted ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">Oui</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Non</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Relancer"
                          onClick={() => handleManualReminder(cart)} disabled={!cart.email || cart.converted}>
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir"
                          onClick={() => setViewCart(cart)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Marquer converti"
                          onClick={() => handleMarkConverted(cart.id)} disabled={cart.converted}>
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Supprimer"
                          onClick={() => handleDelete(cart.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Config detail dialog */}
      <Dialog open={!!viewCart} onOpenChange={() => setViewCart(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détail de la configuration</DialogTitle>
          </DialogHeader>
          {viewCart && (
            <div className="space-y-3 text-sm">
              <p><strong>Email :</strong> {viewCart.email || "Non capturé"}</p>
              <p><strong>Étape :</strong> {STAGE_LABELS[viewCart.abandonment_stage] || viewCart.abandonment_stage}</p>
              <p><strong>Emails envoyés :</strong> {viewCart.touch_count}/3</p>
              <p><strong>Créé le :</strong> {formatDate(viewCart.created_at)}</p>
              <p><strong>Mis à jour le :</strong> {formatDate(viewCart.updated_at)}</p>
              {viewCart.cart_data?.configuration && (
                <div className="border border-border p-3 bg-secondary/30 space-y-1">
                  <p><strong>Dimensions :</strong> {viewCart.cart_data.configuration.width} × {viewCart.cart_data.configuration.projection} cm</p>
                  <p><strong>Toile :</strong> {viewCart.cart_data.configuration.toileColor?.label || "—"}</p>
                  <p><strong>Armature :</strong> {viewCart.cart_data.configuration.armatureColor?.label || "—"}</p>
                  <p><strong>Options :</strong> {
                    [
                      viewCart.cart_data.configuration.options?.motorisation && "Motorisation",
                      viewCart.cart_data.configuration.options?.led && "LED",
                      viewCart.cart_data.configuration.options?.packConnect && "Pack Connect",
                    ].filter(Boolean).join(", ") || "Aucune"
                  }</p>
                  <p className="font-medium text-base mt-2">
                    Total : {getCartValue(viewCart.cart_data).toLocaleString("fr-FR")} €
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAbandonedCartsPage;
