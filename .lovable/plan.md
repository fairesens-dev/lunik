

## Plan : Grille tarifaire réelle + nouvelles options

### Données extraites de la capture d'écran

**Grille de prix TTC** (largeur en mm × avancée en mm) :

```text
                 1900-2399  2400-2899  2900-3399  3400-3600  3601-3899  3900-4399  4400-4800  4801-5920
Avancée 1500     2 849      3 159      3 159      3 159      3 569      3 569      3 569      3 789
Avancée 2000     —          3 239      3 239      3 239      3 669      3 669      3 669      3 919
Avancée 2500     —          —          3 359      3 359      3 809      3 809      3 809      4 079
Avancée 3000     —          —          —          3 499      3 969      3 969      3 969      4 269
Avancée 3500     —          —          —          —          —          4 089      4 089      —
```

**Options TTC** :
| Option | Prix TTC |
|---|---|
| Éclairage LED sous coffre SOMFY | +859 € |
| Éclairage LED sous les bras SOMFY | +959 € |
| Automatisme Vent SOMFY 3D IO | +199 € |
| Pose plafond avec équerre | +289 € |
| Manœuvre manuelle treuil + manivelle | −619 € (remplace la motorisation par défaut) |
| Manœuvre SOMFY RADIO CSI | +199 € |

**Observation importante** : Le prix de base inclut déjà la motorisation SOMFY. L'option "Manœuvre manuelle" est une **réduction** de -619 € car elle retire la motorisation.

---

### Ce qui va changer

#### 1. Nouvelle table de prix statique (`src/lib/pricingTable.ts`)
- Créer un fichier contenant la grille complète (plages de largeur × avancées autorisées → prix TTC).
- Fonction `lookupPrice(widthMm: number, projectionMm: number): number | null` qui retourne le prix ou `null` si la combinaison est invalide.
- Fonction `getValidProjections(widthMm: number): number[]` pour savoir quelles avancées sont disponibles pour une largeur donnée.
- Fonction `getWidthRanges(): {min, max, label}[]` listant les plages de largeur.

#### 2. Nouvelles options statiques
- Remplacer les 3 options actuelles (motorisation/LED/pack) par les 6 options du tarif.
- "Manœuvre manuelle" sera une option qui **soustrait** 619 € (motorisation incluse par défaut).
- Les options seront indépendantes (pas de pack, pas de logique d'inclusion mutuelle).

#### 3. Refonte du hook `useConfigurator.ts`
- Largeur : sélection par **plage** (dropdown ou slider snappé aux plages : 190-239, 240-289, etc.) avec saisie libre en cm, arrondie à la plage.
- Avancée : **dropdown** limité aux valeurs autorisées (150, 200, 250, 300, 350 cm) filtrées selon la largeur choisie.
- Prix = `lookupPrice(largeur, avancée)` + somme des options cochées.
- Plus de calcul `surfaceArea × baseRate`.

#### 4. Mise à jour de `ConfiguratorSection.tsx`
- Largeur : champ numérique libre (en cm, min 190, max 592) — le système identifie automatiquement la plage tarifaire.
- Avancée : **select dropdown** avec uniquement les avancées valides pour la largeur choisie (ex: largeur 200cm → seule avancée 150 disponible).
- Section options : 6 options avec switches, l'option "Manœuvre manuelle" affiche "−619 €" en vert.
- Le prix affiché est le prix TTC exact de la grille + options.

#### 5. Fichiers modifiés
- **Nouveau** : `src/lib/pricingTable.ts` — grille + lookup
- **Modifié** : `src/hooks/useConfigurator.ts` — nouveau calcul de prix, nouvelles options, contraintes de dimensions
- **Modifié** : `src/components/product/ConfiguratorSection.tsx` — UI dropdown avancée, 6 options, affichage prix

