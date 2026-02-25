

# Integration Trustpilot — Avis en temps reel + Admin

## Probleme de securite important

L'API Trustpilot necessite une cle API qui ne doit **pas** etre exposee cote client (les variables `VITE_` sont visibles dans le bundle JS). La solution passe par une **Edge Function proxy** qui fait les appels a Trustpilot cote serveur.

---

## Architecture

```text
Frontend                     Edge Function                  Trustpilot API
   |                              |                              |
   | supabase.functions.invoke()  |                              |
   | "trustpilot-proxy"           |                              |
   +----------------------------->| fetch(api.trustpilot.com)    |
                                  +----------------------------->|
                                  |<-----------------------------+
   |<-----------------------------| JSON response                |
   | Cache localStorage 1h       |                              |
```

---

## Secrets Supabase a ajouter

2 nouveaux secrets :
- `TRUSTPILOT_API_KEY` — cle API Trustpilot
- `TRUSTPILOT_BUSINESS_UNIT_ID` — identifiant de l'entreprise Trustpilot

---

## Fichiers a creer

### 1. `supabase/functions/trustpilot-proxy/index.ts`

Edge Function qui recoit `{ action, params }` et proxifie vers l'API Trustpilot :
- `action: "summary"` — GET `/business-units/{BU_ID}` (score global, nombre d'avis, distribution)
- `action: "reviews"` — GET `/business-units/{BU_ID}/reviews` avec pagination, filtre par etoiles, tri
- Retourne le JSON tel quel au client
- Pas de JWT requis (`verify_jwt = false`) car lecture publique

### 2. `src/lib/trustpilot.ts`

Module utilitaire frontend :
- `fetchBusinessSummary()` — appelle l'Edge Function action `summary`, cache localStorage 1h
- `fetchReviews({ page, perPage, stars, orderBy })` — appelle action `reviews`, cache localStorage 1h
- `clearTrustpilotCache()` — vide le cache
- Gestion d'erreur avec fallback vers les temoignages statiques du ContentContext

### 3. `src/hooks/useTrustpilot.ts`

Hook React qui expose :
- `summary` (score, nombre, distribution) + `loading` + `error`
- `reviews` (liste paginee) + `loadMore()` + `filterByStars(n)`
- Chargement initial au mount avec cache localStorage

### 4. `src/components/TrustpilotReviews.tsx`

Composant front-end complet :

**Banniere sommaire** : logo Trustpilot SVG (vert officiel) + etoiles visuelles remplies + `"{score}/5 . {count} avis verifies"` + lien externe "Voir tous les avis"

**Grille d'avis** (3 colonnes desktop, 1 mobile) : chaque carte affiche les etoiles remplies, le titre en gras, le texte (3 lignes max + "Lire la suite"), avatar initiales + nom + date relative ("il y a 3 jours"), badge "Avis verifie"

**Barre de filtre** par etoiles : [Tous] [5 etoiles] [4 etoiles]

**Bouton "Voir plus d'avis"** pour pagination

**Skeleton** pendant le chargement, **fallback** vers les temoignages ContentContext en cas d'erreur API

### 5. `src/components/TrustpilotWidget.tsx`

Widget TrustBox officiel Trustpilot en fallback/complement — `div` avec les attributs `data-widget` charges par le script Trustpilot externe.

---

## Fichiers a modifier

### `src/pages/admin/AdminMarketingPage.tsx`

Remplacement du placeholder "Coming soon" par une page complete avec tabs :

**Tab "Avis Trustpilot"** :

1. **Carte sommaire** — score global + etoiles + nombre total + graphique de distribution en barres horizontales (5 etoiles = XX%, 4 etoiles = XX%, etc.)

2. **Tableau des avis** — colonnes : Note (etoiles), Titre, Auteur, Date, Actions (lien Trustpilot externe, toggle "Mettre en avant")

3. **Gestionnaire d'avis mis en avant** — liste des avis selectionnes (max 6), reordonnables par drag (fleches haut/bas), sauvegardes dans `site_content` sous la cle `featuredReviews`. Ces avis sont affiches en priorite dans les sections temoignages du front-end.

4. **Section invitation d'avis** — formulaire email (saisie manuelle ou selection depuis commandes "Livre"), envoie l'email `review_request` via l'Edge Function `send-order-email` existante. Historique des invitations envoyees.

### `src/contexts/ContentContext.tsx`

- Ajouter un type `FeaturedReview` (`{ trustpilotId, title, text, author, rating, date }`)
- Ajouter `featuredReviews: FeaturedReview[]` dans `HomepageContent`
- Ajouter `updateFeaturedReviews()` dans le contexte

### `src/components/home/TestimonialsSection.tsx`

- Si `featuredReviews` non vide dans le contenu **et** l'API Trustpilot echoue : afficher les avis mis en avant par l'admin
- Si l'API Trustpilot repond : afficher les avis Trustpilot reels avec la banniere sommaire
- Conserver le carousel existant comme fallback ultime (temoignages statiques ContentContext)

### `src/components/product/ProductTestimonialsSection.tsx`

- Remplacer les temoignages codes en dur par le composant `TrustpilotReviews`
- Ajouter le widget `TrustpilotWidget` en dessous

### `src/pages/Index.tsx`

- Aucun changement structurel — `TestimonialsSection` gere deja l'affichage

### `src/pages/ProductPage.tsx`

- Aucun changement structurel — `ProductTestimonialsSection` integrera le nouveau composant

### `supabase/config.toml`

- Ajouter la config pour `trustpilot-proxy` avec `verify_jwt = false`

### `index.html`

- Ajouter le script TrustBox Trustpilot : `<script src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>`

---

## Strategie de cache

Les donnees Trustpilot sont cachees dans `localStorage` avec un TTL de 1 heure :
- Cle `tp_summary` : sommaire entreprise
- Cle `tp_reviews_{page}_{stars}` : pages d'avis par filtre
- A chaque appel, on verifie le timestamp ; si expire, on refetch via l'Edge Function
- L'admin peut forcer un rafraichissement via un bouton "Actualiser" qui appelle `clearTrustpilotCache()`

---

## Cascade de fallback

```text
1. API Trustpilot (via Edge Function) → avis reels
2. Avis mis en avant par l'admin (featuredReviews dans site_content)
3. Temoignages statiques du ContentContext (carousel existant)
```

Cela garantit que la section temoignages affiche toujours du contenu, meme si l'API Trustpilot est indisponible ou pas encore configuree.

