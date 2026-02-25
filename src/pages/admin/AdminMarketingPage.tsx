import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent, type FeaturedReview } from "@/contexts/ContentContext";
import { useTrustpilot } from "@/hooks/useTrustpilot";
import { clearTrustpilotCache } from "@/lib/trustpilot";
import {
  Star, ExternalLink, RefreshCw, ChevronUp, ChevronDown, Trash2,
  StarOff, Send, BarChart3,
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
      </Tabs>
    </div>
  );
};

export default AdminMarketingPage;
