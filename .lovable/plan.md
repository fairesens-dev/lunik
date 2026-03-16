

## Analyse

Le flux SAV du widget est **fonctionnellement correct** : l'edge function `widget-save` crée/retrouve le contact, insère une activité de type `sav_request` et une conversion `sav_request_submitted`, le tout via le service role (bypass RLS). La fiche contact admin charge bien les activités par `contact_id` et les affiche dans la timeline.

**Problèmes identifiés :**

1. **Icônes manquantes** — `activityIcons` ne contient pas d'entrée pour `sav_request`, `callback_request`, ni `chatbot_conversation`. Elles tombent sur le fallback `StickyNote`, peu lisible.

2. **Metadata non affichée** — L'edge function stocke des metadata riches (numéro de commande, catégorie de problème, téléphone) dans le champ `metadata` de l'activité, mais la fiche contact n'affiche que `subject` et `body`, pas les metadata.

3. **Types manquants dans le logger manuel** — Le select de création d'activité manuelle (dialog "Logger") ne propose pas `sav_request`, `callback_request`, `chatbot_conversation`.

## Plan

### 1. Ajouter les icônes pour les types widget (AdminContactDetailPage.tsx)

Ajouter dans `activityIcons` :
- `sav_request` → icône `Wrench`
- `callback_request` → icône `PhoneCall`  
- `chatbot_conversation` → icône `MessageCircle`

### 2. Afficher les metadata des activités SAV/callback/chatbot

Dans le rendu de chaque activité de la timeline, si `a.metadata` contient des clés pertinentes (`order_number`, `problem_category`, `phone`, `message_count`), les afficher sous forme de petites badges ou lignes de détail sous le `body`.

### 3. Ajouter les nouveaux types au logger d'activité manuelle

Ajouter `sav_request`, `callback_request`, `chatbot_conversation` dans la liste du `Select` du dialog "Logger".

---

**Fichier modifié** : `src/pages/admin/AdminContactDetailPage.tsx`

Aucune modification de base de données nécessaire — le schéma et les RLS sont déjà corrects.

