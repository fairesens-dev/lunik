

## 4 corrections demandées

### 1. Bullet points "Des matériaux solides" — même taille que la description
**Fichier** : `src/components/product/ProductFeaturesSection.tsx` (ligne 37)
- Passer les specs de `text-xs` a `text-sm` pour correspondre a la description (ligne 34).

### 2. Logo "Une marque accompagnée par" — h-32 et mt ajusté
**Fichier** : `src/components/Footer.tsx` (ligne 111)
- Changer `h-40 -mt-12` en `h-32 -mt-[2.3rem]`.

### 3. Notifications marketing cachées sur desktop par la sticky bar
**Fichier** : `src/components/SocialProofToast.tsx` (ligne 91)
- La notification est positionnée `bottom-20 sm:bottom-6 left-6`. Sur desktop, la StickyCTABar recouvre cette position.
- Passer a `bottom-20` sur tous les écrans (ou `sm:bottom-20`) pour remonter la notification au-dessus de la barre sticky.

### 4. Carte Normandie — supprimer le path silhouette, couvrir tout le fond
**Fichier** : `src/components/home/NormandySection.tsx`
- Supprimer le `<path>` de la silhouette de France (lignes 20-24).
- Changer le conteneur SVG de `absolute -inset-4` a `absolute inset-0` pour couvrir exactement la div.
- Le SVG garde `preserveAspectRatio="xMidYMid slice"` pour remplir tout l'espace. Les marqueurs de villes et le cercle usine restent en place.

