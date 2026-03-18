import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderResult {
  ref: string;
  client_name: string;
  status: string;
  status_history: { status: string; date: string }[];
  amount: number;
  width: number;
  projection: number;
  toile_color: string;
  armature_color: string;
  options: string[];
  delivery_option: string;
  payment_status: string;
  created_at: string;
}

const STATUS_STEPS = ["Commandé", "En fabrication", "Prêt à expédier", "Expédié", "Livré"];

const OrderTrackingPage = () => {
  const [params] = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") || "");
  const [email, setEmail] = useState(params.get("email") || "");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!ref || !email) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const { data, error: rpcError } = await supabase.rpc("lookup_order", {
        p_ref: ref,
        p_email: email,
      });

      if (rpcError) throw rpcError;
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setOrder(null);
        setError("Aucune commande trouvée avec ces informations.");
        return;
      }

      const row = Array.isArray(data) ? data[0] : data;
      setOrder(row as unknown as OrderResult);
    } catch {
      setError("Erreur lors de la recherche. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Determine current step index based on status
  const getCurrentStep = (status: string) => {
    const map: Record<string, number> = {
      "Nouveau": 0,
      "Confirmé": 1,
      "En fabrication": 2,
      "Expédié": 3,
      "Livré": 4,
    };
    return map[status] ?? 0;
  };

  return (
    <div className="py-20">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-light mb-3">Suivi de commande</h1>
          <p className="text-sm text-muted-foreground">Entrez votre référence et email pour suivre votre commande.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <Label className="text-xs text-muted-foreground">Référence commande</Label>
            <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="SC-K4F2X9" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Votre email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.fr" type="email" />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !ref || !email}
            className="w-full rounded-none py-4 h-auto tracking-[0.15em] uppercase text-sm"
          >
            {loading ? "Recherche..." : "Suivre ma commande"}
          </Button>
        </div>

        {error && searched && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="border border-border bg-card p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-serif text-lg">{order.ref}</p>
                <p className="text-xs text-muted-foreground">
                  Commandé le {format(new Date(order.created_at), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <span className="bg-primary/10 text-primary text-xs px-3 py-1 font-medium">{order.status}</span>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {STATUS_STEPS.map((label, i) => {
                const current = getCurrentStep(order.status);
                const done = i <= current;
                const isCurrent = i === current;
                return (
                  <div key={label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                          done ? "bg-primary border-primary" : "bg-background border-border"
                        } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-1" : ""}`}
                      />
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 ${done ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                    <div className={`pb-6 ${done ? "text-foreground" : "text-muted-foreground"}`}>
                      <p className={`text-sm ${isCurrent ? "font-medium" : ""}`}>
                        {done && i < current ? "✅ " : isCurrent ? "🔄 " : "⏳ "}
                        {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(getCurrentStep(order.status) / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            <div className="text-xs text-muted-foreground space-y-1 border-t border-border pt-4">
              <p>{order.width} × {order.projection} cm · {order.toile_color} · {order.armature_color}</p>
              {order.options?.length > 0 && <p>Options : {order.options.join(", ")}</p>}
              <p className="font-medium text-foreground">{order.amount.toLocaleString("fr-FR")} €</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
