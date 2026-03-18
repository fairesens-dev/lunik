

# Plan : Mise à jour des types d'emails et du suivi de commande

## Fichiers à modifier

### 1. `supabase/functions/create-checkout/index.ts`
- Ligne 119 : `sendEmail("confirmation")` → `sendEmail("order_received")`
- Ligne 120 : Supprimer `sendEmail("admin_new_order")` (template supprimé)
- Ligne 238 : Idem `sendEmail("confirmation")` → `sendEmail("order_received")`
- Ligne 239 : Supprimer `sendEmail("admin_new_order")`

### 2. `src/pages/admin/AdminOrderDetailPage.tsx`

**a) `TRANSACTIONAL_EMAILS` (lignes 54-60)** — Remplacer par les 6 nouveaux types :
```
order_received → "Commande reçue"
in_production → "En production"
ready_to_ship → "Prêt à expédier"
in_delivery → "Livraison en cours"
delivered → "Livré"
sav_requested → "Demande SAV"
```

**b) `emailMap` dans `handleUpdateStatus` (lignes 241-246)** — Mettre à jour le mapping statut → type email :
```
"En fabrication" → "in_production"
"Expédié" → "in_delivery" (+ ouvrir le modal tracking)
"Livré" → "delivered"
```
Supprimer "Annulé" → "cancellation" (template supprimé).

**c) `handleTrackingConfirm` (ligne 305)** — `sendOrderEmail("shipped", ...)` → `sendOrderEmail("in_delivery", ...)`

**d) Actions rapides (lignes 820-824)** — Remplacer les 4 boutons par les 6 nouveaux types :
```
"Envoyer confirmation commande" → type "order_received"
"Notifier mise en fabrication" → type "in_production"
"Notifier prêt à expédier" → type "ready_to_ship"
"Envoyer numéro de suivi" → type "in_delivery" (openModal: true)
"Notifier livraison" → type "delivered"
"Confirmer demande SAV" → type "sav_requested"
```

### 3. `src/pages/OrderTrackingPage.tsx` (page publique de suivi)

**a) `STATUS_STEPS` (ligne 26)** — Aligner avec les nouveaux statuts plus granulaires :
```
["Commandé", "En fabrication", "Prêt à expédier", "Expédié", "Livré"]
```

**b) `getCurrentStep` (lignes 67-74)** — Mettre à jour le mapping :
```
"Nouveau" → 0
"Confirmé" → 0
"En fabrication" → 1
"Prêt à expédier" → 2
"Expédié" → 3
"Livré" → 4
```

### 4. `src/pages/admin/AdminOrdersPage.tsx`

**a) `STATUS_OPTIONS` (ligne 43)** — Ajouter "Prêt à expédier" :
```
["Tous", "Nouveau", "En fabrication", "Prêt à expédier", "Expédié", "Livré", "Annulé"]
```

**b) `statusColor` (lignes 46-50)** — Ajouter l'entrée pour "Prêt à expédier" :
```
"Prêt à expédier": "bg-cyan-100 text-cyan-700"
```

### 5. `src/pages/admin/AdminOrderDetailPage.tsx` — STATUS_OPTIONS et statusColor

**a) `STATUS_OPTIONS` (ligne 29)** — Ajouter "Prêt à expédier" :
```
["Nouveau", "En fabrication", "Prêt à expédier", "Expédié", "Livré", "Annulé"]
```

**b) `statusColor` (lignes 31-36)** — Ajouter :
```
"Prêt à expédier": "bg-cyan-100 text-cyan-700 border-cyan-200"
```

### Redéploiement

La edge function `create-checkout` devra être redéployée après modification.

