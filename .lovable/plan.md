

# Plan : Extraire et afficher les codes toile (ex: D545) dans le configurateur

## Analyse

Les fichiers du bucket `toile-colors` suivent le pattern `hi_ORC_D545_120_...jpg`. Le code référence est `parts[2]` après split sur `_`. Actuellement, `parseToileColorLabel` extrait uniquement le nom lisible (à partir de `parts[4]+`) et ignore ce code.

## Solution

Ajouter un champ `refCode` au flux de données et l'afficher entre parenthèses à côté du nom dans le sélecteur de toile.

### 1. Créer une fonction d'extraction du code référence

Dans `src/lib/parseToileColorLabel.ts`, ajouter une fonction `parseToileRefCode(filename)` qui retourne `parts[2]` (ex: "D545", "0001", "8553") si le pattern standard est détecté, sinon `undefined`.

### 2. Ajouter `refCode` à `ColorEntry`

Dans `src/contexts/ConfiguratorSettingsContext.tsx` :
- Ajouter `refCode?: string` à l'interface `ColorEntry`
- Dans le mapping des fichiers bucket (ligne ~147), appeler `parseToileRefCode(f.name)` et stocker le résultat dans `refCode`

### 3. Propager `refCode` dans le hook

Dans `src/hooks/useConfigurator.ts` ligne 20, ajouter `refCode: c.refCode` au mapping `TOILE_COLORS_COMPAT`.

### 4. Afficher le code dans `ToileColorSelector`

Dans le composant, afficher `{c.refCode && ` (${c.refCode})`}` à côté du nom dans la vignette et dans la lightbox.

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/lib/parseToileColorLabel.ts` | Ajouter `parseToileRefCode()` |
| `src/contexts/ConfiguratorSettingsContext.tsx` | Ajouter `refCode` à `ColorEntry` + mapping bucket |
| `src/hooks/useConfigurator.ts` | Propager `refCode` dans TOILE_COLORS_COMPAT |
| `src/components/product/ToileColorSelector.tsx` | Afficher le code entre parenthèses |

