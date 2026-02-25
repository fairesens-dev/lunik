import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { useConfiguratorSettings } from "@/contexts/ConfiguratorSettingsContext";
import { Eye, EyeOff, User, Bell, Truck, Shield, AlertTriangle, Monitor } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ── Tab 1: Mon compte ──────────────────────────────────

function AccountTab() {
  const { admin, updateAdmin } = useAuth();
  const { content, updateGlobal } = useContent();
  const { toast } = useToast();

  const nameParts = (admin?.name || "").split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [email, setEmail] = useState(admin?.email || "");

  const [brandName, setBrandName] = useState(content.global.brandName);
  const [siret, setSiret] = useState(content.global.siret);
  const [address, setAddress] = useState(content.global.address);
  const [tva, setTva] = useState(() => localStorage.getItem("admin_tva") || "");
  const [billingEmail, setBillingEmail] = useState(() => localStorage.getItem("admin_billing_email") || "");

  const handleUpdateAdmin = () => {
    updateAdmin({ name: `${firstName} ${lastName}`.trim(), email });
    toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
  };

  const handleUpdateCompany = () => {
    updateGlobal({ brandName, siret, address });
    localStorage.setItem("admin_tva", tva);
    localStorage.setItem("admin_billing_email", billingEmail);
    toast({ title: "Entreprise mise à jour", description: "Les informations de l'entreprise ont été enregistrées." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations administrateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email de connexion</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <div><Badge variant="secondary">Administrateur</Badge></div>
          </div>
          <Button onClick={handleUpdateAdmin}>Mettre à jour</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de l'entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom commercial</Label>
            <Input value={brandName} onChange={e => setBrandName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>SIRET</Label>
            <Input value={siret} onChange={e => setSiret(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Adresse complète</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>TVA intracommunautaire</Label>
            <Input value={tva} onChange={e => setTva(e.target.value)} placeholder="FR XX XXX XXX XXX" />
          </div>
          <div className="space-y-2">
            <Label>Email facturation</Label>
            <Input type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} placeholder="facturation@monstore.fr" />
          </div>
          <Button onClick={handleUpdateCompany}>Mettre à jour</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 2: Notifications ───────────────────────────────

interface NotifSettings {
  newOrder: boolean;
  newLead: boolean;
  leadReminder: boolean;
  orderStatusUpdate: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  emails: string;
}

const defaultNotif: NotifSettings = {
  newOrder: true, newLead: true, leadReminder: true, orderStatusUpdate: true,
  weeklyReport: false, monthlyReport: false, emails: "",
};

function NotificationsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotifSettings>(() => {
    try {
      const raw = localStorage.getItem("admin_notifications");
      return raw ? { ...defaultNotif, ...JSON.parse(raw) } : defaultNotif;
    } catch { return defaultNotif; }
  });

  const toggle = (key: keyof NotifSettings) =>
    setSettings(s => ({ ...s, [key]: !s[key] }));

  const save = () => {
    localStorage.setItem("admin_notifications", JSON.stringify(settings));
    toast({ title: "Notifications enregistrées", description: "Vos préférences ont été sauvegardées." });
  };

  const switches: { key: keyof NotifSettings; label: string }[] = [
    { key: "newOrder", label: "Nouvelle commande reçue" },
    { key: "newLead", label: "Nouveau lead soumis" },
    { key: "leadReminder", label: "Lead sans réponse depuis 48h (relance automatique)" },
    { key: "orderStatusUpdate", label: "Statut commande mis à jour" },
    { key: "weeklyReport", label: "Rapport hebdomadaire (synthèse lundi matin)" },
    { key: "monthlyReport", label: "Rapport mensuel" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alertes email</CardTitle>
        <CardDescription>Choisissez les événements pour lesquels vous souhaitez recevoir une notification par email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {switches.map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <Label className="cursor-pointer">{s.label}</Label>
              <Switch checked={settings[s.key] as boolean} onCheckedChange={() => toggle(s.key)} />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label>Email(s) de notification</Label>
          <Input
            value={settings.emails}
            onChange={e => setSettings(s => ({ ...s, emails: e.target.value }))}
            placeholder="admin@monstore.fr, equipe@monstore.fr"
          />
          <p className="text-xs text-muted-foreground">Séparez les adresses par une virgule</p>
        </div>
        <Button onClick={save}>Sauvegarder</Button>
      </CardContent>
    </Card>
  );
}

// ── Tab 3: Livraison & SAV ─────────────────────────────

interface DeliverySettings {
  delay: string;
  customMessage: string;
  showCustomMessage: boolean;
}

const defaultDelivery: DeliverySettings = { delay: "4 à 5 semaines", customMessage: "", showCustomMessage: false };

function DeliverySAVTab() {
  const { toast } = useToast();
  const { content, updateGlobal, updateSAV } = useContent();

  const [delivery, setDelivery] = useState<DeliverySettings>(() => {
    try {
      const raw = localStorage.getItem("admin_delivery_settings");
      return raw ? { ...defaultDelivery, ...JSON.parse(raw) } : defaultDelivery;
    } catch { return defaultDelivery; }
  });

  const [phone, setPhone] = useState(content.global.phone);
  const [emailSAV, setEmailSAV] = useState(content.global.email);
  const [hours, setHours] = useState(content.sav.hours);
  const [responseDelay, setResponseDelay] = useState(content.sav.responseDelay);

  const saveDelivery = () => {
    localStorage.setItem("admin_delivery_settings", JSON.stringify(delivery));
    toast({ title: "Délais enregistrés", description: "Les paramètres de livraison ont été sauvegardés." });
  };

  const saveSAV = () => {
    updateGlobal({ phone, email: emailSAV });
    updateSAV({ hours, responseDelay });
    toast({ title: "SAV mis à jour", description: "Les informations SAV ont été enregistrées." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Délais affichés sur le site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Délai fabrication + livraison affiché</Label>
            <Input value={delivery.delay} onChange={e => setDelivery(d => ({ ...d, delay: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Message délai personnalisé</Label>
            <Textarea
              value={delivery.customMessage}
              onChange={e => setDelivery(d => ({ ...d, customMessage: e.target.value }))}
              placeholder="Ex: En raison d'une forte demande, les délais sont actuellement allongés..."
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Afficher ce message exceptionnel sur le site</Label>
            <Switch
              checked={delivery.showCustomMessage}
              onCheckedChange={v => setDelivery(d => ({ ...d, showCustomMessage: v }))}
            />
          </div>
          {delivery.showCustomMessage && delivery.customMessage && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium mb-1">Aperçu :</p>
              <p>{delivery.customMessage}</p>
            </div>
          )}
          <Button onClick={saveDelivery}>Sauvegarder</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations SAV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Téléphone SAV</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email SAV</Label>
            <Input type="email" value={emailSAV} onChange={e => setEmailSAV(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Horaires d'ouverture</Label>
            <Textarea value={hours} onChange={e => setHours(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Délai de réponse affiché</Label>
            <Input value={responseDelay} onChange={e => setResponseDelay(e.target.value)} placeholder="sous 24h" />
          </div>
          <Button onClick={saveSAV}>Sauvegarder</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab 4: Sécurité ────────────────────────────────────

function SecurityTab() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const { resetToDefaults } = useConfiguratorSettings();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = () => {
    if (currentPwd !== "admin2024!") {
      toast({ title: "Erreur", description: "Le mot de passe actuel est incorrect.", variant: "destructive" });
      return;
    }
    if (newPwd.length < 8) {
      toast({ title: "Erreur", description: "Le nouveau mot de passe doit contenir au moins 8 caractères.", variant: "destructive" });
      return;
    }
    if (newPwd !== confirmPwd) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été modifié avec succès." });
  };

  const handleReset = () => {
    resetToDefaults();
    toast({ title: "Configurateur réinitialisé", description: "Toutes les données du configurateur ont été remises aux valeurs par défaut." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Changer le mot de passe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mot de passe actuel</Label>
            <Input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPwd.length > 0 && newPwd.length < 8 && (
              <p className="text-xs text-destructive">Minimum 8 caractères</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Confirmer le nouveau mot de passe</Label>
            <Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
            {confirmPwd.length > 0 && confirmPwd !== newPwd && (
              <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
            )}
          </div>
          <Button onClick={handleChangePassword}>Mettre à jour le mot de passe</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sessions actives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 text-sm">
              <span className="font-medium">Session actuelle</span>
              <span className="text-muted-foreground"> · Démarrée il y a 2h · Navigateur Chrome · IP: 192.168.*.***</span>
            </div>
          </div>
          <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={logout}>
            Déconnecter toutes les sessions
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium">Réinitialiser toutes les données du configurateur</p>
          <p className="text-sm text-muted-foreground">
            Remet tous les paramètres du configurateur aux valeurs par défaut. Cette action est irréversible.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Réinitialiser</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la réinitialisation</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action va remettre tous les paramètres du configurateur (prix, dimensions, couleurs, options) aux valeurs par défaut. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Réinitialiser
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────

const AdminSettingsPage = () => (
  <div className="space-y-6 font-sans">
    <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="account" className="gap-1.5"><User className="h-4 w-4 hidden sm:block" /> Mon compte</TabsTrigger>
        <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-4 w-4 hidden sm:block" /> Notifications</TabsTrigger>
        <TabsTrigger value="delivery" className="gap-1.5"><Truck className="h-4 w-4 hidden sm:block" /> Livraison & SAV</TabsTrigger>
        <TabsTrigger value="security" className="gap-1.5"><Shield className="h-4 w-4 hidden sm:block" /> Sécurité</TabsTrigger>
      </TabsList>
      <TabsContent value="account"><AccountTab /></TabsContent>
      <TabsContent value="notifications"><NotificationsTab /></TabsContent>
      <TabsContent value="delivery"><DeliverySAVTab /></TabsContent>
      <TabsContent value="security"><SecurityTab /></TabsContent>
    </Tabs>
  </div>
);

export default AdminSettingsPage;
