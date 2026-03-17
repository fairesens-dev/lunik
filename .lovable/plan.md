

# Plan : Persister le refCode des coloris de toile

## Problème actuel
Le `refCode` (ex: "D307") est déjà extrait des noms de fichiers par `parseToileRefCode`, mais lors du merge (ligne 162-165 de `ConfiguratorSettingsContext.tsx`), seul `photoUrl` est récupéré du bucket pour les couleurs déjà en DB. Le `refCode` est perdu pour les couleurs sauvegardées.

## Modification unique

**Fichier** : `src/contexts/ConfiguratorSettingsContext.tsx` — ligne 162-165

Dans le merge des toile colors, ajouter `refCode` à la fusion, de la même manière que `photoUrl` :

```ts
toileColors = (map.toileColors as ColorEntry[]).map(dbColor => ({
  ...dbColor,
  photoUrl: dbColor.photoUrl || bucketMap.get(dbColor.id)?.photoUrl,
  refCode: dbColor.refCode || bucketMap.get(dbColor.id)?.refCode,
}));
```

Cela garantit que :
- Les couleurs chargées depuis le bucket ont toujours leur `refCode` extrait du nom de fichier
- Les couleurs sauvegardées en DB récupèrent le `refCode` du bucket si elles ne l'ont pas encore
- Quand l'admin sauvegarde les couleurs (via `upsertSetting("toileColors", ...)`), le `refCode` est persisté en JSONB dans la table `configurator_settings`

Aucune migration DB nécessaire — le champ `refCode` est déjà dans le type `ColorEntry` et la table `configurator_settings` stocke du JSONB libre.

