

## Plan : Ajouter les 28 coloris Orchestra avec support des motifs rayés

### Contexte

Le `ColorEntry` actuel ne supporte que `id`, `hex`, `label`, `active`, `photoUrl`. Il faut étendre le modèle pour gérer les types `solid`, `textured` et `striped` (avec tableau de couleurs pour les rayures). L'affichage des pastilles dans le configurateur utilise uniquement `backgroundColor` — il faudra supporter le `repeating-linear-gradient` pour les rayés.

### Modifications

**1. Étendre le type `ColorEntry`** (`src/contexts/ConfiguratorSettingsContext.tsx`)

Ajouter des champs optionnels au type :
- `type?: "solid" | "textured" | "striped"` (défaut `"solid"`)
- `colors?: string[]` (pour les rayures, tableau de 2+ couleurs)

**2. Remplacer les couleurs de toile par défaut** (`src/contexts/ConfiguratorSettingsContext.tsx`)

Peupler `DEFAULT_SETTINGS.toileColors` avec les 28 coloris fournis, tous `active: true`.

**3. Mettre à jour le rendu des pastilles** (`src/components/product/ConfiguratorSection.tsx`)

Dans la boucle d'affichage des couleurs de toile, calculer le `style` dynamiquement :
- `solid` / `textured` → `backgroundColor: c.hex`
- `striped` → `background: repeating-linear-gradient(45deg, color1, color1 10px, color2 10px, color2 20px)`

Extraire une fonction utilitaire `getColorSwatchStyle(color)` pour réutilisabilité.

**4. Adapter le hook et les compat maps** (`src/hooks/useConfigurator.ts`)

Enrichir `TOILE_COLORS_COMPAT` pour propager `type` et `colors` en plus de `name` et `hex`, afin que le configurateur puisse les exploiter.

**5. Mettre à jour le sous-titre**

Changer "Plus de 200 coloris" → "Toile Orchestra by Dickson · 28 coloris" dans la section 02 du configurateur.

### Fichiers impactés

- `src/contexts/ConfiguratorSettingsContext.tsx` — type + defaults
- `src/hooks/useConfigurator.ts` — compat map enrichie
- `src/components/product/ConfiguratorSection.tsx` — rendu pastilles avec gradient

