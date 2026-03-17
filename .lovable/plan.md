

# Plan : Uniformiser la largeur de la colonne gauche du checkout

## Diagnostic

Les 3 étapes utilisent la même grille CSS `lg:grid-cols-[minmax(0,1fr)_400px]`. Le problème probable est que le conteneur parent `max-w-[1100px]` combiné avec le padding `px-6` laisse le grid se dimensionner correctement, mais les éléments `lg:hidden` (OrderSummary mobile) créent un 3ème enfant dans le grid qui perturbe le layout sur certains navigateurs.

## Solution

Restructurer les 3 étapes pour n'avoir que **2 enfants directs** dans le grid desktop, en regroupant le contenu gauche + l'OrderSummary mobile dans un seul wrapper, et en déplaçant l'OrderSummary desktop dans le 2ème slot.

### Modification dans les 3 fichiers checkout

Remplacer le pattern actuel (3 enfants grid) :
```
<div className="grid ... lg:grid-cols-[minmax(0,1fr)_400px]">
  <form/div> ... </form/div>          ← enfant 1
  <div className="lg:hidden">...</div> ← enfant 2 (caché desktop mais grid cell)
  <div className="hidden lg:block">...</div> ← enfant 3
</div>
```

Par un pattern à **2 enfants** :
```
<div className="grid ... lg:grid-cols-[minmax(0,1fr)_400px]">
  <div className="min-w-0">
    <form/div> ... </form/div>
    <div className="lg:hidden mt-8">...</div>  ← OrderSummary mobile DANS le col gauche
  </div>
  <div className="hidden lg:block">            ← OrderSummary desktop seul
    <div className="sticky top-8">...</div>
  </div>
</div>
```

### Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `CheckoutStep1.tsx` | Regrouper form + OrderSummary mobile dans un wrapper div |
| `CheckoutStep2.tsx` | Idem |
| `CheckoutStep3.tsx` | Idem |

