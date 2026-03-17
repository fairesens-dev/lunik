

# Plan : Mettre à jour les couleurs d'armature avec textures photo

## Contexte

Les 6 images uploadées sont des textures de finition pour les couleurs d'armature :
1. Blanc satiné - RAL 9016
2. Ivoire clair satiné - RAL 1015
3. Aluminium métallisé - RAL 9006
4. Gris anthracite texturé - RAL 7016
5. Brun gris structuré - RAL 8019
6. Noir foncé structuré - RAL 9005

## Actions

### 1. Uploader les 6 images dans le bucket Supabase `product-photos/armatures/`

Copier les fichiers uploadés dans `public/images/armatures/` puis les uploader dans le bucket storage pour avoir des URLs publiques pérennes.

### 2. Mettre à jour Supabase `configurator_settings` (id = `armatureColors`)

Migration SQL pour insérer les 6 couleurs avec leurs `photoUrl` pointant vers le bucket storage :

| Couleur | hex | RAL | photoUrl |
|---------|-----|-----|----------|
| Blanc satiné | #F5F5F5 | 9016 | URL bucket |
| Ivoire clair satiné | #DDD5BE | 1015 | URL bucket |
| Aluminium métallisé | #A5A5A5 | 9006 | URL bucket |
| Gris anthracite texturé | #4A5459 | 7016 | URL bucket |
| Brun gris structuré | #473B36 | 8019 | URL bucket |
| Noir foncé structuré | #2D2D2D | 9005 | URL bucket |

### 3. Modifier le rendu armature dans `ConfiguratorSection.tsx`

Actuellement le swatch armature utilise `backgroundColor: c.hex`. Ajouter le support de `photoUrl` : si présent, utiliser `backgroundImage: url(...)` comme pour les toiles (style identique au `getSwatchStyle` de `ToileColorSelector`).

### 4. Propager `photoUrl` dans `ARMATURE_COLORS_COMPAT` (useConfigurator.ts)

Ajouter `photoUrl` au mapping des armature colors pour que le composant y ait accès.

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `public/images/armatures/` | 6 images copiées |
| Supabase migration | UPDATE `configurator_settings` id=armatureColors |
| `src/hooks/useConfigurator.ts` | Ajouter `photoUrl` au mapping ARMATURE_COLORS_COMPAT |
| `src/components/product/ConfiguratorSection.tsx` | Support photoUrl dans le swatch armature |

