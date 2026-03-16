

## Constat

Quand un utilisateur télécharge son devis via `SaveConfigCTA`, le composant :
1. Met à jour le panier abandonné (`abandoned_carts`) via `captureEmail`
2. Envoie l'email via l'edge function `send-config-email`

**Mais il n'insère jamais de lead dans la table `leads`.** Le lead n'apparaît donc pas dans `/admin/leads`.

## Plan

Ajouter un insert dans la table `leads` lors de la soumission du formulaire de devis, dans `src/components/product/SaveConfigCTA.tsx`.

### Modification de `SaveConfigCTA.tsx`

Dans `handleSubmit`, après `captureEmail(email)`, ajouter un insert Supabase :

```typescript
await supabase.from("leads").insert({
  first_name: "",
  last_name: "",
  email,
  phone: "",
  width,
  projection,
  toile_color: toileColor.label,
  armature_color: armatureColor.label,
  options: optionsList,  // ["Motorisation", "LED", ...] 
  postal_code: "",
  message: "DEVIS_EMAIL",
  processed: false,
});
```

Le champ `message` sera marqué `"DEVIS_EMAIL"` pour identifier la source du lead. Les colonnes `first_name` et `last_name` seront vides (l'utilisateur ne fournit que son email). Les options seront construites à partir du booléen `options` en tableau de strings.

La table `leads` autorise déjà les inserts publics (RLS: `WITH CHECK true` pour INSERT), donc aucune migration n'est nécessaire.

### Section technique

- Table cible : `leads` (colonnes existantes compatibles)
- RLS : INSERT public déjà autorisé
- Pas de migration SQL requise
- Le filtre "Configurateur" dans `AdminLeadsPage` fonctionne déjà car il vérifie `width > 0`

