

## Plan : Refonte complète du configurateur — Encadrés visuels, navigation, options marketing, réassurance

### 1. Colonne gauche — 2 encadrés miniatures + bouton "Visualiser chez moi" remonté

Remplacer le bouton "Visualiser chez moi" flottant par **2 miniatures cliquables** en bas à gauche (au-dessus de la fiche technique) :

- **Miniature 1** : "Projeter sur ma terrasse" — icône Camera, ouvre le `VisualizeAtHomeDialog` existant
- **Miniature 2** : "Voir la toile de près" — icône Eye/ZoomIn, ouvre un dialog simple affichant soit la `photoUrl` de la toile sélectionnée en plein écran, soit un gros plan IA généré via l'edge function `generate-store-image` avec un prompt close-up

Les 2 encadrés : `w-[140px] h-[80px]`, fond glass morphism `bg-background/80 backdrop-blur`, border, positionnés en `absolute bottom-[100px] left-4`, dans un `flex gap-2`.

Supprimer l'ancien bouton "Visualiser chez moi" (lignes 138-145).

### 2. Header — Retirer le bouton "Commander"

Supprimer le bloc conditionnel lignes 108-118 (le `{basePrice !== null && (...)}` avec le bouton Commander dans le header). Garder juste le `<div className="flex-1" />` vide à droite.

### 3. Navigation steps — Bouton contextuel unique

Remplacer les doubles boutons "Suivant"/"Précédent" dans chaque step par un **seul footer de navigation** sous les step indicators, en dehors du contenu conditionnel :

- Step 01 : bouton principal "Couleurs →"
- Step 02 : "← Dimensions" (outline) + "Options →" (primary)
- Step 03 : "← Couleurs" (outline) + "Commander" (gradient, appelle `handleOrder`)

Supprimer les boutons Suivant/Précédent actuels à l'intérieur de chaque step (lignes 258-260, 302-305, 354-356).

Le bouton "Commander" n'apparaît que sur la step 03 et dans la barre sticky en bas.

### 4. Options — Refonte marketing (sans emoji)

Modifier `src/lib/pricingTable.ts` pour :

- Retirer tous les `icon` emoji, les remplacer par des descriptions textuelles courtes
- Ajouter des `tip` avec témoignages clients crédibles (prénom, ville)
- Ajouter `badge: "POPULAIRE"` sur LED coffre, `badge: "COUP DE CŒUR"` sur LED bras, `badge: "RECOMMANDÉ"` sur capteur vent
- `manoeuvre-manuelle` : pas de badge, pas de highlight, tip d'avertissement neutre
- Ajouter `highlight: true` sur LED coffre et capteur vent
- Ajouter un champ `socialProof?: string` (ex: "78% des clients choisissent cette option")

Dans `ConfigurateurPage.tsx` step 03 :
- Réordonner : options premium d'abord (LED coffre, LED bras, capteur vent), pose plafond, radio CSI, manoeuvre manuelle en dernier
- Les options premium ont un design plus riche : fond gradient léger quand sélectionnées, social proof sous le switch
- Manoeuvre manuelle : style discret, grisé, pas de mise en valeur

### 5. Témoignages et réassurance dans les steps

Ajouter dans chaque step un petit bloc de réassurance contextuel :

- **Step 01 (Dimensions)** : "Fabrication française sur-mesure · Garantie 5 ans structure" + mini-témoignage
- **Step 02 (Couleurs)** : "Toile Dickson garantie 10 ans · Résistance UV maximale" + mini-témoignage
- **Step 03 (Options)** : "Installation professionnelle · SAV réactif" + mini-témoignage

Format : petit encadré `border-l-2 border-primary pl-3` avec texte en italique, prénom et ville.

### 6. Espacement SaveConfigCTA

Conserver le `mt-10` existant. Ajouter un `border-t border-border pt-8` pour mieux séparer.

### Fichiers modifiés

- **`src/pages/ConfigurateurPage.tsx`** : header sans Commander, 2 encadrés miniatures, navigation contextuelle, réassurance par step, options redesignées
- **`src/lib/pricingTable.ts`** : options sans emoji, badges marketing, social proof, tips témoignages
- **`src/components/product/ToileCloseUpDialog.tsx`** (nouveau) : dialog plein écran pour voir le motif/matière de la toile sélectionnée

