

## Plan : Page Configurateur fullwidth dédiée — Style app-like inspiré de la référence

L'image de référence montre un configurateur d'architecture avec un visuel 3D dominant à gauche, des panneaux de configuration à droite en accordéon, le tout dans une UI type application (pas de hero, pas de marketing, juste l'outil). On s'en inspire pour créer une page `/configurateur` dédiée, fullwidth, immersive.

---

### Architecture

```text
┌──────────────────────────────────────────────────────────┐
│  Header simplifié (logo + retour accueil)    [Commander] │
├────────────────────────────────┬─────────────────────────┤
│                                │  01 Dimensions          │
│                                │  ────────────────       │
│    VISUEL IA DU STORE          │  02 Couleur de toile    │
│    (occupe ~60% largeur)       │  ────────────────       │
│                                │  03 Armature            │
│    Badges config en overlay    │  ────────────────       │
│    (dimensions, LED, etc.)     │  04 Options             │
│                                │  ────────────────       │
│    Fiche technique en bas      │  📧 Save config         │
│                                │  ────────────────       │
│                                │  PRIX + CTA Commander   │
├────────────────────────────────┴─────────────────────────┤
│  Trust bar minimaliste (paiement sécurisé, livraison…)   │
└──────────────────────────────────────────────────────────┘
```

### Fichiers à créer / modifier

**1. `src/pages/ConfigurateurPage.tsx`** (nouveau)
- Page dédiée fullwidth, `min-h-screen`, fond `bg-card`
- Mini-header intégré : logo à gauche, bouton "← Retour" et CTA "Commander" à droite
- Layout `grid grid-cols-1 lg:grid-cols-[60%_40%]` occupant tout le viewport (`h-[calc(100vh-64px)]`)
- Colonne gauche : visuel IA en `sticky`, badges overlay (dimensions, couleurs, options), fiche technique Dickson en bas
- Colonne droite : scroll interne avec les 4 étapes en accordéon style, prix sticky en bas de colonne, SaveConfigCTA
- Trust bar en bas, fine, full width
- Réutilise `useConfigurator`, `DynamicProductVisual`, `ToileColorSelector`, `SaveConfigCTA`
- Pas de `AnimatedSection` wrapping (UI app, pas landing)

**2. `src/App.tsx`**
- Ajouter route `/configurateur` avec `ConfigurateurPage` (hors Layout, comme checkout — pas de header/footer classique)

**3. `src/pages/Index.tsx`**
- Retirer `ConfiguratorSection` de la landing page
- Remplacer par un CTA block qui renvoie vers `/configurateur`

**4. `src/components/Header.tsx`**
- Changer les liens `/#configurator` → `/configurateur`

**5. `src/components/home/HeroSection.tsx`**
- Changer le CTA principal `/#configurator` → `/configurateur`

### Design de la page configurateur

- **Visuel gauche (60%)** : fond neutre `bg-secondary/30`, visuel IA centré verticalement, badges de config en overlay semi-transparents (glass morphism), fiche technique en grille 2×2 en bas
- **Panel droit (40%)** : fond `bg-background`, padding généreux, chaque étape séparée par un `border-b`, numérotation `01 02 03 04` en ambre, titres en `font-display font-bold`
- **Prix sticky** : barre fixe en bas du panel droit avec prix, paiement en X fois, et bouton gradient "Commander"
- **Mini-header** : hauteur 64px, `bg-background/90 backdrop-blur-xl`, logo + navigation minimaliste
- **Mobile** : stack vertical, visuel en haut (aspect 4/3), panel config en dessous, prix sticky bottom bar

### Changements dans d'autres fichiers

- `ContactCTASection`, `ExitIntentPopup` : mettre à jour les liens `/#configurator` → `/configurateur`
- `HeroSection` : CTA → `Link to="/configurateur"`

