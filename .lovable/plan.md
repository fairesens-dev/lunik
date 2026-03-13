

## Plan: Nouveau Webdesign — Landing Page Vidéo Immersive

### Direction créative

Tendances 2026 appliquées :
- **Video-first hero** : bandeau plein écran avec vidéo en arrière-plan, overlay gradient, texte centré
- **Scroll-triggered reveals** : sections qui apparaissent avec des animations plus cinématiques
- **Bento grid layout** : remplacement du checkerboard classique par une grille asymétrique type Apple/Linear
- **Social proof intégré au hero** : compteurs animés directement dans le bandeau vidéo
- **Sections alternées dark/light** : rythme visuel fort avec des inversions de fond
- **Sticky CTA bar** : barre flottante qui apparaît après scroll du hero

### Fichiers modifiés

| Fichier | Action |
|---|---|
| `src/components/home/HeroSection.tsx` | **Rewrite** — Video hero plein écran |
| `src/components/home/MarqueeSection.tsx` | **Rewrite** — Style glassmorphism |
| `src/components/home/ProductHighlightSection.tsx` | **Rewrite** — Bento grid layout |
| `src/components/home/ValuesSection.tsx` | **Rewrite** — Horizontal scroll cards |
| `src/components/home/ConfiguratorCTASection.tsx` | **Rewrite** — Split dark section avec compteurs |
| `src/components/home/TestimonialsSection.tsx` | **Minor** — Fond dark, style cards ajusté |
| `src/components/home/ProcessSection.tsx` | **Rewrite** — Timeline horizontale |
| `src/components/home/FAQSection.tsx` | **Minor** — Fond light |
| `src/components/home/ContactCTASection.tsx` | **Rewrite** — CTA immersif avec image fond |
| `src/components/Header.tsx` | **Update** — Transparent sur hero, solid au scroll |
| `src/pages/Index.tsx` | **Update** — Ajout sticky CTA bar + réordonnancement sections |
| `src/index.css` | **Update** — Nouvelles classes utilitaires (video overlay, bento) |

### Section par section

**1. Hero — Video plein écran**
- `<video>` en background (source: vidéo Pexels/libre de droits d'une terrasse ensoleillée — en attendant, on utilise une vidéo placeholder via URL publique type `https://videos.pexels.com/...` ou un fallback sur l'image existante)
- Overlay gradient `from-black/60 via-black/30 to-transparent`
- Texte centré verticalement : overline, titre XXL (font-display 7xl+), sous-titre
- Deux CTA : "Configurer mon store" (bouton primary) + "Voir nos réalisations" (bouton outline blanc)
- Trust badges en bas du hero (pills glass effect : `bg-white/10 backdrop-blur-sm`)
- Compteurs animés intégrés (5000+ stores, 4.9/5 Trustpilot, 173 coloris)
- Hauteur : `min-h-screen`
- Fallback poster image si vidéo ne charge pas

**2. Header — Transparent mode**
- Sur la homepage uniquement : header transparent `bg-transparent` au-dessus du hero
- Au scroll : transition vers `bg-card/95 backdrop-blur-md` (comportement actuel)
- Logo en blanc quand transparent, normal quand scrolled
- Liens en blanc quand transparent

**3. Marquee — Glass ribbon**
- Fond semi-transparent `bg-foreground/5 backdrop-blur-sm` au lieu du fond primary plein
- Texte foreground au lieu de primary-foreground

**4. Product Highlight — Bento Grid**
- Grille asymétrique : 1 grande carte (2 colonnes) + 2 petites cartes
- Chaque carte : image de fond, overlay gradient, titre + description en overlay
- Hover : scale de l'image + opacity du texte
- 6 cartes au total en 2 rangées de 3 (alternance grande/petite)

**5. Features (dark section)** — Inchangé, fonctionne bien

**6. Values — Scroll horizontal**
- Cards horizontales avec scroll snap
- Chaque card : grande image, icône, titre, description
- Indicateur de scroll (dots ou fraction)

**7. Configurator CTA — Split immersif**
- Fond dark (foreground)
- Gauche : compteurs animés empilés verticalement
- Droite : texte + CTA lumineux
- Pas d'image, juste texte/chiffres sur fond sombre

**8. Process — Timeline horizontale**
- 5 étapes en ligne horizontale avec scroll sur mobile
- Cercles numérotés connectés par une ligne
- Descriptions sous chaque cercle

**9. Contact CTA — Image de fond**
- Image terrasse en background au lieu de fond uni
- Overlay sombre
- Texte blanc centré + CTAs

**10. Sticky CTA Bar (nouveau)**
- Apparaît après scroll du hero (IntersectionObserver)
- Barre fixe en bas : "Store Coffre Sur-Mesure — à partir de X€" + bouton "Configurer"
- `bg-primary text-primary-foreground` avec `backdrop-blur`
- Se cache sur scroll up, apparaît sur scroll down (optionnel, peut rester fixe)

### Vidéo hero

Pour la vidéo, on utilise un fichier vidéo libre de droits hébergé. Deux options :
- URL Pexels directe (ex: vidéo de terrasse/jardin ensoleillé)
- Fallback gracieux : si la vidéo ne charge pas, l'image `store-vue-ensemble.webp` s'affiche comme poster

La vidéo sera en `autoplay muted loop playsinline` pour la compatibilité mobile.

### Palette & typo

Aucun changement de palette/typo — on conserve le teal profond + DM Sans + Inter Tight. Le changement est purement structurel et layout.

