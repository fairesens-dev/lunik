

# Plan : Paiement par chèque et virement + Paramètres admin

## Résumé

Ajouter deux nouveaux moyens de paiement (chèque et virement bancaire) au checkout, avec gestion on/off et instructions personnalisables depuis l'admin.

## Fonctionnement

### Checkout (étape 3)
- Trois options de paiement sélectionnables : CB (existant), Virement, Chèque
- Quand l'utilisateur choisit **Virement** ou **Chèque** :
  - Pas de redirection Stripe — la commande est insérée directement en base avec `payment_status: "awaiting_transfer"` ou `"awaiting_check"`
  - Un écran de confirmation affiche les instructions de paiement (IBAN/ordre du chèque/adresse) configurées dans l'admin
  - Redirection vers `/merci` avec les infos
- Les options n'apparaissent que si elles sont activées dans l'admin

### Admin — Nouvel onglet "Paiement" dans Paramètres
- Ajout d'un 6ème onglet `Paiement` dans `AdminSettingsPage.tsx`
- Contenu :
  - **CB** : toggle activé/désactivé (activé par défaut)
  - **Virement** : toggle + champs IBAN, BIC, titulaire du compte, banque, texte d'instructions personnalisé
  - **Chèque** : toggle + champs ordre du chèque, adresse d'envoi, texte d'instructions personnalisé
- Données stockées dans `admin_settings` avec clé `"payment_methods"`

### Edge function `create-checkout`
- Mise à jour pour gérer `paymentMethod === "transfer"` ou `"check"` :
  - Insère la commande + lead directement (pas de session Stripe)
  - Envoie les emails de confirmation
  - Retourne `{ redirect: "/merci", ref, instructions }` au lieu d'une URL Stripe

## Fichiers à modifier/créer

| Fichier | Changement |
|---------|-----------|
| `src/pages/admin/AdminSettingsPage.tsx` | Ajouter onglet "Paiement" avec toggles + champs instructions virement/chèque |
| `src/components/checkout/CheckoutStep3.tsx` | Ajouter sélection virement/chèque, charger les settings, gérer soumission sans Stripe |
| `supabase/functions/create-checkout/index.ts` | Gérer `paymentMethod` "transfer"/"check" sans Stripe |

## Détails techniques

### Structure des settings `payment_methods`
```json
{
  "card": { "enabled": true },
  "transfer": {
    "enabled": false,
    "iban": "FR76 ...",
    "bic": "BNPAFRPP",
    "accountHolder": "SAS LuniK",
    "bank": "BNP Paribas",
    "instructions": "Effectuez votre virement en indiquant la référence de commande..."
  },
  "check": {
    "enabled": false,
    "orderTo": "SAS LuniK",
    "sendAddress": "123 rue ..., 75001 Paris",
    "instructions": "Envoyez votre chèque à l'ordre de..."
  }
}
```

### Checkout — chargement des settings
Le composant `CheckoutStep3` charge `payment_methods` depuis `admin_settings` au mount pour savoir quelles options afficher. Pour virement/chèque, au lieu d'appeler `create-checkout`, il insère directement la commande via le edge function avec le `paymentMethod` correspondant.

