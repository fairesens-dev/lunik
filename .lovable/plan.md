

# Plan : Option "Motorisation SOMFY" incluse + incompatibilités entre options

## Objectif
1. Ajouter une option "Motorisation SOMFY IO" cochée par défaut (incluse, prix 0 €)
2. Ajouter un champ `incompatibleWith` sur chaque option (gérable depuis l'admin)
3. Dans le configurateur, quand on active une option, désactiver automatiquement ses options incompatibles

## Modifications

### 1. Type `OptionEntry` — `src/contexts/ConfiguratorSettingsContext.tsx`
- Ajouter deux champs :
  - `defaultSelected?: boolean` — indique si l'option est cochée par défaut au chargement
  - `incompatibleWith?: string[]` — liste des IDs d'options incompatibles

### 2. Hook `useConfigurator` — `src/hooks/useConfigurator.ts`
- Initialiser `selectedOptions` avec les options qui ont `defaultSelected: true` (au lieu d'un `Set` vide)
- Modifier `toggleOption` : quand on active une option, parcourir `incompatibleWith` de cette option ET les `incompatibleWith` des autres options qui la ciblent, et désélectionner les options incompatibles automatiquement

### 3. Page configurateur — `src/pages/ConfigurateurPage.tsx`
- Ajouter un indicateur visuel quand une option est désactivée par incompatibilité (texte discret "Incompatible avec [option X]" sous l'option grisée)
- L'option désactivée par incompatibilité reste cliquable : si l'utilisateur la réactive, c'est l'autre option incompatible qui se désactive

### 4. Admin options — `src/pages/admin/AdminConfiguratorPage.tsx` (OptionsTab)
- Ajouter un champ `defaultSelected` (checkbox "Cochée par défaut")
- Ajouter une section "Incompatible avec" (multi-checkbox similaire à "Inclut les options" existant) pour chaque option
- Persister `incompatibleWith` et `defaultSelected` via le même mécanisme de sauvegarde

### 5. Données initiales
- L'option "Motorisation SOMFY IO" (id: `motorisation-somfy`, prix: 0, `defaultSelected: true`) devra être créée par l'admin directement via l'interface d'administration (pas de migration DB nécessaire)
- On peut configurer son incompatibilité avec "Manœuvre manuelle" depuis l'admin

## Logique d'incompatibilité (bidirectionnelle)
Quand l'utilisateur active l'option A :
- Pour chaque ID dans `A.incompatibleWith`, désélectionner cette option
- Cela rend le comportement symétrique : si "Manœuvre manuelle" est incompatible avec "Motorisation SOMFY", activer l'une désactive l'autre

## Fichiers impactés
| Fichier | Changement |
|---------|-----------|
| `src/contexts/ConfiguratorSettingsContext.tsx` | Ajout `defaultSelected` + `incompatibleWith` au type |
| `src/hooks/useConfigurator.ts` | Init sélection par défaut + logique incompatibilité dans toggleOption |
| `src/pages/ConfigurateurPage.tsx` | Indicateur visuel d'incompatibilité |
| `src/pages/admin/AdminConfiguratorPage.tsx` | UI admin pour default + incompatibilités |

