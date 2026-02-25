import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Tab = "menu" | "message" | "callback";

const ContactWidget = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { content } = useContent();
  const { toast } = useToast();

  // Message form
  const [msgForm, setMsgForm] = useState({ name: "", email: "", message: "" });
  // Callback form
  const [callbackPhone, setCallbackPhone] = useState("");

  const isOnline = (() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  })();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.from("contact_messages" as any).insert({
        first_name: msgForm.name.split(" ")[0] || msgForm.name,
        last_name: msgForm.name.split(" ").slice(1).join(" ") || "-",
        email: msgForm.email,
        message: msgForm.message,
        subject: "Widget contact",
      } as any);
      setSent(true);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.from("contact_messages" as any).insert({
        first_name: "Rappel",
        last_name: "demandé",
        email: "rappel@widget.local",
        phone: callbackPhone,
        message: `Demande de rappel au ${callbackPhone}`,
        subject: "Demande de rappel",
      } as any);
      setSent(true);
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const reset = () => { setTab("menu"); setSent(false); setMsgForm({ name: "", email: "", message: "" }); setCallbackPhone(""); };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="mb-3 w-[280px] bg-background border border-border shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notre équipe vous répond</p>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
                  {isOnline ? "En ligne" : "Disponible demain 9h"}
                </p>
              </div>
              <button onClick={() => { setOpen(false); reset(); }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {sent ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Message envoyé !</p>
                  <p className="text-xs text-muted-foreground">Nous vous répondons sous 30 minutes.</p>
                  <Button variant="outline" size="sm" className="text-xs mt-2" onClick={reset}>Retour</Button>
                </div>
              ) : tab === "menu" ? (
                <div className="space-y-2">
                  <button
                    className="w-full flex items-center gap-3 p-3 border border-border hover:bg-secondary transition-colors text-left"
                    onClick={() => window.location.href = `tel:${content.global.phone?.replace(/\s/g, "")}`}
                  >
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Nous appeler</p>
                      <p className="text-xs text-muted-foreground">{content.global.phone}</p>
                    </div>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 p-3 border border-border hover:bg-secondary transition-colors text-left"
                    onClick={() => setTab("message")}
                  >
                    <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Envoyer un message</p>
                      <p className="text-xs text-muted-foreground">Réponse sous 30 min</p>
                    </div>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 p-3 border border-border hover:bg-secondary transition-colors text-left"
                    onClick={() => setTab("callback")}
                  >
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Rappel sous 30min</p>
                      <p className="text-xs text-muted-foreground">Nous vous rappelons</p>
                    </div>
                  </button>
                </div>
              ) : tab === "message" ? (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <Input
                    placeholder="Votre nom"
                    value={msgForm.name}
                    onChange={(e) => setMsgForm(p => ({ ...p, name: e.target.value }))}
                    required
                    className="rounded-none h-9 text-sm"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={msgForm.email}
                    onChange={(e) => setMsgForm(p => ({ ...p, email: e.target.value }))}
                    required
                    className="rounded-none h-9 text-sm"
                  />
                  <Textarea
                    placeholder="Votre message..."
                    value={msgForm.message}
                    onChange={(e) => setMsgForm(p => ({ ...p, message: e.target.value }))}
                    required
                    className="rounded-none min-h-[80px] text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setTab("menu")}>← Retour</Button>
                    <Button type="submit" size="sm" className="flex-1 text-xs" disabled={sending}>
                      {sending ? "Envoi..." : "Envoyer"}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCallback} className="space-y-3">
                  <p className="text-sm text-muted-foreground">Entrez votre numéro, nous vous rappelons sous 30 minutes.</p>
                  <Input
                    placeholder="06 XX XX XX XX"
                    type="tel"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    required
                    className="rounded-none h-9 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setTab("menu")}>← Retour</Button>
                    <Button type="submit" size="sm" className="flex-1 text-xs" disabled={sending}>
                      {sending ? "Envoi..." : "Je souhaite être rappelé(e)"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setOpen(!open); if (!open) reset(); }}
        className="group w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-accent-light transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default ContactWidget;
