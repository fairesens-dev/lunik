

## Plan — Améliorations page commande admin, Thank You page & PDF

### 1. Bandeau sticky : padding-top à 0
**Fichier** : `AdminOrderDetailPage.tsx` (ligne 229)
Supprimer le padding-top implicite en ajoutant `pt-0` ou en supprimant l'espace entre le header et le bandeau sticky. Ajuster la classe du sticky bar pour qu'il soit collé au header.

### 2. Notes internes : avatar + nom admin
**Fichier** : `AdminOrderDetailPage.tsx`
- Importer `useAuth` depuis `AuthContext`
- Dans `handleSaveNotes`, stocker le nom de l'admin dans le format : `[date] [Nom Admin] note`
- Dans l'affichage des notes, parser le nom et afficher un `Avatar` avec les initiales + le nom à côté de chaque note

### 3. Modal "Envoyer numéro de suivi"
**Fichier** : `AdminOrderDetailPage.tsx`
- Ajouter un state `showTrackingModal`
- Quand on clique sur "Envoyer numéro de suivi" dans Actions rapides, ouvrir un `Dialog` avec :
  - Un champ transporteur avec autocompletion (Geodis, TNT, Chronopost, DPD, GLS, Colissimo, Autre)
  - Un champ numéro de suivi
  - Un bouton Confirmer qui appelle `sendOrderEmail("shipped", { tracking: {...} })`
- Utiliser le composant `Dialog` existant

### 4. Photo générée du store au lieu de l'icône carton
**Fichier** : `AdminOrderDetailPage.tsx`
- Dans le détail commande (ligne 302-305), remplacer l'icône `Package` par une image générée via `generate-store-image`
- Appeler la edge function avec les couleurs de la commande pour obtenir le visuel
- Afficher dans la div 80x80 avec `object-cover`, fallback sur l'icône Package

### 5. Visuels des coloris toile et armature
**Fichier** : `AdminOrderDetailPage.tsx`
- Pour la toile : construire l'URL depuis le bucket `toile-colors` en cherchant le fichier correspondant au label
- Pour l'armature : utiliser les couleurs hex connues (RAL 7016 = #383E42, blanc = #FFFFFF, etc.)
- Afficher les miniatures à côté des noms de coloris dans le tableau de configuration

### 6. Harmoniser les emojis du suivi (admin + /merci)
**Fichiers** : `AdminOrderDetailPage.tsx`, `ThankYouPage.tsx`
- Définir un set d'emojis cohérent dans les `TRACKING_STAGES` de l'admin
- Mettre à jour les `steps` de ThankYouPage pour utiliser les mêmes emojis :
  - 📧 Email de confirmation
  - 📞 Appel de confirmation  
  - 🏭 Fabrication
  - 🚚 Livraison

### 7. Améliorer le suivi fabrication : supprimer datepicker, agrandir Note, sauvegarder
**Fichier** : `AdminOrderDetailPage.tsx`
- Supprimer l'`Input type="date"` de chaque stage
- Agrandir le champ Note (passer de `w-[140px]` à `w-[200px]` ou plus, `h-8`)
- Ajouter un bouton "Enregistrer" en bas du bloc qui sauvegarde `stages` dans `status_history` de la commande via update Supabase
- La date sera automatiquement enregistrée au moment où la checkbox est cochée

### 8. Améliorer le PDF (fond blanc, meilleur design)
**Fichier** : `src/lib/generateInvoice.ts`
- Supprimer le bloc `doc.setFillColor(245, 240, 232)` pour le client (fond beige → fond blanc)
- Ajouter une ligne de séparation élégante sous le header
- Améliorer la typographie : espacement, alignement
- Ajouter un cadre autour du bloc client au lieu du fond coloré
- Utiliser des couleurs plus sobres pour le tableau (gris foncé au lieu du vert)

### Fichiers modifiés
- `src/pages/admin/AdminOrderDetailPage.tsx` (modifications majeures)
- `src/pages/ThankYouPage.tsx` (harmonisation emojis)
- `src/lib/generateInvoice.ts` (design PDF)

