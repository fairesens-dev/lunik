

## Ajouter un champ "E-mail transactionnel" dans Paramètres du site

### Ce qui sera fait
Un nouveau champ e-mail sera ajouté dans la carte "Paramètres du site" de l'onglet Général (`/admin/parametres`). Cette adresse sera stockée dans `admin_settings` (clé `general`) et pourra être lue par les Edge Functions Resend comme adresse d'expédition.

### Modifications

**`src/pages/admin/AdminSettingsPage.tsx` — GeneralTab**
- Ajouter un state `transactionalEmail` initialisé depuis `loadSetting("general")`.
- Ajouter un champ `Input` type email dans la carte "Paramètres du site", avec le label "E-mail transactionnel" et un placeholder explicatif (ex: `notifications@votredomaine.fr`).
- Une description sous le champ : "Adresse d'expédition utilisée par Resend pour tous les e-mails transactionnels."
- Persister la valeur dans `saveSite()` aux côtés de `siteUrl`, `currency`, `timezone`.

**Edge Functions (`send-config-email`, `send-order-email`, `process-abandoned-carts`)**
- Actuellement ces fonctions lisent `FROM_EMAIL` depuis `Deno.env`. Aucune modification n'est nécessaire côté Edge Functions pour l'instant — le champ admin sert de référence visuelle et pourra être connecté ultérieurement via un appel Supabase dans les Edge Functions si souhaité.

### Impact
- Aucune migration DB nécessaire (utilise la table `admin_settings` existante, clé `general`).
- Changement limité à un seul fichier frontend.

