

## Problème

La grille parent (`min-h-[calc(100vh-64px)]`) grandit quand le contenu de la colonne droite (accordéons ouverts) dépasse la hauteur de l'écran. La colonne gauche, même avec `sticky`, suit la hauteur de la ligne de grille et s'étire — ce qui agrandit la photo.

## Correction

**Fichier** : `src/pages/ConfigurateurPage.tsx`

Passer la grille de `min-h` à une structure où la colonne gauche est verrouillée en hauteur viewport :

1. Sur la `div` de grille (ligne 128) : remplacer `min-h-[calc(100vh-64px)]` par rien (ou garder juste pour mobile).
2. Sur la colonne gauche (ligne 131) : forcer `lg:h-[calc(100vh-64px)]` avec `lg:sticky lg:top-16` et `overflow-hidden` — mais aussi ajouter `lg:self-start` pour que la cellule de grille ne s'étire pas à la hauteur de la ligne.

Le point clé est `lg:self-start` sur la colonne gauche : cela empêche CSS Grid de l'étirer à la hauteur de la colonne droite (comportement par défaut `stretch`).

