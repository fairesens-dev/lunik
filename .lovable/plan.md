
# Fonctionnalites e-commerce complementaires

Implementation de 7 fonctionnalites pour transformer le site en boutique mono-produit performante.

---

## Feature 1 -- Exit Intent Popup

### Fichier a creer : `src/components/ExitIntentPopup.tsx`

Composant qui detecte le depart de la souris par le haut du viewport (`document.addEventListener("mouseleave")` + `clientY < 5`).

**Conditions d'affichage :**
- L'utilisateur est sur `/store-coffre` (verifie via `useLocation`)
- Le configurateur a ete touche (width > 0 et projection > 0, passe en prop ou lu depuis CartContext)
- Le popup n'a pas deja ete montre (`sessionStorage.getItem("exit_popup_shown")`)

**Contenu :**
- Modale centree avec overlay sombre
- Gauche : `DynamicProductVisual` miniature avec la config courante
- Droite : titre Cormorant "Attendez ! Votre store est presque pret.", texte de recuperation, formulaire email
- Au submit : `captureEmail(email)` + appel `send-config-email` + fermeture + flag sessionStorage
- Lien secondaire "Commander des echantillons gratuits" vers `/echantillons`

### Fichier a modifier : `src/pages/ProductPage.tsx`

- Importer et rendre `ExitIntentPopup` en passant les donnees du configurateur (width, projection, toileColor, armatureColor, price)

---

## Feature 2 -- Contact Widget (click-to-call / mini formulaire)

### Fichier a creer : `src/components/ContactWidget.tsx`

Bouton flottant fixe en bas a droite (z-50), present sur toutes les pages publiques (integre dans `Layout.tsx`).

**Etat par defaut :** Bouton rond vert avec icone bulle + label "Besoin d'aide ?" au hover.

**Etat deploye (clic toggle) :** Mini carte 280px :
- En-tete : "Notre equipe vous repond" + indicateur en ligne (Lun-Ven 9h-18h base sur `new Date()`)
- Option 1 : "Nous appeler" — lien `tel:` avec le numero depuis `ContentContext`
- Option 2 : "Envoyer un message" — mini formulaire inline (nom + email + message), submit vers `contact_messages` dans Supabase
- Option 3 : "Rappel sous 30min" — input telephone, submit vers `contact_messages` avec sujet "Demande de rappel"

**Animations :** `framer-motion` pour le scale/fade du panneau.

### Fichier a modifier : `src/components/Layout.tsx`

- Ajouter `<ContactWidget />` apres `<Footer />`

---

## Feature 3 -- Social Proof Toasts

### Fichier a creer : `src/components/SocialProofToast.tsx`

Composant qui affiche des notifications en bas a gauche sur la page produit.

**Logique :**
- Pool de 6+ messages statiques (noms/villes fictifs + messages dynamiques)
- Demarrage apres 30s sur la page
- Intervalle aleatoire 45-90s entre chaque toast
- Max 3 toasts par session (`sessionStorage` compteur)
- Ne s'affiche PAS pendant le checkout (`useLocation` pour verifier)
- Design : carte blanche, shadow-lg, slide-in depuis la gauche (framer-motion), barre de progression 5s, bouton fermer

### Fichier a modifier : `src/pages/ProductPage.tsx`

- Ajouter `<SocialProofToast />` dans le rendu

---

## Feature 4 -- SEO Meta + JSON-LD

### Dependance a installer : `react-helmet-async`

### Fichier a creer : `src/components/SEOMeta.tsx`

Composant wrapper qui utilise `<Helmet>` pour injecter :
- `<title>`, `<meta name="description">`, OpenGraph tags, Twitter Card tags
- Props : `title`, `description`, `image?`, `url?`, `type?`, `jsonLd?`

### Fichiers a modifier :

**`src/main.tsx`** — Envelopper `<App />` dans `<HelmetProvider>`

**`src/pages/Index.tsx`** — Ajouter `<SEOMeta>` avec titre/description statiques pour la homepage

**`src/pages/ProductPage.tsx`** — Ajouter `<SEOMeta>` dynamique base sur la configuration courante (width, projection, toileColor, price) + bloc JSON-LD `Product` avec `AggregateOffer` et `AggregateRating`

**`src/pages/ContactPage.tsx`**, **`src/pages/SAVPage.tsx`**, **`src/pages/CGVPage.tsx`**, **`src/pages/MentionsLegalesPage.tsx`** — Ajouter `<SEOMeta>` avec titre/description specifiques

---

## Feature 5 -- Page Echantillons

### Fichier a creer : `src/pages/EchantillonsPage.tsx`

Page formulaire propre :
- H1 Cormorant : "Commandez vos echantillons de toile gratuits"
- Sous-titre explicatif (livraison 48h, gratuit)
- Champs : prenom, nom, email, adresse, CP, ville
- Selecteur de couleurs multi-select (meme swatches que le configurateur, via `useConfiguratorSettings`, max 5 couleurs selectionnees)
- Textarea optionnel "Votre projet"
- Submit : insertion dans `leads` avec `message` contenant "ECHANTILLON: [couleurs selectionnees]" + envoi email confirmation via `send-config-email` adapte
- Page de confirmation inline

