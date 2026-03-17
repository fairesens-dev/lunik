
Objectif: corriger le vrai écran utilisé sur `/configurateur`, pas seulement le composant générique.

Constat
- Le croquis correspond à `src/pages/ConfigurateurPage.tsx`.
- La route `/configurateur` rend `ConfigurateurPage` dans `src/App.tsx`.
- Le bug vient du fait que l’ordre a déjà été inversé dans `src/components/product/ConfiguratorSection.tsx`, mais ce composant n’est pas celui affiché sur la page du configurateur standalone.
- Dans `ConfigurateurPage.tsx`, l’étape `02` affiche encore :
  1. `Toile`
  2. séparateur
  3. `Armature`

Plan de correction
1. Modifier `src/pages/ConfigurateurPage.tsx` dans le bloc `activeStep === "02"`.
2. Inverser les deux sous-sections :
   - afficher d’abord `Armature`
   - puis le séparateur
   - puis `Toile`
3. Conserver les mêmes composants, styles et handlers existants :
   - `ARMATURE_COLORS`, `armatureColor`, `setArmatureColor`
   - `ToileColorSelector`, `toileColor`, `setToileColor`
4. Vérifier la cohérence visuelle après inversion :
   - le titre “02 · Couleurs” reste inchangé
   - seul l’ordre interne change
   - aucune logique pricing / panier / visualisation n’est impactée

Fichier concerné
- `src/pages/ConfigurateurPage.tsx`

Résultat attendu
- Dans l’étape “02 · Couleurs”, l’utilisateur choisit d’abord l’armature, puis la toile, exactement comme sur ton croquis.
