import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, Wrench, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useContactWidget } from "@/contexts/ContactWidgetContext";

type Msg = { role: "user" | "assistant"; content: string };
type WidgetScreen = "menu" | "ai_chat" | "sav" | "callback";

// ── Streaming helper ──
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/widget-chat`;
const SAVE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/widget-save`;

async function streamChat({
  messages, onDelta, onDone, onError,
}: { messages: Msg[]; onDelta: (t: string) => void; onDone: () => void; onError: (e: string) => void }) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Erreur réseau" }));
      onError(err.error || "Erreur du service");
      return;
    }
    if (!resp.body) { onError("Pas de réponse"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let done = false;

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch { buf = line + "\n" + buf; break; }
      }
    }
    onDone();
  } catch { onError("Erreur de connexion"); }
}

async function saveWidgetData(action: string, data: Record<string, unknown>) {
  const resp = await fetch(SAVE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ action, data }),
  });
  return resp.json();
}

// ── Typing dots ──
const TypingDots = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    {[0, 1, 2].map(i => (
      <motion.span key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
    ))}
  </div>
);

// ── Main component ──
const ContactWidget = () => {
  const { isOpen, openWidget, closeWidget, screen, setScreen } = useContactWidget();
  const { toast } = useToast();

  // Pulse animation - stop after first open
  const [hasOpened, setHasOpened] = useState(() => sessionStorage.getItem("widget_opened") === "true");

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Msg[]>(() => {
    try { return JSON.parse(sessionStorage.getItem("chatbot_session") || "[]"); } catch { return []; }
  });
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const userMsgCount = chatMessages.filter(m => m.role === "user").length;

  // SAV state
  const [savStep, setSavStep] = useState(0);
  const [savData, setSavData] = useState({ order_number: "", problem_category: "", problem_detail: "", email: "", phone: "" });
  const [savInput, setSavInput] = useState("");
  const [savDone, setSavDone] = useState(false);
  const [savOrderInfo, setSavOrderInfo] = useState<{ order_found: boolean; order_status?: string; order_date?: string } | null>(null);
  const savEndRef = useRef<HTMLDivElement>(null);

  // Callback state
  const [cbForm, setCbForm] = useState({ first_name: "", phone: "", city: "" });
  const [cbRgpd, setCbRgpd] = useState(false);
  const [cbSending, setCbSending] = useState(false);
  const [cbDone, setCbDone] = useState(false);

  // Persist chat
  useEffect(() => {
    if (chatMessages.length > 0) sessionStorage.setItem("chatbot_session", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // ESC to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) closeWidget(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, closeWidget]);

  useEffect(() => {
    if (screen !== "sav") return;

    const frame = window.requestAnimationFrame(() => {
      savEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [screen, savStep, savDone]);

  const handleOpen = () => {
    if (!hasOpened) { setHasOpened(true); sessionStorage.setItem("widget_opened", "true"); }
  };

  // ── AI Chat send ──
  const sendChat = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || isStreaming) return;
    if (userMsgCount >= 20) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setIsStreaming(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setChatMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: newMessages,
      onDelta: upsert,
      onDone: () => setIsStreaming(false),
      onError: (err) => {
        setIsStreaming(false);
        toast({ title: "Erreur", description: err, variant: "destructive" });
      },
    });
  }, [chatInput, chatMessages, isStreaming, userMsgCount, toast]);

  // ── SAV flow ──
  const savQuestions = [
    "Quel est le numéro de votre commande ?",
    "Quel est le problème rencontré ?",
    "", // conditional Q3
    "Quel est votre email de commande ?",
    "Quel est votre numéro de téléphone ?",
  ];

  const savCategories = ["Produit non reçu", "Produit endommagé", "Produit non conforme", "Problème de paiement", "Autre"];

  const getQ3Text = () => {
    const cat = savData.problem_category;
    if (cat === "Produit non reçu") return "Quel est le transporteur indiqué dans votre email de confirmation ?";
    if (cat === "Produit endommagé" || cat === "Produit non conforme") return "Pouvez-vous décrire le problème en détail ?";
    if (cat === "Problème de paiement") return "Le paiement a-t-il été débité de votre compte ?";
    return "Décrivez votre problème";
  };

  const handleSavSubmit = (value: string) => {
    if (savStep === 0) {
      setSavData(p => ({ ...p, order_number: value }));
      setSavStep(1);
    } else if (savStep === 2) {
      setSavData(p => ({ ...p, problem_detail: value }));
      setSavStep(3);
    } else if (savStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        toast({ title: "Email invalide", variant: "destructive" });
        return;
      }
      setSavData(p => ({ ...p, email: value }));
      setSavStep(4);
    } else if (savStep === 4) {
      setSavData(p => ({ ...p, phone: value }));
      completeSav({ ...savData, phone: value });
    }
    setSavInput("");
  };

  const handleSavCategory = (cat: string) => {
    setSavData(p => ({ ...p, problem_category: cat }));
    setSavStep(2);
  };

  const completeSav = async (finalData: typeof savData) => {
    try {
      const result = await saveWidgetData("sav", finalData);
      setSavOrderInfo(result);
      setSavDone(true);
    } catch {
      toast({ title: "Erreur d'envoi", variant: "destructive" });
    }
  };

  // ── Callback submit ──
  const handleCallback = async () => {
    const phoneRegex = /^(?:(?:\+33|0033|0)[1-9])(?:[\s.-]?\d{2}){4}$/;
    if (!phoneRegex.test(cbForm.phone.replace(/\s/g, ""))) {
      toast({ title: "Numéro de téléphone invalide", variant: "destructive" });
      return;
    }
    setCbSending(true);
    try {
      await saveWidgetData("callback", { ...cbForm });
      setCbDone(true);
    } catch {
      toast({ title: "Erreur d'envoi", variant: "destructive" });
    } finally { setCbSending(false); }
  };

  // Save transcript on close
  const handleClose = () => {
    closeWidget();
    if (chatMessages.length > 1) {
      const email = localStorage.getItem("contact_email") || undefined;
      saveWidgetData("chat_transcript", { transcript: chatMessages, email });
    }
  };

  const resetScreen = (s: WidgetScreen) => {
    setScreen(s);
    if (s === "sav") { setSavStep(0); setSavData({ order_number: "", problem_category: "", problem_detail: "", email: "", phone: "" }); setSavDone(false); setSavOrderInfo(null); setSavInput(""); }
    if (s === "callback") { setCbForm({ first_name: "", phone: "", city: "" }); setCbRgpd(false); setCbDone(false); }
  };

  const isOnline = (() => {
    const now = new Date();
    const d = now.getDay(), h = now.getHours();
    return d >= 1 && d <= 5 && h >= 9 && h < 18;
  })();

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-3 w-[340px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "min(600px, calc(100vh - 100px))" }}
            role="dialog" aria-label="Widget de contact"
          >
            {/* ── Header ── */}
            <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-2xl flex items-center justify-between shrink-0">
              <div>
                <p className="text-sm font-semibold">Notre équipe vous répond</p>
                <p className="text-xs opacity-80 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
                  {isOnline ? "En ligne" : "Disponible demain 9h"}
                </p>
              </div>
              <button onClick={handleClose} aria-label="Fermer le widget" className="hover:bg-white/10 rounded-full p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {/* ── Menu Screen ── */}
              {screen === "menu" && (
                <div className="p-4 space-y-2">
                  {[
                    { icon: <MessageCircle className="w-5 h-5" />, title: "Poser une question", sub: "Notre IA répond instantanément", target: "ai_chat" as WidgetScreen },
                    { icon: <Wrench className="w-5 h-5" />, title: "Service après-vente", sub: "Un problème avec votre commande ?", target: "sav" as WidgetScreen },
                    { icon: <Phone className="w-5 h-5" />, title: "Être rappelé", sub: "Laissez vos coordonnées", target: "callback" as WidgetScreen },
                  ].map(item => (
                    <button key={item.target} onClick={() => resetScreen(item.target)}
                      className="w-full flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-secondary/50 transition-colors text-left">
                      <div className="text-primary shrink-0">{item.icon}</div>
                      <div><p className="text-sm font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.sub}</p></div>
                    </button>
                  ))}
                </div>
              )}

              {/* ── AI Chat Screen ── */}
              {screen === "ai_chat" && (
                <div className="flex flex-col h-full">
                  <div className="px-4 pt-2">
                    <button onClick={() => resetScreen("menu" as WidgetScreen)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3">
                      <ArrowLeft className="w-3 h-3" /> Retour
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">👋 Bonjour ! Comment puis-je vous aider ?</p>
                      </div>
                    )}
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-foreground rounded-bl-md"
                        }`}>
                          {m.content}
                          {m.role === "assistant" && /rappel|contacter|rappeler/i.test(m.content) && (
                            <button onClick={() => resetScreen("callback" as WidgetScreen)}
                              className="mt-2 text-xs text-primary underline block">📞 Demander un rappel</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isStreaming && chatMessages[chatMessages.length - 1]?.role !== "assistant" && <TypingDots />}
                    {userMsgCount >= 20 && (
                      <div className="text-center py-3 space-y-2">
                        <p className="text-xs text-muted-foreground">Vous souhaitez parler à un humain ?</p>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => resetScreen("callback" as WidgetScreen)}>
                          📞 Demander un rappel
                        </Button>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  {userMsgCount < 20 && (
                    <form onSubmit={(e) => { e.preventDefault(); sendChat(); }}
                      className="px-4 py-3 border-t border-border flex gap-2 shrink-0">
                      <Input value={chatInput} onChange={e => setChatInput(e.target.value)}
                        placeholder="Votre question..." className="rounded-full h-9 text-sm flex-1"
                        disabled={isStreaming} aria-label="Message" />
                      <Button type="submit" size="icon" className="rounded-full h-9 w-9 shrink-0" disabled={isStreaming || !chatInput.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* ── SAV Screen ── */}
              {screen === "sav" && (
                <div className="flex flex-col h-full min-h-0">
                  <div className="px-4 pt-2 shrink-0">
                    <button onClick={() => resetScreen("menu" as WidgetScreen)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3">
                      <ArrowLeft className="w-3 h-3" /> Retour
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2 min-h-0">
                    {savDone ? (
                      <div className="text-center py-6 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium">Demande SAV enregistrée !</p>
                        {savOrderInfo?.order_found ? (
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Commande <span className="font-medium text-foreground">{savData.order_number}</span> trouvée.</p>
                            {savOrderInfo.order_status && <p>Statut actuel : <span className="font-medium text-foreground">{savOrderInfo.order_status}</span></p>}
                            {savOrderInfo.order_date && <p>Date : {new Date(savOrderInfo.order_date).toLocaleDateString("fr-FR")}</p>}
                            <p className="mt-2">Notre équipe traite votre demande et revient vers vous rapidement.</p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">Notre équipe revient vers vous dans les meilleurs délais.</p>
                        )}
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => resetScreen("menu" as WidgetScreen)}>Nouvelle question</Button>
                      </div>
                    ) : (
                      <>
                        {savStep >= 0 && (
                          <div className="flex justify-start">
                            <div className="bg-secondary text-foreground px-3 py-2 rounded-2xl rounded-bl-md text-sm max-w-[80%]">
                              {savQuestions[0]}
                            </div>
                          </div>
                        )}
                        {savData.order_number && (
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-br-md text-sm max-w-[80%]">
                              {savData.order_number}
                            </div>
                          </div>
                        )}
                        {savStep >= 1 && (
                          <div className="flex justify-start">
                            <div className="bg-secondary text-foreground px-3 py-2 rounded-2xl rounded-bl-md text-sm max-w-[80%]">
                              {savQuestions[1]}
                            </div>
                          </div>
                        )}
                        {savData.problem_category && (
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-br-md text-sm max-w-[80%]">
                              {savData.problem_category}
                            </div>
                          </div>
                        )}
                        {savStep >= 2 && savData.problem_category && (
                          <div className="flex justify-start">
                            <div className="bg-secondary text-foreground px-3 py-2 rounded-2xl rounded-bl-md text-sm max-w-[80%]">
                              {getQ3Text()}
                            </div>
                          </div>
                        )}
                        {savData.problem_detail && (
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-br-md text-sm max-w-[80%]">
                              {savData.problem_detail}
                            </div>
                          </div>
                        )}
                        {savStep >= 3 && (
                          <div className="flex justify-start">
                            <div className="bg-secondary text-foreground px-3 py-2 rounded-2xl rounded-bl-md text-sm max-w-[80%]">
                              {savQuestions[3]}
                            </div>
                          </div>
                        )}
                        {savData.email && (
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-br-md text-sm max-w-[80%]">
                              {savData.email}
                            </div>
                          </div>
                        )}
                        {savStep >= 4 && (
                          <div className="flex justify-start">
                            <div className="bg-secondary text-foreground px-3 py-2 rounded-2xl rounded-bl-md text-sm max-w-[80%]">
                              {savQuestions[4]} <span className="text-xs opacity-60">(optionnel)</span>
                            </div>
                          </div>
                        )}
                        <div ref={savEndRef} />
                      </>
                    )}
                  </div>
                  {/* SAV Input area */}
                  {!savDone && (
                    <div className="px-4 py-3 border-t border-border shrink-0">
                      {savStep === 1 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {savCategories.map(cat => (
                            <button key={cat} onClick={() => handleSavCategory(cat)}
                              className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-secondary transition-colors">
                              {cat}
                            </button>
                          ))}
                        </div>
                      ) : savStep === 2 && savData.problem_category === "Problème de paiement" ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs flex-1" onClick={() => { setSavData(p => ({ ...p, problem_detail: "Oui, le paiement a été débité" })); setSavStep(3); }}>Oui</Button>
                          <Button size="sm" variant="outline" className="text-xs flex-1" onClick={() => { setSavData(p => ({ ...p, problem_detail: "Non, le paiement n'a pas été débité" })); setSavStep(3); }}>Non</Button>
                        </div>
                      ) : savStep === 4 ? (
                        <div className="flex gap-2">
                          <form onSubmit={(e) => { e.preventDefault(); handleSavSubmit(savInput); }} className="flex-1 flex gap-2">
                            <Input value={savInput} onChange={e => setSavInput(e.target.value)} placeholder="06 XX XX XX XX" type="tel" className="rounded-full h-9 text-sm" />
                            <Button type="submit" size="icon" className="rounded-full h-9 w-9 shrink-0"><Send className="w-4 h-4" /></Button>
                          </form>
                          <Button size="sm" variant="ghost" className="text-xs" onClick={() => completeSav(savData)}>Passer</Button>
                        </div>
                      ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleSavSubmit(savInput); }} className="flex gap-2">
                          <Input value={savInput} onChange={e => setSavInput(e.target.value)}
                            placeholder={savStep === 3 ? "email@exemple.com" : "Votre réponse..."}
                            type={savStep === 3 ? "email" : "text"}
                            className="rounded-full h-9 text-sm flex-1" required />
                          <Button type="submit" size="icon" className="rounded-full h-9 w-9 shrink-0"><Send className="w-4 h-4" /></Button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Callback Screen ── */}
              {screen === "callback" && (
                <div className="p-4 flex flex-col h-full overflow-y-auto">
                  <button onClick={() => resetScreen("menu" as WidgetScreen)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Retour
                  </button>
                  {cbDone ? (
                    <div className="text-center py-6 space-y-3 flex-1 flex flex-col justify-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm font-medium">Demande enregistrée !</p>
                      <p className="text-xs text-muted-foreground">Merci {cbForm.first_name}, nous vous rappelons au {cbForm.phone} dès que possible.</p>
                      <Button size="sm" variant="outline" className="text-xs" onClick={handleClose}>Fermer</Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <p className="text-sm font-medium">📞 Être rappelé par notre équipe</p>
                        <p className="text-xs text-muted-foreground mt-1">Remplissez ce formulaire et nous vous recontactons.</p>
                      </div>
                      <div className="space-y-3 flex-1">
                        <Input placeholder="Prénom *" value={cbForm.first_name} onChange={e => setCbForm(p => ({ ...p, first_name: e.target.value }))}
                          className="rounded-lg h-9 text-sm" required aria-label="Prénom" />
                        <Input placeholder="Numéro de téléphone *" type="tel" value={cbForm.phone}
                          onChange={e => setCbForm(p => ({ ...p, phone: e.target.value }))}
                          className="rounded-lg h-9 text-sm" required aria-label="Téléphone" />
                        <Input placeholder="Ville *" value={cbForm.city} onChange={e => setCbForm(p => ({ ...p, city: e.target.value }))}
                          className="rounded-lg h-9 text-sm" required aria-label="Ville" />
                        <div className="flex items-start gap-2">
                          <Checkbox id="rgpd" checked={cbRgpd} onCheckedChange={(v) => setCbRgpd(v === true)} className="mt-0.5" />
                          <label htmlFor="rgpd" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                            J'accepte que mes données soient traitées pour me recontacter.{" "}
                            <a href="/mentions-legales" target="_blank" className="underline">En savoir plus</a>
                          </label>
                        </div>
                        <Button onClick={handleCallback} className="w-full text-sm" size="sm"
                          disabled={!cbForm.first_name || !cbForm.phone || !cbForm.city || !cbRgpd || cbSending}>
                          {cbSending ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Envoi...</> : "Demander à être rappelé"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { if (isOpen) { handleClose(); } else { openWidget(); handleOpen(); } }}
        className={`group w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow ${
          !hasOpened ? "animate-pulse" : ""
        }`}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default ContactWidget;