### Fichiers a modifier :

**`src/App.tsx`** — Ajouter route `/echantillons` dans le groupe Layout public

**`src/components/Footer.tsx`** — Ajouter lien "Echantillons gratuits" dans la navigation

**`src/components/Header.tsx`** — Ajouter lien dans la navigation si pertinent

**`src/pages/admin/AdminLeadsPage.tsx`** — Ajouter un filtre par type (tous / commande / configurateur / echantillons) base sur le contenu du champ `message` (prefixe "ECHANTILLON:")

### Schema SQL : Aucune migration necessaire

La table `leads` existante supporte deja tous les champs necessaires (`first_name`, `last_name`, `email`, `phone`, `postal_code`, `message`, `toile_color`, `options`). Le champ `message` servira a stocker le type + couleurs demandees. Le champ `options` stockera les labels des couleurs selectionnees.

---

## Feature 6 -- Cookie Banner RGPD

### Fichier a creer : `src/components/CookieBanner.tsx`

Banniere en bas de page (non modale), affichee si `localStorage.getItem("cookie_consent")` est null.

**Contenu :**
- Texte RGPD + 3 boutons : "Tout accepter" (primary), "Personnaliser" (outline), "Tout refuser" (ghost)
- Modale de personnalisation avec toggles :
  - Cookies essentiels (toujours actif, switch desactive)
  - Cookies analytiques (Google Analytics, Hotjar)
  - Cookies marketing (Facebook Pixel, Google Ads)
- Sauvegarde dans localStorage : `{ essential: true, analytics: true/false, marketing: true/false, date: ISO }`

### Fichier a creer : `src/pages/CookiesPage.tsx`

Page statique "Politique de cookies" avec les categories et explications.

### Fichiers a modifier :

**`src/components/Layout.tsx`** — Ajouter `<CookieBanner />` apres le ContactWidget

**`src/App.tsx`** — Ajouter route `/cookies` dans le groupe Layout public

**`src/components/Footer.tsx`** — Ajouter lien "Politique de cookies" dans la navigation + le bottom bar

---

## Feature 7 -- Generateur de factures PDF

### Dependances a installer : `jspdf`, `jspdf-autotable`

### Fichier a creer : `src/lib/generateInvoice.ts`

Fonction `generateInvoicePDF(order)` qui genere un PDF avec :
- En-tete : "FACTURE" + logo/nom entreprise
- Infos societe (nom, adresse, SIRET, TVA) a gauche
- Infos facture (numero, date, ref commande) a droite
- Bloc client (nom, adresse, email) sur fond ecru
- Tableau des lignes : designation, qte, prix HT, TVA 20%, total TTC
  - Ligne store de base
  - Lignes options (motorisation, LED, pack)
  - Ligne livraison gratuite
  - Si code promo : ligne de reduction
- Pied : sous-total HT, TVA 20%, total TTC
- Bas de page : methode de paiement, garantie, remerciement
- `doc.save(Facture-{ref}.pdf)`

### Fichier a modifier : `src/pages/admin/AdminOrderDetailPage.tsx`

- Ajouter un bouton "Telecharger la facture PDF" dans la barre d'actions sticky (a cote de "Imprimer")
- Au clic : appeler `generateInvoicePDF(order)` avec les donnees de la commande

---

## Resume des fichiers

| Fichier | Action |
|---------|--------|
| `src/components/ExitIntentPopup.tsx` | Creer |
| `src/components/ContactWidget.tsx` | Creer |
| `src/components/SocialProofToast.tsx` | Creer |
| `src/components/SEOMeta.tsx` | Creer |
| `src/components/CookieBanner.tsx` | Creer |
| `src/pages/EchantillonsPage.tsx` | Creer |
| `src/pages/CookiesPage.tsx` | Creer |
| `src/lib/generateInvoice.ts` | Creer |
| `src/main.tsx` | Modifier (HelmetProvider) |
| `src/App.tsx` | Modifier (2 routes) |
| `src/components/Layout.tsx` | Modifier (ContactWidget + CookieBanner) |
| `src/components/Footer.tsx` | Modifier (liens echantillons + cookies) |
| `src/pages/Index.tsx` | Modifier (SEOMeta) |
| `src/pages/ProductPage.tsx` | Modifier (SEOMeta + ExitIntent + SocialProof) |
| `src/pages/ContactPage.tsx` | Modifier (SEOMeta) |
| `src/pages/SAVPage.tsx` | Modifier (SEOMeta) |
| `src/pages/CGVPage.tsx` | Modifier (SEOMeta) |
| `src/pages/MentionsLegalesPage.tsx` | Modifier (SEOMeta) |
| `src/pages/admin/AdminOrderDetailPage.tsx` | Modifier (bouton facture) |
| `src/pages/admin/AdminLeadsPage.tsx` | Modifier (filtre echantillons) |

### Dependances a installer
- `react-helmet-async`
- `jspdf`
- `jspdf-autotable`
