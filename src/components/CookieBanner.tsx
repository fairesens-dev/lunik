import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const STORAGE_KEY = "cookie_consent";

interface CookiePrefs {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  date: string;
}

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    analytics: false,
    marketing: false,
    date: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setShow(true);
  }, []);

  const save = (p: CookiePrefs) => {
    const final = { ...p, date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    setShow(false);
  };

  const acceptAll = () => save({ essential: true, analytics: true, marketing: true, date: "" });
  const refuseAll = () => save({ essential: true, analytics: false, marketing: false, date: "" });
  const saveCustom = () => save(prefs);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[55] p-4 print:hidden"
        >
          <div className="max-w-4xl mx-auto bg-background border border-border shadow-xl">
            {!customize ? (
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.{" "}
                    <Link to="/cookies" className="text-primary underline text-xs">
                      Politique de cookies
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button onClick={acceptAll} size="sm" className="text-xs rounded-none">
                    Tout accepter
                  </Button>
                  <Button onClick={() => setCustomize(true)} variant="outline" size="sm" className="text-xs rounded-none">
                    Personnaliser
                  </Button>
                  <Button onClick={refuseAll} variant="ghost" size="sm" className="text-xs rounded-none">
                    Tout refuser
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg">Préférences de cookies</h3>
                  <button onClick={() => setCustomize(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border">
                    <div>
                      <p className="text-sm font-medium">Cookies essentiels</p>
                      <p className="text-xs text-muted-foreground">Nécessaires au fonctionnement du site</p>
                    </div>
                    <Switch checked disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border">
                    <div>
                      <p className="text-sm font-medium">Cookies analytiques</p>
                      <p className="text-xs text-muted-foreground">Google Analytics, Hotjar</p>
                    </div>
                    <Switch checked={prefs.analytics} onCheckedChange={(v) => setPrefs(p => ({ ...p, analytics: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border">
                    <div>
                      <p className="text-sm font-medium">Cookies marketing</p>
                      <p className="text-xs text-muted-foreground">Facebook Pixel, Google Ads</p>
                    </div>
                    <Switch checked={prefs.marketing} onCheckedChange={(v) => setPrefs(p => ({ ...p, marketing: v }))} />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button onClick={refuseAll} variant="ghost" size="sm" className="text-xs rounded-none">
                    Tout refuser
                  </Button>
                  <Button onClick={saveCustom} size="sm" className="text-xs rounded-none">
                    Enregistrer mes choix
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
