import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Check, Loader2 } from "lucide-react";
import { useCartAbandonment } from "@/hooks/useCartAbandonment";
import { supabase } from "@/integrations/supabase/client";

interface SaveConfigCTAProps {
  hasValidConfig: boolean;
  width: number;
  projection: number;
  toileColor: { label: string };
  armatureColor: { label: string };
  options: { motorisation: boolean; led: boolean; packConnect: boolean };
  price: number;
  basePrice: number | null;
}

const SaveConfigCTA = ({ hasValidConfig, width, projection, toileColor, armatureColor, options, price, basePrice }: SaveConfigCTAProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { captureEmail } = useCartAbandonment();

  if (!hasValidConfig) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      captureEmail(email);

      const cart = {
        configuration: {
          width,
          projection,
          toileColor,
          armatureColor,
          options,
        },
        pricing: {
          base: basePrice ?? 0,
          total: price,
        },
      };

      await supabase.functions.invoke("send-config-email", {
        body: { email, cart },
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
          Retrouvez-le dans votre boîte mail.
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
        Recevez votre devis détaillé directement par email.
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
            "Télécharger mon devis →"
          )}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
        En soumettant ce formulaire, vous acceptez que vos coordonnées soient utilisées par LuniK et son usine partenaire dans le cadre d'une commande de store sur mesure ou à des fins promotionnelles. Vous pouvez vous désinscrire à tout moment.
      </p>
      {status === "error" && (
        <p className="text-xs text-destructive mt-2">Erreur lors de l'envoi. Réessayez.</p>
      )}
    </form>
  );
};

export default SaveConfigCTA;
