

# Fix : aligner la largeur de la sidebar sur les 3 étapes du checkout

Le problème est simple : `CheckoutStep2.tsx` utilise encore `lg:grid-cols-[1fr_380px]` alors que Step1 et Step3 ont été mis à jour à `lg:grid-cols-[1fr_400px]`.

## Correction

**Fichier** : `src/components/checkout/CheckoutStep2.tsx` (ligne 27)

Changer `lg:grid-cols-[1fr_380px]` → `lg:grid-cols-[1fr_400px]`

C'est la seule modification nécessaire.

