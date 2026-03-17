

# Plan : Badge Trustpilot + Témoignages statiques depuis rayy.fr

## Objectif
Ajouter un badge Trustpilot visuel (4.8/5, 233 avis, "Excellent") au-dessus du carrousel de témoignages sur la homepage, et remplacer les témoignages fallback par de vrais avis récupérés depuis la page Trustpilot (en excluant ceux mentionnant une installation/pose).

## Modifications

### 1. `src/components/home/TestimonialsSection.tsx`
- Ajouter un **badge Trustpilot** entre le titre "Ce que nos clients en pensent" et le carrousel
- Le badge affiche : logo Trustpilot SVG vert + 5 étoiles + "4.8/5 · 233 avis vérifiés · Excellent" + lien vers la page TP
- Style : bandeau horizontal centré, compact, cohérent avec le design existant (couleur `#00b67a` pour les étoiles/logo)

### 2. `src/contexts/ContentContext.tsx` (données par défaut des testimonials)
- Remplacer les témoignages fallback statiques par les 7 avis sélectionnés depuis Trustpilot (sans mention d'installation) :

| Auteur | Titre | Extrait | Note |
|--------|-------|---------|------|
| M. Lesteven | Produit d'excellente facture | Produit de qualité, suivi commercial parfait, délai tenu. | 5 |
| M. Viet | Très bonne entreprise | Très bonne entreprise, renseignements au top, store nickel, je recommande vivement | 5 |
| M. Savorgnano | Très bien 👍 | Excellent contact avec l'équipe. Livraison rapide du produit qui correspond pleinement à nos attentes avec un prix raisonnable. | 5 |
| M. Demangeon | Contact sympathique | Contact sympathique, efficacité des réponses | 5 |
| Mme Rathgeber | Je suis très satisfaite de mon store | L'équipe est professionnelle, sympathique et travaille avec soin et propreté. Je recommande vivement ! | 5 |
| Mme et M. Maire | Commande de deux stores… RAVIS ! | Nous avons commandé deux stores bannes chez Rayy. Nous sommes ravis et recommandons l'entreprise. | 5 |
| M. Adrian | Rayy store XL | Je recommande cette entreprise. Livraison impeccable. Très bon produit et rendu impeccable. | 5 |

### 3. Mise à jour `trustpilotUrl` dans le content global
- S'assurer que `trustpilotUrl` pointe vers `https://fr.trustpilot.com/review/rayy.fr`

## Rendu visuel du badge

```text
┌──────────────────────────────────────────────────────────────┐
│  [★ Trustpilot logo]  ★★★★★  4.8/5 · 233 avis · Excellent  │
│                     Voir les avis →                          │
└──────────────────────────────────────────────────────────────┘
```

## Fichiers impactés
| Fichier | Action |
|---------|--------|
| `src/components/home/TestimonialsSection.tsx` | Ajout badge Trustpilot |
| `src/contexts/ContentContext.tsx` | MAJ témoignages fallback + trustpilotUrl |

