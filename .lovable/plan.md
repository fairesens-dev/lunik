

# Systeme de recuperation de paniers abandonnes

## Architecture

Le systeme repose sur une table Supabase `abandoned_carts` (et non localStorage seul) pour permettre le suivi admin, les relances automatiques et les statistiques fiables. Le localStorage sert uniquement de cache cote client pour la restauration instantanee.

```text
Client (localStorage)          Supabase DB                  Edge Function (cron)
     |                              |                              |
     | captureEmail()               |                              |
     +---> upsert abandoned_carts --+                              |
     |                              |                              |
     |                              | process-abandoned-carts      |
     |                              |<-----------------------------+
     |                              | (toutes les heures)          |
     |                              | T+1h: email 1                |
     |                              | T+24h: email 2               |
     |                              | T+72h: email 3               |
```

---

## Migration SQL

Nouvelle table `abandoned_carts` :

- `id` uuid PK
- `session_id` text (identifiant unique de session)
- `email` text (nullable, rempli quand capture)
- `cart_data` jsonb (snapshot complet CartItem)
- `abandonment_stage` text ("configurateur" | "checkout_step_1" | "checkout_step_2" | "checkout_step_3")
- `touch_count` integer default 0 (0, 1, 2, 3)
- `last_email_sent_at` timestamptz nullable
- `converted` boolean default false
- `converted_order_id` uuid nullable (FK vers orders)
- `promo_code_used` text nullable
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

RLS : public INSERT/UPDATE (par session_id), authenticated SELECT/UPDATE/DELETE.

Nouvelle table `promo_codes` :

- `id` uuid PK
- `code` text unique (uppercase)
- `type` text ("percent" | "fixed")
- `value` numeric
- `valid_from` timestamptz
- `valid_until` timestamptz
- `max_uses` integer nullable (null = illimite)
- `current_uses` integer default 0
- `first_purchase_only` boolean default false
- `active` boolean default true
- `created_at` timestamptz default now()

RLS : public SELECT (codes actifs seulement), authenticated full CRUD.

Ajout colonne `promo_code` text et `promo_discount` integer dans la table `orders`.

---

## Fichiers a creer

### 1. `src/hooks/useCartAbandonment.ts`

Hook qui :
- Genere/recupere un `session_id` dans localStorage
- Sauvegarde un snapshot du panier dans localStorage + upsert dans `abandoned_carts` a chaque changement de cart (debounce 2s)
- `captureEmail(email)` : met a jour le snapshot avec l'email, upsert en base
- `setStage(stage)` : met a jour l'etape d'abandon (configurateur, checkout_step_1, etc.)
- `restoreCart()` : recupere le snapshot depuis localStorage
- `markConverted(orderId)` : marque le panier comme converti

### 2. `supabase/functions/process-abandoned-carts/index.ts`

Edge Function cron (toutes les heures) qui :
1. Requete : `abandoned_carts WHERE email IS NOT NULL AND converted = false AND touch_count < 3`
2. Pour chaque panier :
   - Si `touch_count = 0` et `updated_at < now() - 1h` : envoie email 1 (sujet: "Votre store sur-mesure vous attend")
   - Si `touch_count = 1` et `last_email_sent_at < now() - 24h` : envoie email 2 (sujet: "Des questions sur votre store ?")
   - Si `touch_count = 2` et `last_email_sent_at < now() - 72h` : envoie email 3 (sujet: "Derniere chance - votre configuration expire") avec code promo optionnel
