

# Plan: Synchroniser l'admin CMS avec le front-end

## Problèmes identifiés

Après analyse du code, voici les désynchronisations entre l'administration et le site :

### 1. Options du configurateur (critique)
Le configurateur utilise `PRICING_OPTIONS` hardcodé dans `pricingTable.ts` au lieu de `settings.options` géré depuis l'admin. Les modifications faites en admin n'ont aucun effet sur le configurateur.

### 2. Bandeau défilant (MarqueeSection)
Utilise un tableau `pills` hardcodé. Le champ `marqueeText` éditable dans l'admin n'est plus lu.

### 3. Sections hardcodées non éditables
- **ProductHighlightSection** : 4 features + image hardcodées
- **ProductFeaturesSection** : 3 blocs (Toile/Structure/Motorisation) hardcodés
- **ValuesSection** : 6 valeurs + 4 stats hardcodées
- **ContactCTASection** : Textes hardcodés
- **HeroSection** : Stats (5000+ stores, 4.9/5) hardcodées

## Plan d'implémentation

### Étape 1 — Connecter les options du configurateur à l'admin
- Modifier `useConfigurator.ts` pour utiliser `settings.options` au lieu de `PRICING_OPTIONS` hardcodé
- Mapper les `OptionEntry` du context vers le format `PricingOption` attendu par le configurateur
- Conserver `PRICING_OPTIONS` de `pricingTable.ts` comme fallback si `settings.options` est vide

### Étape 2 — Reconnecter le bandeau défilant au CMS
- Modifier `MarqueeSection.tsx` pour lire `content.homepage.marqueeText` depuis le ContentContext
- Parser le texte (séparé par `·`) en pills individuels
- L'admin permet déjà d'éditer ce texte dans l'onglet "Page d'accueil"

### Étape 3 — Enrichir le ContentContext avec les sections manquantes
Ajouter au type `HomepageContent` :
- `highlightFeatures` : tableau pour "Chaque détail a été pensé"
- `highlightImage` : URL de l'image produit
- `valueCards` : tableau pour la section engagements
- `statsItems` : tableau pour les chiffres clés (hero + values)
- `contactCTATitle`, `contactCTASubtitle` : textes de la section contact

Ajouter les valeurs par défaut correspondant au contenu actuel hardcodé.

### Étape 4 — Connecter les composants front au CMS
- `ProductHighlightSection` → lire depuis `content.homepage.highlightFeatures` + `highlightImage`
- `ValuesSection` → lire depuis `content.homepage.valueCards` + `statsItems`
- `HeroSection` → lire stats depuis `content.homepage.statsItems`
- `ContactCTASection` → lire depuis `content.homepage.contactCTATitle/Subtitle`

### Étape 5 — Ajouter les éditeurs admin correspondants
Dans `AdminContentPage.tsx`, ajouter dans l'onglet "Page d'accueil" :
- Éditeur de la section "Chaque détail a été pensé" (features + upload image)
- Éditeur des valeurs/engagements
- Éditeur des chiffres clés
- Éditeur du CTA contact

### Étape 6 — Synchroniser les données initiales
- S'assurer que les valeurs par défaut correspondent exactement au contenu actuel
- Vérifier que le ContentContext merge correctement les defaults avec les données Supabase

## Fichiers impactés
- `src/hooks/useConfigurator.ts` — utiliser settings.options
- `src/lib/pricingTable.ts` — garder comme fallback uniquement
- `src/components/home/MarqueeSection.tsx` — reconnecter au CMS
- `src/components/home/ProductHighlightSection.tsx` — lire CMS
- `src/components/home/ValuesSection.tsx` — lire CMS
- `src/components/home/HeroSection.tsx` — lire stats CMS
- `src/components/home/ContactCTASection.tsx` — lire CMS
- `src/contexts/ContentContext.tsx` — enrichir types + defaults
- `src/pages/admin/AdminContentPage.tsx` — ajouter éditeurs
- `src/pages/admin/AdminConfiguratorPage.tsx` — pas de changement (déjà fonctionnel côté admin)

