

# Plan : Refonte Leads & Clients dans l'admin

## Résumé

1. **Renommer "Contacts" en "Clients"** : afficher uniquement les contacts qui ont au moins une commande (jointure par email avec `orders`).
2. **Refondre la page Leads** pour agréger 3 sources : leads (configurateur/devis), demandes de rappel (callback via `activities`), paniers abandonnés (`abandoned_carts`), et demandes SAV (`activities` type `sav_request`).
3. **Supprimer la page Paniers abandonnés** (`/admin/paniers-abandonnes`) et son entrée dans le menu.
4. **Ajouter la demande de rappel aux leads** : modifier l'edge function `widget-save` pour insérer aussi dans la table `leads` lors d'un callback.
5. **Ajouter les demandes SAV aux leads** : modifier `widget-save` pour insérer aussi dans `leads` lors d'une demande SAV.
6. **Colonne "Type" dans le tableau Leads** avec badges colorés : Configurateur, Devis, Rappel, Panier abandonné, SAV.
7. **Modal "Détails"** : bouton d'action ouvrant une dialog avec toutes les infos du lead. Si l'email correspond à un client (commande existante), afficher la liste des commandes avec lien vers `/admin/commandes/:orderId`.

## Détails techniques

### 1. Edge function `widget-save` — actions `callback` et `sav`

Ajouter un `INSERT` dans la table `leads` :
- **Callback** : `first_name`, `phone`, `email` (généré), `message: "RAPPEL"`, `processed: false`
- **SAV** : `first_name` (depuis email), `email`, `phone`, `message: "SAV:{category}"`, `processed: false`, `width/projection: 0`

### 2. AdminLeadsPage — refonte complète

- **Chargement** : fetch `leads` + `abandoned_carts` (non convertis, avec email). Mapper les paniers abandonnés en objets Lead unifiés avec `type: "panier_abandonné"`.
- **Typage des leads existants** :
  - `message` commence par "RAPPEL" → type "Rappel"
  - `message` commence par "SAV:" → type "SAV"  
  - `message` commence par "ECHANTILLON:" → type "Échantillon"
  - `message === "DEVIS_EMAIL"` → type "Devis"
  - `width > 0` → type "Configurateur"
  - sinon → "Autre"
- **Filtre "Type"** : Tous, Configurateur, Devis, Rappel, Panier abandonné, SAV
- **Colonne "Type"** dans le tableau avec Badge coloré
- **Bouton "Détails"** → ouvre une Dialog montrant toutes les infos du lead
- **Dans la modal** : requête `orders` par email. Si trouvé → afficher liste des commandes avec lien cliquable

### 3. AdminContactsPage → AdminClientsPage

- Renommer en "Clients" dans la sidebar et le routeur
- Filtrer : ne garder que les contacts dont l'email existe dans `orders` (fetch `orders` distinct emails, puis filtrer)
- Supprimer les filtres de statut CRM inutiles, garder la recherche

### 4. Navigation (AdminLayout.tsx)

- Supprimer l'entrée "Paniers abandonnés"
- Renommer "Contacts" → "Clients"
- Mettre à jour `routeTitles`

### 5. App.tsx — Routes

- Supprimer la route `/admin/paniers-abandonnes`
- Supprimer l'import de `AdminAbandonedCartsPage`
- Route `/admin/contacts` reste mais pointe vers la page renommée

### Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `supabase/functions/widget-save/index.ts` | Ajouter insert leads pour callback + SAV |
| `src/pages/admin/AdminLeadsPage.tsx` | Refonte complète (3 sources, type, modal détails) |
| `src/pages/admin/AdminContactsPage.tsx` | Filtrer par clients uniquement, renommer |
| `src/components/admin/AdminLayout.tsx` | MAJ navigation |
| `src/App.tsx` | Supprimer route paniers abandonnés |

