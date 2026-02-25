import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width: number;
  projection: number;
  toileColor: string;
  armatureColor: string;
  optionsSummary: string;
  price: number;
}

const OrderModal = ({ open, onOpenChange, width, projection, toileColor, armatureColor, optionsSummary, price }: OrderModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", codePostal: "", message: "" });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setSubmitted(false);
      setForm({ prenom: "", nom: "", email: "", telephone: "", codePostal: "", message: "" });
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-2xl mb-2">Merci {form.prenom} !</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Votre demande a bien été reçue. Notre équipe vous contacte sous 24h pour confirmer votre commande et vous communiquer les modalités de paiement.
            </p>
            <Button onClick={() => handleClose(false)} variant="outline" className="rounded-none">Fermer</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Finalisez votre commande</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-2">
                Store Coffre — {width} × {projection} cm · Toile : {toileColor} · Armature : {armatureColor} · Options : {optionsSummary} · Total : {price.toLocaleString("fr-FR")} €
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Prénom" required value={form.prenom} onChange={e => update("prenom", e.target.value)} />
                <Input placeholder="Nom" required value={form.nom} onChange={e => update("nom", e.target.value)} />
              </div>
              <Input type="email" placeholder="Email" required value={form.email} onChange={e => update("email", e.target.value)} />
              <Input type="tel" placeholder="Téléphone" required value={form.telephone} onChange={e => update("telephone", e.target.value)} />
              <Input placeholder="Code postal" required value={form.codePostal} onChange={e => update("codePostal", e.target.value)} />
              <Textarea placeholder="Un message ou une question ? (optionnel)" value={form.message} onChange={e => update("message", e.target.value)} />
              <Button type="submit" className="w-full bg-primary text-primary-foreground py-5 rounded-none tracking-[0.15em] uppercase text-sm font-medium h-auto">
                Envoyer ma commande
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                🔒 Vos données sont protégées. Aucun paiement à cette étape. Vous serez recontacté sous 24h pour confirmer votre commande.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
