

# Remplacement du visuel schematique par une photo IA realiste

## Changements prevus

### 1. Supprimer les boutons presets (lignes 56-74, 119-153 de ConfiguratorSection.tsx)

Retrait complet des 3 boutons "Votre config / Style epure / Style audacieux", des thumbnails DynamicProductVisual en miniature, et de tout le state `previewConfig` associe.

### 2. Ajouter un toggle LED sur le visuel

Un petit bouton superpose sur l'image permettra d'activer/desactiver le rendu LED directement sur le visuel (toggle "Voir avec eclairage LED"), synchronise avec l'option LED du configurateur.

### 3. Remplacer le visuel SVG par une image generee par IA

**Architecture :**

```text
[ConfiguratorSection]
   |
   v
[DynamicProductVisual] -- appelle --> [Edge Function: generate-store-image]
                                            |
                                            v
                                    [Gemini 2.5 Flash Image API]
                                            |
                                            v
                                    [Image base64 renvoyee au client]
```

**Edge function `generate-store-image` :**
- Recoit en POST : `toileColorHex`, `toileColorLabel`, `armatureColorHex`, `armatureColorLabel`, `led` (boolean)
- Construit un prompt du type : *"A realistic professional product photo of a modern retractable cassette awning (store banne coffre) deployed on a sunny terrace. The fabric is [color label] ([hex]). The aluminum frame is [color label] ([hex]). [With warm LED strip lighting under the fabric / No LED]. Clean background, lifestyle setting, high quality."*
- Appelle `ai.gateway.lovable.dev` avec le modele `google/gemini-2.5-flash-image`
- Renvoie l'image base64

**Composant `DynamicProductVisual` refactorise :**
- Suppression de tout le rendu SVG schematique
- Appel a l'edge function quand `toileColor`, `armatureColor` ou `led` changent (avec debounce de 800ms)
- Cache en memoire (Map cle = `${toileHex}-${armatureHex}-${led}`) pour eviter de regenerer les memes combinaisons
- Affichage d'un skeleton/placeholder anime pendant le chargement
- Les dimensions (`width`, `projection`) n'influencent plus le visuel
- Fallback : si l'API echoue, afficher une image statique par defaut

**Gestion de la prop `compact` :**
- En mode compact (thumbnails), ne pas appeler l'IA - ces thumbnails sont supprimees de toute facon

### 4. Fichiers modifies

| Fichier | Modification |
|---|---|
| `src/components/product/ConfiguratorSection.tsx` | Retirer presets, previewConfig, thumbnails. Simplifier le passage de props au visuel. |
| `src/components/product/DynamicProductVisual.tsx` | Refonte complete : remplacer SVG par appel edge function + cache + loading state |
| `supabase/functions/generate-store-image/index.ts` | Nouvelle edge function pour generer l'image via Gemini |

### 5. Experience utilisateur

- Au chargement initial : generation de l'image avec les couleurs par defaut (~2-3s), skeleton anime affiche
- Au changement de couleur : debounce 800ms puis generation, l'image precedente reste affichee avec un overlay de chargement subtil
- Toggle LED : regeneration de l'image avec/sans LED
- Cache : les combinaisons deja generees s'affichent instantanement

