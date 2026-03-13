

## Plan: Modal/Popup Configurator — `/admin/modals`

### Overview

Full modal management module with a list page and a builder page (4 tabs). The `modals` table already exists with all needed columns and enums. Two new columns needed via migration: `title` (text) and `body_text` (text) for structured content alongside `html_content`. Also need `background_color`, `text_color`, `width_size` columns. No new tables needed.

### Database Migration

Add missing columns to `modals` table:
- `title` text nullable
- `body_text` text nullable  
- `background_color` text default `'#FFFFFF'`
- `text_color` text default `'#000000'`
- `width_size` text default `'medium'` (small/medium/large/full)
- `form_enabled` boolean default false
- `form_fields` jsonb default `'{}'` (which fields are enabled)
- `redirect_url` text nullable
- `webhook_url` text nullable
- `campaign_id` uuid nullable (FK to campaigns)
- `updated_at` timestamptz default now()

### Files to create/modify

| File | Action |
|---|---|
| `src/pages/admin/AdminModalsPage.tsx` | **Create** — Modal list with cards, stats, quick actions |
| `src/pages/admin/AdminModalBuilderPage.tsx` | **Create** — 4-tab builder (Design, Targeting, Integration, Analytics) |
| `src/App.tsx` | Add 3 routes |
| `src/components/admin/AdminLayout.tsx` | Add "Modals" nav entry with `Layers` icon in BOUTIQUE group |

### Page 1: AdminModalsPage (`/admin/modals`)

- Card grid view, each card shows: name, type badge (popup/slide_in/banner/exit_intent), trigger description, status toggle (active/paused/draft)
- Stats per card: impressions_count, conversions_count, conversion rate %
- Quick actions: Edit, Duplicate, Delete, Preview (opens modal in overlay)
- "New Modal" button → `/admin/modals/new`
- Stats banner: total modals, total impressions, avg conversion rate

### Page 2: AdminModalBuilderPage (`/admin/modals/new` & `/admin/modals/:id/edit`)

4 tabs via Tabs component:

**Tab 1 — Design:**
- Type selector: popup, slide_in, banner, exit_intent (radio cards)
- Title, body_text, button_text, button_url inputs
- Image URL input (optional header image)
- Background color + text color pickers (native `<input type="color">`)
- Width selector: small/medium/large/full (radio group)
- Right side: live preview panel rendering the modal in real-time based on current settings

**Tab 2 — Targeting:**
- Trigger type select (time_delay, scroll_percent, exit_intent, page_load)
- Trigger value input (seconds or scroll %)
- Target pages: radio "All pages" / "Specific URLs" + textarea for URL patterns
- Show to: select (all/new/returning)
- Frequency: select (always/once/once_per_session)

**Tab 3 — Integration:**
- Form toggle: enable/disable capture form
- If enabled: checkboxes for Email (always on), First Name, Last Name, Phone
- On submit logic description: creates contact + logs activity
- Redirect URL input (optional)
- Webhook URL input (optional)
- Campaign dropdown: select from existing campaigns table

**Tab 4 — Analytics:**
- KPI cards: impressions, conversions, conversion rate
- Recharts BarChart: daily impressions vs conversions (from conversions table filtered by modal metadata, last 30 days)
- Table of last 50 contacts captured (from activities where metadata contains modal_id)

**Embed Instructions section** (below tabs):
- Generated JS snippet in code block with copy button
- Test mode toggle description

### Routes & Nav

- AdminLayout: Add `{ to: "/admin/modals", icon: Layers, label: "Modals" }` in BOUTIQUE group
- routeTitles: `"/admin/modals": "Modals"`
- App.tsx routes: `/admin/modals`, `/admin/modals/new`, `/admin/modals/:id/edit`

