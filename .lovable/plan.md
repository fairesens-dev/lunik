

# Migration des donnees vers Supabase

Toutes les donnees de l'application sont actuellement stockees en localStorage ou en dur dans le code (mock data). Ce plan cree les tables Supabase optimisees et adapte les contexts/pages pour lire et ecrire depuis la base de donnees.

---

## Tables a creer (1 migration SQL)

### 1. `site_content` -- Contenu du site (key-value)
Stocke les sections du ContentContext en une seule ligne par cle de section.

| Colonne | Type | Description |
|---------|------|-------------|
| id | text PK | Cle de section : `global`, `homepage`, `productPage`, `sav`, `promoBanner` |
| data | jsonb NOT NULL | Contenu JSON de la section |
| updated_at | timestamptz | Mis a jour automatiquement |

### 2. `configurator_settings` -- Parametres du configurateur
Meme approche key-value pour les settings du configurateur.

| Colonne | Type | Description |
|---------|------|-------------|
| id | text PK | Cle : `pricing`, `dimensions`, `toileColors`, `armatureColors`, `options` |
| data | jsonb NOT NULL | Contenu JSON |
| updated_at | timestamptz | |

### 3. `orders` -- Commandes
| Colonne | Type |
|---------|------|
| id | uuid PK (gen_random_uuid) |
| ref | text UNIQUE NOT NULL |
| client_name | text NOT NULL |
| client_email | text NOT NULL |
| client_phone | text |
| client_postal_code | text |
| width | integer NOT NULL |
| projection | integer NOT NULL |
| toile_color | text |
| armature_color | text |
| options | text[] DEFAULT '{}' |
| amount | integer NOT NULL |
| status | text NOT NULL DEFAULT 'Nouveau' |
| message | text DEFAULT '' |
| status_history | jsonb DEFAULT '[]' |
| notes | text DEFAULT '' |
| created_at | timestamptz DEFAULT now() |

### 4. `leads` -- Leads / demandes de devis
| Colonne | Type |
|---------|------|
| id | uuid PK (gen_random_uuid) |
| first_name | text NOT NULL |
| last_name | text NOT NULL |
| email | text NOT NULL |
| phone | text |
| width | integer |
| projection | integer |
| toile_color | text |
| armature_color | text |
| options | text[] DEFAULT '{}' |
| postal_code | text |
| message | text DEFAULT '' |
| processed | boolean DEFAULT false |
| created_at | timestamptz DEFAULT now() |

### 5. `contact_messages` -- Messages du formulaire de contact
| Colonne | Type |
|---------|------|
| id | uuid PK (gen_random_uuid) |
| first_name | text NOT NULL |
| last_name | text NOT NULL |
| email | text NOT NULL |
| phone | text |
| subject | text |
| message | text NOT NULL |
| created_at | timestamptz DEFAULT now() |

### 6. `admin_settings` -- Parametres admin (notifications, livraison, etc.)
| Colonne | Type |
|---------|------|
| id | text PK | Cle : `notifications`, `delivery`, `company` |
| data | jsonb NOT NULL |
| updated_at | timestamptz |

---

## Politiques RLS

- **`site_content`**, **`configurator_settings`**, **`admin_settings`** : SELECT public (le site doit lire le contenu), INSERT/UPDATE/DELETE uniquement pour les utilisateurs authentifies
- **`orders`**, **`leads`**, **`contact_messages`** : INSERT public (les visiteurs soumettent des commandes/leads/messages), SELECT/UPDATE/DELETE uniquement pour les utilisateurs authentifies
- Trigger `moddatetime` sur `updated_at` pour les tables key-value

---

## Seed des donnees par defaut

La migration inclura des INSERT avec les valeurs par defaut actuelles (contenu du site, parametres configurateur) pour que la base soit operationnelle immediatement.

---

## Fichiers modifies

### `src/contexts/ContentContext.tsx`
- Remplacer localStorage par des requetes Supabase (`supabase.from('site_content')`)
- Charger les donnees au mount avec `useEffect` + `supabase.select()`
- Chaque `update*` fait un `upsert` dans la table `site_content`
- Garder les valeurs par defaut comme fallback si la base est vide

### `src/contexts/ConfiguratorSettingsContext.tsx`
- Meme approche : remplacer localStorage par Supabase `configurator_settings`
- `loadSettings()` fait un SELECT, `persist()` fait un UPSERT
- Fallback sur DEFAULT_SETTINGS

### `src/pages/admin/AdminOrdersPage.tsx`
- Remplacer `MOCK_ORDERS` par un `useEffect` + `supabase.from('orders').select()` au mount
- `updateStatus()` fait un UPDATE sur la table
- Export CSV utilise les donnees de la base

### `src/pages/admin/AdminLeadsPage.tsx`
- Remplacer `MOCK_LEADS` par un SELECT sur la table `leads`
- `toggleTraite()` fait un UPDATE (`processed`)
- `deleteLead()` fait un DELETE

### `src/components/product/OrderModal.tsx`
- `handleSubmit()` fait un INSERT dans `orders` (genere la ref auto)
- Fait aussi un INSERT dans `leads`

### `src/pages/ContactPage.tsx`
- `handleSubmit()` fait un INSERT dans `contact_messages`

### `src/pages/admin/AdminSettingsPage.tsx`
- Tabs Notifications et Livraison : remplacer localStorage par la table `admin_settings`
- Tab Mon compte (entreprise) : reste synce avec `site_content.global`

### `src/pages/admin/AdminDashboardPage.tsx`
- Les KPIs et commandes recentes liront depuis `orders` et `leads` avec des requetes d'agregation

---

## Details techniques

- Les tables key-value (`site_content`, `configurator_settings`, `admin_settings`) utilisent un `id` text comme cle primaire pour simplifier les upserts
- Extension `moddatetime` activee pour `updated_at` automatique
- Les donnees mock actuelles seront inserees comme seed dans la migration pour une transition sans perte
- Le ref des commandes sera genere cote client avec le pattern `CMD-YYYY-NNN` (numero sequentiel base sur un compteur dans la table)
- Pas de foreign key vers `auth.users` (conformement aux guidelines Supabase)
- Les contexts gardent un state local pour la reactivite UI, synchronise avec Supabase en arriere-plan

