

## Plan: Refonte homepage + logo SVG + admin modernisé

### 1. Logo SVG partout

Le fichier `user-uploads://logo-lunik.svg` sera copié dans `src/assets/logo-lunik.svg` et utilisé dans :
- **Header.tsx** : version SVG dark (scrolled) + version blanche (transparent hero) — on ajoutera un filtre CSS `brightness(0) invert(1)` pour la version blanche plutôt que deux fichiers
- **Footer.tsx** : logo SVG avec filtre blanc
- **AdminLayout.tsx** : logo SVG sidebar (filtre blanc)
- **AdminLoginPage.tsx** : logo SVG

### 2. Rapprocher "Ce que nos clients en pensent" de "Ils ont sauté le pas"

Dans `Index.tsx`, supprimer tout ce qui se trouve entre `GallerySection` et `TestimonialsSection`. Actuellement il n'y a rien entre les deux, mais on va réduire le padding :
- `GallerySection` : `py-20 lg:py-28` → `pb-8 pt-20 lg:pb-8 lg:pt-28`
- `TestimonialsSection` : `py-20 lg:py-28` → `pt-8 pb-20 lg:pt-8 lg:pb-28`

### 3. Chiffres clés sous "Pourquoi choisir notre store" + supprimer le reste du bloc ConfiguratorCTASection

- **ValuesSection.tsx** : Ajouter les 4 stats animées (5000+, 4.9/5, 173, 5 ans) + bouton CTA configurateur directement sous le carousel des valeurs
- **ConfiguratorCTASection.tsx** : Supprimer entièrement (retirer l'import et l'usage dans `Index.tsx`)

### 4. Revoir "Conçu pour durer" (ProductFeaturesSection)

Le problème : les onglets cachent le contenu des 2 autres tabs. Nouveau design :
- **3 colonnes côte à côte** (desktop), empilées en mobile
- Chaque colonne : image en haut, numéro + titre + description + specs en dessous
- Fond sombre conservé (`bg-foreground text-background`)
- Pas d'accordéon/tabs — tout est visible en permanence

### 5. Revoir "Chaque Détail a été pensé" (ProductHighlightSection)

Supprimer la galerie bento grid. Nouveau design :
- Section d'introduction textuelle avec sous-titre + headline + paragraphe descriptif
- Puis 3 blocs features en grille (icône + titre + description) — résumant Coffre intégral, Toile Dickson, Motorisation Somfy, LED, Bras articulés, Sur-mesure
- Pas d'images — c'est un bloc d'intro, les images sont ailleurs

### 6. Moderniser l'admin

- **AdminLayout.tsx** : Sidebar plus épurée avec fond `#1a1a2e` (bleu très foncé) au lieu du sage green, nav items avec `rounded-lg`, hover plus doux, suppression du `border-l-[3px]` au profit d'un `bg-white/10` subtil
- **Topbar** : fond blanc pur, ombre légère `shadow-sm`, pas de border
- **AdminDashboardPage** : Remplacer les `text-gray-*` hardcodés par les tokens Tailwind (`text-foreground`, `text-muted-foreground`)

### Fichiers modifiés

| Fichier | Action |
|---|---|
| `src/assets/logo-lunik.svg` | Copier depuis upload |
| `src/components/Header.tsx` | Import SVG, utiliser avec filtre pour variant blanc |
| `src/components/Footer.tsx` | Import SVG |
| `src/components/admin/AdminLayout.tsx` | Logo SVG + sidebar modernisée (fond dark, rounded items) |
| `src/pages/admin/AdminLoginPage.tsx` | Logo SVG |
| `src/pages/admin/AdminDashboardPage.tsx` | Tokens CSS au lieu de gray-* |
| `src/components/home/GallerySection.tsx` | Réduire padding bottom |
| `src/components/home/TestimonialsSection.tsx` | Réduire padding top |
| `src/components/home/ValuesSection.tsx` | Ajouter stats + CTA configurateur en bas |
| `src/pages/Index.tsx` | Supprimer ConfiguratorCTASection |
| `src/components/home/ProductHighlightSection.tsx` | Remplacer bento par intro textuelle + features grid |
| `src/components/product/ProductFeaturesSection.tsx` | 3 colonnes visibles au lieu de tabs |
| `src/index.css` | Sidebar variables → fond bleu foncé |

