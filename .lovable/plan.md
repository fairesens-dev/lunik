

# Plan de refonte majeure du site LuniK

## 1. Supprimer la page Echantillons et toutes ses references

**Fichiers concernes :**
- Supprimer `src/pages/EchantillonsPage.tsx`
- `src/App.tsx` : retirer la route `/echantillons` et l'import
- `src/components/Header.tsx` : retirer le lien "Echantillons" du menu `navLinks`
- `src/components/Footer.tsx` : retirer le lien "Echantillons gratuits" de la navigation footer
- `src/components/product/ConfiguratorSection.tsx` (ligne 221) : retirer le lien "Commander des echantillons gratuits"
- `src/components/ExitIntentPopup.tsx` (ligne 149-155) : retirer le lien "Ou commander des echantillons gratuits"

---

## 2. Logo sur le login admin et dans l'admin

- `src/pages/admin/AdminLoginPage.tsx` : remplacer le texte `[BRAND] Admin` (ligne 114) par le logo noir (`logo-lunik.png`) avec `<img>` tag
- `src/components/admin/AdminLayout.tsx` : copier le logo blanc uploaded (`only-logo-LuniK-white-RGB.png`) vers `src/assets/logo-lunik-white.png`, puis remplacer le texte `[BRAND]` (ligne 72) par ce logo blanc dans la sidebar sombre

---

## 3. Administration des realisations clients dans /contenu

**Objectif :** Ajouter un onglet "Realisations" dans `AdminContentPage` pour gerer les images de la galerie avec une indication textuelle (ex: "Patrick, Strasbourg (67)").

**Modifications :**
- `src/contexts/ContentContext.tsx` :
  - Ajouter un type `GalleryItem { id, src, alt, caption, active }` (caption = ex: "Patrick, Strasbourg (67)")
  - Ajouter `galleryItems: GalleryItem[]` dans `HomepageContent`
  - Ajouter `updateGalleryItems` dans le contexte
- `src/pages/admin/AdminContentPage.tsx` : ajouter un onglet "Realisations" avec upload d'image, champ caption, toggle actif/inactif, reorder
- `src/components/home/GallerySection.tsx` : lire `content.homepage.galleryItems` au lieu de la liste hardcodee, afficher le caption sous chaque image

---

## 4. Corriger la banniere promo (positionnement)

**Probleme :** La banniere promo (`PromoBanner`) se superpose au header fixe car elle est en-dessus dans le DOM mais le header est `fixed top-0`.

**Solution dans `src/components/Layout.tsx` :**
- Ajouter un padding-top dynamique au `<main>` qui tient compte de la banniere promo active
- Ou rendre la banniere `fixed` aussi, au-dessus du header, et decaler le `pt-20` du main a `pt-[calc(5rem+bannerHeight)]`
- Approche retenue : Placer la PromoBanner en `fixed top-0` et decaler le header a `top-[40px]` quand la banniere est active. Ajuster le padding-top du main en consequence.

---

## 5. Fusionner page produit et page d'accueil en une landing page unique

**Objectif :** Supprimer la route `/store-coffre` separee et creer une landing page unique efficace.

