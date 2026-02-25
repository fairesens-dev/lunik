

# Enhance Remaining Pages (SAV, Contact, CGV, Mentions Legales)

All four pages already exist with basic content. This plan upgrades them to match the premium design system with richer layouts and content.

---

## 1. SAV Page (`src/pages/SAVPage.tsx`) -- REWRITE

**New structure:**

- **Hero section**: Centered overline "Service Apres-Vente", H1 "Un SAV qui vous ressemble" in Cormorant, subtitle describing the French-based support team
- **3 service cards** (grid, border, icon + title + description):
  1. Phone icon -- "Nous contacter" -- "Par telephone ou email, notre equipe repond sous 24h"
  2. Package icon -- "Pieces detachees" -- "Toutes les pieces disponibles, expedition sous 48h"
  3. BookOpen icon -- "Guide d'installation" -- "Tutoriels et documentation pour installer votre store"
- **Contact form section** (2-column: form left, info right):
  - Form fields: Nom + Email (side by side), Numero de commande (optional), Select for type of request, Textarea for message, File upload input for photos (standard HTML file input styled to match), Submit button
  - Right side: phone number, email, hours, response time promise
- **FAQ Accordion** section with SAV-specific questions:
  - Garantie coverage details
  - How to request a repair
  - Pieces detachees ordering process
  - Toile replacement procedure
  - Coverage area (France metropolitaine)
  - Motor/remote troubleshooting

Uses existing components: AnimatedSection, Accordion, Button, Input, Textarea, Select. Adds lucide-react icons (Phone, Package, BookOpen, Upload).

---

## 2. Contact Page (`src/pages/ContactPage.tsx`) -- REWRITE

**New structure:**

- **Hero**: Centered overline "Contact", H1 "Parlons de votre projet", subtitle
- **Split layout** (2 columns on desktop, stacked mobile):
  - **Left column** -- Contact info cards:
    - Phone block: icon + number + "Lundi-Vendredi 9h-18h"
    - Email block: icon + email address
    - Hours block: full schedule
    - Showroom address
    - Map placeholder (aspect-video bg-stone-200 with label "Carte interactive")
  - **Right column** -- Contact form:
    - Prenom + Nom (side by side)
    - Email + Telephone (side by side)
    - Select for subject (Devis, Renseignements, SAV, Partenariat, Autre)
    - Textarea for message
    - Submit button full-width

Layout flipped from current (form was left, info right) to info left, form right per the request.

---

## 3. CGV Page (`src/pages/CGVPage.tsx`) -- REWRITE

**Enhanced structure:**

- Same clean layout with Cormorant headers and Inter body
- Expanded to include all standard French e-commerce CGV sections (currently 8, expanding to ~12):
  1. Objet
  2. Produits et services
  3. Prix et tarifs
  4. Commande et validation
  5. Modalites de paiement
  6. Livraison et installation
  7. Transfert de propriete
  8. Droit de retractation
  9. Garantie legale de conformite
  10. Garantie commerciale et SAV
  11. Responsabilite
  12. Donnees personnelles
  13. Litiges et mediation
- Each section gets more detailed placeholder content (2-3 paragraphs where appropriate)
- Keep the table of contents navigation at top
- Add "Derniere mise a jour" date

---

## 4. Mentions Legales Page (`src/pages/MentionsLegalesPage.tsx`) -- REWRITE

**Enhanced structure with all required French legal fields:**

- Editeur du site (company name, legal form, capital, RCS, siege social, phone, email, directeur de publication, numero TVA intracommunautaire)
- Hebergement (name, address, phone of hosting provider)
- Propriete intellectuelle
- Donnees personnelles et RGPD (expanded with DPO contact, legal basis, data retention, rights)
- Cookies (types used, consent management)
- Liens hypertextes
- Credits (photos, design)
- Droit applicable

---

## Files Modified

1. `src/pages/SAVPage.tsx` -- Complete rewrite with hero, 3 cards, enhanced form with file upload, expanded FAQ
2. `src/pages/ContactPage.tsx` -- Rewrite with split layout (info left, form right)
3. `src/pages/CGVPage.tsx` -- Rewrite with expanded CGV sections (13 articles)
4. `src/pages/MentionsLegalesPage.tsx` -- Rewrite with all required French legal fields

No new files or dependencies needed. All pages already use the global Layout (Header + Footer) via the router setup in App.tsx.

