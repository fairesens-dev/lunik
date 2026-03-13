

## Plan: Matrice de prix éditable dans Admin > Configurateur > Tarification

### Objectif
Remplacer le formulaire "tarif/m²" actuel par une grille éditable (8 largeurs × 5 avancées) correspondant exactement à `PRICE_GRID` de `pricingTable.ts`. Les prix modifiés dans l'admin sont persistés en base et utilisés par le configurateur.

### Architecture

La grille est actuellement hardcodée dans `src/lib/pricingTable.ts`. On va :

1. **Persister la grille** dans `configurator_settings` (clé `priceGrid`) via le même pattern JSONB existant
2. **Charger la grille dynamiquement** dans `ConfiguratorSettingsContext` et l'exposer via le contexte
3. **Modifier `pricingTable.ts`** pour exporter une version mutable de `PRICE_GRID` et des setters
4. **Réécrire le `PricingTab`** avec un tableau HTML éditable

### Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/lib/pricingTable.ts` | Exporter `PRICE_GRID`, `WIDTH_RANGES`, `PROJECTIONS` + ajouter `setPriceGrid()` pour override dynamique |
| `src/contexts/ConfiguratorSettingsContext.tsx` | Ajouter `priceGrid` au state, charger depuis DB, exposer `updatePriceGrid()` |
| `src/pages/admin/AdminConfiguratorPage.tsx` | Réécrire `PricingTab` — tableau matriciel avec inputs éditables |

### Détail du PricingTab refondu

- Tableau avec headers : colonnes = avancées (150, 200, 250, 300, 350 cm), lignes = plages de largeur
- Chaque cellule : `<Input type="number">` pré-rempli avec le prix actuel, ou case grisée si `null` (combinaison indisponible)
- Toggle par cellule pour activer/désactiver une combinaison (mettre à null)
- Bouton "Sauvegarder" en bas
- Conservation du simulateur de prix existant à droite (utilise la grille live)
- Conservation des champs "Paiement en N fois" et "Prix minimum" en dessous de la grille

### Flow de données

```text
Admin modifie grille → updatePriceGrid() → upsert configurator_settings.priceGrid
                                          → setPriceGrid() dans pricingTable.ts
                                          → lookupPrice() utilise la nouvelle grille
```

Au chargement de l'app, `ConfiguratorSettingsContext` charge `priceGrid` depuis la DB et appelle `setPriceGrid()` pour overrider les valeurs hardcodées. Si aucune donnée en DB, les valeurs par défaut du fichier s'appliquent.

