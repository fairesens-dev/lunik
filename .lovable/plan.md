

# Plan : Fix chatbot input focus + SAV order lookup

## Problème 1 : Perte de focus de l'input

**Cause** : `AIChatScreen`, `SAVScreen`, `MenuScreen`, `CallbackScreen` sont définis comme des fonctions-composants **à l'intérieur** du composant `ContactWidget`. À chaque re-render (chaque frappe clavier), React recrée ces fonctions, considère que ce sont de nouveaux composants, et **démonte/remonte** le DOM — ce qui fait perdre le focus à l'input.

**Solution** : Remplacer ces sous-composants par du JSX inline directement dans le render, au lieu de les appeler comme `<AIChatScreen />`.

## Problème 2 : Lier la demande SAV à la commande existante

**Flux actuel** : Le widget SAV collecte le numéro de commande mais ne vérifie pas s'il existe. Les données sont sauvées comme une activité/conversion générique.

**Solution** : Modifier l'edge function `widget-save` pour, quand `action === "sav"` :
1. Chercher la commande par `ref` dans la table `orders`
2. Si trouvée : ajouter une note SAV dans le champ `notes` de la commande, et mettre à jour `status` vers "SAV en cours" + ajouter une entrée dans `status_history`
3. Retourner les infos de la commande (statut, date) au frontend pour confirmation visuelle

## Fichiers à modifier

| Fichier | Changement |
|---------|-----------|
| `src/components/ContactWidget.tsx` | Inliner les 4 écrans au lieu de les définir comme sous-composants ; afficher confirmation avec infos commande après lookup |
| `supabase/functions/widget-save/index.ts` | Ajouter lookup de commande par `ref` + mise à jour notes/status_history |

## Détails techniques

### ContactWidget.tsx
- Supprimer `MenuScreen`, `AIChatScreen`, `SAVScreen`, `CallbackScreen` comme fonctions
- Les remplacer par des blocs JSX conditionnels inline dans le render (`{screen === "ai_chat" && (<div>...</div>)}`)
- Dans le SAV done screen, afficher les infos de commande retournées par l'API (statut, date)

### widget-save/index.ts — action "sav"
```sql
-- Pseudo-logic:
SELECT id, ref, status, client_name, created_at FROM orders WHERE ref = data.order_number LIMIT 1
-- If found:
UPDATE orders SET 
  notes = CONCAT(existing_notes, '\n[SAV] ', problem_category, ': ', problem_detail),
  status_history = status_history || new_entry
WHERE id = order_id
```
- Retourner `{ success: true, order_found: true, order_status, order_date }` ou `{ success: true, order_found: false }`

