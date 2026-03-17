

# Plan : Supprimer les doublons de coloris de toile

## Problème
Le merge (ligne 158-172 de `ConfiguratorSettingsContext.tsx`) déduplique par `id` uniquement. Or les anciennes entrées DB ont des IDs simples ("taupe") tandis que le bucket génère des IDs longs ("hi_orc_7559_120_taupe_RVBjpgLR"). Résultat : "Taupe" et "Taupe (7559)" coexistent.

## Solution

**Fichier** : `src/contexts/ConfiguratorSettingsContext.tsx` — lignes 167-171

Après le merge des couleurs DB, quand on ajoute les couleurs bucket manquantes (ligne 167-171), vérifier aussi par **label normalisé** (en plus de l'id). Si une couleur bucket a le même label qu'une couleur DB existante, ne pas l'ajouter mais mettre à jour l'entrée DB avec `photoUrl` et `refCode` du bucket.

```ts
// Current: only checks by id
for (const bc of bucketColors) {
  if (!toileColors.find(tc => tc.id === bc.id)) {
    toileColors.push(bc);
  }
}

// New: also check by normalized label to avoid duplicates
const normalizeLabel = (l: string) => l.toLowerCase().trim();
for (const bc of bucketColors) {
  const existingById = toileColors.find(tc => tc.id === bc.id);
  if (existingById) continue;
  
  const existingByLabel = toileColors.find(
    tc => normalizeLabel(tc.label) === normalizeLabel(bc.label)
  );
  if (existingByLabel) {
    // Update the existing entry with bucket data (photoUrl, refCode)
    existingByLabel.photoUrl = existingByLabel.photoUrl || bc.photoUrl;
    existingByLabel.refCode = existingByLabel.refCode || bc.refCode;
  } else {
    toileColors.push(bc);
  }
}
```

Cela élimine tous les doublons du type "Taupe" / "Taupe (7559)" en fusionnant automatiquement les données bucket dans l'entrée DB existante.

