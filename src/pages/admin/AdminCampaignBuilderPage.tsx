import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft, ArrowRight, Check, Send, Clock, CalendarIcon,
  Eye, Smartphone, Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Campaign = Tables<"campaigns">;

const STEPS = ["Configuration", "Audience", "Contenu", "Planification"];

const TEMPLATES: Record<string, { label: string; html: string }> = {
  basic: {
    label: "Basique",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h1 style="color:#333;">{{subject}}</h1>
  <p>Bonjour {{first_name}},</p>
  <p>Votre contenu ici…</p>
  <hr/>
  <p style="font-size:12px;color:#999;"><a href="{{unsubscribe_link}}">Se désinscrire</a></p>
</div>`,
  },
  promo: {
    label: "Promo",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f8f8;padding:0;">
  <div style="background:#7B8E7B;color:white;padding:30px;text-align:center;">
    <h1 style="margin:0;">🎉 Offre Spéciale</h1>
  </div>
  <div style="padding:30px;">
    <p>Bonjour {{first_name}},</p>
    <p>Profitez de notre offre exclusive…</p>
    <div style="text-align:center;margin:20px 0;">
      <a href="#" style="background:#B8826B;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;">En profiter</a>
    </div>
  </div>
  <div style="padding:15px;text-align:center;font-size:12px;color:#999;">
    <a href="{{unsubscribe_link}}">Se désinscrire</a>
  </div>
</div>`,
  },
  newsletter: {
    label: "Newsletter",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="border-bottom:3px solid #4A5E3A;padding:20px 0;text-align:center;">
    <h1 style="margin:0;color:#4A5E3A;">Newsletter</h1>
  </div>
  <div style="padding:20px;">
    <p>Bonjour {{first_name}},</p>
    <h2>Article 1</h2>
    <p>Description…</p>
    <h2>Article 2</h2>
    <p>Description…</p>
  </div>
  <div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#999;">
    <a href="{{unsubscribe_link}}">Se désinscrire</a>
  </div>
</div>`,
  },
};

const MERGE_TAGS = [
  { tag: "{{first_name}}", label: "Prénom" },
  { tag: "{{last_name}}", label: "Nom" },
  { tag: "{{email}}", label: "Email" },
  { tag: "{{unsubscribe_link}}", label: "Lien désinscription" },
];

const contactStatuses = ["visitor", "lead", "mql", "sql", "customer", "churned"] as const;
const contactSources = ["organic", "paid", "email", "social", "referral", "direct"] as const;
type ContactStatus = (typeof contactStatuses)[number];
type ContactSource = (typeof contactSources)[number];

const AdminCampaignBuilderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(id || null);

  // Step 1
  const [name, setName] = useState("");
  const [type, setType] = useState<"newsletter" | "automation" | "transactional">("newsletter");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");

  // Step 2
  const [statusFilters, setStatusFilters] = useState<ContactStatus[]>([]);
  const [sourceFilters, setSourceFilters] = useState<ContactSource[]>([]);
  const [audienceCount, setAudienceCount] = useState(0);
  const [manualEmails, setManualEmails] = useState("");

  // Step 3
  const [htmlContent, setHtmlContent] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState("");

  // Step 4
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("09:00");

  // Load existing campaign
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      const { data } = await supabase.from("campaigns").select("*").eq("id", id).single();
      if (data) {
        setName(data.name);
        setType(data.type);
        setSenderName(data.sender_name || "");
        setSenderEmail(data.sender_email || "");
        setSubject(data.subject || "");
        setPreviewText(data.preview_text || "");
        setHtmlContent(data.html_content || "");
        if (data.scheduled_at) {
          setScheduleType("later");
          setScheduleDate(new Date(data.scheduled_at));
          setScheduleTime(format(new Date(data.scheduled_at), "HH:mm"));
        }
      }
    })();
  }, [id, isEdit]);

  // Audience count
  useEffect(() => {
    const fetchCount = async () => {
      let q = supabase.from("contacts").select("id", { count: "exact", head: true });
      if (statusFilters.length > 0) q = q.in("status", statusFilters);
      if (sourceFilters.length > 0) q = q.in("source", sourceFilters);
      const { count } = await q;
      setAudienceCount(count || 0);
    };
    fetchCount();
  }, [statusFilters, sourceFilters]);

  const saveDraft = useCallback(async () => {
    setSaving(true);
    const payload = {
      name: name || "Sans titre",
      type,
      sender_name: senderName || null,
      sender_email: senderEmail || null,
      subject: subject || null,
      preview_text: previewText || null,
      html_content: htmlContent || null,
      status: "draft" as const,
    };
    if (campaignId) {
      await supabase.from("campaigns").update(payload).eq("id", campaignId);
    } else {
      const { data } = await supabase.from("campaigns").insert(payload).select("id").single();
      if (data) setCampaignId(data.id);
    }
    setSaving(false);
  }, [campaignId, name, type, senderName, senderEmail, subject, previewText, htmlContent]);

  const goStep = async (next: number) => {
    await saveDraft();
    setStep(next);
  };

  const insertMergeTag = (tag: string) => {
    const ta = textareaRef.current;
    if (!ta) { setHtmlContent((p) => p + tag); return; }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = htmlContent.slice(0, start);
    const after = htmlContent.slice(end);
    setHtmlContent(before + tag + after);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const handleLaunch = async () => {
    if (!campaignId) return;
    setSaving(true);

    // Fetch matched contacts
    let q = supabase.from("contacts").select("id, email");
    if (statusFilters.length > 0) q = q.in("status", statusFilters);
    if (sourceFilters.length > 0) q = q.in("source", sourceFilters);
    const { data: contacts } = await q;

    // Add manual emails
    const manualList = manualEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));

    const allContactIds = new Set((contacts || []).map((c) => c.id));
    const contactEmails = new Map((contacts || []).map((c) => [c.email.toLowerCase(), c.id]));

    // Resolve manual emails
    if (manualList.length > 0) {
      const { data: manual } = await supabase
        .from("contacts")
        .select("id, email")
        .in("email", manualList);
      (manual || []).forEach((c) => allContactIds.add(c.id));
    }

    const now = new Date().toISOString();
    const scheduledAt = scheduleType === "later" && scheduleDate
      ? new Date(`${format(scheduleDate, "yyyy-MM-dd")}T${scheduleTime}:00`).toISOString()
      : null;

    // Insert campaign_contacts
    const rows = Array.from(allContactIds).map((cid) => ({
      campaign_id: campaignId,
      contact_id: cid,
      sent_at: scheduleType === "now" ? now : null,
    }));

    if (rows.length > 0) {
      await supabase.from("campaign_contacts").insert(rows);
    }

    // Update campaign
    await supabase.from("campaigns").update({
      status: scheduleType === "now" ? ("sent" as const) : ("scheduled" as const),
      recipients_count: rows.length,
      sent_at: scheduleType === "now" ? now : null,
      scheduled_at: scheduledAt,
      name, type, sender_name: senderName, sender_email: senderEmail,
      subject, preview_text: previewText, html_content: htmlContent,
    }).eq("id", campaignId);

    setSaving(false);
    toast.success(scheduleType === "now" ? "Campagne envoyée !" : "Campagne planifiée !");
    navigate("/admin/campaigns");
  };

  const subjectLen = subject.length;
  const subjectFeedback = subjectLen === 0 ? null : subjectLen <= 60 ? "good" : subjectLen <= 90 ? "ok" : "long";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/campaigns")} className="rounded-md">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold">{isEdit ? "Modifier la campagne" : "Nouvelle campagne"}</h1>
        {saving && <span className="text-xs text-muted-foreground">Sauvegarde…</span>}
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => goStep(i)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                i === step ? "bg-primary text-primary-foreground" :
                i < step ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Setup */}
      {step === 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom de la campagne</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Newsletter Mars 2026" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="transactional">Transactionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom expéditeur</Label>
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="LuniK Store" />
              </div>
              <div className="space-y-1.5">
                <Label>Email expéditeur</Label>
                <Input value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="contact@frenchify.fr" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Objet</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Objet de votre email" />
              {subjectFeedback && (
                <p className={cn("text-xs", subjectFeedback === "good" ? "text-green-600" : subjectFeedback === "ok" ? "text-yellow-600" : "text-destructive")}>
                  {subjectLen} caractères — {subjectFeedback === "good" ? "Bonne longueur ✓" : subjectFeedback === "ok" ? "Acceptable" : "Trop long"}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Texte de prévisualisation</Label>
              <Input value={previewText} onChange={(e) => setPreviewText(e.target.value)} placeholder="Texte qui apparaît après l'objet dans la boîte de réception" />
              <p className="text-xs text-muted-foreground">{previewText.length}/150 caractères</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Audience */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Audience</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Statut des contacts</Label>
                <div className="flex flex-wrap gap-1.5">
                  {contactStatuses.map((s) => (
                    <Badge
                      key={s}
                      className={cn(
                        "cursor-pointer text-xs",
                        statusFilters.includes(s) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                      onClick={() => setStatusFilters((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
                {statusFilters.length === 0 && <p className="text-xs text-muted-foreground">Aucun filtre = tous les contacts</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <div className="flex flex-wrap gap-1.5">
                  {contactSources.map((s) => (
                    <Badge
                      key={s}
                      className={cn(
                        "cursor-pointer text-xs",
                        sourceFilters.includes(s) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                      onClick={() => setSourceFilters((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{audienceCount}</p>
                <p className="text-sm text-muted-foreground">contacts correspondent à ce segment</p>
              </CardContent>
            </Card>
            <div className="space-y-1.5">
              <Label>Import manuel (emails séparés par virgule ou retour à la ligne)</Label>
              <Textarea
                value={manualEmails}
                onChange={(e) => setManualEmails(e.target.value)}
                placeholder="email1@example.com&#10;email2@example.com"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Content */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Contenu</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Modèles</Label>
                <div className="flex gap-2">
                  {Object.entries(TEMPLATES).map(([key, t]) => (
                    <Button key={key} variant="outline" size="sm" className="rounded-md" onClick={() => setHtmlContent(t.html)}>
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Merge tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {MERGE_TAGS.map((m) => (
                    <Badge
                      key={m.tag}
                      className="cursor-pointer bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                      onClick={() => insertMergeTag(m.tag)}
                    >
                      {m.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <Textarea
                ref={textareaRef}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={16}
                className="font-mono text-xs"
                placeholder="Contenu HTML de votre email…"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4" /> Prévisualisation</CardTitle>
                <div className="flex gap-1">
                  <Button variant={previewMode === "desktop" ? "default" : "ghost"} size="sm" className="rounded-md" onClick={() => setPreviewMode("desktop")}>
                    <Monitor className="w-3 h-3 mr-1" /> Desktop
                  </Button>
                  <Button variant={previewMode === "mobile" ? "default" : "ghost"} size="sm" className="rounded-md" onClick={() => setPreviewMode("mobile")}>
                    <Smartphone className="w-3 h-3 mr-1" /> Mobile
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <iframe
                  srcDoc={htmlContent || "<p style='color:#999;text-align:center;padding:40px;'>Aucun contenu</p>"}
                  className="border rounded"
                  style={{ width: previewMode === "desktop" ? 600 : 320, height: 500 }}
                  title="Email preview"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="Email de test" className="max-w-xs" />
              <Button variant="outline" className="rounded-md" onClick={() => toast.info("Envoi de test non disponible pour le moment")}>
                <Send className="w-3 h-3 mr-1" /> Envoyer un test
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4 — Schedule */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Planification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={scheduleType} onValueChange={(v: any) => setScheduleType(v)}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="flex items-center gap-1.5 cursor-pointer"><Send className="w-4 h-4" /> Envoyer maintenant</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="later" id="later" />
                  <Label htmlFor="later" className="flex items-center gap-1.5 cursor-pointer"><Clock className="w-4 h-4" /> Planifier</Label>
                </div>
              </RadioGroup>

              {scheduleType === "later" && (
                <div className="flex flex-wrap items-end gap-4 pl-6">
                  <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-52 justify-start rounded-md", !scheduleDate && "text-muted-foreground")}>
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {scheduleDate ? format(scheduleDate, "PPP", { locale: fr }) : "Choisir une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          disabled={(d) => d < new Date()}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Heure</Label>
                    <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-32" />
                  </div>
                  <p className="text-xs text-muted-foreground pb-2">Fuseau horaire : {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-sm">Résumé</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Audience</span>
                <span className="font-medium">{audienceCount} contacts</span>
                <span className="text-muted-foreground">Objet</span>
                <span className="font-medium">{subject || "—"}</span>
                <span className="text-muted-foreground">Expéditeur</span>
                <span className="font-medium">{senderName || "—"} &lt;{senderEmail || "—"}&gt;</span>
                <span className="text-muted-foreground">Envoi</span>
                <span className="font-medium">
                  {scheduleType === "now" ? "Immédiat" : scheduleDate ? `${format(scheduleDate, "dd/MM/yyyy")} à ${scheduleTime}` : "Non défini"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => step > 0 ? goStep(step - 1) : navigate("/admin/campaigns")}
          className="rounded-md"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> {step > 0 ? "Précédent" : "Retour"}
        </Button>
        {step < 3 ? (
          <Button onClick={() => goStep(step + 1)} className="rounded-md">
            Suivant <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleLaunch} disabled={saving || !name} className="rounded-md">
            <Send className="w-4 h-4 mr-1" /> {scheduleType === "now" ? "Envoyer" : "Planifier"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminCampaignBuilderPage;
