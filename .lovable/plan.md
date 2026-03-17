

# Plan : Schéma SVG interactif "Astuces pour bien mesurer"

## Ce qui change

Remplacement du bloc texte (lignes 146-158 de `ConfiguratorSection.tsx`) par un composant SVG inline montrant une vue de profil d'un store banne avec les 4 cotes annotées :

1. **Largeur** (flèche horizontale en haut du store, avec label "Zone + 40 cm de chaque côté")
2. **Avancée** (flèche horizontale sous le store déployé, du mur au bout)
3. **Hauteur sous linteau** (flèche verticale du sol au point de fixation, "≥ 2 m")
4. **Inclinaison** (arc + angle "≥ 15°" entre l'horizontale et la toile)

## Implémentation

### 1. Créer `src/components/product/MeasurementDiagram.tsx`

Composant React retournant un SVG inline (~300×200 viewBox) représentant :
- Un mur (rectangle gris à gauche)
- Un sol (ligne en bas)
- Le coffre du store (rectangle arrondi fixé au mur)
- La toile déployée en pente (trapèze/ligne inclinée depuis le coffre)
- Le bras articulé (lignes sous la toile)
- 4 annotations avec flèches et labels :
  - Largeur : flèche double ↔ en haut, couleur `primary`
  - Avancée : flèche double ↔ horizontale sous la toile
  - Hauteur : flèche double ↕ verticale du sol au coffre
  - Inclinaison : arc d'angle avec "≥ 15°"

Le SVG utilisera les couleurs Tailwind via `currentColor` et classes CSS pour s'intégrer au design. Responsive via `w-full` avec `viewBox` fixe.

### 2. Modifier `ConfiguratorSection.tsx` (lignes 146-158)

Remplacer la `<ul>` par le schéma SVG suivi d'une légende compacte reprenant les 4 points clés en une ligne chacun sous le schéma.

Structure finale du bloc :
```
┌─ Astuces pour bien mesurer ─────────┐
│  [Lightbulb] Astuces pour bien...   │
│  ┌─────────────────────────────┐    │
│  │   SVG: store + 4 cotes     │    │
│  └─────────────────────────────┘    │
│  • Largeur = zone + 40cm/côté      │
│  • Avancée = mur → bout déployé    │
│  • Hauteur ≥ 2m sous linteau       │
│  • Inclinaison ≥ 15°               │
└─────────────────────────────────────┘
```

