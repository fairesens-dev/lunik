

## Plan : Remplacer les coloris hardcodés par les images du bucket Supabase

### Constat

Le bucket `toile-colors` contient environ **160 images** de textures Orchestra (unis, chinés, tweed, piqué, rayures, bloc-color...). Le code actuel n'en affiche que 28 avec des pastilles CSS. Il faut utiliser les vraies photos comme pastilles.

### Modifications

**1. Rendre le bucket `toile-colors` public** (migration SQL)

Le bucket est actuellement privé. Sans cela, les images ne sont pas accessibles publiquement via URL.

**2. Charger dynamiquement les coloris depuis le bucket** (`ConfiguratorSettingsContext.tsx`)

Au lieu de hardcoder 160 entrées, le contexte va lister les fichiers du bucket `toile-colors` au chargement et construire automatiquement la liste des coloris :
- `id` : nom du fichier sans extension (ex: `hi_orc_0001_120_ecru_RVBjpgLR`)
- `label` : nom humain extrait du fichier (ex: `Écru`, `Charcoal Tweed`, `Manosque Beige`, `Littoral Argent`...)
- `photoUrl` : URL publique Supabase Storage
- `hex` : `#888` par défaut (fallback)
- `type` : `"solid"` (le type visuel n'a plus d'importance puisqu'on affiche la photo)

Les coloris du bucket remplacent les defaults hardcodés. La gestion admin (activer/désactiver) reste fonctionnelle via la table `configurator_settings` : si des entrées existent en base, elles priment ; sinon, les coloris du bucket sont utilisés.

**3. Mettre à jour le rendu des pastilles** (`ConfiguratorSection.tsx`)

Si un coloris a un `photoUrl`, la pastille utilise `background-image: url(...)` avec `background-size: cover` au lieu du `backgroundColor` ou `linear-gradient`. La pastille conserve ses dimensions (rectangulaire) et son comportement de sélection (bordure + check).

**4. Fonction utilitaire d'extraction du label** 

Parser le nom de fichier pour en extraire un label lisible :
- `hi_orc_0001_120_ecru_RVBjpgLR.jpg` → `Écru`
- `hi_orc_7330_120_charcoal_tweed_RVBjpgLR.jpg` → `Charcoal Tweed`
- `hi_ORC_D532_120_LITTORAL_Argent_sur_laize.jpg` → `Littoral Argent`
- `hi_orc_8553_120_BS_jaune_RVBjpgLR.jpg` → `BS Jaune` (bicolore store)

**5. Mettre à jour le sous-titre du configurateur**

"Toile Orchestra by Dickson · 28 coloris" sera remplacé dynamiquement par le nombre réel de coloris chargés.

**6. Adapter le hook `useConfigurator`**

Propager `photoUrl` dans `TOILE_COLORS_COMPAT` pour que tous les composants en aval puissent l'utiliser.

### Fichiers impactés

- Migration SQL : bucket public
- `src/contexts/ConfiguratorSettingsContext.tsx` : chargement dynamique depuis le bucket
- `src/components/product/ConfiguratorSection.tsx` : rendu pastilles avec images
- `src/hooks/useConfigurator.ts` : propagation `photoUrl`

