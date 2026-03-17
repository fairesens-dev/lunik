

## Plan : Rebranding Total LuniK — Direction Solaire & Moderne

### Tendances 2026 integrées
- **Warm maximalism** : palettes chaudes (ambre/safran/corail) remplaçant les tons froids/sage
- **Rounded UI** : `border-radius` généreux partout (boutons, cartes, inputs) — fin de l'ère sharp/brutalist
- **Micro-interactions** : hover effects plus expressifs, transitions fluides
- **Gradients subtils** : fonds avec gradients warm, pas aplats
- **Typography contrast** : titres très gras + body léger, tailles plus grandes
- **Dark sections inversées** : sections hero/CTA avec fond sombre + accents lumineux
- **Glass morphism léger** : header translucide avec blur

---

### 1. Nouvelle palette de couleurs (`src/index.css`)

Remplacement complet des CSS variables :

```text
AVANT (sage/ecru)              →  APRÈS (solaire/ambre)
─────────────────────────────────────────────────────────
--primary: 100 24% 30% (sage)  →  35 95% 55% (ambre doré #F5A623)
--accent-light: 100 18% 55%    →  25 90% 58% (orange chaud #E8742A)
--background: 37 33% 93%       →  40 40% 97% (crème chaud #FAF7F2)
--card: 50 20% 97%             →  35 35% 95% (sable clair #F5F0E8)
--foreground: 0 0% 10%         →  20 15% 12% (brun profond)
--muted-fg: 0 0% 42%           →  25 10% 45% (brun moyen)
--border: 30 16% 87%           →  30 25% 88% (sable border)
--ring: 100 24% 30%            →  35 95% 55% (ambre)
--destructive: inchangé
```

Mode dark ajusté avec ambre/orange en accents lumineux sur fond sombre.

### 2. Typographie (`tailwind.config.ts` + `index.css`)

