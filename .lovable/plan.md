

# Plan : Mettre à jour les options du configurateur

## Problème

Les options stockées dans Supabase (`configurator_settings`, clé `options`) ne contiennent que 3 options obsolètes (Motorisation 390€, LED 290€, Pack Connect 590€) qui ne correspondent pas au tarif 2026 du document.

## Solution

Mettre à jour la ligne `configurator_settings` (id = `options`) dans Supabase avec les 6 options du document :

| Option | Prix TTC |
|--------|----------|
| Éclairage LED sous coffre SOMFY | 859 € |
| Éclairage LED sous les bras SOMFY | 959 € |
| Automatisme Vent SOMFY 3D IO | 199 € |
| Pose plafond avec équerre | 289 € |
| Manœuvre manuelle treuil + manivelle | -619 € |
| Manœuvre SOMFY RADIO CSI (à commande de secours intégrée) | 199 € |

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/hooks/useConfigurator.ts` | Aucun changement nécessaire — la logique de fallback et de résolution admin est déjà en place |

## Implémentation

Une seule opération : `UPDATE configurator_settings` pour remplacer le JSON `data` de la ligne `id = 'options'` avec les 6 options du tarif 2026, en conservant le format attendu par le hook (`id`, `label`, `description`, `price`, `active`, `highlight`, `savingsLabel`, `imageUrl`). Les badges marketing et descriptions seront repris depuis le fallback hardcodé (`pricingTable.ts`) qui correspond déjà au document.

