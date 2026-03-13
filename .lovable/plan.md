

# Plan : Hero responsive — titre ne chevauche plus le menu

## Problème constaté

Screenshots pris à 4 résolutions montrent le même bug : le titre "Vivez dehors, sans compromis." chevauche la barre de navigation sur toutes les tailles d'écran.

**Cause racine** : Le hero utilise `-mt-20` pour passer derrière le header, puis `pt-32` (128px) comme padding-top. Mais le header fait 80px + le bandeau promo 40px = 120px. Il ne reste que 8px entre le header et le titre — largement insuffisant avec des titres en `text-6xl`/`text-7xl`.

## Correction

**Fichier** : `src/components/home/HeroSection.tsx`

1. **Importer `useContent` pour détecter le bandeau promo** — le composant l'importe déjà
2. **Calculer dynamiquement le padding-top** du conteneur de contenu en fonction de la présence du bandeau promo :
   - Sans bandeau : `pt-[140px]` (header 80px + 60px de marge)
   - Avec bandeau : `pt-[180px]` (header 80px + bandeau 40px + 60px de marge)
3. **Augmenter la hauteur minimale** : passer de `min-h-[max(60vh,500px)]` à `min-h-[max(70vh,580px)]` pour que le contenu ait plus de place en bas aussi (boutons + stats)
4. **Réduire la taille du titre sur les écrans intermédiaires** : ajouter un breakpoint `lg:text-[3.5rem]` entre `md:text-5xl` et `xl:text-7xl` pour les laptops 13-14"
5. **Mobile** : le `-mt-20` combiné au bandeau promo cause aussi un overlap — appliquer le même padding dynamique

Aucun autre fichier à modifier.

