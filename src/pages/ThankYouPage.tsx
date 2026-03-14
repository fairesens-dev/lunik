import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle2 } from "lucide-react";
import logoLunik from "@/assets/logo-lunik.svg";

const ThankYouPage = () => {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "—";
  const email = params.get("email") || "";
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  const steps = [
    { icon: "📧", label: "Email de confirmation", desc: "dans quelques minutes" },
    { icon: "📞", label: "Appel de confirmation", desc: "sous 24h" },
    { icon: "🏭", label: "Fabrication", desc: "débute après confirmation" },
    { icon: "🚚", label: "Livraison", desc: "dans 4 à 5 semaines" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Checkmark animation */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-3">
            Merci pour votre commande !
          </h1>
          <p className="text-sm text-muted-foreground">
            Référence : <strong>{ref}</strong>
          </p>
        </div>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Votre commande a bien été enregistrée.
          {email && (
            <>
              {" "}Vous allez recevoir une confirmation par email à <strong>{email}</strong>.
            </>
          )}
          {" "}Notre équipe vous contactera sous 24h pour confirmer les détails de fabrication.
        </p>

        {/* Next steps */}
        <div className="border border-border bg-card p-6 text-left">
          <h3 className="font-serif text-lg mb-4 text-center">Et maintenant ?</h3>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild className="rounded-none h-auto py-3 px-6">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild className="rounded-none h-auto py-3 px-6">
            <Link to={`/suivi?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(email)}`}>
              Suivre ma commande
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