- Headlines : **"Playfair Display"** (plus moderne que Cormorant Garamond, plus de poids)
- Body : **"DM Sans"** (plus rond et chaleureux qu'Inter)
- Import Google Fonts dans `index.html`
- `--radius: 0rem` → `--radius: 0.75rem` (tout arrondi)

### 3. Boutons (`src/components/ui/button.tsx`)

- `rounded-md` → `rounded-full` pour les CTA principaux
- Nouveau variant "gradient" : `bg-gradient-to-r from-amber-500 to-orange-500 text-white`
- Padding plus généreux, shadow sur hover
- Suppression de `rounded-none` dans TOUS les composants (Header, Hero, Configurator, Footer, etc.)

### 4. Header (`src/components/Header.tsx`)

- Background : glass morphism `bg-background/80 backdrop-blur-xl`
- Logo : potentiellement teinter avec les nouvelles couleurs (via CSS filter ou nouveau logo)
- CTA header : bouton gradient arrondi avec micro-shadow
- Mobile menu : fond gradient warm au lieu d'aplat

### 5. Hero Section (`src/components/home/HeroSection.tsx`)

- Fond gauche : gradient radial warm (ambre → crème) au lieu d'aplat
- Badge "4.9/5 Trustpilot" : pastille arrondie avec fond ambre/10
- CTA : bouton gradient arrondi + shadow glow ambre
- Overline : couleur ambre au lieu de sage
- Trust badges en bas : icônes rondes avec fond ambre clair

### 6. Marquee Section (`src/components/home/MarqueeSection.tsx`)

- Background : `bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500`
- Texte blanc

### 7. Product Highlight (`src/components/home/ProductHighlightSection.tsx`)

- Badge "Fabriqué en France" : fond arrondi gradient au lieu de bg-primary/10
- Bouton CTA gradient arrondi
- Image : `rounded-2xl` avec shadow

### 8. Features Section (`src/components/product/ProductFeaturesSection.tsx`)

- Icônes dans cercles avec fond ambre/10
- Cartes avec `rounded-xl` et subtle shadow

### 9. Fabric Section (`src/components/home/FabricSection.tsx`)

- Checkmarks : couleur ambre
- Image : `rounded-2xl`
- Specs : badges arrondis

### 10. Values Section (`src/components/home/ValuesSection.tsx`)

- Cercles icônes : gradient ambre au lieu de bg-primary/10
- Cartes avec hover lift effect

### 11. Configurateur (`src/components/product/ConfiguratorSection.tsx`)

- Card : `rounded-2xl` avec shadow-lg
- Badge "Configurateur" : pastille gradient ambre
- Inputs : `rounded-lg`
- Options switches : accent ambre
- Prix : grande typo ambre/orange
- CTA "Commander" : bouton gradient full-width avec glow
- Trust badges : pastilles arrondies

### 12. Gallery Section (`src/components/home/GallerySection.tsx`)

- Images : `rounded-xl` avec overlay gradient warm
- Caption : fond avec blur + rounded

### 13. Testimonials (`src/components/home/TestimonialsSection.tsx`)

- Cartes : `rounded-xl shadow-md`
- Avatar : cercle avec border ambre
- Navigation arrows : cercles avec fond gradient

### 14. Process Section (`src/components/home/ProcessSection.tsx`)

- Steps : cercles numérotés avec gradient ambre au lieu d'emojis
- Ligne de connexion : gradient ambre
- Texte step : style badge arrondi

### 15. FAQ Section (`src/components/home/FAQSection.tsx`)

- Accordion : `rounded-xl` avec hover state ambre

### 16. Contact CTA (`src/components/home/ContactCTASection.tsx`)

- Background : gradient dark → ambre subtil au lieu de gris
- Boutons arrondis

### 17. Footer (`src/components/Footer.tsx`)

- Background : brun profond chaud au lieu de noir pur
- Accents ambre pour les liens hover
- Badge "Fabriqué en France" arrondi avec border ambre

### 18. Contact Widget (`src/components/ContactWidget.tsx`)

- FAB : gradient ambre arrondi avec glow
- Popup : `rounded-2xl`
- Header : gradient ambre

### 19. Exit Intent Popup (`src/components/ExitIntentPopup.tsx`)

- Modal : `rounded-2xl`
- CTA : gradient button
- Background overlay : teinté chaud

### 20. Promo Banner (`src/components/PromoBanner.tsx`)

- Style : gradient ambre → orange

### 21. Cookie Banner (`src/components/CookieBanner.tsx`)

- Arrondi, bouton accent ambre

---

### Fichiers modifiés (22 fichiers)

| Fichier | Changements |
|---|---|
| `index.html` | Google Fonts (Playfair Display + DM Sans) |
| `src/index.css` | Palette complète (CSS variables) + radius |
| `tailwind.config.ts` | fontFamily, nouveaux keyframes |
| `src/components/ui/button.tsx` | Nouveau variant "gradient", rounded |
| `src/components/Header.tsx` | Glass morphism, bouton gradient |
| `src/components/home/HeroSection.tsx` | Gradient fond, CTA gradient, badges |
| `src/components/home/MarqueeSection.tsx` | Fond gradient ambre |
| `src/components/home/ProductHighlightSection.tsx` | Arrondis, badge, CTA |
| `src/components/home/FabricSection.tsx` | Arrondis, checks ambre |
| `src/components/home/ValuesSection.tsx` | Icônes gradient, hover lift |
| `src/components/product/ProductFeaturesSection.tsx` | Cartes arrondies |
| `src/components/product/ConfiguratorSection.tsx` | Card arrondie, gradient CTA, inputs |
| `src/components/home/GallerySection.tsx` | Images arrondies |
| `src/components/home/TestimonialsSection.tsx` | Cartes arrondies, avatars |
| `src/components/home/ProcessSection.tsx` | Steps numérotés, gradient |
| `src/components/home/FAQSection.tsx` | Accordion arrondi |
| `src/components/home/ContactCTASection.tsx` | Gradient fond, boutons |
| `src/components/Footer.tsx` | Brun chaud, accents ambre |
| `src/components/ContactWidget.tsx` | FAB gradient, popup arrondie |
| `src/components/ExitIntentPopup.tsx` | Modal arrondie, CTA gradient |
| `src/components/PromoBanner.tsx` | Gradient |
| `src/components/CookieBanner.tsx` | Arrondis |

### Approche d'implémentation

Phase 1 : Fondations (index.html, index.css, tailwind.config.ts, button.tsx) — palette + typo + radius
Phase 2 : Layout (Header, Footer, Layout, PromoBanner, CookieBanner)
Phase 3 : Sections home (Hero → Contact CTA, dans l'ordre de la page)
Phase 4 : Configurateur + widgets (ConfiguratorSection, ContactWidget, ExitIntentPopup)

