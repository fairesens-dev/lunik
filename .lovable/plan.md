

# Build Admin Dashboard, Orders & Leads Pages

Rewrite 3 existing placeholder pages into fully functional admin interfaces with charts, tables, filters, and detail drawers -- all using mock data.

---

## Files to Modify

### 1. `src/pages/admin/AdminDashboardPage.tsx` -- REWRITE

**Row 1 -- KPI Cards (4 columns)**
- 4 cards: Commandes (23, +12%), CA (47 320 euros, +8%), Visiteurs (3 847, +23%), Taux conversion (2.8%, -0.2%)
- Each card includes a recharts `LineChart` sparkline (height 40px, no axes/tooltip, just stroke line)
- Trend badge: green `ArrowUp` or red `ArrowDown` icon + percentage text
- Mock sparkline data arrays (7 data points each)

**Row 2 -- Main Charts (2 columns, 60/40 split)**
- Left: recharts `ComposedChart` with `Bar` (commandes, gray) + `Line` (CA, sage green #4A5E3A), dual Y axes, X axis months Jan-Dec, Tooltip, Legend
- Right: recharts `PieChart` (donut via `innerRadius`) -- 4 segments (Sans option 38%, Motorisation 35%, LED 12%, Pack Connect 15%), colors #4A5E3A, #8FA07A, #C8B89A, #1A1A1A, legend with percentages

**Row 3 -- Split Tables (2 columns)**
- Left: "Dernieres commandes" -- Table with 5 rows (Ref, Client, Dimensions, Options, Montant, Statut badge, Date). Status badges color-coded. Link to /admin/commandes
- Right: "Derniers leads non traites" -- 5 card-style entries (name, email, phone, config, date). "Contacter" mailto link + "Marquer traite" checkbox. Link to /admin/leads

**Row 4 -- Alerts**
- Full-width card with 3 mock alerts using colored left borders (orange warning, green success, blue info)

Uses: `useAuth` for admin name, recharts components, Card, Table, Badge, Checkbox from shadcn

---

### 2. `src/pages/admin/AdminOrdersPage.tsx` -- REWRITE

**Mock Data**: 15 realistic order objects with: id, ref, client (name/email/phone/cp), width, projection, toileColor, armatureColor, options array, montant, status, date, message, statusHistory array, notes

**Filter Bar**: 
- Search Input (filters by name/email/ref)
- Select for Status (Tous, Nouveau, En fabrication, Expedie, Livre, Annule)
- Select for Period (Ce mois, 3 mois, 6 mois, Cette annee, Personnalise)
- DatePicker range (visible only when Personnalise selected) -- use simple date inputs
- "Exporter CSV" button (generates and downloads a CSV blob from filtered data)

**Orders Table**:
- Checkbox column, Ref, Client, Configuration ("350x250 cm . Sauge . Anthracite"), Options (icon badges), Montant, Status (colored pill Badge), Date, Actions
- Actions: Eye icon "Voir" (opens drawer), dropdown for status change, Mail icon (mailto)
- Client-side filtering + pagination (10 per page) using useState
- Pagination component at bottom

**Order Detail Drawer**:
- Sheet component sliding from right (w-[400px])
- Displays: ref + date, client info block, full configuration details with color swatches, price breakdown table, client message, status history timeline (vertical with dots and lines), status update Select + Button, internal notes Textarea, "Envoyer email" button
- State managed locally: selectedOrder, notes per order

---

### 3. `src/pages/admin/AdminLeadsPage.tsx` -- REWRITE

**Mock Data**: 15 lead objects with: id, prenom, nom, email, telephone, width, projection, toileColor, armatureColor, options, codePostal, date, message, traite (boolean)

**Stat Banner**: Card at top showing "12 leads ce mois . 5 non traites . Taux de traitement : 58%" with computed values from mock data

**Filter Bar**:
- Search input (name/email/phone)
- Switch toggle "Non traites uniquement" 
- Select for Period

**Leads Table**:
- Columns: Prenom+Nom, Email, Telephone, Configuration summary, Code Postal, Date, Traite (toggle Checkbox), Actions
- Treated rows get `opacity-50` styling
- Actions: Mail icon (mailto), Phone icon (tel: link), Check icon (toggle traite), Trash icon (removes from local state)
- Pagination (10 per page)

---

## Technical Details

- **recharts** is already installed -- use LineChart, ComposedChart, Bar, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
- **shadcn components** used: Card, Table (+ all sub-components), Badge, Button, Input, Select, Checkbox, Sheet, Switch, Textarea, Separator
- All state is local (useState) -- no backend, all mock data
- CSV export: create Blob with comma-separated data, trigger download via temporary anchor element
- All pages use `font-sans` class consistently with the AdminLayout shell
- No new files needed beyond the 3 rewrites
- No new dependencies needed

