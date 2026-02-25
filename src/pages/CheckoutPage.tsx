import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Lock } from "lucide-react";
import CheckoutStep1, { type Step1Data } from "@/components/checkout/CheckoutStep1";
import CheckoutStep2 from "@/components/checkout/CheckoutStep2";
import CheckoutStep3 from "@/components/checkout/CheckoutStep3";

const STEPS = ["Coordonnées", "Livraison", "Paiement"];

const CheckoutPage = () => {
  const { item } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [contactData, setContactData] = useState<Step1Data | null>(null);
  const [deliveryOption, setDeliveryOption] = useState("standard");

  useEffect(() => {
    if (!item) navigate("/store-coffre", { replace: true });
  }, [item, navigate]);

  if (!item) return null;

  const handleStep1 = (data: Step1Data) => {
    setContactData(data);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleStep2 = (delivery: string) => {
    setDeliveryOption(delivery);
    setStep(3);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-wider">LUNIK</Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            Commande sécurisée
          </div>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center text-xs font-medium transition-colors ${
                    i + 1 <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-sm ${i + 1 <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="w-16 h-px bg-border mx-4" />}
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && <CheckoutStep1 onNext={handleStep1} defaultValues={contactData ?? undefined} />}
        {step === 2 && <CheckoutStep2 onNext={handleStep2} onBack={() => setStep(1)} />}
        {step === 3 && contactData && (
          <CheckoutStep3
            contactData={contactData}
            deliveryOption={deliveryOption}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
