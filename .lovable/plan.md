

## Section "Fabriqué en Normandie"

### Emplacement
Entre `ProductHighlightSection` et `ProductFeaturesSection` dans `Index.tsx` — exactement dans l'espace vide visible sur la capture.

### Design
Une section compacte et élégante avec :
- Un mini SVG inline de la silhouette de la Normandie (discret, en couleur primary avec opacité faible)
- Un texte court : "Fabriqué en Normandie" + une ligne de description
- Layout horizontal sur desktop : texte à gauche, carte à droite
- Fond neutre (`bg-background`), padding modéré (`py-12`)
- Style cohérent avec le reste du site (font-display, text-muted-foreground)

### Fichiers
1. **Créer `src/components/home/NormandySection.tsx`** — Nouveau composant avec :
   - SVG inline simplifié de la silhouette normande (path vectoriel léger)
   - Un point/marqueur sur la position approximative de l'atelier
   - Texte : titre "Fabriqué en Normandie" + sous-texte court sur la fabrication locale
   - Wrapped dans `AnimatedSection`
   - Layout `flex items-center` centré, compact

2. **Modifier `src/pages/Index.tsx`** — Insérer `<NormandySection />` entre `ProductHighlightSection` et le `div` contenant `ProductFeaturesSection`

