

# Plan : Uniformiser la largeur des colonnes du checkout

## Diagnostic

La grille CSS est identique dans les 3 étapes (`lg:grid-cols-[minmax(0,1fr)_400px]`), mais la colonne sidebar n'a pas de `min-w-0`. Dans l'étape 1, le contenu du OrderSummary (section code promo avec Input + Button) a une largeur intrinsèque minimale qui dépasse 400px, forçant le navigateur à agrandir la colonne droite au détriment de la gauche.

## Solution

Ajouter `min-w-0` sur le wrapper de la sidebar desktop dans les 3 fichiers CheckoutStep pour contraindre la colonne à respecter les 400px du grid track.

| Fichier | Modification |
|---------|-------------|
| `CheckoutStep1.tsx` | `<div className="hidden lg:block">` → `<div className="hidden lg:block min-w-0">` |
| `CheckoutStep2.tsx` | Idem |
| `CheckoutStep3.tsx` | Idem |

