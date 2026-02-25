

# Build Content Management Page (/admin/contenu)

Create a ContentContext for site-wide content management and a full admin page with 7 tabs to edit all front-end text content in real-time.

---

## New Files

### 1. `src/contexts/ContentContext.tsx`

React Context with localStorage persistence (key: `site_content`).

**State structure** matches the spec exactly:
- `global`: brandName, tagline, phone, email, address, siret, socialInstagram, socialFacebook, socialPinterest, trustpilotUrl
- `homepage`: heroTitle, heroSubtitle, heroOverline, heroCTA1, heroCTA2, marqueeText, productSectionTitle, productSectionSubtitle, testimonials array, faqItems array
- `productPage`: heroTitle, heroOverline, heroSubtitle, configuratorTitle, configuratorSubtitle, stepLabels array, orderConfirmationMessage, faqItems array
- `sav`: heroTitle, heroSubtitle, hours, responseDelay, faqItems array
- `promoBanner`: active, text, bgColor, textColor, ctaText, ctaUrl

Default values populated from the current hardcoded strings in existing components.

**Methods**: `updateGlobal()`, `updateHomepage()`, `updateProductPage()`, `updateSAV()`, `updatePromoBanner()`, `updateTestimonials()`, `updateHomepageFAQ()`, `updateProductFAQ()`, `updateSAVFAQ()`

Provider loads from localStorage on mount, persists on every state change.

### 2. `src/components/PromoBanner.tsx`

Simple full-width banner component consuming ContentContext:
- Only renders if `promoBanner.active === true`
- Shows text, CTA button, styled with configured bgColor/textColor
- Rendered at top of Layout.tsx (above Header)

---

## Rewritten Files

### 3. `src/pages/admin/AdminContentPage.tsx` -- FULL REWRITE

Page title: "Gestion du contenu", subtitle about real-time updates.

**7 Tabs** (shadcn Tabs):

**Tab 1 -- Infos globales**: Two cards ("Identite de la marque" with brandName/tagline/phone/email/address/siret/trustpilotUrl, "Reseaux sociaux" with Instagram/Facebook/Pinterest URLs). Save button + toast.

**Tab 2 -- Page d'accueil**: Cards for Hero (overline, title textarea with char count, subtitle, CTA1 text, CTA2 text), Marquee (textarea + live scrolling preview below), Product highlight section (title, subtitle). Save + toast.

**Tab 3 -- Page produit**: Cards for Hero (overline, title, subtitle), Configurator section (title, subtitle), Step labels (4 inputs), Order confirmation message (textarea). Save + toast.

**Tab 4 -- SAV & Contact**: Cards for SAV hero (title, subtitle), Contact info (hours textarea, response delay input). Save + toast.

**Tab 5 -- Temoignages**: Editable list of testimonial cards. Each row: name input, city input, rating select (1-5), text textarea, active toggle, delete button (with inline confirm). "+ Ajouter un temoignage" button. Save + toast.

**Tab 6 -- FAQ**: Two sub-sections via inner tabs: "FAQ Page d'accueil" and "FAQ Page produit". Each is an editable list of question/answer pairs with active toggle, up/down reorder arrows, delete. "+ Ajouter une question" button. Save + toast.

**Tab 7 -- Banniere promo**: Card with active toggle, text input, bgColor + textColor color pickers (native input + hex text), CTA text, CTA URL. Live preview bar below showing exact rendering. Save + toast.

---

## Modified Files

### 4. `src/App.tsx`
- Import `ContentProvider` from ContentContext
- Wrap app with `<ContentProvider>` (alongside existing ConfiguratorSettingsProvider)

### 5. `src/components/Layout.tsx`
- Import `PromoBanner` component
- Render `<PromoBanner />` before `<Header />` inside the layout

### 6. `src/components/home/HeroSection.tsx`
- Import `useContent` from ContentContext
- Replace hardcoded title/subtitle/overline/CTA texts with `content.homepage.heroTitle`, etc.
- heroTitle supports `\n` rendered as `<br />`

### 7. `src/components/home/MarqueeSection.tsx`
- Import `useContent`, replace hardcoded `marqueeText` with `content.homepage.marqueeText`

### 8. `src/components/home/TestimonialsSection.tsx`
- Import `useContent`, replace hardcoded testimonials array with `content.homepage.testimonials.filter(t => t.active)`

### 9. `src/components/home/FAQSection.tsx`
- Import `useContent`, replace hardcoded faqs with `content.homepage.faqItems.filter(f => f.active)`

### 10. `src/components/home/ProductHighlightSection.tsx`
- Import `useContent`, replace hardcoded section title/subtitle with `content.homepage.productSectionTitle` / `productSectionSubtitle`

### 11. `src/components/product/ProductHeroSection.tsx`
- Import `useContent`, replace hardcoded overline/title/subtitle with `content.productPage.*`

### 12. `src/components/product/ProductFAQSection.tsx`
- Import `useContent`, replace hardcoded faqs array with `content.productPage.faqItems.filter(f => f.active)`

### 13. `src/components/product/ConfiguratorSection.tsx`
- Import `useContent`, replace hardcoded configurator section title/subtitle with `content.productPage.configuratorTitle` / `configuratorSubtitle`

### 14. `src/pages/SAVPage.tsx`
- Import `useContent`, replace hardcoded hero title/subtitle with `content.sav.heroTitle` / `heroSubtitle`
- Replace hardcoded SAV FAQ array with `content.sav.faqItems.filter(f => f.active)`

### 15. `src/components/Footer.tsx`
- Import `useContent`, replace hardcoded brand name, email, phone with `content.global.*`
- Replace hardcoded social links with `content.global.socialInstagram`, etc.

### 16. `src/components/Header.tsx`
- Import `useContent`, replace `[BRAND]` with `content.global.brandName`

---

## Technical Details

- All admin form state is local (useState per tab); "Sauvegarder" commits to context + localStorage
- Toast notifications via `useToast` from shadcn
- Testimonials/FAQ items include `active: boolean` for toggle visibility and `id: string` for stable keys
- FAQ reordering uses ArrowUp/ArrowDown buttons (same pattern as ConfiguratorPage colors)
- Delete confirmation is inline ("Supprimer ? [Annuler] [Confirmer]")
- Marquee live preview in Tab 2 uses the same CSS animation class as the front-end
- Promo banner live preview in Tab 7 renders a styled div with the configured colors/text
- heroTitle newlines: stored as `\n` in state, rendered by splitting on `\n` and joining with `<br />`
- No new dependencies needed

