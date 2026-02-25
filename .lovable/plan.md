

# Configurator Settings Admin Page

Build a `ConfiguratorContext` shared between admin settings and front-end configurator, plus a full admin settings page with 5 tabs.

---

## New Files

### 1. `src/contexts/ConfiguratorSettingsContext.tsx`

React Context holding the full configurator configuration state:
- **State structure**: `pricing` (baseRate, minPrice, installmentDivisor), `dimensions` (width/projection min/max/step), `toileColors[]`, `armatureColors[]`, `options[]` -- exactly as specified
- **Persistence**: localStorage key `configurator_settings`, loaded on mount with fallback to defaults
- **Methods exposed**: `updatePricing()`, `updateDimensions()`, `updateToileColor()`, `addToileColor()`, `removeToileColor()`, `toggleToileColor()`, `reorderToileColors()`, `updateArmatureColor()`, `addArmatureColor()`, `removeArmatureColor()`, `toggleArmatureColor()`, `reorderArmatureColors()`, `updateOption()`, `addOption()`, `removeOption()`, `resetToDefaults()`
- Each update method saves to localStorage immediately
- Provider wraps entire app in `App.tsx`

### 2. `src/pages/admin/AdminConfiguratorPage.tsx` -- REWRITE

Full admin page with:

**Sticky preview banner**: sage green bg, eye icon, "Les modifications s'appliquent en temps reel" + external link to /store-coffre

**5 Tabs** (using shadcn Tabs):

**Tab 1 -- Tarification**: 2-column layout
- Left: baseRate, minPrice, installmentDivisor number inputs with helper text
- Right: live price simulator card with width/projection sliders + computed surface/price/installment display
- Save button with toast

**Tab 2 -- Dimensions**: 2-column (Largeur / Avancee)
- Min, max, step inputs per dimension
- Validation: min < max inline error
- Simple CSS diagram (div-based top-down awning view) showing labeled width/projection, updating live
- Save button with toast

**Tab 3 -- Couleurs de toile**: color list
- Each row: move up/down buttons, 32px color circle, label Input, hex Input + native color picker, active Switch, delete Button (with confirm state)
- "Ajouter un coloris" button at bottom
- Save button with toast

**Tab 4 -- Couleurs armature**: same layout as Tab 3
- Rectangular swatch (80x32px) instead of circle
- Same controls

**Tab 5 -- Options**: card per option
- Each card: active toggle, icon input, label input, description textarea, price number input, promo badge input (optional), highlight toggle, includesIds multi-checkbox
- "Ajouter une option" button
- Save button with toast

---

## Modified Files

### 3. `src/App.tsx`
- Import and wrap app with `<ConfiguratorSettingsProvider>` (inside BrowserRouter, outside Routes)

### 4. `src/hooks/useConfigurator.ts`
- Import `useConfiguratorSettings` from the new context
- Replace hardcoded `TOILE_COLORS`, `ARMATURE_COLORS` with active colors from context
- Replace hardcoded `baseRate=580`, `minPrice=1890`, divisor `3` with context values
- Replace hardcoded option prices (390, 290, 590) with context option prices
- Export `TOILE_COLORS` and `ARMATURE_COLORS` as computed from context (active only) for backward compat

### 5. `src/components/product/ConfiguratorSection.tsx`
- Import `useConfiguratorSettings` to read active colors, options, and dimension limits
- Replace hardcoded `TOILE_COLORS`/`ARMATURE_COLORS` imports with context-driven active lists
- Replace hardcoded option cards with dynamic rendering from `settings.options.filter(o => o.active)`
- Replace hardcoded dimension min/max in clamp functions with context values
- Replace hardcoded installment text divisor with context value

---

## Technical Details

- All admin form state is local (useState) per tab; "Sauvegarder" commits to context + localStorage
- Toast notifications via existing `useToast` hook from shadcn
- No drag-and-drop library -- use simple ArrowUp/ArrowDown buttons for reordering
- Delete confirmation is inline (row changes to "Supprimer ? [Annuler] [Confirmer]")
- Color picker uses native `<input type="color">` paired with hex text input
- Price simulator in Tab 1 uses the same formula as useConfigurator but with local admin-edited values
- No new dependencies needed

