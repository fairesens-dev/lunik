

## Plan : Configurateur — Visuel 100%, fiche technique fixe, tri coloris, steps restructurés

### 1. Visuel 100% sans scroll (`ConfigurateurPage.tsx` — colonne gauche)

La colonne gauche devient un conteneur fixe `h-[calc(100vh-64px)]` sans overflow. Le visuel occupe tout l'espace disponible au-dessus de la fiche technique. La fiche technique est positionnée en `absolute bottom-0` pour rester collée en bas de l'écran.

- Supprimer `overflow-y-auto` sur la colonne gauche
- Le `DynamicProductVisual` remplit tout l'espace via `flex-1` + suppression du `max-w-2xl` wrapper
- Les badges overlay restent en position absolue sur le visuel
- La fiche technique passe en `absolute bottom-0 left-0 right-0` avec un fond semi-transparent

### 2. Tri des coloris (`classifyToileColor.ts`)

Amélioration des keywords pour une classification plus précise :

- **Rayés** : ajouter des patterns Dickson courants manquants comme les noms de références contenant des tirets multiples ou des codes couleur combinés (ex: "J", suffixes numériques après couleurs)
- **Motifs** : ajouter `"dickson"` patterns comme `"marl"`, `"mélange"`, `"melange"`, `"grain"`, `"natté"`, `"natte"`, `"canvas"`, `"toile"` (quand combiné avec texture)
- Le `type` field depuis les settings Supabase (`solid`, `striped`, `textured`) doit primer — vérifier que les données en base ont le bon type et que la logique le respecte bien

### 3. Steps restructurés (`ConfigurateurPage.tsx` — colonne droite)

Passer de 4 steps à 3 steps :

| Avant | Après |
|---|---|
| 01 Dimensions | 01 Dimensions (inchangé) |
| 02 Couleur de toile | 02 Couleurs (toile + armature fusionnés) |
| 03 Armature | 03 Options (inchangé) |
| 04 Options | — |

- Step 02 "Couleurs" contient deux sous-sections : "Toile" avec le `ToileColorSelector` puis "Armature" avec les swatches, séparées par un petit `border-t`
- Renuméroter 01 → 02 → 03 avec mise à jour des labels

### Fichiers modifiés

- `src/pages/ConfigurateurPage.tsx` : layout visuel, restructuration steps
- `src/lib/classifyToileColor.ts` : keywords améliorés

