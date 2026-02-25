

# Page Detail Commande — /admin/commandes/:orderId

Remplacement du drawer lateral par une page dediee complete pour la gestion des commandes.

---

## Architecture

```text
/admin/commandes          --> liste (existante, modifiee)
/admin/commandes/:orderId --> nouvelle page detail
```

La page detail utilise `AdminLayout` via les routes imbriquees existantes. Le bouton "oeil" dans la liste redirigera vers `/admin/commandes/{id}` au lieu d'ouvrir le drawer.

---

## Fichiers a creer

### 1. `src/pages/admin/AdminOrderDetailPage.tsx`

Page principale ~600 lignes. Charge la commande par `useParams().orderId`, fait un `supabase.from("orders").select("*").eq("id", orderId).single()`.

**Header sticky** :
- Breadcrumb : Commandes > SC-XXX (lien retour vers /admin/commandes)
- Gauche : Badge statut colore + Select inline pour changer le statut + bouton "Mettre a jour"
- Droite : boutons Email, Imprimer (window.print()), menu "Plus" (Dupliquer, Archiver, Supprimer)

**Layout 2 colonnes** : `grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6`

**Colonne gauche** (4 cards) :

1. **Detail commande** — image placeholder + nom produit + tableau de configuration (largeur, avancee, surface, couleurs avec pastilles, options avec checkmarks)  + note client si presente
2. **Recapitulatif financier** — tableau de prix detaille (base, options, livraison, sous-total HT, TVA 20%, total TTC) + infos paiement (badge statut, Stripe ID copiable, date)
3. **Suivi fabrication & livraison** — timeline editable avec 9 etapes (checkboxes, dates, notes). Section tracking conditionnelle (transporteur select, numero de suivi, URL, bouton envoi)
4. **Notes internes** — textarea + bouton ajouter + historique des notes en ordre inverse chronologique (pour le MVP, le champ `notes` existant sera utilise tel quel — pas de refactoring en array jsonb)

**Colonne droite** (5 cards) :

1. **Client** — avatar initiales, nom, email (mailto), tel (tel:), adresse complete. Section "Historique client" avec nombre de commandes et CA total (requete aggregate sur orders par email)
2. **Historique statuts** — timeline verticale compacte depuis `status_history` jsonb
3. **Emails envoyes** — liste statique des emails transactionnels (confirmation, fabrication, expedition, livraison, satisfaction) avec statut envoye/non envoye. Boutons "Renvoyer" et "Previsualiser" (placeholder pour le MVP)
4. **Documents** — boutons pour generer bon de commande PDF, facture PDF, guide installation (tous placeholder `window.print()` ou alert pour le MVP)
5. **Actions rapides** — boutons outline pleine largeur : envoyer confirmation, notifier fabrication, envoyer tracking, demander avis, remboursement partiel (rouge), annuler commande (rouge)

### 2. Print stylesheet

Ajoute dans `src/index.css` un bloc `@media print` qui :
- Masque la sidebar, topbar, boutons d'action, card notes, card actions rapides
- Affiche le contenu en colonne unique
- Ajoute un header entreprise et un footer "CONFIDENTIEL"
- Page break avant le recapitulatif financier

---

## Fichiers a modifier

### `src/App.tsx`
- Ajouter `import AdminOrderDetailPage`
- Ajouter la route `/admin/commandes/:orderId` dans le bloc admin protege

### `src/pages/admin/AdminOrdersPage.tsx`
- Remplacer le bouton Eye qui ouvre le drawer par un `<Link to={/admin/commandes/${o.id}}>` 
- Supprimer tout le code du `<Sheet>` drawer (lignes 230-335)
- Supprimer les imports `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`
- Supprimer les states `selectedOrder`, `drawerNotes`

### `src/components/admin/AdminLayout.tsx`
- Ajouter une entree dans `routeTitles` pour gerer le pattern `/admin/commandes/:id` (afficher "Detail commande" dans le breadcrumb)

---

## Donnees necessaires (pas de migration)

Toutes les colonnes existent deja dans la table `orders` : `client_address`, `client_city`, `client_country`, `civility`, `delivery_option`, `payment_method`, `payment_status`, `stripe_payment_intent_id`, `status_history`, `notes`. Pas de migration SQL necessaire.

Pour l'historique client (nombre de commandes, CA total), une requete `supabase.from("orders").select("amount").eq("client_email", email)` sera faite cote client.

---

## Details techniques

- Le statut est mis a jour via `supabase.from("orders").update(...)` comme dans la page actuelle
- Les notes utilisent le champ `notes` texte existant (pas de refactoring en JSONB array pour ce sprint)
- Le Stripe ID est affiche avec un bouton copier (`navigator.clipboard.writeText`)
- La section tracking (transporteur, numero de suivi) stocke les donnees dans `status_history` en ajoutant des metadonnees au step "Expedie"
- Les emails et documents sont des placeholders UI — les fonctions reelles seront implementees dans un sprint ulterieur
- `window.print()` est utilise pour l'impression avec le stylesheet print dedie

