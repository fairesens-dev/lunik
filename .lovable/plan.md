

## Plan : Utiliser l'image du coloris comme référence pour la génération IA

### Problème

Actuellement, le prompt de génération ne décrit la toile que par son nom et sa couleur hex (`"BS Rouge"`, `#888`). Pour les motifs rayés, chinés ou texturés, Gemini ne peut pas deviner le pattern exact. L'image du coloris dans le bucket contient cette information.

### Modifications

**1. Propager `photoUrl` vers `DynamicProductVisual`** (`ConfiguratorSection.tsx`)

La ligne 38 construit `currentToile` sans `photoUrl`. Il faut l'ajouter :
```ts
const currentToile = { hex: selectedToile?.hex || "#fff", label: toileColor, photoUrl: (selectedToile as any)?.photoUrl };
```

**2. Passer `photoUrl` à la edge function** (`DynamicProductVisual.tsx`)

- Ajouter `photoUrl` dans la signature de `generateImage` et dans le body envoyé à `generate-store-image`
- Inclure `photoUrl` dans la `cacheKey` (car le même label peut avoir des motifs différents)
- Mettre à jour l'appel dans le `useEffect`

**3. Envoyer l'image du coloris comme référence visuelle à Gemini** (`generate-store-image/index.ts`)

Si `toilePhotoUrl` est fourni, utiliser l'API multimodale de Gemini : envoyer un message `content` composé de texte + image_url. Le prompt demande explicitement à Gemini de reproduire le motif exact visible dans l'image de référence sur la toile du store banne.

```ts
// Si on a une photo de référence, on l'envoie comme image jointe
const content = toilePhotoUrl
  ? [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: toilePhotoUrl } }
    ]
  : prompt;

messages: [{ role: "user", content }],
```

Le prompt sera enrichi d'une instruction :
> "IMPORTANT: An image of the exact fabric pattern/texture is attached. The awning fabric MUST reproduce this exact pattern, colors, and texture faithfully."

**4. Redéployer la edge function**

### Fichiers impactés

| Fichier | Changement |
|---|---|
| `src/components/product/ConfiguratorSection.tsx` | Propager `photoUrl` dans `currentToile` |
| `src/components/product/DynamicProductVisual.tsx` | Passer `photoUrl` au body de l'appel, inclure dans cache key |
| `supabase/functions/generate-store-image/index.ts` | Accepter `toilePhotoUrl`, construire un message multimodal texte+image |

