
Objectif: verrouiller une seule structure de mise en page desktop pour le checkout afin que la colonne gauche (Coordonnées/Livraison/Paiement) et le bloc “Votre commande” gardent exactement la même largeur et le même point de départ visuel à chaque step.

1) Diagnostic ciblé
- Le rendu perçu diffère surtout sur Step 1 (Coordonnées) car sa racine est un `<form>` alors que Step 2/3 utilisent un `<div>`.
- Même avec des classes proches, cette différence de structure peut provoquer un rendu non strictement identique (notamment avec injections autofill/extensions et styles UA), ce qui décale visuellement la largeur de la colonne gauche et la position du titre.

2) Plan de correction (3 étapes checkout)
- Uniformiser la structure racine des 3 steps:
  - Step 1, Step 2, Step 3: même wrapper grid desktop, même colonne gauche, même colonne droite.
- Step 1:
  - Remplacer la racine `form` par une racine `div` identique aux autres steps.
  - Mettre le `<form>` uniquement à l’intérieur de la colonne gauche avec `w-full max-w-none`.
- Step 1/2/3:
  - Utiliser exactement la même définition de colonnes desktop: `lg:grid-cols-[minmax(0,1fr)_400px]`.
  - Forcer la colonne gauche à `w-full min-w-0`.
  - Forcer la colonne droite (sidebar) à une largeur fixe visuelle cohérente (track 400px + bloc summary sans contrainte parasite).
- Titres:
  - Harmoniser le bloc titre en haut de la colonne gauche (même classe/même espacement vertical) pour que “Coordonnées”, “Mode de livraison” et “Paiement” démarrent au même endroit lors des changements d’étape.

3) Fichiers à modifier
- `src/components/checkout/CheckoutStep1.tsx`
- `src/components/checkout/CheckoutStep2.tsx`
- `src/components/checkout/CheckoutStep3.tsx`
- (Optionnel propre) extraire une petite constante de classes commune dans ces fichiers pour éviter toute dérive future.

4) Validation attendue
- Sur desktop (viewport identique), passage Step 1 → 2 → 3:
  - même X de départ du titre de la colonne gauche,
  - même largeur visuelle de la colonne gauche,
  - même largeur visuelle de “Votre commande”.
- Vérification en revenant en arrière (3 → 2 → 1) pour confirmer que l’alignement ne bouge pas.

Section technique (résumé)
- Standardiser la grille sur `minmax(0,1fr)` + `400px` empêche les variations dues au contenu.
- Sortir le `<form>` de la racine grid de Step 1 supprime la divergence structurelle avec Step 2/3.
- Appliquer `w-full max-w-none` côté colonne gauche garantit une occupation pleine largeur du track.
