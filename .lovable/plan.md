

# Rebuild HomePage with 10 Complete Sections

Complete rewrite of `src/pages/Index.tsx` with all 10 sections as specified, plus CSS additions for the marquee animation.

---

## Files to Modify

### 1. `src/index.css` -- Add marquee keyframe animation
Add a CSS `@keyframes marquee` animation for the infinite scrolling band (Section 2). This will translate the content from 0 to -50% horizontally, creating a seamless loop.

### 2. `tailwind.config.ts` -- Add marquee animation token
Register the `marquee` keyframe and animation in the Tailwind config so it can be used as `animate-marquee`.

### 3. `src/components/Layout.tsx` -- Remove `pt-20` for hero
The hero section needs to go full-viewport, so the `pt-20` padding on `<main>` should be removed (the hero will handle its own top spacing, and other pages will need their own top padding or we keep it and offset the hero with negative margin). Better approach: keep `pt-20` but make the hero use `-mt-20` to go under the header.

### 4. `src/pages/Index.tsx` -- Complete rewrite
Replace the entire file with all 10 sections:

**Section 1 -- Hero (full viewport)**
- Split layout: left 55% text + right 45% image placeholder
- Overline in sage green uppercase, H1 in Cormorant 72px, body paragraph
- Two buttons side-by-side: primary "Configurer mon store" + secondary outlined "Voir le produit"
- 3 trust micro-badges row below buttons
- Right side: `bg-stone-200` placeholder with warm overlay gradient
- Uses `-mt-20` to extend under header, `min-h-screen`

**Section 2 -- Marquee scrolling band**
- Thin band with `bg-primary text-white`, `overflow-hidden`
- Duplicated text content inside a flex container with CSS `animate-marquee`
- Smooth infinite horizontal scroll

**Section 3 -- Product Highlight**
- Centered title + subtitle
- 2-column grid: image placeholder left, 4 feature rows right (emoji + bold label + description)
- CTA link to /store-coffre

**Section 4 -- Values (3 columns)**
- Background `bg-card` (#FAFAF7)
- Centered section title
- 3 columns with large serif number "01"/"02"/"03", title, and description text

**Section 5 -- Configurator CTA (dark section)**
- Background `bg-[#1A1A1A]`, all text white
- Overline, H2 in Cormorant, body text
- 5 step indicators connected by lines (flexbox with dividers)
- Outlined white CTA button

**Section 6 -- Gallery**
- Section title + subtitle
- 3-column masonry-like grid with 6 `bg-stone-200` placeholders of varying heights
- Trustpilot link below

**Section 7 -- Testimonials**
- Background `bg-background` (warm ecru)
- Title + star rating display
- Horizontal scrollable slider using `useState` for current index, with 4 testimonial cards
- White card with shadow, Cormorant italic quote, author + city
- Left/right arrow buttons + dot indicators

**Section 8 -- Process timeline**
- Background `bg-card`
- Title centered
- Horizontal timeline on desktop (flex row with connecting lines), vertical stack on mobile
- 5 steps with emoji, title, description

**Section 9 -- FAQ Accordion**
- 6 questions using the existing `Accordion` component from shadcn/ui
- Clean styling matching site design

**Section 10 -- Contact/Footer CTA**
- Dark background `bg-[#1A1A1A]`, centered text
- Title, subtitle, two CTA buttons: ghost "Nous appeler" + primary "Envoyer un message" linking to /contact

---

## Technical Details

- **Marquee animation**: Pure CSS using `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }` with duplicated content for seamless loop
- **Testimonial slider**: React `useState` for index, `transform: translateX(...)` with transition for smooth sliding, `ChevronLeft`/`ChevronRight` from lucide-react for arrows
- **All sections** use the existing `AnimatedSection` component for scroll-triggered fade-in animations
- **Responsive**: All grids collapse to single column on mobile, timeline goes vertical, slider stays swipeable
- **No new dependencies needed** -- everything uses existing UI components, framer-motion, lucide-react, and CSS

