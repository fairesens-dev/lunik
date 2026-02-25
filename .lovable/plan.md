

# Rebuild ProductPage as a Full Marketing Landing Page with Integrated Configurator

Complete rewrite of `src/pages/ProductPage.tsx` and creation of modular sub-components in `src/components/product/`.

---

## Architecture

The page will be split into modular components following the same pattern as the HomePage (`src/components/home/`):

```text
src/
  hooks/
    useConfigurator.ts          (NEW - custom hook for all config state + pricing)
  components/
    product/
      ProductHeroSection.tsx     (Section 1)
      ProductMarqueeSection.tsx  (Section 2)
      ProductFeaturesSection.tsx (Section 3)
      ProductGallerySection.tsx  (Section 4)
      ConfiguratorSection.tsx    (Section 5 - main configurator)
      OrderModal.tsx             (Modal triggered by CTA)
      ProductTestimonialsSection.tsx (Section 6)
      ProductProcessSection.tsx  (Section 7)
      ProductWarrantySection.tsx (Section 8)
      ProductFAQSection.tsx      (Section 9)
      ProductFinalCTA.tsx        (Section 10)
  pages/
    ProductPage.tsx              (REWRITE - composes all sections)
```

---

## Custom Hook: `useConfigurator`

Single source of truth for configurator state:
- `width` (number, default 350, min 150, max 600)
- `projection` (number, default 250, min 100, max 400)
- `toileColor` (string, default "Blanc Ecru")
- `armatureColor` (string, default "Blanc RAL 9016")
- `motorisation` (boolean, default false)
- `led` (boolean, default false)
- `pack` (boolean, default false)
- Pack Connect logic: toggling pack ON auto-enables motorisation + LED and disables individual toggles; toggling OFF re-enables them
- `calculatePrice` via `useMemo`: surface-based pricing (580 euros/m2, min 1890 euros) + options
- `installmentPrice` derived (price / 3, rounded)
- `surfaceArea` derived (width/100 * projection/100, 2 decimals)

---

## Section-by-Section Breakdown

### Section 1 -- Hero (ProductHeroSection)
Full-viewport split layout reusing the same pattern as `HeroSection.tsx`:
- Left 55%: overline, H1 "Le store qui redefini l'exterieur.", body text, two CTAs (anchor scroll to `#configurator` and `#features`), trust badges
- Right 45%: `bg-stone-200` placeholder with warm gradient overlay
- Uses `-mt-20` to extend under sticky header

### Section 2 -- Marquee (ProductMarqueeSection)
Same pattern as `MarqueeSection.tsx` with product-specific text. Reuses existing `animate-marquee` CSS.

### Section 3 -- Features (ProductFeaturesSection, id="features")
Background `bg-card`. Centered title + subtitle. Three alternating 2-column rows (image/text swap). Each row has a label, H3, body paragraph, and 3 spec lines with arrow icons.

### Section 4 -- Gallery (ProductGallerySection)
3-column masonry grid with 6 `bg-stone-300` placeholders. Trustpilot link below.

### Section 5 -- Configurator (ConfiguratorSection, id="configurator")
The core of the page. Background `bg-card`.
- **Intro block**: overline badge, H2, subtitle
- **Configurator card**: white bg, border, 2-column layout on desktop (stacked on mobile)
  - **Left (45%)**: product image placeholder, config summary tags, color swatches preview
  - **Right (55%)**: 4 configuration blocks:
    - **01 Dimensions**: Two number inputs (largeur/avancee) with min/max, live surface area calculation
    - **02 Toile**: 12 color swatches as 44px circles in a 6-per-row grid, selected state with ring + shadow
    - **03 Armature**: 4 rectangular swatches with name labels, selected state with accent border + checkmark
    - **04 Options**: 3 toggle cards (Motorisation 390 euros, LED 290 euros, Pack Connect 590 euros with "ECONOMISEZ 90 euros" badge). Pack logic auto-toggles the other two.
  - **Price block**: large Cormorant price display with transition animation, installment info, full-width CTA "Commander ce store", trust icons row

### OrderModal
Triggered by "Commander ce store". Uses Radix Dialog:
- White card with backdrop blur overlay
- Order recap (dimensions, colors, options, total)
- Form: prenom + nom (side by side), email, telephone, code postal, message textarea
- Submit shows success state in-place: green checkmark, thank you message, close button
- Form managed with local `useState`

### Section 6 -- Testimonials (ProductTestimonialsSection)
Same slider pattern as home `TestimonialsSection.tsx` with updated content and star ratings per card.

### Section 7 -- Process (ProductProcessSection)
Dark background (`bg-[#1A1A1A]`), white text. Same timeline pattern as home `ProcessSection.tsx` with updated steps and text.

### Section 8 -- Warranty (ProductWarrantySection)
Background `bg-card`. 3-column card grid (Garantie 5 ans, SAV France, Pieces detachees). CTA link to `/service-apres-vente`.

### Section 9 -- FAQ (ProductFAQSection)
Background `bg-background`. Accordion with 6 product-specific questions using existing shadcn Accordion component.

### Section 10 -- Final CTA (ProductFinalCTA)
Full-width gradient background (`bg-gradient-to-br from-[#4A5E3A] to-[#2C3A22]`), white text, H2, subtitle, white button that anchor-scrolls back to `#configurator`.

---

## Files Modified

1. **`src/hooks/useConfigurator.ts`** -- NEW: custom hook with all state, pack logic, and pricing
2. **`src/components/product/ProductHeroSection.tsx`** -- NEW
3. **`src/components/product/ProductMarqueeSection.tsx`** -- NEW
4. **`src/components/product/ProductFeaturesSection.tsx`** -- NEW
5. **`src/components/product/ProductGallerySection.tsx`** -- NEW
6. **`src/components/product/ConfiguratorSection.tsx`** -- NEW (largest component)
7. **`src/components/product/OrderModal.tsx`** -- NEW
8. **`src/components/product/ProductTestimonialsSection.tsx`** -- NEW
9. **`src/components/product/ProductProcessSection.tsx`** -- NEW
10. **`src/components/product/ProductWarrantySection.tsx`** -- NEW
11. **`src/components/product/ProductFAQSection.tsx`** -- NEW
12. **`src/components/product/ProductFinalCTA.tsx`** -- NEW
13. **`src/pages/ProductPage.tsx`** -- REWRITE: simple composition of all sections, passes configurator hook down to ConfiguratorSection and OrderModal
14. **`src/index.css`** -- Add smooth scroll behavior (`html { scroll-behavior: smooth }`) and price transition utility class

## No new dependencies needed
Everything uses existing: React state, framer-motion, lucide-react, shadcn components (Dialog, Switch, Accordion, Input, Button), Tailwind CSS.

