

## Plan: Newsletter & Campaign Tool — `/admin/campaigns`

### Overview

Full campaign management module with 4 pages: list, builder (new/edit), and report view. Uses existing `campaigns`, `campaign_contacts`, and `contacts` tables. No database changes needed.

### Files to create/modify

| File | Action |
|---|---|
| `src/pages/admin/AdminCampaignsPage.tsx` | **Create** — Campaign list with cards/table toggle, filters, quick actions |
| `src/pages/admin/AdminCampaignBuilderPage.tsx` | **Create** — 4-step wizard (Setup, Audience, Content, Schedule) |
| `src/pages/admin/AdminCampaignReportPage.tsx` | **Create** — KPI row, charts, contact-level table, CSV export |
| `src/App.tsx` | Add 4 routes |
| `src/components/admin/AdminLayout.tsx` | Add "Campagnes" nav entry with `Mail` icon under ANALYSE group |

### Page 1: AdminCampaignsPage (`/admin/campaigns`)

- Toggle between card grid and table view (localStorage preference)
- Each campaign: name, type badge (newsletter=blue, automation=purple, transactional=gray), status chip (draft=yellow, scheduled=blue, sent=green), recipients_count, open rate % (`opens_count/recipients_count`), click rate %, sent_at or scheduled_at
- Quick actions per campaign: Edit → `/admin/campaigns/:id/edit`, Duplicate (insert copy), View Report → `/admin/campaigns/:id/report`, Delete
- Filter by status + type select
- "New Campaign" button → `/admin/campaigns/new`
- Stats banner: total campaigns, total sent, avg open rate

### Page 2: AdminCampaignBuilderPage (`/admin/campaigns/new` & `/admin/campaigns/:id/edit`)

4-step stepper using internal state (step 1-4), not separate routes.

**Step 1 — Setup:**
- Campaign name, type select (newsletter/automation/transactional)
- Sender name + sender email inputs
- Subject line with character counter (green "Good" < 60 chars, red "Too long" > 90)
- Preview text with character counter
- Auto-save draft on step change

**Step 2 — Audience:**
- Segment filters: status select (multi), source select (multi)
- Live count: query `contacts` with filters, display "X contacts correspondent"
- Manual import: textarea to paste emails, resolve to contact_ids
- Exclusion count: contacts with `unsubscribed_at` in campaign_contacts

**Step 3 — Content:**
- Textarea-based HTML editor (no heavy dependency)
- 3 pre-built HTML template buttons (Basic, Promo, Newsletter) that populate the textarea
- Merge tags panel: clickable chips `{{first_name}}`, `{{last_name}}`, `{{email}}`, `{{unsubscribe_link}}` — insert at cursor
- Preview toggle: desktop (600px iframe) / mobile (320px iframe) rendering html_content
- "Send test" button: input email + invoke logic (toast placeholder)

**Step 4 — Schedule:**
- Radio: "Send now" or "Schedule"
- If schedule: date picker + time input + timezone display
- Summary card: audience count, subject, sender, schedule
- "Confirm & Launch" button: updates campaign status to `scheduled` or `sent`, inserts `campaign_contacts` rows for all matched contacts with `sent_at = now()`

### Page 3: AdminCampaignReportPage (`/admin/campaigns/:id/report`)

- Fetch campaign + campaign_contacts (with contact email join)
- KPI row (Cards): Sent (recipients_count), Opens (opens_count), Open Rate %, Clicks (clicks_count), CTR %, Unsubscribes (unsubscribes_count)
- Opens/Clicks over time chart: use `recharts` (already installed) LineChart, aggregate campaign_contacts by opened_at/clicked_at timestamps
- Contact-level table: email, opened (checkmark/cross based on opened_at), clicked, unsubscribed
- Export CSV button for recipients

### Routes & Nav

- `AdminLayout`: Add `{ to: "/admin/campaigns", icon: Mail, label: "Campagnes" }` in ANALYSE group after Marketing
- `routeTitles`: Add `"/admin/campaigns": "Campagnes"`
- `App.tsx`: Add 4 routes:
  - `/admin/campaigns` → `AdminCampaignsPage`
  - `/admin/campaigns/new` → `AdminCampaignBuilderPage`
  - `/admin/campaigns/:id/edit` → `AdminCampaignBuilderPage`
  - `/admin/campaigns/:id/report` → `AdminCampaignReportPage`

### Technical notes

- All queries via existing typed `supabase` client
- Toast via `sonner`
- French labels consistent with existing admin
- No new dependencies — recharts already available for charts
- Campaign builder saves as draft on each step transition via `supabase.from("campaigns").upsert()`

