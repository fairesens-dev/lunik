import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Settings, Users, Puzzle, Code, Bell, Eye, EyeOff, Plus, Trash2, Copy, RefreshCw, Shield,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────

async function loadSetting(key: string) {
  const { data } = await supabase.from("admin_settings").select("data").eq("id", key).single();
  return data?.data as Record<string, any> | null;
}

async function saveSetting(key: string, data: Record<string, any>) {
  await supabase.from("admin_settings").upsert({ id: key, data } as any, { onConflict: "id" });
}

// ── Tab 1: Général ─────────────────────────────────────

function GeneralTab() {
  const { admin, updateAdmin, updatePassword } = useAuth();
  const { content, updateGlobal } = useContent();
  const { toast } = useToast();

  const nameParts = (admin?.name || "").split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [email, setEmail] = useState(admin?.email || "");

  const [siteUrl, setSiteUrl] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [transactionalEmail, setTransactionalEmail] = useState("");

  const [brandName, setBrandName] = useState(content.global.brandName);
  const [siret, setSiret] = useState(content.global.siret);
  const [address, setAddress] = useState(content.global.address);
  const [tva, setTva] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  const [consentText, setConsentText] = useState("");
  const [retentionPeriod, setRetentionPeriod] = useState("2yr");

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const [gen, comp, gdpr] = await Promise.all([
        loadSetting("general"),
        loadSetting("company"),
        loadSetting("gdpr"),
      ]);
      if (gen) { setSiteUrl(gen.siteUrl || ""); setCurrency(gen.currency || "EUR"); setTimezone(gen.timezone || "Europe/Paris"); setTransactionalEmail(gen.transactionalEmail || ""); }
      if (comp) { setTva(comp.tva || ""); setBillingEmail(comp.billingEmail || ""); }
      if (gdpr) { setConsentText(gdpr.consentText || ""); setRetentionPeriod(gdpr.retentionPeriod || "2yr"); }
    })();
  }, []);

  const saveProfile = () => {
    updateAdmin({ name: `${firstName} ${lastName}`.trim(), email });
    toast({ title: "Profil mis à jour" });
  };

  const saveSite = async () => {
    updateGlobal({ brandName });
    await saveSetting("general", { siteUrl, currency, timezone, transactionalEmail });
    toast({ title: "Paramètres du site enregistrés" });
  };

  const saveCompany = async () => {
    updateGlobal({ brandName, siret, address });
    await saveSetting("company", { tva, billingEmail });
    toast({ title: "Entreprise mise à jour" });
  };

  const saveGdpr = async () => {
    await saveSetting("gdpr", { consentText, retentionPeriod });
    toast({ title: "Paramètres RGPD enregistrés" });
  };

  const handleChangePassword = async () => {
    if (newPwd.length < 8) { toast({ title: "Erreur", description: "Minimum 8 caractères.", variant: "destructive" }); return; }
    if (newPwd !== confirmPwd) { toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" }); return; }
    setPwdLoading(true);
    const res = await updatePassword(newPwd);
    setPwdLoading(false);
    if (res.success) { setNewPwd(""); setConfirmPwd(""); toast({ title: "Mot de passe mis à jour" }); }
    else toast({ title: "Erreur", description: res.error, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      {/* Site */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Paramètres du site</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nom du site</Label><Input value={brandName} onChange={e => setBrandName(e.target.value)} /></div>
            <div className="space-y-2"><Label>URL du site</Label><Input value={siteUrl} onChange={e => setSiteUrl(e.target.value)} placeholder="https://monstore.fr" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New York</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>E-mail transactionnel</Label>
            <Input type="email" value={transactionalEmail} onChange={e => setTransactionalEmail(e.target.value)} placeholder="notifications@votredomaine.fr" />
            <p className="text-xs text-muted-foreground">Adresse d'expédition utilisée par Resend pour tous les e-mails transactionnels (devis, confirmations, relances…).</p>
          </div>
          <Button onClick={saveSite}>Enregistrer</Button>
        </CardContent>
      </Card>

      {/* Admin profile */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Profil administrateur</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Prénom</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Nom</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <Button onClick={saveProfile}>Mettre à jour</Button>
        </CardContent>
      </Card>

      {/* Company */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Entreprise</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>SIRET</Label><Input value={siret} onChange={e => setSiret(e.target.value)} /></div>
            <div className="space-y-2"><Label>TVA intracommunautaire</Label><Input value={tva} onChange={e => setTva(e.target.value)} placeholder="FR XX XXX XXX XXX" /></div>
          </div>
          <div className="space-y-2"><Label>Adresse complète</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email facturation</Label><Input type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} /></div>
          <Button onClick={saveCompany}>Mettre à jour</Button>
        </CardContent>
      </Card>

      {/* GDPR */}
      <Card>
        <CardHeader><CardTitle className="text-lg">RGPD</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Texte de consentement</Label><Textarea value={consentText} onChange={e => setConsentText(e.target.value)} placeholder="En soumettant ce formulaire, vous acceptez..." rows={3} /></div>
          <div className="space-y-2">
            <Label>Durée de rétention des données</Label>
            <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="6mo">6 mois</SelectItem>
                <SelectItem value="1yr">1 an</SelectItem>
                <SelectItem value="2yr">2 ans</SelectItem>
                <SelectItem value="3yr">3 ans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveGdpr}>Enregistrer</Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Mot de passe</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nouveau mot de passe</Label>
            <div className="relative">
              <Input type={showPwd ? "text" : "password"} value={newPwd} onChange={e => setNewPwd(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPwd.length > 0 && newPwd.length < 8 && <p className="text-xs text-destructive">Minimum 8 caractères</p>}
          </div>
          <div className="space-y-2">
            <Label>Confirmer</Label>
            <Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
            {confirmPwd.length > 0 && confirmPwd !== newPwd && <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>}
          </div>
          <Button onClick={handleChangePassword} disabled={pwdLoading}>{pwdLoading ? "Mise à jour..." : "Changer le mot de passe"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 2: Équipe ──────────────────────────────────────

interface TeamMember { id: string; name: string; email: string; role: string; }

function TeamTab() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [roundRobin, setRoundRobin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");

  useEffect(() => {
    (async () => {
      const d = await loadSetting("team");
      if (d) { setMembers(d.members || []); setRoundRobin(d.roundRobin || false); }
    })();
  }, []);

  const save = useCallback(async (m: TeamMember[], rr: boolean) => {
    await saveSetting("team", { members: m, roundRobin: rr });
  }, []);

  const addMember = async () => {
    if (!newEmail) return;
    const member: TeamMember = { id: crypto.randomUUID(), name: newName || newEmail.split("@")[0], email: newEmail, role: newRole };
    const updated = [...members, member];
    setMembers(updated);
    await save(updated, roundRobin);
    setNewName(""); setNewEmail(""); setNewRole("viewer"); setDialogOpen(false);
    toast({ title: "Membre ajouté" });
  };

  const removeMember = async (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    await save(updated, roundRobin);
    toast({ title: "Membre supprimé" });
  };

  const toggleRoundRobin = async (v: boolean) => {
    setRoundRobin(v);
    await save(members, v);
    toast({ title: v ? "Round-robin activé" : "Round-robin désactivé" });
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = { admin: "destructive", sales: "default", marketing: "secondary", viewer: "outline" };
    return <Badge variant={map[role] as any || "outline"}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Membres de l'équipe</CardTitle>
            <CardDescription>Gérez les accès à l'administration</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Inviter</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Inviter un membre</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2"><Label>Nom</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jean Dupont" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="jean@monstore.fr" /></div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button onClick={addMember}>Ajouter</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucun membre ajouté</TableCell></TableRow>
              )}
              {members.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{roleBadge(m.role)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeMember(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Attribution des leads</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Round-robin automatique</p>
              <p className="text-xs text-muted-foreground">Attribue les nouveaux leads aux membres Sales à tour de rôle</p>
            </div>
            <Switch checked={roundRobin} onCheckedChange={toggleRoundRobin} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 3: Intégrations ────────────────────────────────

function IntegrationsTab() {
  const { toast } = useToast();
  const [ga4Id, setGa4Id] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [gadsId, setGadsId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioFrom, setTwilioFrom] = useState("");
  const [showTwilioToken, setShowTwilioToken] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await loadSetting("integrations");
      if (!d) return;
      setGa4Id(d.ga4Id || ""); setMetaPixelId(d.metaPixelId || ""); setGadsId(d.gadsId || ""); setWebhookUrl(d.webhookUrl || "");
      setSmtpHost(d.smtpHost || ""); setSmtpPort(d.smtpPort || "587"); setSmtpUser(d.smtpUser || ""); setSmtpPass(d.smtpPass || ""); setSmtpFrom(d.smtpFrom || "");
      setTwilioSid(d.twilioSid || ""); setTwilioToken(d.twilioToken || ""); setTwilioFrom(d.twilioFrom || "");
    })();
  }, []);

  const saveAll = async () => {
    await saveSetting("integrations", {
      ga4Id, metaPixelId, gadsId, webhookUrl,
      smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom,
      twilioSid, twilioToken, twilioFrom,
    });
    toast({ title: "Intégrations enregistrées" });
  };

  const Section = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Section title="Google Analytics 4" desc="Injectez automatiquement le script GA4 sur votre site">
        <div className="space-y-2"><Label>Measurement ID</Label><Input value={ga4Id} onChange={e => setGa4Id(e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
      </Section>

      <Section title="Meta Pixel" desc="Suivi des conversions Facebook / Instagram">
        <div className="space-y-2"><Label>Pixel ID</Label><Input value={metaPixelId} onChange={e => setMetaPixelId(e.target.value)} placeholder="123456789012345" /></div>
      </Section>

      <Section title="Google Ads" desc="Suivi des conversions Google Ads">
        <div className="space-y-2"><Label>Conversion ID</Label><Input value={gadsId} onChange={e => setGadsId(e.target.value)} placeholder="AW-XXXXXXXXX" /></div>
      </Section>

      <Section title="Webhook global" desc="Envoie un POST JSON à chaque nouveau lead créé">
        <div className="space-y-2"><Label>URL du webhook</Label><Input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://hooks.zapier.com/..." /></div>
      </Section>

      <Section title="SMTP (envoi d'emails)" desc="Configuration du serveur SMTP pour les campagnes email">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Hôte</Label><Input value={smtpHost} onChange={e => setSmtpHost(e.target.value)} placeholder="smtp.resend.com" /></div>
          <div className="space-y-2"><Label>Port</Label><Input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Utilisateur</Label><Input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Mot de passe</Label>
          <div className="relative">
            <Input type={showSmtpPass ? "text" : "password"} value={smtpPass} onChange={e => setSmtpPass(e.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowSmtpPass(!showSmtpPass)}>
              {showSmtpPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2"><Label>Adresse d'envoi</Label><Input type="email" value={smtpFrom} onChange={e => setSmtpFrom(e.target.value)} placeholder="noreply@monstore.fr" /></div>
      </Section>

      <Section title="SMS — Twilio" desc="Envoi de SMS via Twilio">
        <div className="space-y-2"><Label>Account SID</Label><Input value={twilioSid} onChange={e => setTwilioSid(e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Auth Token</Label>
          <div className="relative">
            <Input type={showTwilioToken ? "text" : "password"} value={twilioToken} onChange={e => setTwilioToken(e.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowTwilioToken(!showTwilioToken)}>
              {showTwilioToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2"><Label>Numéro d'envoi</Label><Input value={twilioFrom} onChange={e => setTwilioFrom(e.target.value)} placeholder="+33600000000" /></div>
      </Section>

      <Button onClick={saveAll} className="w-full">Enregistrer toutes les intégrations</Button>
    </div>
  );
}

// ── Tab 4: API & Tracking ──────────────────────────────

interface ApiKey { id: string; name: string; key: string; createdAt: string; }

function ApiTrackingTab() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [corsOrigins, setCorsOrigins] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await loadSetting("api_tracking");
      if (d) { setApiKeys(d.apiKeys || []); setCorsOrigins(d.corsOrigins || ""); }
    })();
  }, []);

  const saveState = useCallback(async (keys: ApiKey[], cors: string) => {
    await saveSetting("api_tracking", { apiKeys: keys, corsOrigins: cors });
  }, []);

  const trackingScript = `<!-- Lunik Tracking -->
<script>
(function(){
  var s=document.createElement('script');
  s.src='https://gejgtkgqyzdfbsbxujgl.supabase.co/functions/v1/tracking';
  s.async=true;
  s.dataset.project='gejgtkgqyzdfbsbxujgl';
  document.head.appendChild(s);
})();
</script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(trackingScript);
    toast({ title: "Script copié dans le presse-papier" });
  };

  const generateKey = async () => {
    const key: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName || "Clé sans nom",
      key: `lnk_${crypto.randomUUID().replace(/-/g, "")}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...apiKeys, key];
    setApiKeys(updated);
    await saveState(updated, corsOrigins);
    setNewKeyName(""); setDialogOpen(false);
    toast({ title: "Clé API générée" });
  };

  const revokeKey = async (id: string) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    await saveState(updated, corsOrigins);
    toast({ title: "Clé révoquée" });
  };

  const saveCors = async () => {
    await saveState(apiKeys, corsOrigins);
    toast({ title: "Origines CORS enregistrées" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Script de tracking</CardTitle>
          <CardDescription>Ajoutez ce script dans le &lt;head&gt; de votre site pour activer le suivi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="rounded-md bg-muted p-4 text-xs overflow-x-auto font-mono">{trackingScript}</pre>
          <Button variant="outline" size="sm" onClick={copyScript}><Copy className="h-4 w-4 mr-1" /> Copier le script</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Clés API</CardTitle>
            <CardDescription>Générez des clés pour les intégrations externes</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Générer</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle clé API</DialogTitle></DialogHeader>
              <div className="space-y-2 py-2">
                <Label>Nom de la clé</Label>
                <Input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Mon intégration" />
              </div>
              <DialogFooter><Button onClick={generateKey}>Générer</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Clé</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucune clé API</TableCell></TableRow>
              )}
              {apiKeys.map(k => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.name}</TableCell>
                  <TableCell className="font-mono text-xs">{k.key.slice(0, 12)}...{k.key.slice(-4)}</TableCell>
                  <TableCell className="text-sm">{new Date(k.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Révoquer cette clé ?</AlertDialogTitle>
                          <AlertDialogDescription>Les intégrations utilisant cette clé cesseront de fonctionner immédiatement.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => revokeKey(k.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Révoquer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Origines CORS autorisées</CardTitle>
          <CardDescription>Une origine par ligne (ex: https://monsite.fr)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={corsOrigins} onChange={e => setCorsOrigins(e.target.value)} rows={4} placeholder="https://monsite.fr&#10;https://staging.monsite.fr" />
          <Button onClick={saveCors}>Enregistrer</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 5: Notifications ───────────────────────────────

interface NotifSettings {
  newOrder: boolean;
  newLead: boolean;
  leadReminder: boolean;
  orderStatusUpdate: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  emails: string;
  scoreThreshold: number;
  scoreAlertEmail: string;
  dailyDigest: boolean;
  dailyDigestEmail: string;
  slackWebhook: string;
}

const defaultNotif: NotifSettings = {
  newOrder: true, newLead: true, leadReminder: true, orderStatusUpdate: true,
  weeklyReport: false, monthlyReport: false, emails: "",
  scoreThreshold: 50, scoreAlertEmail: "", dailyDigest: false, dailyDigestEmail: "", slackWebhook: "",
};

function NotificationsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotifSettings>(defaultNotif);

  useEffect(() => {
    (async () => {
      const d = await loadSetting("notifications");
      if (d) setSettings({ ...defaultNotif, ...d });
    })();
  }, []);

  const toggle = (key: keyof NotifSettings) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const set = (key: keyof NotifSettings, val: any) => setSettings(s => ({ ...s, [key]: val }));

  const save = async () => {
    await saveSetting("notifications", settings);
    toast({ title: "Notifications enregistrées" });
  };

  const switches: { key: keyof NotifSettings; label: string }[] = [
    { key: "newOrder", label: "Nouvelle commande reçue" },
    { key: "newLead", label: "Nouveau lead soumis" },
    { key: "leadReminder", label: "Lead sans réponse depuis 48h" },
    { key: "orderStatusUpdate", label: "Statut commande mis à jour" },
    { key: "weeklyReport", label: "Rapport hebdomadaire (lundi matin)" },
    { key: "monthlyReport", label: "Rapport mensuel" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertes email</CardTitle>
          <CardDescription>Événements déclenchant un email de notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {switches.map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <Label className="cursor-pointer">{s.label}</Label>
              <Switch checked={settings[s.key] as boolean} onCheckedChange={() => toggle(s.key)} />
            </div>
          ))}
          <div className="space-y-2 pt-2">
            <Label>Email(s) de notification</Label>
            <Input value={settings.emails} onChange={e => set("emails", e.target.value)} placeholder="admin@monstore.fr, equipe@monstore.fr" />
            <p className="text-xs text-muted-foreground">Séparez les adresses par une virgule</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alerte lead score</CardTitle>
          <CardDescription>Recevez une alerte quand un lead dépasse un seuil de score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Seuil de score</Label>
              <Input type="number" value={settings.scoreThreshold} onChange={e => set("scoreThreshold", Number(e.target.value))} min={1} />
            </div>
            <div className="space-y-2">
              <Label>Email de notification</Label>
              <Input type="email" value={settings.scoreAlertEmail} onChange={e => set("scoreAlertEmail", e.target.value)} placeholder="sales@monstore.fr" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Digest quotidien</CardTitle>
          <CardDescription>Résumé quotidien des nouveaux leads et conversions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Activer le digest quotidien</Label>
            <Switch checked={settings.dailyDigest} onCheckedChange={() => toggle("dailyDigest")} />
          </div>
          {settings.dailyDigest && (
            <div className="space-y-2">
              <Label>Email destinataire</Label>
              <Input type="email" value={settings.dailyDigestEmail} onChange={e => set("dailyDigestEmail", e.target.value)} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Slack (optionnel)</CardTitle>
          <CardDescription>Envoyez un message Slack à chaque nouveau lead</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Webhook URL Slack</Label>
          <Input value={settings.slackWebhook} onChange={e => set("slackWebhook", e.target.value)} placeholder="https://hooks.slack.com/services/..." />
        </CardContent>
      </Card>

      <Button onClick={save} className="w-full">Sauvegarder les notifications</Button>
    </div>
  );
}

// ── Tab 6: Paiement ────────────────────────────────────

interface PaymentMethodsSettings {
  card: { enabled: boolean };
  transfer: {
    enabled: boolean;
    iban: string;
    bic: string;
    accountHolder: string;
    bank: string;
    instructions: string;
  };
  check: {
    enabled: boolean;
    orderTo: string;
    sendAddress: string;
    instructions: string;
  };
}

const defaultPaymentSettings: PaymentMethodsSettings = {
  card: { enabled: true },
  transfer: {
    enabled: false,
    iban: "",
    bic: "",
    accountHolder: "",
    bank: "",
    instructions: "Effectuez votre virement en indiquant la référence de commande dans le libellé. La commande sera validée dès réception du paiement.",
  },
  check: {
    enabled: false,
    orderTo: "",
    sendAddress: "",
    instructions: "Envoyez votre chèque en indiquant la référence de commande au dos. La commande sera validée dès réception et encaissement.",
  },
};

function PaymentTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PaymentMethodsSettings>(defaultPaymentSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const d = await loadSetting("payment_methods");
      if (d) setSettings({ ...defaultPaymentSettings, ...d } as any);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    await saveSetting("payment_methods", settings as any);
    toast({ title: "Paramètres de paiement enregistrés" });
  };

  const updateTransfer = (key: string, value: string | boolean) =>
    setSettings(s => ({ ...s, transfer: { ...s.transfer, [key]: value } }));

  const updateCheck = (key: string, value: string | boolean) =>
    setSettings(s => ({ ...s, check: { ...s.check, [key]: value } }));

  if (loading) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement...</p>;

  return (
    <div className="space-y-6">
      {/* CB */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">💳 Carte bancaire (Stripe)</CardTitle>
              <CardDescription>Paiement comptant sécurisé par CB via Stripe</CardDescription>
            </div>
            <Switch
              checked={settings.card.enabled}
              onCheckedChange={v => setSettings(s => ({ ...s, card: { enabled: v } }))}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Virement */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">🏦 Virement bancaire</CardTitle>
              <CardDescription>Le client effectue un virement manuel après commande</CardDescription>
            </div>
            <Switch
              checked={settings.transfer.enabled}
              onCheckedChange={v => updateTransfer("enabled", v)}
            />
          </div>
        </CardHeader>
        {settings.transfer.enabled && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titulaire du compte</Label>
                <Input value={settings.transfer.accountHolder} onChange={e => updateTransfer("accountHolder", e.target.value)} placeholder="SAS LuniK" />
              </div>
              <div className="space-y-2">
                <Label>Banque</Label>
                <Input value={settings.transfer.bank} onChange={e => updateTransfer("bank", e.target.value)} placeholder="BNP Paribas" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>IBAN</Label>
                <Input value={settings.transfer.iban} onChange={e => updateTransfer("iban", e.target.value)} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" />
              </div>
              <div className="space-y-2">
                <Label>BIC</Label>
                <Input value={settings.transfer.bic} onChange={e => updateTransfer("bic", e.target.value)} placeholder="BNPAFRPP" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructions personnalisées</Label>
              <Textarea
                value={settings.transfer.instructions}
                onChange={e => updateTransfer("instructions", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Chèque */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">📝 Chèque</CardTitle>
              <CardDescription>Le client envoie un chèque par courrier</CardDescription>
            </div>
            <Switch
              checked={settings.check.enabled}
              onCheckedChange={v => updateCheck("enabled", v)}
            />
          </div>
        </CardHeader>
        {settings.check.enabled && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>À l'ordre de</Label>
                <Input value={settings.check.orderTo} onChange={e => updateCheck("orderTo", e.target.value)} placeholder="SAS LuniK" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adresse d'envoi</Label>
              <Textarea
                value={settings.check.sendAddress}
                onChange={e => updateCheck("sendAddress", e.target.value)}
                placeholder="123 rue de Paris&#10;75001 Paris"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Instructions personnalisées</Label>
              <Textarea
                value={settings.check.instructions}
                onChange={e => updateCheck("instructions", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        )}
      </Card>

      <Button onClick={save} className="w-full">Sauvegarder les paramètres de paiement</Button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────

const AdminSettingsPage = () => (
  <div className="space-y-6 font-sans">
    <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="general" className="gap-1.5"><Settings className="h-4 w-4 hidden sm:block" /> Général</TabsTrigger>
        <TabsTrigger value="team" className="gap-1.5"><Users className="h-4 w-4 hidden sm:block" /> Équipe</TabsTrigger>
        <TabsTrigger value="integrations" className="gap-1.5"><Puzzle className="h-4 w-4 hidden sm:block" /> Intégrations</TabsTrigger>
        <TabsTrigger value="api" className="gap-1.5"><Code className="h-4 w-4 hidden sm:block" /> API & Tracking</TabsTrigger>
        <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-4 w-4 hidden sm:block" /> Notifications</TabsTrigger>
        <TabsTrigger value="payment" className="gap-1.5"><Shield className="h-4 w-4 hidden sm:block" /> Paiement</TabsTrigger>
      </TabsList>
      <TabsContent value="general"><GeneralTab /></TabsContent>
      <TabsContent value="team"><TeamTab /></TabsContent>
      <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
      <TabsContent value="api"><ApiTrackingTab /></TabsContent>
      <TabsContent value="notifications"><NotificationsTab /></TabsContent>
      <TabsContent value="payment"><PaymentTab /></TabsContent>
    </Tabs>
  </div>
);

export default AdminSettingsPage;
