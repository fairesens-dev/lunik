

# Build Admin Settings Page (/admin/parametres)

Rewrite the placeholder `AdminSettingsPage` into a full 4-tab settings interface integrating with AuthContext, ContentContext, and ConfiguratorSettingsContext.

---

## File to Rewrite

### `src/pages/admin/AdminSettingsPage.tsx` -- FULL REWRITE

**Page header**: Title "Parametres", no subtitle needed.

**4 Tabs** (using shadcn Tabs component):

### Tab 1 -- Mon compte

**Card 1: "Informations administrateur"**
- Two side-by-side inputs: Prenom + Nom (initialized from `useAuth().admin.name`, split on space)
- Email de connexion (initialized from `useAuth().admin.email`)
- Role: read-only Badge showing "Administrateur"
- "Mettre a jour" button -- saves to AuthContext admin object via a new `updateAdmin()` method + toast success
- Note: Since AuthContext currently has a simple `Admin` type, we need to add `updateAdmin` method

**Card 2: "Informations de l'entreprise"**
- Fields synced with ContentContext `global`: Nom commercial (brandName), SIRET, Adresse complete (address), TVA intracommunautaire (new field -- stored locally since not in ContentContext), Email facturation (new field -- stored locally)
- "Mettre a jour" button -- saves brandName/siret/address to ContentContext via `updateGlobal()` + toast

### Tab 2 -- Notifications

**Card: "Alertes email"**
- Description text about choosing notification events
- 6 Switch toggles with labels:
  - Nouvelle commande recue (default: on)
  - Nouveau lead soumis (default: on)
  - Lead sans reponse depuis 48h (default: on)
  - Statut commande mis a jour (default: on)
  - Rapport hebdomadaire (default: off)
  - Rapport mensuel (default: off)
- "Email(s) de notification" Input field (comma-separated)
- "Sauvegarder" button -- saves to localStorage key `admin_notifications` + toast

### Tab 3 -- Livraison & SAV

**Card 1: "Delais affiches sur le site"**
- Delai fabrication + livraison: Input (free text, e.g. "4 a 5 semaines")
- Message delai personnalise: Textarea
- Toggle "Afficher ce message exceptionnel sur le site"
- Preview div showing the message styled as it would appear
- Saves to localStorage key `admin_delivery_settings` + toast

**Card 2: "Informations SAV"**
- Telephone SAV (synced with ContentContext `global.phone`)
- Email SAV (synced with ContentContext `global.email`)
- Horaires d'ouverture (synced with ContentContext `sav.hours`)
- Delai de reponse affiche (synced with ContentContext `sav.responseDelay`)
- "Sauvegarder" button -- saves via `updateGlobal()` + `updateSAV()` + toast

### Tab 4 -- Securite

**Card 1: "Changer le mot de passe"**
- 3 password inputs: current, new (with show/hide toggle via Eye/EyeOff icons), confirm
- Validation: min 8 chars, new must match confirm, current must match existing
- "Mettre a jour le mot de passe" button -- validates against AuthContext credentials, shows toast success/error

**Card 2: "Sessions actives"**
- Single info row: "Session actuelle . Demarree il y a 2h . Navigateur Chrome . IP: [masked]"
- Button: "Deconnecter toutes les sessions" (variant destructive/outline) -- calls `logout()` from AuthContext

**Card 3: "Zone de danger"**
- Card with red/destructive border
- Title: "Reinitialiser toutes les donnees du configurateur"
- Description about irreversibility
- Red "Reinitialiser" button -- opens AlertDialog confirmation modal
- On confirm: calls `resetToDefaults()` from ConfiguratorSettingsContext + toast

---

## Modified File

### `src/contexts/AuthContext.tsx`

- Add `updateAdmin` method to AuthContextType interface: `updateAdmin: (data: Partial<Admin>) => void`
- Implement: merges partial Admin data into current admin state, persists to sessionStorage
- This allows Tab 1 to update admin name/email

---

## Technical Details

- All form state is local (useState per tab); save buttons commit to respective contexts/localStorage
- Toast notifications via existing `useToast` hook
- Password show/hide uses `Eye`/`EyeOff` icons from lucide-react toggling input type
- AlertDialog from shadcn for the reset confirmation modal
- Notification settings and delivery settings stored in their own localStorage keys (`admin_notifications`, `admin_delivery_settings`) since they don't have dedicated contexts
- No new dependencies needed -- uses existing Tabs, Card, Input, Switch, Button, Badge, AlertDialog, Label, Textarea from shadcn

