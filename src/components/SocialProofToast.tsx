import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MESSAGES = [
  "🛒 Marie de Lyon vient de commander un store 350×250 cm",
  "👁️ 12 personnes regardent ce store en ce moment",
  "⭐ Xavier a laissé un avis 5 étoiles il y a 2 heures",
  "✅ Thomas de Paris vient de recevoir sa commande",
  "🔥 8 commandes cette semaine",
  "📦 Livraison en 4-5 semaines pour les commandes passées aujourd'hui",
];

const SESSION_KEY = "social_proof_count";
const MAX_PER_SESSION = 3;

const SocialProofToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);
  const location = useLocation();

  const isCheckout = location.pathname.startsWith("/checkout");

  const getCount = () => parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
  const incrementCount = () => sessionStorage.setItem(SESSION_KEY, String(getCount() + 1));

  const showToast = useCallback(() => {
    if (isCheckout || getCount() >= MAX_PER_SESSION) return;
    const idx = Math.floor(Math.random() * MESSAGES.length);
    setMessage(MESSAGES[idx]);
    setProgress(100);
    setVisible(true);
    incrementCount();

    // Auto-dismiss progress
    const start = Date.now();
    const duration = 5000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        progressRef.current = requestAnimationFrame(tick);
      } else {
        setVisible(false);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
  }, [isCheckout]);

  const scheduleNext = useCallback(() => {
    if (isCheckout || getCount() >= MAX_PER_SESSION) return;
    const delay = 45000 + Math.random() * 45000; // 45-90s
    timerRef.current = window.setTimeout(() => {
      showToast();
      scheduleNext();
    }, delay);
  }, [isCheckout, showToast]);

  useEffect(() => {
    // Start after 30s
    const initial = window.setTimeout(() => {
      showToast();
      scheduleNext();
    }, 30000);

    return () => {
      clearTimeout(initial);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [showToast, scheduleNext]);

  const dismiss = () => {
    setVisible(false);
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-20 sm:bottom-6 left-6 z-40 w-[300px] bg-background border border-border shadow-lg overflow-hidden print:hidden"
        >
          <div className="p-4 pr-10">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Progress bar */}
          <div className="h-0.5 bg-secondary">
            <div
              className="h-full bg-primary transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofToast;
