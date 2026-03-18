

# Plan : Améliorations de la modal échantillons

## Modifications

### 1. `SampleCart.tsx` — Retirer les chips, ajouter bloc marketing

Remplacer la section chips (liste des échantillons sélectionnés avec ×) par un bloc marketing :
- Icône cadeau + texte : **"Échantillons offerts pour tout achat d'un store LuniK"**
- En petit dessous : "La commande d'échantillons génère un avoir du même montant, utilisable lors de votre commande de store LuniK."
- Garder le pricing et le shipping info en dessous

### 2. `SampleColorCard.tsx` — Ajouter loupe sur les couleurs avec photo

Ajouter un bouton loupe (icône `Search`) visible au hover sur le swatch quand `photoUrl` est disponible. Au clic, ouvrir une lightbox (Dialog) montrant la photo en grand — similaire à `ToileColorSelector`.

Remonter la logique lightbox dans `SampleOrderModal` : passer un callback `onZoom` à chaque card, et gérer le Dialog lightbox dans la modal parente.

### 3. `SampleOrderModal.tsx` — Fix scroll + 3 colonnes + lightbox

- **Scroll cassé** : Le `ScrollArea` avec `flex-1 min-h-0` ne fonctionne pas car le `DialogContent` n'a pas `overflow-hidden`. Remplacer `ScrollArea` par un simple `div` avec `overflow-y-auto` et une hauteur max calculée, ou ajouter `overflow-hidden` au parent flex.
- **3 colonnes** : Changer la grille de `grid-cols-1 sm:grid-cols-2` à `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
- **Lightbox** : Ajouter un state `lightboxColor` + Dialog comme dans `ToileColorSelector`

### 4. Fichiers modifiés

| Fichier | Action |
|---|---|
| `src/components/samples/SampleCart.tsx` | Retirer chips, ajouter bloc marketing avoir |
| `src/components/samples/SampleColorCard.tsx` | Ajouter bouton loupe + callback onZoom |
| `src/components/samples/SampleOrderModal.tsx` | Fix scroll, 3 cols, lightbox, passer onZoom |

