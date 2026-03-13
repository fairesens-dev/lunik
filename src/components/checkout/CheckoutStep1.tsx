import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const step1Schema = z.object({
  civility: z.enum(["M.", "Mme"], { required_error: "Choisissez une civilité" }),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Téléphone requis"),
  address: z.string().min(5, "Adresse requise"),
  address2: z.string().optional(),
  postalCode: z.string().min(5, "Code postal requis").max(5),
  city: z.string().min(2, "Ville requise"),
  country: z.string().default("France"),
  note: z.string().optional(),
  cgv: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les CGV" }) }),
  newsletter: z.boolean().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;

interface Props {
  onNext: (data: Step1Data) => void;
  defaultValues?: Partial<Step1Data>;
  onEmailCapture?: (email: string) => void;
  onPromoApplied?: (code: string, discount: number) => void;
  promoCode?: string;
  promoDiscount?: number;
}

const CheckoutStep1 = ({ onNext, defaultValues, onEmailCapture, onPromoApplied, promoCode = "", promoDiscount = 0 }: Props) => {
  const { item } = useCart();
  const [noteOpen, setNoteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      civility: undefined,
      country: "France",
      cgv: undefined as unknown as true,
      newsletter: false,
      ...defaultValues,
    },
  });

  const civility = watch("civility");

  if (!item) return null;

  return (
    <form onSubmit={handleSubmit(onNext)} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      {/* LEFT – Form */}
      <div className="space-y-8">
        {/* Coordonnées */}
        <div>
          <h3 className="font-serif text-xl mb-4">Vos coordonnées</h3>
          <div className="space-y-4">
            {/* Civilité */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Civilité</Label>
              <RadioGroup
                value={civility}
                onValueChange={(v) => setValue("civility", v as "M." | "Mme")}
                className="flex gap-4"
              >
                {["M.", "Mme"].map((c) => (
                  <label
                    key={c}
                    className={`flex items-center gap-2 border px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                      civility === c ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={c} />
                    {c}
                  </label>
                ))}
              </RadioGroup>
              {errors.civility && <p className="text-xs text-destructive mt-1">{errors.civility.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-xs text-muted-foreground">Prénom</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-xs text-muted-foreground">Nom</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (val && val.includes("@") && onEmailCapture) {
                    onEmailCapture(val);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">Votre confirmation de commande sera envoyée à cette adresse</p>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs text-muted-foreground">Téléphone mobile</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              <p className="text-xs text-muted-foreground mt-1">Pour le suivi de livraison</p>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="font-serif text-xl mb-4">Adresse de livraison</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-xs text-muted-foreground">Adresse</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <Label htmlFor="address2" className="text-xs text-muted-foreground">Adresse ligne 2 (optionnel)</Label>
              <Input id="address2" {...register("address2")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode" className="text-xs text-muted-foreground">Code postal</Label>
                <Input id="postalCode" maxLength={5} {...register("postalCode")} />
                {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="city" className="text-xs text-muted-foreground">Ville</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country" className="text-xs text-muted-foreground">Pays</Label>
              <Input id="country" {...register("country")} disabled />
            </div>
          </div>
        </div>

        {/* Note */}
        <Collapsible open={noteOpen} onOpenChange={setNoteOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${noteOpen ? "rotate-180" : ""}`} />
            Note pour la commande (optionnel)
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Textarea
              {...register("note")}
              placeholder="Instructions particulières, code d'accès..."
              rows={3}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={watch("cgv") === true}
              onCheckedChange={(v) => setValue("cgv", v === true ? true : undefined as unknown as true)}
              className="mt-0.5"
            />
            <span className="text-sm">
              J'ai lu et j'accepte les{" "}
              <a href="/conditions-generales-de-vente" target="_blank" className="text-primary story-link">
                conditions générales de vente
              </a>
            </span>
          </label>
          {errors.cgv && <p className="text-xs text-destructive">{errors.cgv.message}</p>}

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={watch("newsletter") === true}
              onCheckedChange={(v) => setValue("newsletter", v === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-muted-foreground">Recevoir les actualités et offres par email</span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full py-5 rounded-none tracking-[0.15em] uppercase text-sm font-medium h-auto"
        >
          Continuer vers la livraison →
        </Button>
      </div>

      {/* RIGHT – Summary */}
      <div className="hidden lg:block">
        <div className="sticky top-8">
          <OrderSummary item={item} promoCode={promoCode} promoDiscount={promoDiscount} onPromoApplied={onPromoApplied} />
        </div>
      </div>
    </form>
  );
};

export default CheckoutStep1;
