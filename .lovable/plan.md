

# Plan : Visuels éditables depuis l'admin avec galerie du bucket Website

## État actuel

**Images déjà éditables (champ URL texte) :**
- `highlightImage` — section "Chaque détail a été pensé"
- `valueCards[].image` — 6 cartes engagements
- `galleryItems[].src` — galerie réalisations (avec upload)
- `contactCTAImage` — fond du CTA contact

**Images hardcodées, NON éditables :**
- Hero : poster vidéo (`/images/store-vue-ensemble.webp`)
- Hero : vidéo (`/videos/hero-store.mp4`)
- ProductHeroSection : image droite (`/images/store-salon-apero.webp`)
- ProductGallerySection : 6 images hardcodées
- FabricSection : image toile (`/images/store-toile-detail.webp`)
- DynamicProductVisual : fallback

**Bucket "Website" :** ~79 photos "Store Coffre Rayy LUNIK", 7 photos "Toile DICKSON", ~30 photos "TOP PHOTOS/Store Coffre LUNIK" (les meilleures).

## Plan d'implémentation

### 1. Composant ImagePicker réutilisable
Créer `src/components/admin/ImagePicker.tsx` :
- Liste les fichiers du bucket "Website" via `supabase.storage.from("Website").list()`
- Affiche une grille de miniatures cliquable dans un Dialog
- Permet aussi l'upload d'une nouvelle image dans le bucket
- Retourne l'URL publique sélectionnée
- Affiche un aperçu de l'image actuelle

### 2. Nouveaux champs CMS dans ContentContext
Ajouter à `HomepageContent` :
- `heroPosterImage` (défaut : URL du bucket TOP PHOTOS)
- `heroVideoUrl` (défaut : `/videos/hero-store.mp4`)
- `fabricSectionImage` (défaut : URL bucket)

Ajouter à `ProductPageContent` :
- `heroImage` (défaut : URL bucket)
- `galleryItems` (même structure que homepage gallery)

### 3. Admin — Remplacer les champs URL texte par ImagePicker
Dans `AdminContentPage.tsx` / `TabHomepage` :
- Remplacer les `<Field>` d'URL image par `<ImagePicker>` pour : highlightImage, contactCTAImage, valueCards images, heroPosterImage, fabricSectionImage
- Ajouter section "Visuels Hero" avec picker pour poster + champ vidéo
- Ajouter section "Page produit" avec picker pour l'image hero produit

### 4. Mettre à jour les composants frontend
- `HeroSection.tsx` : lire `heroPosterImage` et `heroVideoUrl` depuis le CMS
- `ProductHeroSection.tsx` : lire `productPage.heroImage`
- `FabricSection.tsx` : lire `homepage.fabricSectionImage`
- `ProductGallerySection.tsx` : lire depuis CMS au lieu du tableau hardcodé
- `DynamicProductVisual.tsx` : utiliser le même `highlightImage` comme fallback

### 5. Pré-remplir avec les photos du bucket Website
Utiliser les images du dossier "TOP PHOTOS" comme valeurs par défaut :
- Hero poster → TOP PHOTOS/Store Coffre LUNIK (2).jpg (vue d'ensemble)
- Highlight section → TOP PHOTOS/Store Coffre LUNIK (3).jpg (détail produit)
- Value cards → 6 photos variées des TOP PHOTOS
- Contact CTA → TOP PHOTOS/Store Coffre LUNIK (25).jpg (ambiance terrasse)
- Product hero → TOP PHOTOS/Store Coffre LUNIK (4).jpg
- Fabric section → Toile DICKSON - COLORIS (1).jpg
- Gallery réalisations → 6 photos variées du bucket

## Fichiers à modifier/créer

| Fichier | Action |
|---------|--------|
| `src/components/admin/ImagePicker.tsx` | **Créer** — composant de sélection d'image depuis le bucket |
| `src/contexts/ContentContext.tsx` | Ajouter `heroPosterImage`, `heroVideoUrl`, `fabricSectionImage` + defaults avec URLs bucket |
| `src/pages/admin/AdminContentPage.tsx` | Remplacer les champs URL par `<ImagePicker>`, ajouter sections visuels hero + produit |
| `src/components/home/HeroSection.tsx` | Lire poster/video depuis CMS |
| `src/components/home/FabricSection.tsx` | Lire image depuis CMS |
| `src/components/product/ProductHeroSection.tsx` | Lire image depuis CMS |
| `src/components/product/ProductGallerySection.tsx` | Lire galerie depuis CMS |
| `src/components/product/DynamicProductVisual.tsx` | Utiliser fallback CMS |

