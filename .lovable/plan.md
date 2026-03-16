

## Probleme

La modal du widget chat sur mobile a deux problemes :
1. **Trop petite** : `maxHeight: min(480px, calc(100vh - 120px))` combiné avec `max-sm:max-h-[75vh]` limite trop la hauteur
2. **Pas de scroll** : le conteneur `overflow-hidden` empêche le scroll du contenu interne
3. **Position/largeur instables** : les classes `max-sm:w-[calc(100%-2rem)]` changent la largeur sur mobile

## Plan

Modifier la ligne 273-274 du composant `src/components/ContactWidget.tsx` :

- Supprimer `max-sm:w-[calc(100%-2rem)]` et `max-sm:max-h-[75vh]` — garder la largeur fixe `w-[340px]` sur tous les écrans
- Augmenter le `maxHeight` inline à `min(600px, calc(100vh - 100px))` pour donner plus de hauteur
- La position (`bottom-6 right-6`) reste inchangée
- Le scroll interne fonctionne déjà via `overflow-y-auto` sur les sous-conteneurs ; le problème est que `max-sm:max-h-[75vh]` écrase le `maxHeight` inline et réduit trop l'espace

