import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Check, Loader2 } from "lucide-react";
import { useCartAbandonment } from "@/hooks/useCartAbandonment";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface SaveConfigCTAProps {
  hasValidConfig: boolean;
}

const SaveConfigCTA = ({ hasValidConfig }: SaveConfigCTAProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { captureEmail } = useCartAbandonment();
  const { item } = useCart();

  if (!hasValidConfig) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !item) return;

    setStatus("loading");
    try {
      captureEmail(email);

      await supabase.functions.invoke("send-config-email", {
        body: { email, cart: item },
      });

      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="mt-8 border border-primary/20 bg-primary/5 p-5 text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-1">
         <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Devis envoyé !</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Retrouvez-la dans votre boîte mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border border-border bg-secondary/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Recevoir mon devis par e-mail</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Recevez votre configuration détaillée et votre devis par email.
      </p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="votre@email.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={status === "loading" || !email.includes("@")}
          size="sm"
          className="whitespace-nowrap"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Recevoir ma config →"
          )}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-destructive mt-2">Erreur lors de l'envoi. Réessayez.</p>
      )}
    </form>
  );
};

export default SaveConfigCTA;
