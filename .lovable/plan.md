

## Plan : Modernisation complète inspirée de Zohco — Direction éditoriale, teal profond, typographie massive

### Analyse Zohco — Patterns clés identifiés

- **Palette** : Teal profond (#043333) sur fond gris-vert très clair (#E8EDEB), accents teal, pas de couleurs chaudes
- **Typo** : Headlines massives (80-100px+), font Rethink Sans / Inter Tight, tracking serré
- **Hero** : Titre géant pleine largeur AU-DESSUS d'une image panoramique (pas de split layout)
- **Marquee** : Logos partenaires défilants (pas texte)
- **Values** : Cards avec image + tags/pills cliquables
- **Features** : Tabs numérotés (01, 02, 03) avec image qui change
- **Services** : Grille de cards avec image en haut + titre + description
- **Stats** : Compteurs animés (120M+, 490+, 98.9%)
- **Témoignages** : Très grandes cards avec photo portrait, slider avec compteur 01/04
- **CTA** : Section sombre avec images dispersées autour du texte
- **Boutons** : Style "reveal" avec texte qui double au hover, fond sombre arrondi
- **Espacement** : Très généreux, sections aérées, beaucoup de blanc

### 1. Nouvelle palette de couleurs (`src/index.css`)

```text
AVANT (ambre/orange)              →  APRÈS (teal/forest)
──────────────────────────────────────────────────────────
--primary: 35 95% 55% (ambre)     →  174 86% 12% (teal profond #043333)
--accent-light: 25 90% 58%        →  170 50% 25% (teal moyen)
--background: 40 40% 97%          →  150 12% 92% (gris-vert clair #E8EDEB)
--card: 35 35% 95%                →  150 10% 96% (gris presque blanc)
--foreground: 20 15% 12%          →  174 86% 12% (teal profond)
--muted-fg: 25 10% 45%            →  160 8% 45%
--border: 30 25% 88%              →  150 10% 85%
```

### 2. Typographie (`index.html` + `tailwind.config.ts`)

- Remplacer Outfit + DM Sans par **Inter Tight** (headlines) + **DM Sans** (body, conservé)
- Headlines beaucoup plus grandes : `text-6xl md:text-7xl lg:text-8xl`
- Tracking serré sur les titres : `tracking-tight`

### 3. Boutons (`button.tsx`)

- Nouveau style : fond teal profond, `rounded-full`, hover reveal effect
- Variant "gradient" → fond teal uni `bg-primary text-white` avec hover scale
- Suppression du gradient ambre

### 4. Header (`Header.tsx`)

- Style Zohco : fond `bg-card` avec border-bottom subtil, pas de glass morphism
- Logo à gauche, nav centrée, CTA bouton arrondi sombre à droite
- Plus épuré, espacement plus généreux

### 5. Hero (`HeroSection.tsx`) — Refonte totale

- **Layout** : Titre géant pleine largeur en haut, puis image panoramique en dessous (pas de split 55/45)
- Titre massif `text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight`
- Sous le titre : paragraphe + bouton CTA à gauche, badges trust à droite
- Image panoramique : `aspect-[21/9] rounded-2xl` avec légère superposition sur le titre
- Fond : `bg-background` uni, très aéré

### 6. Marquee (`MarqueeSection.tsx`)

- Remplacer le texte défilant par des badges/pills de confiance défilants (Trustpilot, Made in France, Garantie 5 ans, Dickson, Somfy) — même contenu, style pill sur fond transparent avec border

### 7. ProductHighlight → Section "Values" style Zohco

- 2 blocs empilés : chaque bloc = image + colonne texte avec tag pills (comme "human-centered", "Eco development")
- Tags = petites pills `border rounded-full px-3 py-1`
- Alternance image gauche/droite

### 8. ProductFeatures → Tabs numérotés style Zohco

- 3 tabs (Toile, Structure, Motorisation) avec numéros `01.` `02.` `03.`
- Tab actif = contenu affiché avec image à droite
- Style : liste verticale de tabs à gauche, grande image à droite
- Fond sombre `bg-foreground text-background` pour contraste

### 9. ValuesSection → Services cards grid

- 6 cards en grille 3x2
- Chaque card : image ronde/carrée en haut, titre, description
- Fond card blanc, hover lift

### 10. ConfiguratorCTA → Section stats + CTA

- Compteurs animés : "5 000+ stores installés", "4.9/5 Trustpilot", "173 coloris"
- Grande image d'ambiance + texte + bouton CTA

### 11. Gallery → Garder masonry mais avec `rounded-2xl` plus prononcé

### 12. Testimonials → Style Zohco large cards

- Cards plus grandes avec fond blanc, grande citation
- Slider avec compteur `01 / 04`
- Flèches de navigation stylisées

### 13. Process → Steps numérotés avec ligne verticale

- Style minimal : numéro + titre + description en colonne
- Ligne de connexion teal

### 14. FAQ → Plus minimal

- Accordion pleine largeur, pas de border arrondi, juste des séparateurs horizontaux

### 15. ContactCTA → Section teal profond

- Fond `bg-primary` (teal), texte blanc
- 2 boutons : outline blanc + filled blanc
- Optionnel : petites images dispersées comme Zohco

### 16. Footer → Minimal teal

- Fond teal profond, texte clair
- Layout 4 colonnes plus aéré

### Fichiers modifiés (16 fichiers)

| Fichier | Changement principal |
|---|---|
| `index.html` | Font Inter Tight |
| `src/index.css` | Palette teal complète |
| `tailwind.config.ts` | fontFamily Inter Tight |
| `src/components/ui/button.tsx` | Style teal, hover reveal |
| `src/components/Header.tsx` | Minimal, fond card, CTA sombre |
| `src/components/home/HeroSection.tsx` | Full-width, titre géant + panoramique |
| `src/components/home/MarqueeSection.tsx` | Pills trust défilantes |
| `src/components/home/ProductHighlightSection.tsx` | Values + tag pills |
| `src/components/product/ProductFeaturesSection.tsx` | Tabs numérotés, fond sombre |
| `src/components/home/ValuesSection.tsx` | Cards services grille |
| `src/components/home/ConfiguratorCTASection.tsx` | Stats animés + CTA |
| `src/components/home/GallerySection.tsx` | Arrondi plus prononcé |
| `src/components/home/TestimonialsSection.tsx` | Large cards, compteur |
| `src/components/home/ProcessSection.tsx` | Minimal numéroté |
| `src/components/home/FAQSection.tsx` | Séparateurs, minimal |
| `src/components/home/ContactCTASection.tsx` | Fond teal, CTA blanc |
| `src/components/Footer.tsx` | Teal profond, 4 colonnes |

### Approche

Phase 1 : Fondations (palette, typo, boutons)
Phase 2 : Layout (Header, Footer)
Phase 3 : Sections dans l'ordre de la page (Hero → ContactCTA)

