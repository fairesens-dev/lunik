

## Rendre la matrice tarifaire dynamique (largeurs + avancées éditables) et supprimer l'onglet Dimensions

Actuellement, les largeurs (`WIDTH_RANGES`) et avancées (`PROJECTIONS`) sont codées en dur dans `pricingTable.ts`. L'admin ne peut modifier que les prix dans la grille. L'objectif est de permettre l'ajout/suppression de lignes (largeurs) et colonnes (avancées) directement depuis l'onglet Tarification.

### Fichiers modifiés

**1. `src/lib/pricingTable.ts`**
- Rendre `WIDTH_RANGES` et `PROJECTIONS` mutables avec des setters (`setWidthRanges`, `setProjections`) comme `setPriceGrid`.
- Les fonctions `lookupPrice`, `getValidProjections`, `isValidWidth`, `getWidthRangeLabel`, `MIN_WIDTH_CM`, `MAX_WIDTH_CM` continuent de fonctionner dynamiquement (elles lisent déjà les tableaux par référence, il suffit de remplacer la référence).

**2. `src/contexts/ConfiguratorSettingsContext.tsx`**
- Ajouter `widthRanges` et `projections` au type `ConfiguratorSettings`.
- Au chargement, lire `widthRanges` et `projections` depuis la DB (clés `widthRanges`, `projections` dans `configurator_settings`), sinon utiliser les défauts.
- Appeler `setWidthRanges` et `setProjections` au chargement.
- Exposer `updateWidthRanges(ranges)` et `updateProjections(projections)` dans le contexte.
- Supprimer les exports liés à `dimensions` (ou les garder sans effet, puisque l'onglet est supprimé).

**3. `src/pages/admin/AdminConfiguratorPage.tsx`**
- **Supprimer l'onglet "Dimensions"** et le composant `DimensionsTab`.
- Passer de `grid-cols-5` à `grid-cols-4` pour les tabs.
- **Enrichir `PricingTab`** avec :
  - Bouton "Ajouter une colonne (avancée)" : demande la valeur en mm, ajoute une colonne à la grille, met à jour `projections`.
  - Bouton "Ajouter une ligne (largeur)" : demande min/max en mm, ajoute une ligne à la grille, met à jour `widthRanges`.
  - Bouton supprimer sur chaque en-tête de colonne et de ligne pour retirer une dimension.
  - La sauvegarde persiste `widthRanges`, `projections` et `priceGrid` ensemble.

### Flux utilisateur

L'admin voit la matrice actuelle avec un bouton "+" en fin de ligne d'en-tête (nouvelle avancée) et un bouton "+" en fin de colonne (nouvelle largeur). Chaque en-tête de ligne/colonne a un petit bouton "×" pour supprimer. Les modifications se sauvegardent via le même bouton "Sauvegarder".

