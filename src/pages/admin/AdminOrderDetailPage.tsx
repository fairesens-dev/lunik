import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronRight, Mail, Printer, MoreHorizontal, Copy, Check,
  Zap, Lightbulb, Smartphone, FileText, Star, RefreshCw,
  Bell, Truck, Ban, CreditCard, Eye, Send, Package, ClipboardCheck,
  Search as SearchIcon, MapPin, CheckCircle2, Sun, Trash2, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { generateInvoicePDF } from "@/lib/generateInvoice";

const STATUS_OPTIONS = ["Nouveau", "En fabrication", "Expédié", "Livré", "Annulé"];

const statusColor: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-700 border-blue-200",
  "En fabrication": "bg-orange-100 text-orange-700 border-orange-200",
  Expédié: "bg-purple-100 text-purple-700 border-purple-200",
  Livré: "bg-green-100 text-green-700 border-green-200",
  Annulé: "bg-red-100 text-red-700 border-red-200",
};

const TRACKING_STAGES = [
  { key: "received", label: "Commande reçue", icon: "📥" },
  { key: "paid", label: "Paiement confirmé", icon: "✅" },
  { key: "fabrication", label: "Mise en fabrication", icon: "🏭" },
  { key: "quality", label: "Contrôle qualité", icon: "🔍" },
  { key: "ready", label: "Prêt à expédier", icon: "📦" },
  { key: "shipped", label: "Expédié", icon: "🚚" },
  { key: "in_transit", label: "En cours de livraison", icon: "📍" },
  { key: "delivered", label: "Livré", icon: "✅" },
  { key: "satisfaction", label: "Satisfaction client", icon: "🌞" },
];

const TRANSACTIONAL_EMAILS = [
  { key: "confirmation", label: "Confirmation commande" },
  { key: "fabrication", label: "Accusé fabrication" },
  { key: "expedition", label: "Email expédition" },
  { key: "livraison", label: "Email livraison" },
  { key: "satisfaction", label: "Email satisfaction" },
];

const AdminOrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [copied, setCopied] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [clientStats, setClientStats] = useState<{ count: number; total: number; first: string; last: string } | null>(null);

  // Tracking stages state
  const [stages, setStages] = useState<Record<string, { done: boolean; date: string; note: string }>>({});
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
      if (error || !data) {
        setLoading(false);
        return;
      }
      setOrder(data);
      setNewStatus(data.status);

      // Init stages from status_history metadata
      const sh = (data.status_history as any) || [];
      const stageState: Record<string, { done: boolean; date: string; note: string }> = {};
      TRACKING_STAGES.forEach(s => {
        const found = sh.find?.((h: any) => h.stage === s.key);
        stageState[s.key] = found ? { done: true, date: found.date || "", note: found.note || "" } : { done: false, date: "", note: "" };
      });
      // Auto-mark received & paid based on status_history
      if (sh.length > 0) stageState.received = { done: true, date: sh[0]?.date || "", note: "" };
      if (data.payment_status === "paid") stageState.paid = { done: true, date: stageState.paid?.date || "", note: "" };
      setStages(stageState);

      // Tracking info from metadata
      const shippedEntry = sh.find?.((h: any) => h.stage === "shipped" || h.status === "Expédié");
      if (shippedEntry?.carrier) setTrackingCarrier(shippedEntry.carrier);
      if (shippedEntry?.tracking_number) setTrackingNumber(shippedEntry.tracking_number);
      if (shippedEntry?.tracking_url) setTrackingUrl(shippedEntry.tracking_url);

      // Client stats
      if (data.client_email) {
        const { data: clientOrders } = await supabase.from("orders").select("amount, created_at").eq("client_email", data.client_email);
        if (clientOrders && clientOrders.length > 0) {
          const sorted = [...clientOrders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          setClientStats({
            count: clientOrders.length,
            total: clientOrders.reduce((s, o) => s + (o.amount || 0), 0),
            first: sorted[0].created_at,
            last: sorted[sorted.length - 1].created_at,
          });
        }
      }
      setLoading(false);
    })();
  }, [orderId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>;
  if (!order) return <div className="p-8 text-center text-muted-foreground">Commande introuvable.</div>;

  const area = ((order.width * order.projection) / 10000).toFixed(2);
  const options = order.options || [];
  const statusHistory = (order.status_history as any[]) || [];

  const sendOrderEmail = async (type: string, extra?: any) => {
    setSendingEmail(type);
    try {
      const { data, error } = await supabase.functions.invoke("send-order-email", {
        body: { type, orderId: order.id, extra },
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: "Email envoyé", description: `Email "${type}" envoyé avec succès.` });
        // Refresh order to get updated emails_sent
        const { data: refreshed } = await supabase.from("orders").select("*").eq("id", order.id).single();
        if (refreshed) setOrder(refreshed);
      } else {
        throw new Error(data?.error || "Erreur inconnue");
      }
    } catch (err: any) {
      console.error("Email error:", err);
      toast({ title: "Erreur d'envoi", description: err.message || "Impossible d'envoyer l'email.", variant: "destructive" });
    } finally {
      setSendingEmail(null);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order.status) return;
    const newHistory = [...statusHistory, { status: newStatus, date: new Date().toISOString() }];
    const { error } = await supabase.from("orders").update({ status: newStatus, status_history: newHistory } as any).eq("id", order.id);
    if (!error) {
      setOrder({ ...order, status: newStatus, status_history: newHistory });
      toast({ title: "Statut mis à jour", description: `Commande ${order.ref} → ${newStatus}` });

      // Auto-trigger emails based on status change
      const emailMap: Record<string, string> = {
        "En fabrication": "fabrication",
        "Expédié": "shipped",
        "Livré": "delivered",
        "Annulé": "cancellation",
      };
      const emailType = emailMap[newStatus];
      if (emailType) {
        const extra = emailType === "shipped" ? { tracking: { carrier: trackingCarrier, tracking_number: trackingNumber, tracking_url: trackingUrl } } : undefined;
        await sendOrderEmail(emailType, extra);
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!noteText.trim()) return;
    const currentNotes = order.notes || "";
    const timestamp = new Date().toLocaleString("fr-FR");
    const updated = `[${timestamp}] ${noteText.trim()}\n${currentNotes}`;
    const { error } = await supabase.from("orders").update({ notes: updated } as any).eq("id", order.id);
    if (!error) {
      setOrder({ ...order, notes: updated });
      setNoteText("");
      toast({ title: "Note ajoutée" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const initials = order.client_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

  // Price breakdown (estimated from amount)
  const totalTTC = order.amount || 0;
  const totalHT = +(totalTTC / 1.2).toFixed(2);
  const tva = +(totalTTC - totalHT).toFixed(2);

  // Options pricing estimates
  const hasMotor = options.some((o: string) => o.toLowerCase().includes("motor"));
  const hasLED = options.some((o: string) => o.toLowerCase().includes("led") || o.toLowerCase().includes("éclairage"));
  const hasConnect = options.some((o: string) => o.toLowerCase().includes("connect"));
  const motorPrice = hasMotor ? 390 : 0;
  const ledPrice = hasLED ? 290 : 0;
  const connectPrice = hasConnect ? 190 : 0;
  const optionsTotal = motorPrice + ledPrice + connectPrice;
  const basePrice = totalTTC - optionsTotal;

  return (
    <div className="space-y-6 font-sans print:space-y-4" id="order-detail">
      {/* Print header */}
      <div className="hidden print:block print-header mb-6">
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4">
          <div>
            <h1 className="text-2xl font-bold">[BRAND]</h1>
            <p className="text-sm text-gray-600">Stores sur-mesure</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Commande {order.ref}</p>
            <p>{formatDate(order.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 bg-gray-50 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 border-b border-gray-200 print:hidden" id="action-bar">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link to="/admin/commandes" className="text-gray-500 hover:text-gray-700">Commandes</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-medium text-gray-900">{order.ref}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status badge + select */}
            <Badge className={`text-xs px-3 py-1 ${statusColor[order.status] || "bg-gray-100 text-gray-700"}`}>
              {order.status}
            </Badge>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" className="h-8 text-xs" onClick={handleUpdateStatus} disabled={newStatus === order.status}>
              Mettre à jour
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <a href={`mailto:${order.client_email}`}><Mail className="w-3.5 h-3.5 mr-1" /> Email</a>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 mr-1" /> Imprimer
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => generateInvoicePDF(order)}>
              <FileText className="w-3.5 h-3.5 mr-1" /> Facture PDF
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast({ title: "Fonctionnalité à venir", description: "Duplication non disponible pour le moment." })}>
                  Dupliquer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Fonctionnalité à venir", description: "Archivage non disponible pour le moment." })}>
                  Archiver
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => toast({ title: "Fonctionnalité à venir", description: "Suppression non disponible pour le moment." })}>
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 print:block">

        {/* LEFT COLUMN */}
        <div className="space-y-6 print:space-y-4">

          {/* CARD 1: Détail commande */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Détail de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product row */}
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-stone-200 rounded flex items-center justify-center shrink-0">
                  <Package className="w-8 h-8 text-stone-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Store Coffre Sur-Mesure</p>
                  <p className="text-xs text-muted-foreground">Réf produit : SKU-SC-001</p>
                </div>
              </div>

              {/* Configuration table */}
              <div className="border rounded-md overflow-hidden text-sm">
                <div className="grid grid-cols-[1fr_2fr] divide-y">
                  <div className="px-3 py-2 bg-gray-50 font-medium border-r">Largeur</div>
                  <div className="px-3 py-2">{order.width} cm</div>
                  <div className="px-3 py-2 bg-gray-50 font-medium border-r">Avancée</div>
                  <div className="px-3 py-2">{order.projection} cm</div>
                  <div className="px-3 py-2 bg-gray-50 font-medium border-r">Surface</div>
                  <div className="px-3 py-2">{area} m²</div>
                  <div className="px-3 py-2 bg-gray-50 font-medium border-r">Couleur toile</div>
                  <div className="px-3 py-2 flex items-center gap-2">
                    {order.toile_color && <span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: order.toile_color === "Sauge" ? "#7B8E7B" : undefined }} />}
                    {order.toile_color || "—"}
                  </div>
                  <div className="px-3 py-2 bg-gray-50 font-medium border-r">Couleur armature</div>
                  <div className="px-3 py-2 flex items-center gap-2">
                    {order.armature_color && <span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: order.armature_color?.includes("7016") ? "#383E42" : undefined }} />}
                    {order.armature_color || "—"}
                  </div>
                  {options.map((opt: string) => (
                    <div key={opt} className="contents">
                      <div className="px-3 py-2 bg-gray-50 font-medium border-r flex items-center gap-1.5">
                        {opt.toLowerCase().includes("motor") && <Zap className="w-3.5 h-3.5" />}
                        {opt.toLowerCase().includes("led") && <Lightbulb className="w-3.5 h-3.5" />}
                        {opt.toLowerCase().includes("connect") && <Smartphone className="w-3.5 h-3.5" />}
                        {opt}
                      </div>
                      <div className="px-3 py-2 flex items-center gap-1 text-green-700">
                        <Check className="w-3.5 h-3.5" /> Inclus
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client note */}
              {order.message && (
                <div className="bg-gray-50 rounded-md p-3 text-sm text-muted-foreground italic border">
                  <p className="text-xs font-medium text-gray-500 mb-1 not-italic">Note du client :</p>
                  {order.message}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 2: Récapitulatif financier */}
          <Card className="print:break-before-page">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Récapitulatif financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md overflow-hidden text-sm">
                <div className="grid grid-cols-[2fr_1fr] divide-y">
                  <div className="px-3 py-2 border-r">Store coffre de base ({area} m²)</div>
                  <div className="px-3 py-2 text-right font-medium">{basePrice.toLocaleString("fr-FR")} €</div>
                  {hasMotor && <>
                    <div className="px-3 py-2 border-r">Motorisation Somfy io</div>
                    <div className="px-3 py-2 text-right font-medium">390,00 €</div>
                  </>}
                  {hasLED && <>
                    <div className="px-3 py-2 border-r">Éclairage LED</div>
                    <div className="px-3 py-2 text-right font-medium">290,00 €</div>
                  </>}
                  {hasConnect && <>
                    <div className="px-3 py-2 border-r">Pack Connect</div>
                    <div className="px-3 py-2 text-right font-medium">190,00 €</div>
                  </>}
                  <div className="px-3 py-2 border-r">Livraison</div>
                  <div className="px-3 py-2 text-right font-medium">0,00 €</div>
                  <div className="px-3 py-2 border-r bg-gray-50 font-medium">Sous-total HT</div>
                  <div className="px-3 py-2 text-right font-semibold bg-gray-50">{totalHT.toLocaleString("fr-FR")} €</div>
                  <div className="px-3 py-2 border-r bg-gray-50 font-medium">TVA 20%</div>
                  <div className="px-3 py-2 text-right font-semibold bg-gray-50">{tva.toLocaleString("fr-FR")} €</div>
                  <div className="px-3 py-2 border-r bg-gray-900 text-white font-bold">TOTAL TTC</div>
                  <div className="px-3 py-2 text-right font-bold bg-gray-900 text-white">{totalTTC.toLocaleString("fr-FR")} €</div>
                </div>
              </div>

              {/* Payment info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Paiement</p>
                  <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="text-xs">
                    {order.payment_status === "paid" ? <><CreditCard className="w-3 h-3 mr-1" /> Payé par CB</> : order.payment_status || "En attente"}
                  </Badge>
                </div>
                {order.stripe_payment_intent_id && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Transaction Stripe</p>
                    <button
                      onClick={() => copyToClipboard(order.stripe_payment_intent_id)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      {order.stripe_payment_intent_id}
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date de paiement</p>
                  <p className="text-xs font-medium">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: Suivi fabrication & livraison */}
          <Card className="print:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Suivi de fabrication & livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {TRACKING_STAGES.map((stage) => (
                  <div key={stage.key} className="flex items-start gap-3 py-1.5">
                    <Checkbox
                      checked={stages[stage.key]?.done || false}
                      onCheckedChange={(checked) => setStages(prev => ({
                        ...prev,
                        [stage.key]: { ...prev[stage.key], done: !!checked },
                      }))}
                      className="mt-0.5"
                    />
                    <span className="text-sm shrink-0">{stage.icon}</span>
                    <span className={`text-sm flex-1 ${stages[stage.key]?.done ? "font-medium" : "text-muted-foreground"}`}>
                      {stage.label}
                    </span>
                    <Input
                      type="date"
                      className="w-[130px] h-7 text-xs"
                      value={stages[stage.key]?.date || ""}
                      onChange={(e) => setStages(prev => ({
                        ...prev,
                        [stage.key]: { ...prev[stage.key], date: e.target.value },
                      }))}
                    />
                    <Input
                      placeholder="Note..."
                      className="w-[140px] h-7 text-xs"
                      value={stages[stage.key]?.note || ""}
                      onChange={(e) => setStages(prev => ({
                        ...prev,
                        [stage.key]: { ...prev[stage.key], note: e.target.value },
                      }))}
                    />
                  </div>
                ))}
              </div>

              {/* Tracking section */}
              {stages.shipped?.done && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Informations de suivi</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Transporteur</label>
                        <Select value={trackingCarrier} onValueChange={setTrackingCarrier}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>
                            {["Geodis", "TNT", "Chronopost", "Autre"].map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Numéro de suivi</label>
                        <Input className="h-8 text-xs" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Ex: 1Z999AA10123456784" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">URL de tracking</label>
                      <Input className="h-8 text-xs" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      disabled={sendingEmail === "shipped"}
                      onClick={() => sendOrderEmail("shipped", { tracking: { carrier: trackingCarrier, tracking_number: trackingNumber, tracking_url: trackingUrl } })}
                    >
                      {sendingEmail === "shipped" ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />}
                      Envoyer le tracking au client
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* CARD 4: Notes internes */}
          <Card className="print:hidden" id="notes-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Notes internes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ajouter une note interne..."
                  className="text-sm flex-1 min-h-[60px]"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <Button size="sm" onClick={handleSaveNotes} disabled={!noteText.trim()} className="self-end">
                  Ajouter
                </Button>
              </div>
              {order.notes && (
                <div className="space-y-2 mt-2">
                  {order.notes.split("\n").filter((l: string) => l.trim()).map((line: string, i: number) => (
                    <div key={i} className="text-xs bg-gray-50 rounded p-2.5 border">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 print:space-y-4">

          {/* Client */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{order.civility ? `${order.civility} ` : ""}{order.client_name}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <a href={`mailto:${order.client_email}`} className="text-primary hover:underline block">{order.client_email}</a>
                {order.client_phone && <a href={`tel:${order.client_phone}`} className="text-muted-foreground hover:text-foreground block">{order.client_phone}</a>}
              </div>
              {(order.client_address || order.client_city) && (
                <div className="text-sm text-muted-foreground bg-gray-50 rounded p-3 border">
                  <p className="text-xs font-medium text-gray-500 mb-1">Adresse de livraison</p>
                  {order.client_address && <p>{order.client_address}</p>}
                  {order.client_address2 && <p>{order.client_address2}</p>}
                  <p>{order.client_postal_code} {order.client_city}</p>
                  <p>{order.client_country || "France"}</p>
                </div>
              )}

              {clientStats && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Historique client</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded p-2 border">
                        <p className="text-muted-foreground">Commandes</p>
                        <p className="font-bold text-lg">{clientStats.count}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2 border">
                        <p className="text-muted-foreground">CA total</p>
                        <p className="font-bold text-lg">{clientStats.total.toLocaleString("fr-FR")} €</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2 border">
                        <p className="text-muted-foreground">Première</p>
                        <p className="font-medium">{new Date(clientStats.first).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2 border">
                        <p className="text-muted-foreground">Dernière</p>
                        <p className="font-medium">{new Date(clientStats.last).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                    <Link to={`/admin/commandes?email=${order.client_email}`} className="text-xs text-primary hover:underline mt-2 inline-block">
                      Voir toutes les commandes de ce client →
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Historique des statuts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Historique des statuts</CardTitle>
            </CardHeader>
            <CardContent>
              {statusHistory.length === 0 && <p className="text-xs text-muted-foreground">Aucun historique.</p>}
              <div className="space-y-0">
                {statusHistory.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 pb-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${i === statusHistory.length - 1 ? "bg-primary" : "bg-gray-300"}`} />
                      {i < statusHistory.length - 1 && <div className="w-px h-full bg-gray-200 min-h-[16px]" />}
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">{h.status}</span>
                      <span className="text-muted-foreground ml-1">— {formatDate(h.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emails envoyés */}
          <Card className="print:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Emails envoyés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {TRANSACTIONAL_EMAILS.map((email) => {
                const emailsSent = (order.emails_sent as any[]) || [];
                const sentEntry = emailsSent.filter((e: any) => e.type === email.key).pop();
                const sent = !!sentEntry;
                return (
                  <div key={email.key} className="flex items-center justify-between text-xs py-1.5">
                    <div className="flex items-center gap-2">
                      {sent ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 inline-block" />}
                      <span className={sent ? "font-medium" : "text-muted-foreground"}>
                        {email.label}
                        {sent && sentEntry?.sent_at && <span className="text-muted-foreground ml-1">— {formatDate(sentEntry.sent_at)}</span>}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        disabled={sendingEmail === email.key}
                        onClick={() => sendOrderEmail(email.key)}
                      >
                        {sendingEmail === email.key ? <Loader2 className="w-3 h-3 animate-spin" /> : (sent ? "Renvoyer" : "Envoyer")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="print:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Générer un bon de commande PDF", icon: FileText },
                { label: "Générer une facture PDF", icon: FileText },
                { label: "Guide d'installation", icon: FileText },
              ].map((doc) => (
                <Button key={doc.label} variant="outline" className="w-full justify-start text-xs h-9" onClick={() => window.print()}>
                  <doc.icon className="w-3.5 h-3.5 mr-2" /> {doc.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="print:hidden" id="quick-actions">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Envoyer confirmation commande", icon: Mail, type: "confirmation" },
                { label: "Notifier mise en fabrication", icon: Bell, type: "fabrication" },
                { label: "Envoyer numéro de suivi", icon: Truck, type: "shipped" },
                { label: "Demander un avis", icon: Star, type: "review_request" },
              ].map((action) => (
                <Button
                  key={action.type}
                  variant="outline"
                  className="w-full justify-start text-xs h-9"
                  disabled={sendingEmail === action.type}
                  onClick={() => {
                    const extra = action.type === "shipped" ? { tracking: { carrier: trackingCarrier, tracking_number: trackingNumber, tracking_url: trackingUrl } } : undefined;
                    sendOrderEmail(action.type, extra);
                  }}
                >
                  {sendingEmail === action.type ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <action.icon className="w-3.5 h-3.5 mr-2" />}
                  {action.label}
                </Button>
              ))}
              <Separator />
              <Button variant="outline" className="w-full justify-start text-xs h-9 text-red-600 border-red-200 hover:bg-red-50" onClick={() => toast({ title: "Fonctionnalité à venir" })}>
                <CreditCard className="w-3.5 h-3.5 mr-2" /> Émettre un remboursement partiel
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs h-9 text-red-600 border-red-200 hover:bg-red-50" onClick={() => toast({ title: "Fonctionnalité à venir" })}>
                <Ban className="w-3.5 h-3.5 mr-2" /> Annuler la commande
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-8 pt-4 border-t-2 border-gray-900 text-center text-xs text-gray-500">
        CONFIDENTIEL — Document interne
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
