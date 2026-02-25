

# Add Secure Admin Authentication System

Complete admin panel with authentication, protected routes, persistent sidebar layout, and placeholder pages for all admin sections.

---

## New Files to Create

### 1. Auth Context (`src/contexts/AuthContext.tsx`)
- React Context providing `isAuthenticated`, `admin` (name/email/role), `login()`, `logout()`
- Hardcoded credentials: `admin@monstore.fr` / `admin2024!`
- Persists auth state in `sessionStorage` (expires on browser close)
- On mount, reads sessionStorage to restore session
- `login()` validates credentials, stores in sessionStorage, returns success/error
- `logout()` clears sessionStorage, navigates to `/admin/login`

### 2. Protected Route (`src/components/admin/ProtectedRoute.tsx`)
- Checks `isAuthenticated` from AuthContext
- If false, redirects to `/admin/login` via `<Navigate />`
- If true, renders `<Outlet />` or children

### 3. Admin Layout (`src/components/admin/AdminLayout.tsx`)
- Persistent shell for all protected admin pages
- **Sidebar** (fixed left, 240px, bg-gray-900, white text):
  - Top: "[BRAND] Admin" branding
  - Grouped nav items with icons (lucide-react): Dashboard, Commandes, Leads, Configurateur, Contenu, Marketing, Parametres, Deconnexion
  - Active state: bg-gray-700 + left sage green border
  - Bottom: avatar circle + admin name/email
  - Mobile: collapsible via hamburger (useState toggle)
- **Topbar** (fixed top, h-16, white, border-b):
  - Left: page title (derived from current route)
  - Right: notification bell, "Voir le site" link (target _blank), avatar dropdown
- **Content area**: ml-60 mt-16 bg-gray-50 p-8, renders `<Outlet />`

### 4. Login Page (`src/pages/admin/AdminLoginPage.tsx`)
- Centered card on #F3F4F6 background, max-w-sm
- "[BRAND] Admin" + "Espace de gestion" subtitle
- Email + password inputs (password with show/hide toggle using Eye/EyeOff icons)
- "Connexion" button (bg-gray-900)
- Error banner on failed login
- "Retour au site" link to "/"
- On success: navigate to `/admin/dashboard`
- Does NOT use the public site Layout (no Header/Footer)

### 5. Dashboard Page (`src/pages/admin/AdminDashboardPage.tsx`)
- Placeholder with title "Tableau de bord" and summary stat cards (commandes, CA, leads, taux conversion) with placeholder data

### 6. Placeholder Pages
- `src/pages/admin/AdminOrdersPage.tsx` -- "Commandes" placeholder
- `src/pages/admin/AdminLeadsPage.tsx` -- "Leads" placeholder
- `src/pages/admin/AdminConfiguratorPage.tsx` -- "Configurateur" placeholder
- `src/pages/admin/AdminContentPage.tsx` -- "Contenu" placeholder
- `src/pages/admin/AdminMarketingPage.tsx` -- "Marketing" placeholder
- `src/pages/admin/AdminSettingsPage.tsx` -- "Parametres" placeholder

Each placeholder: simple card with page title and "Coming soon" description.

---

## Modified Files

### `src/App.tsx`
- Import AuthProvider, AdminLayout, ProtectedRoute, and all admin pages
- Wrap entire app (or just the router) with `<AuthProvider>`
- Add routes:
  - `/admin/login` -- public, renders AdminLoginPage (no Layout wrapper)
  - `/admin` -- wrapped in ProtectedRoute + AdminLayout:
    - index redirects to `/admin/dashboard` via `<Navigate />`
    - `/admin/dashboard`, `/admin/commandes`, `/admin/leads`, `/admin/configurateur`, `/admin/contenu`, `/admin/marketing`, `/admin/parametres`

---

## Technical Details

- **No Supabase** -- uses hardcoded credentials as specified, easily replaceable later
- **sessionStorage** keys: `admin_auth` storing JSON `{ isAuthenticated, admin: { name, email, role } }`
- **Sidebar navigation** uses `NavLink` from react-router-dom for active state detection
- **Mobile sidebar**: toggled via state, renders as fixed overlay with backdrop
- **All admin pages** use Inter font (already available), neutral gray palette, no Cormorant serif
- **No new dependencies needed** -- uses existing lucide-react, react-router-dom, tailwind

