

# Plan : Finaliser le système d'échantillons

## Travail restant

Les composants UI (modal, cart, context) et la migration DB sont déjà en place. Il reste 4 chantiers :

## 1. Template email `samples_confirmation` — `send-order-email/index.ts`

Ajouter le type `"samples_confirmation"` au `EmailType` et créer la fonction `samplesConfirmationTemplate(order)` :
- Icône header : 🎨 + "Vos échantillons arrivent bientôt, {prénom} !"
- Paragraphe d'intro sur la réception prochaine des coloris Dickson
- Bloc récapitulatif : lister chaque item de `order.sample_items` avec un carré de couleur HTML inline (`<span style="display:inline-block;width:16px;height:16px;background:${hex};border-radius:3px;">`) + nom + refCode
- Prix total
- Section "Et après ?" avec CTA "Configurer mon store →" vers `/configurateur`
- Contact block + branding LuniK standard

Ajouter l'entrée dans `getEmailConfig` configs map.

## 2. Section admin "Échantillons" — `AdminSettingsPage.tsx`

Dans l'onglet "Paiement" (`PaymentTab`), ajouter une nouvelle `<Card>` après le bloc Chèque :
- Titre : "🎨 Échantillons de toile"
- Switch "Activer la commande d'échantillons"
- Input number : prix unitaire (€ TTC), step 0.01
- Input number : frais de livraison (€ TTC), 0 = offert
- Input number : nombre max (vide = illimité)
- Textarea : message promotionnel
- Sauvegarde dans `admin_settings` id `"samples"`

## 3. Badges et filtres échantillons dans la liste admin — `AdminOrdersPage.tsx`

- Ajouter `orderType` au `mapRow` et à l'interface `Order`
- Badge "Échantillons" (bg-purple-100 text-purple-700) à côté de la ref quand `orderType === "samples"`
- Filtre type de commande : Select "Tous types" / "Stores" / "Échantillons"
- Adapter la colonne Configuration : si samples, afficher "{N} échantillons" au lieu des dimensions

## 4. Détail commande échantillons — `AdminOrderDetailPage.tsx`

- Si `order.order_type === "samples"`, adapter l'affichage central : au lieu des dimensions/coloris de store, afficher la liste des `sample_items` (carré couleur + nom + ref)
- Masquer les champs non pertinents (projection, armature, options) pour ce type

## 5. Déploiement

Redéployer `send-order-email` après modification. Ajouter `samples_confirmation` dans la table `email_templates` (migration ou insert inline).

## Fichiers modifiés

| Fichier | Action |
|---|---|
| `supabase/functions/send-order-email/index.ts` | Ajouter template + type |
| `src/pages/admin/AdminSettingsPage.tsx` | Section échantillons dans PaymentTab |
| `src/pages/admin/AdminOrdersPage.tsx` | Badge + filtre type |
| `src/pages/admin/AdminOrderDetailPage.tsx` | Affichage conditionnel samples |
| Migration SQL | INSERT `samples_confirmation` dans `email_templates` |

