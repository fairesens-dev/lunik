

## Plan : Image plein fond, espacement SaveConfig, et fonctionnalité "Visualiser chez moi"

### 1. Image en background plein (pas de padding)

**`src/pages/ConfigurateurPage.tsx`** — ligne 125 : supprimer le `p-6 lg:p-10 pb-28` et le wrapper `flex items-center justify-center`. Le `DynamicProductVisual` doit être en `absolute inset-0` pour remplir toute la div sans padding. Le `rounded-lg` du className est aussi supprimé.

**`src/components/product/DynamicProductVisual.tsx`** — quand `fillContainer` est true, supprimer le `rounded-sm` résiduel et s'assurer que le container est `absolute inset-0` ou `w-full h-full` sans aspect-ratio.

### 2. Espacement SaveConfigCTA

**`src/pages/ConfigurateurPage.tsx`** — ajouter un `mt-10` ou `pt-8` avant le `<SaveConfigCTA>` pour le séparer visuellement du contenu des steps.

### 3. Bouton "Visualiser mon store chez moi" + fonctionnalité projection

**Concept** : Un bouton overlay sur le visuel gauche ouvre un dialog. L'utilisateur uploade une photo de sa terrasse. La photo est envoyée à une edge function qui utilise Gemini pour générer une image composite : le store configuré (couleur toile, armature, LED) projeté sur la photo de terrasse de l'utilisateur.

**Fichiers à créer / modifier :**

- **`src/components/product/VisualizeAtHomeDialog.tsx`** (nouveau) :
  - Dialog avec zone d'upload drag & drop (accepte JPG/PNG/WebP, max 5MB)
  - Prévisualise la photo uploadée
  - Bouton "Générer la projection" → appelle l'edge function
  - Affiche le résultat (image générée) avec skeleton loader
  - Bouton télécharger le résultat
  - Props : `toileColor`, `armatureColor`, `options` (même interface que DynamicProductVisual)

- **`supabase/functions/project-store-on-photo/index.ts`** (nouveau) :
  - Reçoit : photo terrasse en base64, paramètres du store (toileColorHex/Label, armatureColorHex/Label, led)
  - Encode la photo utilisateur et l'éventuelle photoUrl de toile comme images dans un prompt multimodal Gemini
  - Prompt : "Place a retractable cassette awning on this terrace photo. The awning fabric is [color], the frame is [color]. Make it look realistic and naturally integrated. Preserve the original photo composition."
  - Retourne l'image générée

- **`src/pages/ConfigurateurPage.tsx`** :
  - Ajoute un bouton "Visualiser chez moi" en overlay sur le visuel (en bas à droite, au-dessus de la fiche technique)
  - Ouvre le `VisualizeAtHomeDialog`

### Architecture du flux

```text
[Bouton overlay sur visuel] 
  → Dialog s'ouvre
  → Upload photo terrasse (client-side, FileReader → base64)
  → Clic "Générer"
  → POST /project-store-on-photo { photo: base64, toile, armature, led }
  → Gemini génère l'image composite
  → Affichage résultat dans le dialog
  → Option télécharger
```

Pas de stockage en base : tout est en mémoire, la photo et le résultat restent côté client.