3. Utilise Resend directement (pas via send-order-email, car pas d'orderId)
4. Met a jour `touch_count` et `last_email_sent_at`

### 3. `src/pages/admin/AdminAbandonedCartsPage.tsx`

Page admin complete avec :

**Stats en haut** : 4 cartes (paniers ce mois, valeur estimee, taux de recuperation, CA recupere) calculees depuis la table `abandoned_carts` + `orders`.

**Filtres** : [Tous] [Non convertis] [Configurateur] [Checkout] + filtre par nombre d'emails envoyes (0/1/2/3).

**Tableau** : colonnes Email, Configuration (resume), Valeur, Etape d'abandon, Emails envoyes (badge 0/3), Dernier contact, Converti (badge), Actions.

**Actions par ligne** :
- Relancer manuellement (envoie le prochain email de la sequence)
- Voir la configuration (dialog modal avec details)
- Marquer converti manuellement
- Supprimer

**Actions groupees** : selection multiple + "Envoyer relance groupee".

### 4. `src/components/product/SaveConfigCTA.tsx`

Composant affiche sous le configurateur quand l'utilisateur a configure dimensions + au moins une couleur :
- Champ email + bouton "Recevoir ma config"
- Au submit : `captureEmail(email)` + envoie un email "config sauvegardee" via une nouvelle Edge Function `send-config-email`
- Confirmation : "Configuration envoyee ! Retrouvez-la dans votre boite mail."

### 5. `supabase/functions/send-config-email/index.ts`

Edge Function legere qui envoie un email de recap de configuration (pas liee a une commande) avec un CTA "Reprendre ma configuration" pointant vers `/store-coffre?restore=true`.

---

## Fichiers a modifier

### `src/components/checkout/CheckoutStep1.tsx`

- Ajouter `onBlur` sur le champ email : appelle `captureEmail(emailValue)` si email valide
- Ajouter un champ "Code promo" collapsible en dessous de la note :
  - Input + bouton "Appliquer"
  - Validation via requete Supabase (`promo_codes WHERE code = X AND active = true AND valid_from <= now AND valid_until >= now AND (max_uses IS NULL OR current_uses < max_uses)`)
  - Si valide : badge vert + prix barre + nouveau total
  - Si invalide : message d'erreur rouge
- Le code promo valide est passe a `onNext` (ajout au type `Step1Data`)

### `src/components/checkout/OrderSummary.tsx`

- Ajouter props `promoCode` et `promoDiscount` optionnels
- Si present : afficher une ligne "Code promo REVIENS10" avec la reduction, prix total barre + nouveau total

### `src/pages/CheckoutPage.tsx`

- Integrer `useCartAbandonment` : appeler `setStage("checkout_step_1")` au mount, `setStage("checkout_step_2")` au step 2, etc.
- Passer le code promo valide a travers les etapes jusqu'a `CheckoutStep3`

### `src/components/checkout/CheckoutStep3.tsx`

- Ajouter le code promo dans les donnees envoyees a `create-checkout`

### `src/contexts/CartContext.tsx`

- Changer `sessionStorage` en `localStorage` pour persister le panier entre les sessions (essentiel pour le recovery)

### `src/pages/ProductPage.tsx`

- Ajouter `useCartAbandonment` : appeler `setStage("configurateur")` au mount
- Gerer le parametre URL `?restore=true` pour restaurer le panier depuis le snapshot
- Ajouter `SaveConfigCTA` sous le configurateur

### `src/components/product/ConfiguratorSection.tsx`

- Ajouter le composant `SaveConfigCTA` en fin de section

### `src/pages/admin/AdminMarketingPage.tsx`

- Ajouter un tab "Codes promo" avec :
  - Liste des codes existants (tableau)
  - Formulaire de creation : code (auto-uppercase), type (% ou euro fixe), valeur, dates de validite, max utilisations, premier achat uniquement
  - Toggle actif/inactif
  - Statistiques d'utilisation par code

### `src/App.tsx`

- Ajouter la route `/admin/paniers-abandonnes` vers `AdminAbandonedCartsPage`

### `src/components/admin/AdminLayout.tsx`

- Ajouter "Paniers abandonnes" dans le groupe PRINCIPAL du menu, sous "Commandes", avec l'icone `ShoppingCart`

### `supabase/config.toml`

- Ajouter les configs pour `process-abandoned-carts` et `send-config-email` avec `verify_jwt = false`

### `supabase/functions/create-checkout/index.ts`

- Ajouter la logique de code promo : valider le code, calculer la reduction, stocker `promo_code` et `promo_discount` dans l'order, incrementer `current_uses`
- Au succes de l'insertion : marquer le `abandoned_cart` correspondant comme `converted = true`

### `supabase/functions/send-order-email/index.ts`

- Ajouter 2 nouveaux templates pour les emails 2 et 3 de la sequence d'abandon :
  - `abandoned_cart_followup` : "Des questions sur votre store ?" avec objection-handling
  - `abandoned_cart_final` : "Derniere chance" avec urgence + code promo optionnel
- Modifier `abandonedCartTemplate` pour accepter un lien de restauration avec `?restore=true`

---

## Cron schedule

Le cron `process-abandoned-carts` tourne toutes les heures. Il est configure via `pg_cron` dans une migration SQL :

```sql
SELECT cron.schedule(
  'process-abandoned-carts',
  '0 * * * *',
  $$SELECT net.http_post(
    url := 'https://gejgtkgqyzdfbsbxujgl.supabase.co/functions/v1/process-abandoned-carts',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('supabase.service_role_key'))
  )$$
);
```

---

## Resume des modifications

| Fichier | Action |
|---------|--------|
| Migration SQL | Creer tables `abandoned_carts`, `promo_codes` + colonnes orders + cron |
| `src/hooks/useCartAbandonment.ts` | Creer — hook de tracking client |
| `src/components/product/SaveConfigCTA.tsx` | Creer — CTA email sur configurateur |
| `src/pages/admin/AdminAbandonedCartsPage.tsx` | Creer — page admin paniers abandonnes |
| `supabase/functions/process-abandoned-carts/index.ts` | Creer — cron de relance automatique |
| `supabase/functions/send-config-email/index.ts` | Creer — email recap configuration |
| `src/contexts/CartContext.tsx` | Modifier — passer a localStorage |
| `src/components/checkout/CheckoutStep1.tsx` | Modifier — capture email + champ promo |
| `src/components/checkout/OrderSummary.tsx` | Modifier — affichage reduction promo |
| `src/pages/CheckoutPage.tsx` | Modifier — tracking etapes + promo |
| `src/pages/ProductPage.tsx` | Modifier — restore + SaveConfigCTA |
| `src/components/product/ConfiguratorSection.tsx` | Modifier — integrer SaveConfigCTA |
| `src/pages/admin/AdminMarketingPage.tsx` | Modifier — ajouter tab codes promo |
| `src/App.tsx` | Modifier — ajouter route admin |
| `src/components/admin/AdminLayout.tsx` | Modifier — ajouter lien sidebar |
| `supabase/config.toml` | Modifier — ajouter 2 edge functions |
| `supabase/functions/create-checkout/index.ts` | Modifier — validation promo + mark converted |
| `supabase/functions/send-order-email/index.ts` | Modifier — templates emails 2 et 3 |

