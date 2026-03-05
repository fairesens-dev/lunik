import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DynamicProductVisual from "@/components/product/DynamicProductVisual";
import { useCartAbandonment } from "@/hooks/useCartAbandonment";
import { supabase } from "@/integrations/supabase/client";

interface ExitIntentPopupProps {
  width: number; projection: number; toileColor: string; toileHex: string;
  armatureColor: string; armatureHex: string; price: number;
  motorisation: boolean; led: boolean; pack: boolean;
}

const ExitIntentPopup = ({
  width, projection, toileColor, toileHex, armatureColor, armatureHex,
  price, motorisation, led, pack,
}: ExitIntentPopupProps) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const location = useLocation();
  const { captureEmail } = useCartAbandonment();

  const hasConfig = width > 0 && projection > 0;
  const isProductPage = location.pathname === "/" || location.pathname === "/store-coffre";

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY > 5) return;
    if (!isProductPage || !hasConfig) return;
    if (sessionStorage.getItem("exit_popup_shown")) return;
    setShow(true);
    sessionStorage.setItem("exit_popup_shown", "1");
  }, [isProductPage, hasConfig]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (!isProductPage || !hasConfig) return;
    if (sessionStorage.getItem("exit_popup_shown")) return;
    setShow(true);
    sessionStorage.setItem("exit_popup_shown", "1");
    e.preventDefault();
  }, [isProductPage, hasConfig]);

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleMouseLeave, handleBeforeUnload]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      captureEmail(email);
      await supabase.functions.invoke("send-config-email", {
        body: { email, config: { width, projection, toileColor, armatureColor, price, motorisation, led, pack } },
      });
      setSent(true);
    } catch { /* silent */ } finally { setSending(false); }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setShow(false)} />
          <motion.div
            className="relative bg-background border border-border shadow-2xl rounded-2xl max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <button onClick={() => setShow(false)} className="absolute top-3 right-3 z-10 p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 bg-secondary rounded-l-2xl">
              <DynamicProductVisual toileColor={{ hex: toileHex, label: toileColor }} armatureColor={{ hex: armatureHex, label: armatureColor }} options={{ motorisation, led, packConnect: pack }} width={width} projection={projection} />
              <div className="mt-4 text-center">
                <p className="text-2xl font-display font-bold">{price.toLocaleString("fr-FR")} €</p>
                <p className="text-xs text-primary font-medium mt-1">ou {Math.round(price / 4).toLocaleString("fr-FR")} €/mois en 4× sans frais</p>
                <p className="text-xs text-muted-foreground mt-1">{width} × {projection} cm</p>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center">
              {sent ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Configuration envoyée !</h3>
                  <p className="text-sm text-muted-foreground">Retrouvez-la dans votre boîte mail.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
                    Attendez ! Votre store est presque <span className="text-primary">prêt</span>.
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Vous partez avec votre configuration de {width}×{projection} cm.
                    Sauvegardez-la gratuitement par email.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input type="email" placeholder="votre@email.fr" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg border-border h-11 text-sm" />
                    <Button type="submit" disabled={sending} variant="gradient" className="w-full rounded-full h-11 tracking-[0.1em] uppercase text-xs font-medium">
                      {sending ? "Envoi..." : "Recevoir ma config →"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
