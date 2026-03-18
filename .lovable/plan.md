

# Plan : Améliorations LED + Catégories d'options

## 1. Prompt LED corrigé dans l'Edge Function

**Fichier** : `supabase/functions/generate-store-image/index.ts`

Modifier le `ledInstruction` (ligne 71-73) pour :
- Préciser que l'éclairage LED se situe **sous le coffre principal** (pas au bout du store / barre frontale)
- Plonger la scène dans une ambiance nocturne quand `led=true`

```
led
  ? "Transform the scene to a nighttime/evening atmosphere with dark sky. Add a warm white LED strip light running along the UNDERSIDE OF THE MAIN CASSETTE HOUSING (coffre), close to the wall — NOT at the front bar tip. The LED casts a soft downward ambient glow illuminating the terrace below."
  : "Keep the daytime bright natural sunlight. No LED lighting."
```

## 2. Stocker la variation LED dans le cache

Le cache actuel inclut déjà `led` dans la `cache_key` (`${toileColorHex}-${armatureColorHex}-${!!led}-${toilePhotoUrl}`), donc chaque combinaison LED on/off est déjà stockée séparément. Aucun changement nécessaire ici — le système fonctionne correctement.

## 3. Catégories d'options dans l'étape 03

**Fichier** : `src/contexts/ConfiguratorSettingsContext.tsx`
- Ajouter `category?: string` à l'interface `OptionEntry` (ligne 38-53)

**Fichier** : `src/lib/pricingTable.ts`
- Ajouter `category?: string` à l'interface `PricingOption` et aux options par défaut :
  - `motorisation-somfy` → `"Motorisation"`
  - `led-coffre`, `led-bras` → `"Éclairage"`
  - `capteur-vent` → `"Automatismes"`
  - `pose-plafond`, `radio-csi`, `manoeuvre-manuelle` → `"Accessoires"`

**Fichier** : `src/hooks/useConfigurator.ts`
- Propager le champ `category` dans le mapping `RESOLVED_OPTIONS`

**Fichier** : `src/pages/ConfigurateurPage.tsx` (étape 03, ~ligne 416-500)
- Grouper `sortedOptions` par catégorie
- Afficher un en-tête de catégorie (même style que l'étape 02 : `text-xs font-semibold uppercase tracking-[0.1em]`) avant chaque groupe

**Fichier** : `src/pages/admin/AdminConfiguratorPage.tsx` (OptionsTab)
- Ajouter un champ `Input` "Catégorie" dans le formulaire de chaque option

## 4. Mise à jour mémoire/contexte

Mettre à jour les notes de contexte :
- `configurator/visual-generation-architecture` : ajouter que la scène est plongée dans la nuit pour les visuels LED, et que l'éclairage est positionné sous le coffre principal
- `configurator/option-logic` : ajouter que les options supportent un champ `category` pour le regroupement dans l'étape 03

