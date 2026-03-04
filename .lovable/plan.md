

## Plan : Tri par catégories, classement par nuance, accordéons et lightbox

### Approche

**1. Classification automatique des coloris** (nouveau fichier `src/lib/classifyToileColor.ts`)

Fonction qui analyse le nom de fichier pour déterminer la catégorie :
- **Unis** : noms simples sans indicateurs de motif (ex: `ecru`, `charcoal`, `gris`)
- **Rayés** : contiennent `BS` (bloc-store), `rayure`, `stripe`, ou plusieurs couleurs séparées
- **Motifs / Texturés** : contiennent `tweed`, `chine`, `pique`, `fantaisie`, `jacquard`, `manosque`, `littoral`, `dickson` pattern names

Heuristique : si le label contient des mots-clés connus → catégorie correspondante, sinon → Uni par défaut.

**2. Tri par nuance au sein de chaque catégorie**

Extraire une nuance dominante depuis le label (mots-clés : rouge, bleu, beige, gris, vert, jaune, marron, blanc, noir, orange...) et grouper/trier par nuance. Les coloris sans nuance identifiable vont à la fin.

**3. Refonte de la section 02 du configurateur** (`ConfiguratorSection.tsx`)

Remplacer le `flex-wrap` plat par des accordéons Radix (déjà installé) :

```
02 — COULEUR DE TOILE
Toile Orchestra by Dickson · 156 coloris

▼ Unis (82 coloris)
  [pastilles en grille, triées par nuance]

▶ Rayés (45 coloris)
  [pastilles en grille, triées par nuance]

▶ Motifs & Texturés (29 coloris)
  [pastilles en grille, triées par nuance]
```

Premier accordéon ouvert par défaut. Le coloris sélectionné est toujours visible (son accordéon s'ouvre automatiquement).

**4. Icône loupe + lightbox**

Sur chaque pastille, au hover, afficher une petite icône `Search` (lucide) en bas à droite. Au clic sur la loupe (pas sur la pastille), ouvrir un `Dialog` Radix affichant l'image en grand format avec le nom du coloris. Le clic sur la pastille elle-même continue de sélectionner le coloris.

### Fichiers impactés

| Fichier | Changement |
|---|---|
| `src/lib/classifyToileColor.ts` | Nouveau — classification + tri par nuance |
| `src/components/product/ConfiguratorSection.tsx` | Accordéons par catégorie, loupe, lightbox Dialog |

