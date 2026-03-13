

## Plan: CRM Contacts Module — `/admin/contacts` & `/admin/contacts/:id`

### Files to create/modify

| File | Action |
|---|---|
| `src/pages/admin/AdminContactsPage.tsx` | **Create** — Contact list with filters, search, bulk actions, pagination |
| `src/pages/admin/AdminContactDetailPage.tsx` | **Create** — Contact detail with left/right panel layout |
| `src/App.tsx` | Add 2 routes: `/admin/contacts` and `/admin/contacts/:id` |
| `src/components/admin/AdminLayout.tsx` | Add "Contacts" nav entry under PRINCIPAL group with `Users` icon |

No database changes needed — all tables exist.

---

### Page 1: AdminContactsPage (`/admin/contacts`)

**Data**: `supabase.from("contacts").select("*").order("created_at", { ascending: false })`

**Layout** (follows AdminLeadsPage pattern):
- Stats banner: total contacts, by status breakdown, average lead score
- Filter bar: text search (name/email/company), Select for status, Select for source, Select for per-page (25/50/100)
- Data table columns: Avatar initials | Name | Email | Phone | Status (color badge) | Lead Score (Progress bar) | Source (badge) | Created At
- Status badge colors: visitor=gray, lead=yellow, mql=orange, sql=blue, customer=green, churned=red
- Row click → navigate to `/admin/contacts/:id`
- Bulk select via checkboxes: toolbar appears with "Change Status", "Export CSV" actions
- Pagination: Prev/Next with page counter
- "Add Contact" button → Dialog modal with: first_name, last_name, email, phone, company, job_title, status, source

**CSV Export**: Generate client-side CSV from selected contacts using `Blob` + `URL.createObjectURL`

---

### Page 2: AdminContactDetailPage (`/admin/contacts/:id`)

**Data loading**: Fetch contact + contact_properties + activities + page_views + conversions + campaign_contacts (with campaign name join) in parallel.

**Layout**: Sticky action bar (like AdminOrderDetailPage) + 2-column grid `xl:grid-cols-[1fr_2fr]`

**Top action bar**:
- Breadcrumb: Contacts > {name}
- Buttons: Send Email (mailto), Edit (toggles inline editing), Delete

**Left panel (1/3)**:
- Avatar with initials, full name
- Inline-editable fields: email, phone, company, job_title
- Status select + Source select (save on change)
- Lead Score: Progress bar + manual input override
- Custom Properties section: list key-value pairs from `contact_properties`, add/delete buttons
- Save button for all changes

**Right panel (2/3)** — Tabs component:

- **Timeline tab**: Activities from `activities` table, sorted by `created_at` desc
  - Icon per type: email_sent=Mail, email_opened=Eye, page_view=Eye, form_submit=FileText, purchase=ShoppingCart, note=StickyNote, call=Phone
  - Each: icon + type badge + subject + body preview + date + performed_by
  - "Log Activity" button → Dialog: type select, subject, body → insert into `activities`

- **Page Views tab**: Table from `page_views` where `contact_id = id`
  - Columns: Date, Page URL, Referrer, UTM Source, Device

- **Conversions tab**: Table from `conversions` where `contact_id = id`
  - Columns: Date, Event Name, Category, Value, Page URL

- **Campaigns tab**: From `campaign_contacts` joined with `campaigns` name
  - Columns: Campaign Name, Sent At, Opened At, Clicked At, Status badges

---

### Nav & Routes

- AdminLayout: Add `{ to: "/admin/contacts", icon: Users, label: "Contacts" }` after "Leads" in PRINCIPAL group
- routeTitles: `"/admin/contacts": "Contacts"`
- App.tsx: Add `<Route path="/admin/contacts" element={<AdminContactsPage />} />` and `<Route path="/admin/contacts/:id" element={<AdminContactDetailPage />} />`

### Approach

Both pages created as single-file components (matching existing admin page patterns). No shared components extracted — keeps it self-contained. All Supabase queries use typed client. Toast notifications via `sonner`. French labels consistent with existing admin.

