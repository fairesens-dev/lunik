import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContent, type FeaturedReview } from "@/contexts/ContentContext";
import { useTrustpilot } from "@/hooks/useTrustpilot";
import { clearTrustpilotCache } from "@/lib/trustpilot";
import { supabase } from "@/integrations/supabase/client";
import {
  Star, ExternalLink, RefreshCw, ChevronUp, ChevronDown, Trash2,
  StarOff, Send, BarChart3, Plus, Tag,
} from "lucide-react";
import { toast } from "sonner";

// ── Helpers ─────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const FilledStars = ({ count, size = 4 }: { count: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`w-${size} h-${size} ${i <= count ? "fill-[#00b67a] text-[#00b67a]" : "fill-muted text-muted"}`}
      />
    ))}
  </div>
);

// ── Distribution bar ─────────────────────────────────

function DistributionBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 text-muted-foreground">{label}</span>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00b67a] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-muted-foreground">{pct}%</span>
    </div>
  );
}

// ── Main page ────────────────────────────────────────

const AdminMarketingPage = () => {
  const { content, updateFeaturedReviews } = useContent();
  const { summary, reviews, loading, error, hasMore, loadMore } = useTrustpilot(20);
  const [featured, setFeatured] = useState<FeaturedReview[]>(content.homepage.featuredReviews || []);
  const [inviteEmail, setInviteEmail] = useState("");

  // Promo codes state
  interface PromoCode {
    id: string; code: string; type: string; value: number;
    valid_from: string; valid_until: string; max_uses: number | null;
    current_uses: number; first_purchase_only: boolean; active: boolean;
    created_at: string;
  }
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: "", type: "percent", value: 10,
    valid_from: new Date().toISOString().slice(0, 10),
    valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    max_uses: "" as string | number, first_purchase_only: false,
  });

  const fetchPromoCodes = useCallback(async () => {
    setPromoLoading(true);
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (data) setPromoCodes(data as PromoCode[]);
    setPromoLoading(false);
  }, []);

  useEffect(() => { fetchPromoCodes(); }, [fetchPromoCodes]);

  useEffect(() => {
    setFeatured(content.homepage.featuredReviews || []);
  }, [content.homepage.featuredReviews]);

  const saveFeatured = useCallback(
    (items: FeaturedReview[]) => {
      setFeatured(items);
      updateFeaturedReviews(items);
      toast.success("Avis mis en avant sauvegardés");
    },
    [updateFeaturedReviews]
  );

  const toggleFeatured = useCallback(
    (review: { id: string; title: string; text: string; stars: number; createdAt: string; consumer: { displayName: string } }) => {
      const exists = featured.find(f => f.trustpilotId === review.id);
      if (exists) {
        saveFeatured(featured.filter(f => f.trustpilotId !== review.id));
      } else if (featured.length >= 6) {
        toast.error("Maximum 6 avis mis en avant");
      } else {
        saveFeatured([
          ...featured,
          {
            trustpilotId: review.id,
            title: review.title,
            text: review.text,
            author: review.consumer.displayName,
            rating: review.stars,
            date: review.createdAt,
          },
        ]);
      }
    },
    [featured, saveFeatured]
  );

  const moveFeatured = useCallback(
    (idx: number, dir: -1 | 1) => {
      const next = [...featured];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return;
      [next[idx], next[target]] = [next[target], next[idx]];
      saveFeatured(next);
    },
    [featured, saveFeatured]
  );

  const handleRefresh = () => {
    clearTrustpilotCache();
    window.location.reload();
  };

  // Distribution percentages
  const dist = summary?.starsDistribution;
  const total = dist
    ? dist.oneStar + dist.twoStars + dist.threeStars + dist.fourStars + dist.fiveStars
    : 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" /> Actualiser le cache
        </Button>
      </div>

      <Tabs defaultValue="trustpilot">
        <TabsList>
          <TabsTrigger value="trustpilot">Avis Trustpilot</TabsTrigger>
          <TabsTrigger value="featured">Avis mis en avant</TabsTrigger>
          <TabsTrigger value="invitations">Demandes d'avis</TabsTrigger>
          <TabsTrigger value="promo">Codes promo</TabsTrigger>
        </TabsList>

        {/* ── Tab: Trustpilot reviews ──────────────── */}
        <TabsContent value="trustpilot" className="space-y-6 mt-4">
          {/* Summary card */}
          {loading && !summary ? (
            <Skeleton className="h-48 w-full" />
          ) : summary ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-[#00b67a] font-bold">Trustpilot</span>
                  <FilledStars count={Math.round(summary.stars)} size={5} />
                  <span className="text-lg">{summary.trustScore}/5</span>
                  <Badge variant="secondary">{summary.numberOfReviews?.total ?? 0} avis</Badge>
                </CardTitle>
              </CardHeader>
              {dist && (
                <CardContent className="space-y-2">
                  <DistributionBar label="5 étoiles" pct={pct(dist.fiveStars)} />
                  <DistributionBar label="4 étoiles" pct={pct(dist.fourStars)} />
                  <DistributionBar label="3 étoiles" pct={pct(dist.threeStars)} />
                  <DistributionBar label="2 étoiles" pct={pct(dist.twoStars)} />
                  <DistributionBar label="1 étoile" pct={pct(dist.oneStar)} />
                </CardContent>
              )}
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">Trustpilot non configuré</p>
                <p className="text-xs text-muted-foreground">
                  Ajoutez les secrets <code>TRUSTPILOT_API_KEY</code> et{" "}
                  <code>TRUSTPILOT_BUSINESS_UNIT_ID</code> dans Supabase pour activer l'intégration.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reviews table */}
          {reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Derniers avis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Note</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead className="w-28">Date</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map(r => {
                      const isFeatured = featured.some(f => f.trustpilotId === r.id);
                      return (
                        <TableRow key={r.id}>
                          <TableCell><FilledStars count={r.stars} /></TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">{r.title || "—"}</TableCell>
                          <TableCell>{r.consumer.displayName}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{formatDate(r.createdAt)}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleFeatured(r)}
                              title={isFeatured ? "Retirer des mis en avant" : "Mettre en avant"}
                            >
                              {isFeatured ? (
                                <StarOff className="w-4 h-4 text-amber-500" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </Button>
                            {r.links?.[0]?.href && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={r.links[0].href} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {hasMore && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm" onClick={loadMore} disabled={loading}>
                      Charger plus
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab: Featured reviews ───────────────── */}
        <TabsContent value="featured" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Sélectionnez jusqu'à 6 avis à afficher en priorité sur le site. Utilisez le tableau "Avis Trustpilot" pour les ajouter, ou le fallback statique si l'API n'est pas configurée.
          </p>
          {featured.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucun avis mis en avant. Ajoutez-en depuis l'onglet "Avis Trustpilot".
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead className="w-24">Note</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featured.map((f, i) => (
                      <TableRow key={f.trustpilotId}>
                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                        <TableCell><FilledStars count={f.rating} /></TableCell>
                        <TableCell className="font-medium">{f.title || "—"}</TableCell>
                        <TableCell>{f.author}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFeatured(i, -1)} disabled={i === 0}>
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFeatured(i, 1)} disabled={i === featured.length - 1}>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => saveFeatured(featured.filter((_, j) => j !== i))}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab: Review invitations ─────────────── */}
        <TabsContent value="invitations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Envoyer une demande d'avis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="email@client.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="max-w-sm"
                />
                <Button
                  onClick={() => {
                    // TODO: implement OAuth for automated review invitations
                    toast.info("Fonctionnalité d'invitation à venir — nécessite l'OAuth Trustpilot");
                    setInviteEmail("");
                  }}
                  disabled={!inviteEmail}
                >
                  <Send className="w-4 h-4 mr-2" /> Envoyer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                L'envoi d'invitations Trustpilot nécessite la configuration OAuth. Cette fonctionnalité sera disponible prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Promo codes ────────────────────── */}
        <TabsContent value="promo" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Gérez vos codes promo pour la récupération de paniers et les campagnes.</p>
            <Button size="sm" onClick={() => setShowPromoForm(!showPromoForm)}>
              <Plus className="w-4 h-4 mr-2" /> Nouveau code
            </Button>
          </div>

          {showPromoForm && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Code</Label>
                    <Input
                      placeholder="REVIENS10"
                      value={newPromo.code}
                      onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select value={newPromo.type} onValueChange={v => setNewPromo({ ...newPromo, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">% remise</SelectItem>
                        <SelectItem value="fixed">€ fixe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Valeur</Label>
                    <Input type="number" value={newPromo.value} onChange={e => setNewPromo({ ...newPromo, value: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Début</Label>
                    <Input type="date" value={newPromo.valid_from} onChange={e => setNewPromo({ ...newPromo, valid_from: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Fin</Label>
                    <Input type="date" value={newPromo.valid_until} onChange={e => setNewPromo({ ...newPromo, valid_until: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Max utilisations (vide = illimité)</Label>
                    <Input type="number" placeholder="Illimité" value={newPromo.max_uses} onChange={e => setNewPromo({ ...newPromo, max_uses: e.target.value ? Number(e.target.value) : "" })} />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <Switch checked={newPromo.first_purchase_only} onCheckedChange={v => setNewPromo({ ...newPromo, first_purchase_only: v })} />
                    <Label className="text-xs">Premier achat uniquement</Label>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    if (!newPromo.code) { toast.error("Code requis"); return; }
                    const { error } = await supabase.from("promo_codes").insert({
                      code: newPromo.code,
                      type: newPromo.type,
                      value: newPromo.value,
                      valid_from: new Date(newPromo.valid_from).toISOString(),
                      valid_until: new Date(newPromo.valid_until).toISOString(),
                      max_uses: newPromo.max_uses ? Number(newPromo.max_uses) : null,
                      first_purchase_only: newPromo.first_purchase_only,
                    });
                    if (error) { toast.error("Erreur: " + error.message); return; }
                    toast.success("Code promo créé");
                    setShowPromoForm(false);
                    setNewPromo({ code: "", type: "percent", value: 10, valid_from: new Date().toISOString().slice(0, 10), valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), max_uses: "", first_purchase_only: false });
                    fetchPromoCodes();
                  }}
                >
                  Créer le code
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              {promoLoading ? (
                <div className="p-8"><Skeleton className="h-10 w-full" /></div>
              ) : promoCodes.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>Aucun code promo</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Réduction</TableHead>
                      <TableHead>Validité</TableHead>
                      <TableHead className="text-center">Utilisations</TableHead>
                      <TableHead className="text-center">Actif</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promoCodes.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono font-medium">{p.code}</TableCell>
                        <TableCell>{p.type === "percent" ? `${p.value}%` : `${p.value} €`}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(p.valid_from).toLocaleDateString("fr-FR")} → {new Date(p.valid_until).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="text-center">
                          {p.current_uses}{p.max_uses ? `/${p.max_uses}` : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={p.active}
                            onCheckedChange={async (v) => {
                              await supabase.from("promo_codes").update({ active: v }).eq("id", p.id);
                              fetchPromoCodes();
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                            onClick={async () => {
                              await supabase.from("promo_codes").delete().eq("id", p.id);
                              toast.success("Code supprimé");
                              fetchPromoCodes();
                            }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMarketingPage;
