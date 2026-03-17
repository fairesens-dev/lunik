

# Plan : Réorganiser le configurateur

## 4 modifications dans `ConfiguratorSection.tsx`

### 1. Retirer "Prix de base" de l'étape 01
Supprimer les lignes 145-147 (le bloc `{basePrice !== null && ...}`).

### 2. Ajouter un bloc "Astuces de mesure" dans l'étape 01
Après la ligne surface couverte (144), ajouter un encart informatif avec des conseils pratiques :
- Mesurer la largeur de la zone à couvrir + ajouter 40 cm de débord de chaque côté
- Mesurer l'avancée souhaitée depuis le mur
- Vérifier la hauteur sous linteau (min 2m conseillé)
- Prévoir un angle d'inclinaison de 15° minimum pour l'écoulement des eaux

Style : bordure `border-primary/20`, fond `bg-primary/5`, icône Ruler ou Lightbulb.

### 3. Inverser armature (02) et toile (03)
Remettre la toile en étape 02 et l'armature en étape 03 (inverser les deux blocs JSX, lignes 150-178 et 180-186).

### 4. Déplacer `SaveConfigCTA` après l'étape Options uniquement
Le composant est déjà placé après les options (ligne 249). Il suffit de ne plus le conditionner à `hasValidConfig` seul mais aussi vérifier que l'utilisateur est bien à l'étape options (les options sont toujours visibles, donc on conditionne l'affichage à `selectedOptions.size > 0 || true` — en fait le bloc est déjà après les options). La demande est de ne l'afficher que quand des couleurs ET options sont sélectionnées. On ajoutera une condition : `widthValid && basePrice !== null && toileColor && armatureColor`.

Pas de changement dans `SaveConfigCTA.tsx` — la logique reste dans le parent.

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/components/product/ConfiguratorSection.tsx` | 4 modifications ci-dessus |

