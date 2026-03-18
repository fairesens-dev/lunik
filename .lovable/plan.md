

# Plan : Page Admin "E-mails"

## 1. Migration Supabase — Table `email_templates`

Créer la table avec les 6 rows par défaut et RLS authentifié.

## 2. Navigation — `AdminLayout.tsx`

- Ajouter `{ to: "/admin/emails", icon: Mail, label: "E-mails" }` dans le groupe ANALYSE entre Campagnes et Scoring (utiliser une icône différente comme `MailOpen` ou `Inbox` puisque `Mail` est déjà utilisée pour Campagnes)
- Ajouter `"/admin/emails": "E-mails"` dans `routeTitles`

## 3. Routing — `App.tsx`

Ajouter l'import et la route `<Route path="/admin/emails" element={<AdminEmailsPage />} />` dans le groupe admin protégé.

## 4. Edge Function — `get-email-logs/index.ts`

- GET endpoint avec query params `page`, `limit`
- Appelle `GET https://api.resend.com/emails` avec `RESEND_API_KEY`
- Retourne les données formatées avec CORS headers
- Ajouter `[functions.get-email-logs] verify_jwt = false` dans `config.toml`

## 5. Page — `AdminEmailsPage.tsx`

Fichier unique (~800 lignes) avec 3 onglets via `Tabs` shadcn.

### Onglet "Templates"
- Grille responsive de 6 cards (emoji, nom, type technique, objet, badge "Actif", boutons Prévisualiser/Modifier)
- **Modal prévisualisation** : `Dialog` large (800px), iframe `srcDoc`, toggle Desktop/Mobile (600px/320px), bouton Copier HTML. Les données factices de démo servent à générer le HTML via des fonctions locales reproduisant la structure des templates de `send-order-email`
- **Panel d'édition** : `Dialog` avec formulaire (Input subject, Textarea intro, Input CTA, Textarea footer, Switch actif). Upsert dans `email_templates` via Supabase client. Bouton Réinitialiser (nullifie les overrides)

### Onglet "Activité"
- Fetch des données depuis `orders.emails_sent` (JSONB) via Supabase, flatmappé en lignes individuelles
- Enrichissement optionnel via `get-email-logs` edge function (statuts Resend)
- Table avec colonnes : Date, Destinataire, Type (badge coloré), Objet, Statut (badge), Réf. commande (lien)
- Filtres : type (select), statut (select), recherche texte, bouton rafraîchir
- Pagination client-side (20/page), tri par date desc
- TanStack Query pour le fetching

### Onglet "Paramètres"
- Champs : email d'expédition, nom d'expéditeur, reply-to — sauvegardés dans `admin_settings` clé `general`
- Test d'envoi : email + select template + bouton → invoque `send-order-email` avec un orderId de démo
- Statut Resend : invoque `get-email-logs` pour vérifier la connexion, affiche indicateur vert/rouge

## 6. Mise à jour `send-order-email/index.ts`

Ajouter un fetch de `email_templates` pour le type courant, et appliquer les overrides (subject, intro, CTA text, footer note) s'ils existent. Redéployer la fonction.

## Fichiers modifiés/créés

| Fichier | Action |
|---|---|
| `src/components/admin/AdminLayout.tsx` | Ajouter nav item + routeTitle |
| `src/App.tsx` | Ajouter import + route |
| `src/pages/admin/AdminEmailsPage.tsx` | Créer (page complète ~800 lignes) |
| `supabase/functions/get-email-logs/index.ts` | Créer |
| `supabase/config.toml` | Ajouter config get-email-logs |
| `supabase/functions/send-order-email/index.ts` | Ajouter lecture overrides email_templates |
| Migration SQL | Table email_templates |

