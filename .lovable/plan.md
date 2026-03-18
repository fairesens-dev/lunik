

## Problème

Il n'y a aucun composant `ScrollToTop` dans le projet. React Router ne scroll pas automatiquement en haut lors d'un changement de route — c'est un comportement attendu qu'il faut ajouter manuellement.

## Solution

Créer un composant `ScrollToTop` qui écoute les changements de `location.pathname` et appelle `window.scrollTo(0, 0)`, puis l'ajouter dans le `BrowserRouter` de `App.tsx`.

### Fichiers modifiés

1. **`src/components/ScrollToTop.tsx`** (nouveau) — Composant simple :
   ```tsx
   import { useEffect } from "react";
   import { useLocation } from "react-router-dom";
   
   const ScrollToTop = () => {
     const { pathname } = useLocation();
     useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
     return null;
   };
   export default ScrollToTop;
   ```

2. **`src/App.tsx`** — Importer `ScrollToTop` et le placer juste après `<BrowserRouter>`, avant `<ContentProvider>`.

