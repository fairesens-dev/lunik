

# Systeme d'emails transactionnels avec Resend

## Prerequis

Le secret **RESEND_API_KEY** doit etre configure sur le projet Supabase. Il sera demande a l'utilisateur avant de proceder.

L'utilisateur doit aussi avoir un domaine verifie sur [resend.com/domains](https://resend.com/domains) pour envoyer depuis une adresse personnalisee (sinon, Resend permet d'envoyer depuis `onboarding@resend.dev` en mode test).

---

## Architecture

```text
Frontend (Admin)                    Edge Function
     |                                  |
     | supabase.functions.invoke()      |
     |  "send-order-email"              |
     +--------------------------------->|
                                        | Resend API
                                        +---------> Email envoye
                                        |
                                        | Supabase (update emails_sent)
                                        +---------> orders table
```

Tous les emails passent par une **seule Edge Function** `send-order-email` qui recoit le type d'email et les donnees de commande, selectionne le bon template, et envoie via Resend.

---

## Schema de base de donnees

### Migration sur la table `orders`

Ajout d'une colonne pour tracker les emails envoyes :

| Colonne | Type | Description |
|---------|------|-------------|
| emails_sent | jsonb | Array d'objets `{type, sent_at, resend_id}` |

Valeur par defaut : `'[]'::jsonb`

---

## Fichiers a creer

### 1. `supabase/functions/send-order-email/index.ts`

Edge Function unique qui :
- Recoit `{ type, orderId }` dans le body
- Charge la commande depuis Supabase (via service role key)
- Selectionne le template HTML en fonction du `type` :
  - `confirmation` : confirmation de commande
  - `fabrication` : mise en fabrication
  - `shipped` : expedition avec tracking
  - `delivered` : livraison + demande d'avis
  - `review_request` : relance avis 7 jours apres
  - `cancellation` : annulation
  - `admin_new_order` : notification admin interne
- Genere le HTML avec les donnees de la commande
- Envoie via `Resend` (`npm:resend@2.0.0`)
- Met a jour la colonne `emails_sent` de la commande (append au tableau)
- Retourne `{ success: true, emailId }` ou `{ success: false, error }`

L'adresse d'expedition sera configurable via les secrets Supabase : `FROM_EMAIL` et `FROM_NAME`. Valeurs par defaut : `commandes@monstore.fr` / `Mon Store`.

Le `ADMIN_EMAIL` (secret) recoit les notifications admin.

### 2. Templates HTML (inline dans l'Edge Function)

Chaque template est une fonction TypeScript retournant un string HTML. Design :
- Max-width 600px, inline CSS uniquement
- Couleurs : header `#F5F0E8`, accent `#4A5E3A`, fond blanc
- Police : Georgia/serif pour les titres, Arial/Helvetica pour le corps
- Layout wrapper commun : header logo + footer contact/CGV/ref

**7 templates client + 1 admin :**

1. **Confirmation** — checkmark vert, recapitulatif complet, timeline prochaines etapes, CTA "Suivre ma commande"
2. **Fabrication** — icone usine, barre de progression visuelle, date estimee, rappel config, liens FAQ/SAV
3. **Expedition** — tracking box avec numero copiable, lien transporteur, adresse de livraison, conseils installation
4. **Livraison** — felicitations, ressources installation (guide PDF, video), carte de garantie 5 ans, etoiles Trustpilot
5. **Demande d'avis** — relance 7j, etoiles cliquables vers Trustpilot, section SAV si probleme
6. **Annulation** — confirmation annulation, info remboursement 5-10 jours, invitation a reconfigurer
7. **Panier abandonne** — rappel config, urgence prix, objections (questions/echantillons/4x), CTA reprendre
8. **Admin new order** — format compact interne, lien direct vers `/admin/commandes/{id}`

---

## Fichiers a modifier

### `supabase/config.toml`
Ajout de la config pour la nouvelle fonction :
```toml
[functions.send-order-email]
verify_jwt = false
```

### `src/pages/admin/AdminOrderDetailPage.tsx`

**Modifications majeures :**

1. **`handleUpdateStatus`** — apres mise a jour du statut, appelle automatiquement l'Edge Function pour les statuts qui declenchent un email :
   - `En fabrication` → envoie template `fabrication`
   - `Expedie` → envoie template `shipped`
   - `Livre` → envoie template `delivered`
   - `Annule` → envoie template `cancellation`

2. **Card "Emails envoyes"** — remplace le placeholder `sent = false` par une lecture du champ `emails_sent` de la commande. Affiche la date d'envoi pour chaque type d'email. Les boutons "Renvoyer" appellent l'Edge Function pour renvoyer l'email.

3. **Card "Actions rapides"** — les boutons placeholder deviennent fonctionnels :
   - "Envoyer confirmation" → appelle `send-order-email` type `confirmation`
   - "Notifier fabrication" → appelle type `fabrication`
   - "Envoyer tracking" → appelle type `shipped`
   - "Demander avis" → appelle type `review_request`

4. Ajout d'un etat `sendingEmail` pour afficher un spinner pendant l'envoi.

### `supabase/functions/create-checkout/index.ts`

Apres l'insertion de la commande (ligne 72-83), ajouter un appel interne a `send-order-email` pour :
- Envoyer l'email de confirmation au client
- Envoyer la notification admin

Cela se fait via un `fetch` interne vers l'Edge Function `send-order-email` avec le service role key.

---

## Secrets a configurer

3 nouveaux secrets Supabase :
1. `RESEND_API_KEY` — cle API Resend (obligatoire, sera demandee a l'utilisateur)
2. `FROM_EMAIL` — adresse d'expedition (ex: `commandes@monstore.fr`)
3. `ADMIN_EMAIL` — adresse admin pour les notifications (ex: `dev@frenchify.fr`)

---

## Flux detaille

### A la creation de commande (checkout)
1. `create-checkout` insere la commande
2. Appelle `send-order-email` type `confirmation` + `admin_new_order`
3. L'email de confirmation part immediatement au client
4. L'admin recoit une notification

### Depuis la page admin detail
1. Admin change le statut → `handleUpdateStatus` sauvegarde en base
2. Appel automatique a `send-order-email` avec le type correspondant
3. Le champ `emails_sent` est mis a jour
4. La card "Emails envoyes" se rafraichit pour montrer l'email envoye

### Emails manuels (actions rapides)
1. Admin clique "Envoyer confirmation" / "Renvoyer"
2. Appel a `send-order-email`
3. Toast de confirmation avec le resultat

---

## Notes techniques

- L'Edge Function utilise `npm:resend@2.0.0` (import Deno compatible)
- Pas d'import depuis `src/` dans l'Edge Function (pas dans le contexte Deno)
- Le panier abandonne est un placeholder template — le declenchement automatique (cron job) sera implemente dans un sprint ulterieur
- Les liens dans les emails pointent vers le domaine publie (`https://lunik.lovable.app`)
- Le champ `emails_sent` permet d'eviter les doublons et d'afficher l'historique dans l'admin

