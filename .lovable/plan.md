

## Problème

Le SVG contient un `<path>` qui dessine une silhouette de la France — c'est cette forme remplie (`fill-primary/[0.04]`) avec un contour (`stroke-primary/[0.12]`) qui crée l'effet de "périmètre" visible. La carte SVG est dans sa propre div au lieu d'être en arrière-plan de toute la section.

## Solution

1. **Supprimer le path de silhouette de France** — c'est lui qui crée la forme de "région" englobant la carte
2. **Passer le SVG en position absolue couvrant toute la div principale** (la carte arrondie) — pas dans une sous-div, mais directement en `absolute inset-0` sur la div principale
3. **Sur mobile** : le SVG reste en arrière-plan de toute la carte, le texte par-dessus avec un léger fond semi-transparent pour la lisibilité
4. **Sur desktop** : comportement similaire, SVG en fond sur toute la largeur

### Changements concrets dans `NormandySection.tsx` :

- Remplacer la div conteneur du SVG (`relative w-full md:absolute...`) par une div `absolute inset-0` sans contrainte de largeur
- Supprimer le `<path>` de la silhouette France (lignes 20-24)
- Ajuster le `viewBox` pour centrer les éléments restants (villes + cercle usine) sur toute la surface
- Ajouter un fond semi-transparent derrière le texte sur mobile pour garder la lisibilité (`bg-card/80 backdrop-blur-sm` sur le bloc texte, sur mobile uniquement)
- Le SVG occupera tout l'espace de la carte avec `w-full h-full` en position absolue

