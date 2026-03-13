

# Plan : Responsive mobile — Checkout, Landing & Configurateur

## Problèmes identifiés

### Checkout
1. **OrderSummary masqué sur mobile** — `hidden lg:block` dans les 3 étapes : le récapitulatif de commande n'apparaît jamais sur mobile
2. **Header checkout** — "Commande sécurisée" prend trop de place sur petit écran
3. **Stepper** — les séparateurs `w-16` et le texte des étapes peuvent déborder sur mobile
4. **Grilles 2 colonnes** (prénom/nom, CP/ville) — OK avec `grid-cols-2` mais à vérifier
5. **Footer réassurance** — les 5 badges wrap mal sur petits écrans

### Landing (Index)
6. **HeroSection** — stats en bas à droite (`absolute bottom-8 right-8`) se superposent au scroll indicator sur mobile ; texte potentiellement trop grand
7. **ProductHighlightSection** — image aspect-[3/4] très haute sur mobile, OK
8. **TestimonialsSection** — cards `min-w-[340px]` peuvent être trop larges sur très petits écrans (320px)
9. **ValuesSection** — cards `min-w-[320px]` idem
10. **Footer** — grid 4 colonnes, passe à 1 colonne OK

### Configurateur
11. **Layout 60/40** — sur mobile, le panneau visuel occupe tout l'écran puis le panneau config en dessous ; le visuel est `lg:sticky lg:h-[calc(100vh-64px)]` mais sur mobile il a une hauteur indéfinie avec `absolute inset-0`
12. **Boutons "Projeter/Voir la toile"** — positionnés en `absolute bottom-[140px]`, risque de se superposer sur petit écran
13. **Fiche technique** — grille `grid-cols-2 lg:grid-cols-4` OK mais le témoignage est `hidden lg:flex`
14. **Sticky price bar** — OK mais texte peut tronquer
15. **Step indicators** — 3 boutons en `flex gap-2`, texte peut être trop petit mais acceptable

## Plan d'implémentation

### A. Checkout — OrderSummary visible sur mobile
- Dans `CheckoutStep1.tsx`, `CheckoutStep2.tsx`, `CheckoutStep3.tsx` : remplacer `hidden lg:block` par un affichage mobile **au-dessus du formulaire** (ou en dessous) avec version compacte
- Sur mobile : afficher l'OrderSummary en version compacte (collapsible) en haut, puis le formulaire en dessous
- Alternative plus simple : afficher l'OrderSummary **après** le formulaire sur mobile (supprimer `hidden`, ajouter `order-first lg:order-none` ou similaire)

### B. Checkout — Header & stepper mobile
- Header : masquer "Commande sécurisée" sur mobile (`hidden sm:flex`)
- Stepper : réduire `w-16` à `w-8` sur mobile, masquer le texte des étapes sur très petit écran (`hidden sm:inline`)

### C. Landing — Hero stats mobile
- Masquer les stats sur mobile (`hidden lg:flex`) ou les repositionner sous le contenu
- Réduire la taille du titre hero sur mobile (déjà `text-4xl` minimum, OK)

### D. Landing — Cards carousel mobile
- Réduire `min-w-[340px]` des testimonials à `min-w-[280px]` pour petits écrans
- Idem pour ValuesSection cards `min-w-[320px]` → `min-w-[280px]`

### E. Configurateur — Visuel mobile
- Donner au panneau visuel une hauteur fixe sur mobile (`h-[50vh]` ou `h-[60vh]`) au lieu de `absolute inset-0` dans un conteneur sans hauteur
- Ajuster la position des boutons "Projeter/Voir la toile" pour mobile (`bottom-[100px]` ou repositionner)
- S'assurer que la fiche technique ne déborde pas

### F. Configurateur — Prix sticky bar mobile
- Réduire le padding et la taille de police sur mobile
- S'assurer que le bouton contextuel ne déborde pas

## Fichiers à modifier

| Fichier | Changements |
|---------|------------|
| `CheckoutStep1.tsx` | OrderSummary visible sur mobile (après le form, collapsible) |
| `CheckoutStep2.tsx` | Idem |
| `CheckoutStep3.tsx` | Idem |
| `CheckoutPage.tsx` | Header : masquer "sécurisé" sur mobile, stepper compact |
| `HeroSection.tsx` | Stats masquées sur mobile |
| `TestimonialsSection.tsx` | `min-w-[280px]` |
| `ValuesSection.tsx` | `min-w-[280px]` |
| `ConfigurateurPage.tsx` | Hauteur fixe du visuel sur mobile, repositionner boutons |

