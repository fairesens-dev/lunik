import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Pencil, Copy, Trash2, Eye, Layers,
  MousePointerClick, BarChart3, Target,
} from "lucide-react";
import { toast } from "sonner";

type ModalRow = {
  id: string;
  name: string;
  type: string;
  status: string;
  trigger_type: string;
  trigger_value: string | null;
  show_to: string;
  display_frequency: string;
  impressions_count: number;
  conversions_count: number;
  created_at: string;
};

const typeLabels: Record<string, string> = {
  popup: "Popup",
  slide_in: "Slide-in",
  banner: "Bannière",
  exit_intent: "Exit Intent",
};

const typeBadgeColors: Record<string, string> = {
  popup: "bg-blue-100 text-blue-700",
  slide_in: "bg-purple-100 text-purple-700",
  banner: "bg-amber-100 text-amber-700",
  exit_intent: "bg-red-100 text-red-700",
};

const triggerLabels: Record<string, string> = {
  time_delay: "Délai",
  scroll_percent: "Scroll",
  exit_intent: "Exit Intent",
  page_load: "Chargement page",
};

const AdminModalsPage = () => {
  const navigate = useNavigate();
  const [modals, setModals] = useState<ModalRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModals = async () => {
    const { data, error } = await supabase
      .from("modals")
      .select("id, name, type, status, trigger_type, trigger_value, show_to, display_frequency, impressions_count, conversions_count, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erreur chargement modals");
    } else {
      setModals(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchModals(); }, []);

  const totalImpressions = modals.reduce((s, m) => s + m.impressions_count, 0);
  const totalConversions = modals.reduce((s, m) => s + m.conversions_count, 0);
  const avgCR = totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(1) : "0";

  const toggleStatus = async (modal: ModalRow) => {
    const newStatus = modal.status === "active" ? "paused" : "active";
    const { error } = await supabase.from("modals").update({ status: newStatus }).eq("id", modal.id);
    if (error) { toast.error("Erreur"); return; }
    setModals((prev) => prev.map((m) => m.id === modal.id ? { ...m, status: newStatus } : m));
    toast.success(`Modal ${newStatus === "active" ? "activé" : "mis en pause"}`);
  };

  const duplicateModal = async (modal: ModalRow) => {
    const { data: full } = await supabase.from("modals").select("*").eq("id", modal.id).single();
    if (!full) return;
    const { id, created_at, impressions_count, conversions_count, ...rest } = full as any;
    const { error } = await supabase.from("modals").insert({ ...rest, name: `${rest.name} (copie)`, status: "draft" });
    if (error) { toast.error("Erreur duplication"); return; }
    toast.success("Modal dupliqué");
    fetchModals();
  };

  const deleteModal = async (id: string) => {
    if (!confirm("Supprimer ce modal ?")) return;
    const { error } = await supabase.from("modals").delete().eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    setModals((prev) => prev.filter((m) => m.id !== id));
    toast.success("Modal supprimé");
  };

  const getTriggerDescription = (m: ModalRow) => {
    if (m.trigger_type === "time_delay") return `${m.trigger_value || 0}s délai`;
    if (m.trigger_type === "scroll_percent") return `${m.trigger_value || 0}% scroll`;
    return triggerLabels[m.trigger_type] || m.trigger_type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-sans">Modals & Popups</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez vos popups, bannières et overlays</p>
        </div>
        <Button onClick={() => navigate("/admin/modals/new")} className="gap-2">
          <Plus className="w-4 h-4" /> Nouveau Modal
        </Button>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50"><Layers className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{modals.length}</p>
              <p className="text-xs text-muted-foreground">Modals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50"><Eye className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Impressions totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50"><Target className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold">{avgCR}%</p>
              <p className="text-xs text-muted-foreground">Taux de conversion moy.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal cards */}
      {loading ? (
        <p className="text-muted-foreground text-sm">Chargement…</p>
      ) : modals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun modal</h3>
            <p className="text-sm text-muted-foreground mb-4">Créez votre premier popup ou bannière</p>
            <Button onClick={() => navigate("/admin/modals/new")}><Plus className="w-4 h-4 mr-2" /> Créer un modal</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {modals.map((m) => {
            const cr = m.impressions_count > 0 ? ((m.conversions_count / m.impressions_count) * 100).toFixed(1) : "0";
            return (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{m.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${typeBadgeColors[m.type] || "bg-gray-100 text-gray-700"}`}>
                          {typeLabels[m.type] || m.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{getTriggerDescription(m)}</span>
                      </div>
                    </div>
                    <Switch
                      checked={m.status === "active"}
                      onCheckedChange={() => toggleStatus(m)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-lg font-bold">{m.impressions_count.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Impressions</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-lg font-bold">{m.conversions_count.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Conversions</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-lg font-bold">{cr}%</p>
                      <p className="text-[10px] text-muted-foreground">Taux conv.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-1 border-t">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/modals/${m.id}/edit`)} className="text-xs gap-1">
                      <Pencil className="w-3 h-3" /> Éditer
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => duplicateModal(m)} className="text-xs gap-1">
                      <Copy className="w-3 h-3" /> Dupliquer
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteModal(m.id)} className="text-xs gap-1 text-destructive hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminModalsPage;
