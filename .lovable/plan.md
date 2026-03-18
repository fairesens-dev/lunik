

# Plan : Améliorations UX mobile + options configurateur

## 1. Bouton "Voir nos réalisations" → ancre vers galerie

**`src/components/home/GallerySection.tsx`** : Ajouter `id="gallery"` sur la `<section>`.

Le lien `href="#gallery"` existe déjà dans HeroSection (ligne 105), il lui manque juste la cible.

## 2. Trustpilot mobile : image plus petite, cacher le texte

**`src/components/home/TestimonialsSection.tsx`** (lignes 104-116) :
- Image Trustpilot : `h-6` → `h-4 md:h-6`
- Le `<span>` avec "4.8/5 · 233 avis" et le lien "Voir les avis →" : ajouter `hidden md:inline` pour les masquer sur mobile

## 3. Avis mobile : réduire largeur pour apercevoir le suivant

**`src/components/home/TestimonialsSection.tsx`** (ligne 127) :
- Changer `min-w-[280px]` → `min-w-[260px]` et `sm:min-w-[340px]` → `sm:min-w-[320px]`

## 4. Onglets configurateur : typo plus petite sur mobile

**`src/pages/ConfigurateurPage.tsx`** (ligne 286) :
- Changer la classe `text-xs` → `text-[10px] sm:text-xs` pour que "01 · Dimensions 02 · Couleurs 03 · Options" tienne sur une seule ligne mobile

## 5. Coloris armatures + toile : augmenter hauteur mobile

**`src/pages/ConfigurateurPage.tsx`** (ligne 397) :
- Armatures : changer `aspect-[11/4]` → `aspect-[11/5] sm:aspect-[11/4]`

**`src/components/product/ToileColorSelector.tsx`** : vérifier et augmenter légèrement la hauteur des pastilles toile sur mobile aussi.

## 6. Bouton "Télécharger mon devis →" → "Télécharger" sur mobile

**`src/components/product/SaveConfigCTA.tsx`** (ligne 121) :
```tsx
<>
  <span className="hidden sm:inline">Télécharger mon devis →</span>
  <span className="sm:hidden">Télécharger</span>
</>
```

## 7. Options : clic sur bloc entier pour activer + style vert

**`src/pages/ConfigurateurPage.tsx`** (lignes 448-518) :
- Retirer le `<Switch>` (ligne 478)
- Rendre le `<div>` du bloc cliquable via `onClick={() => toggleOption(opt.id)}` + `cursor-pointer`
- Quand `checked` : bordure `border-green-500/60`, fond `bg-green-50/50` (léger vert transparent)
- Quand non checked : garder le style actuel

## 8. Image option : à gauche sur desktop, inchangé mobile

**`src/pages/ConfigurateurPage.tsx`** (lignes 470-476) :
- Restructurer le layout du bloc option pour que sur desktop, l'image soit à gauche (flex-row) à côté du contenu, de taille fixe (~80px carré)
- Sur mobile, laisser l'image en haut (full width, comme actuellement)

Structure desktop :
```
┌──────┬──────────────────────────────┐
│ IMG  │ Label / description / prix   │
│ 80px │                              │
└──────┴──────────────────────────────┘
```

Mobile inchangé :
```
┌────────────────────────────────────┐
│ IMAGE full width                   │
├────────────────────────────────────┤
│ Label / description / prix         │
└────────────────────────────────────┘
```

