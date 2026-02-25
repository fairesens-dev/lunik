

# Tunnel de Checkout Complet avec Stripe

## Prerequis : Activation de Stripe

Avant de coder quoi que ce soit, il faut activer l'integration Stripe sur le projet. Cela va :
- Vous demander votre cle secrete Stripe (sk_test_xxx)
- Configurer automatiquement les secrets Supabase
- Debloquer les outils et patterns d'integration specifiques a Stripe (Edge Functions, webhooks, etc.)

**Cette etape sera faite en premier lors de l'implementation.**

---

## Architecture Globale

```text
[Configurateur] --> "Commander" --> [/checkout]
     |                                  |
     v                                  v
  CartContext                   Step 1: Coordonnees
  (sessionStorage)              Step 2: Livraison
                                Step 3: Paiement (Stripe Elements)
                                        |
                                        v
                                Edge Function: create-checkout
                                (cree PaymentIntent Stripe)
                                        |
                                        v
                                [/merci?ref=SC-XXX]
                                        |
                                [/suivi] (lookup public)
```

---

## Schema de la base de donnees

### Modifications sur la table `orders`

Ajout de colonnes pour le checkout et le paiement :

| Colonne | Type | Description |
|---------|------|-------------|
| client_address | text | Adresse ligne 1 |
| client_address2 | text | Adresse ligne 2 (optionnel) |
| client_city | text | Ville |
| client_country | text | Pays (default 'France') |
| civility | text | M. ou Mme |
| delivery_option | text | 'standard' ou 'installation' |
| payment_method | text | 'card' ou '4x' |
| payment_status | text | 'pending', 'paid', 'failed' |
| stripe_payment_intent_id | text | ID du PaymentIntent Stripe |
| newsletter_optin | boolean | Opt-in marketing |

Ajout d'une RLS policy pour permettre le SELECT public par ref + email (suivi commande).

---

## Nouveaux fichiers

### 1. `src/contexts/CartContext.tsx`
- Stocke la configuration du store (produit, dimensions, couleurs, options, prix detaille)
- Persiste en `sessionStorage`
- `setItem()` appele depuis le configurateur au clic "Commander"
- `clearCart()` appele apres paiement reussi

### 2. `src/pages/CheckoutPage.tsx`
- Layout epure (pas de Header/Footer du site)
- Header custom : logo + "Commande securisee" + bouton Retour
- Barre de progression 3 etapes
- Redirection vers `/store-coffre` si panier vide
- Gere le state de l'etape courante (1, 2, 3)

### 3. `src/components/checkout/CheckoutStep1.tsx` -- Coordonnees
- Formulaire complet (civilite, nom, prenom, email, telephone, adresse, CP, ville, pays)
- Autocompletion code postal -> ville (basique, dictionnaire local)
- Section note collapsible
- Cases a cocher CGV (obligatoire) + newsletter (optionnel)
- Validation client-side avec zod + react-hook-form
- Colonne droite : resume commande sticky

### 4. `src/components/checkout/CheckoutStep2.tsx` -- Livraison
- 2 options radio card : Livraison standard (gratuite) / Livraison + Installation (sur devis)
- Date estimee calculee dynamiquement
- Timeline visuelle de fabrication
- Resume commande a droite

### 5. `src/components/checkout/CheckoutStep3.tsx` -- Paiement
- Choix CB comptant ou 4x sans frais (radio cards)
- Stripe Elements (CardElement) pour la saisie carte
- Simulation 4x : affichage du montant / 4 avec echeancier
- Badges de securite
- Bouton "Payer X euros" qui :
  1. Appelle l'Edge Function `create-checkout` pour creer un PaymentIntent
  2. Confirme le paiement avec `stripe.confirmCardPayment(clientSecret)`
  3. Insere la commande dans Supabase
  4. Redirige vers `/merci`

### 6. `src/components/checkout/OrderSummary.tsx`
- Composant reutilise dans les 3 etapes et la page merci
- Affiche produit, config, options, prix detaille, TVA, badges confiance

### 7. `supabase/functions/create-checkout/index.ts` -- Edge Function
- Recoit le montant et les details commande
- Cree un PaymentIntent Stripe cote serveur
- Retourne le `clientSecret` au frontend
- Gere aussi le mode 4x (metadata Stripe ou simulation)

### 8. `src/pages/ThankYouPage.tsx` -- /merci
- Animation checkmark CSS
- Reference commande, email de confirmation
- Resume commande (lecture seule)
- Timeline "Et maintenant ?" (email, appel, fabrication, livraison)
- Boutons retour accueil + suivi commande

### 9. `src/pages/OrderTrackingPage.tsx` -- /suivi
- Formulaire lookup : reference + email
- Requete Supabase sur `orders` filtree par ref et email
- Timeline verticale avec statut courant
- Barre de progression visuelle

---

## Modifications de fichiers existants

### `src/App.tsx`
- Ajout des routes `/checkout`, `/merci`, `/suivi`
- `/checkout` hors du Layout principal (pas de Header/Footer)
- `/merci` et `/suivi` dans le Layout ou avec layout custom
- Wrapping avec `CartProvider`

### `src/components/product/ConfiguratorSection.tsx`
- Le bouton "Commander ce store" appelle `setItem()` du CartContext puis `navigate('/checkout')`
- Supprime l'ouverture du OrderModal (remplace par le tunnel checkout)

### `src/pages/ProductPage.tsx`
- Supprime le state `orderOpen` et le composant `OrderModal`
- Le configurateur redirige directement vers `/checkout`

### `src/integrations/supabase/types.ts`
- Mis a jour automatiquement apres la migration SQL

---

## Flux de paiement detaille

1. Utilisateur remplit les 3 etapes du checkout
2. Au clic "Payer", le frontend appelle l'Edge Function `create-checkout`
3. L'Edge Function cree un `PaymentIntent` Stripe avec le montant en centimes
4. Le frontend recoit le `clientSecret` et appelle `stripe.confirmCardPayment()`
5. Si succes : INSERT dans `orders` avec `payment_status: 'paid'` + INSERT dans `leads`
6. Redirection vers `/merci?ref=SC-XXX`
7. Si echec : message d'erreur inline sous le formulaire carte

### Option 4x sans frais
- Pour le MVP : meme flow Stripe mais le montant affiche est divise par 4
- Le paiement reel est du montant total (simulation visuelle uniquement)
- Commentaire `// TODO: Replace with Alma API or Stripe installments` pour la production
- En production : utiliser Stripe Payment Intents avec `payment_method_options.card.installments` ou integrer Alma

---

## Section technique

- **Stripe Elements** : utilise `@stripe/react-stripe-js` avec `loadStripe(pk_test_xxx)`
- **Edge Function** : utilise le secret `STRIPE_SECRET_KEY` configure via l'outil Stripe
- **Validation** : schemas zod pour chaque etape du formulaire
- **Persistance panier** : `sessionStorage` pour eviter la perte au refresh mais nettoyer a la fermeture du navigateur
- **RLS suivi** : nouvelle policy SELECT sur `orders` avec condition `ref = $ref AND client_email = $email` via une fonction RPC Supabase (pour ne pas exposer toutes les commandes)
- **TVA** : calculee a 20% (`total / 1.2 * 0.2`)

