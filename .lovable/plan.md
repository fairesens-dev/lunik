

# Plan : Enrichir les options du configurateur avec des éléments marketing

## Problème

Les options stockées en Supabase n'ont pas de données marketing (badges, tips/témoignages, preuve sociale). Le hook `useConfigurator` force `tip: undefined` et `socialProof: undefined` pour les options admin. Le composant n'affiche pas non plus le `socialProof`.

## Solution en 3 volets

### 1. Mettre à jour les données Supabase (UPDATE via insert tool)

Ajouter dans le JSON de chaque option les champs `tip` et `socialProof` avec du contenu marketing :

| Option | badge (savingsLabel) | tip (témoignage) | socialProof |
|--------|-----|-----|-------------|
| LED coffre | POPULAIRE | « L'éclairage LED a transformé nos soirées d'été » — Marie, Lyon | 78% des clients choisissent cette option |
| LED bras | COUP DE CŒUR | « L'effet est bluffant, tous nos invités nous demandent la référence » — Thomas, Bordeaux | Option la mieux notée par nos clients |
| Capteur vent | RECOMMANDÉ | « Indispensable, ça m'a sauvé le store » — Pascal, Nantes | Recommandé par 9 installateurs sur 10 |
| Pose plafond | — | Idéal si vous ne disposez pas de façade porteuse | — |
| Manœuvre manuelle | ÉCONOMIE | — | — |
| Radio CSI | DOMOTIQUE | Compatible TaHoma, Alexa et Google Home | Plébiscitée par les passionnés de maison connectée |

### 2. Mettre à jour le hook `useConfigurator.ts`

Mapper les champs `tip` et `socialProof` depuis les données admin au lieu de forcer `undefined` :
```ts
tip: o.tip || undefined,
socialProof: o.socialProof || undefined,
```

Ajouter `tip` et `socialProof` à l'interface `OptionEntry` dans `ConfiguratorSettingsContext.tsx`.

### 3. Enrichir le rendu dans `ConfiguratorSection.tsx`

- Afficher le `socialProof` sous le tip, avec une icône de validation (ex: `TrendingUp` ou `Users`) et un style distinct (texte vert/primary, fond léger)
- Ajouter un prix rapporté au mois pour les options > 500€ : ex. "soit ~72 €/mois en 12×"

### Fichiers modifiés

| Fichier | Action |
|---------|--------|
| Supabase `configurator_settings` (id=options) | UPDATE JSON avec badges, tips, socialProof |
| `src/contexts/ConfiguratorSettingsContext.tsx` | Ajouter `tip?` et `socialProof?` à `OptionEntry` |
| `src/hooks/useConfigurator.ts` | Mapper `tip` et `socialProof` depuis admin |
| `src/components/product/ConfiguratorSection.tsx` | Afficher socialProof + prix mensuel |