**Nouvelle structure de la page d'accueil (`Index.tsx`) :**
1. HeroSection (existant, conserve)
2. MarqueeSection (existant)
3. ProductHighlightSection avec features (fusionne depuis ProductFeaturesSection)
4. ValuesSection (existant)
5. **ConfiguratorSection** (integre directement, plus besoin d'aller sur /store-coffre)
6. GallerySection (existant, maintenant dynamique via admin)
7. TestimonialsSection (existant)
8. ProcessSection (existant)
9. ProductWarrantySection (recupere de la page produit)
10. FAQSection (existant)
11. ContactCTASection (existant)
12. ExitIntentPopup + SocialProofToast (recuperes)

**Fichiers :**
- `src/pages/Index.tsx` : refondre en integrant le configurateur et les sections produit
- `src/App.tsx` : rediriger `/store-coffre` vers `/` (avec anchor `#configurator`)
- Supprimer `src/pages/ProductPage.tsx` (ou le garder comme redirect)
- `src/components/Header.tsx` : retirer "Notre Store" des navLinks, mettre le CTA vers `/#configurator`
- `src/components/Footer.tsx` : mettre a jour les liens
- `src/pages/admin/AdminContentPage.tsx` : fusionner les onglets Homepage et Product en un seul, supprimer l'onglet "Page produit" separe
- `src/pages/CheckoutPage.tsx` : rediriger vers `/` au lieu de `/store-coffre` si pas d'item

---

## 6. Uniformiser les selecteurs de couleurs toile (style rectangle)

**Actuellement :** Les couleurs de toile s'affichent en ronds, les armatures en rectangles.

**Modification dans `src/components/product/ConfiguratorSection.tsx` :**
- Remplacer les cercles (`w-11 h-11 rounded-full`) pour les toiles (lignes 205-219) par le meme style rectangle que les armatures (lignes 228-253) : rectangle `w-20 h-8` avec check icon et label texte en dessous
- Adapter le grid pour accommoder les rectangles (moins de colonnes)
- Dans l'admin configurateur (`AdminConfiguratorPage.tsx`), uniformiser egalement le swatch en rectangle pour les couleurs de toile (swatchType "rectangle" au lieu de "circle")

---

## 7. Mettre en avant le Pack Connect + options marketing

**Dans `src/components/product/ConfiguratorSection.tsx` :**
- Pour le Pack Connect : ajouter un bandeau "BEST SELLER" ou "MEILLEURE OFFRE", afficher l'economie realisee de maniere proeminente
- Pour l'option LED : ajouter un mini-temoignage style : *"L'eclairage LED a transforme nos soirees d'ete !" — Marie, Lyon*
- Pour la Motorisation : ajouter un tip marketing : *"95% de nos clients choisissent la motorisation"*
- Rendre les cartes d'options plus visuelles avec un design plus attrayant (bordure coloree, icone plus grande, badges)

---

## 8. Popup exit-intent : afficher le prix en 4x sans frais

**Dans `src/components/ExitIntentPopup.tsx` :**
- Sous le prix affiche (`{price} euro`), ajouter une ligne : `ou {Math.round(price/4)} euro/mois en 4x sans frais`
- Meme chose dans le configurateur si ce n'est pas deja le cas (c'est deja fait via `installmentPrice`)

---

## 9. Checkout : corrections

**Dans `src/components/checkout/CheckoutStep2.tsx` :**
- Supprimer la timeline/statuts de commande (lignes 83-91) : les 4 etapes "Commande validee", "Fabrication", etc.

**Dans `src/components/checkout/CheckoutStep3.tsx` :**
- Rendre le bouton "PAYER ... MAINTENANT" responsive : sur mobile, reduire le texte ou passer le montant sur une 2e ligne. Utiliser `text-xs sm:text-sm` et adapter le contenu pour les petits ecrans. Potentiellement afficher un texte plus court sur mobile ("Payer {total} euro") sans le detail de l'echeance.

---

## Resume technique

| Tache | Fichiers principaux |
|---|---|
| Supprimer echantillons | App.tsx, Header, Footer, ConfiguratorSection, ExitIntentPopup, EchantillonsPage |
| Logo admin | AdminLoginPage, AdminLayout + copie logo blanc |
| Admin realisations | ContentContext, AdminContentPage, GallerySection |
| Banniere promo | Layout, PromoBanner, Header |
| Landing page unique | Index, ProductPage, App.tsx, Header, Footer, AdminContentPage |
| Selecteurs couleurs rectangles | ConfiguratorSection, AdminConfiguratorPage |
| Options marketing | ConfiguratorSection |
| Popup 4x sans frais | ExitIntentPopup |
| Checkout fixes | CheckoutStep2, CheckoutStep3 |

