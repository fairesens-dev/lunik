

## Plan: Tracking Plan Manager — `/admin/tracking`

### Overview

New admin page with 3 tabs: Tag Plan table, Tracking Script Generator, and Live Event Stream. One new page file + route registration + sidebar nav entry.

### Files to create/modify

| File | Action |
|---|---|
| `src/pages/admin/AdminTrackingPage.tsx` | **Create** — Full page with 3 tabs |
| `src/App.tsx` | Add route `/admin/tracking` |
| `src/components/admin/AdminLayout.tsx` | Add nav entry under ANALYSE group |

### Tab 1: Tag Plan Table

- Fetch all rows from `tag_plan` table via Supabase client
- Table columns: Event Name, Category, Trigger, Destinations (Badge), Status (color-coded chip), Actions (edit/delete)
- Status colors: `planned` = yellow (`bg-yellow-100 text-yellow-800`), `implemented` = blue (`bg-blue-100 text-blue-800`), `verified` = green (`bg-green-100 text-green-800`)
- Filter bar: Select for status (`all/planned/implemented/verified`) + Select for destination + text search on event_name
- Add/Edit: Dialog modal with fields: event_name, event_category, description, trigger_description, expected_value, implementation_status (select), destination (select)
- CRUD via `supabase.from("tag_plan")` — insert, update, delete
- Pattern: follows AdminLeadsPage/AdminMarketingPage conventions (Card wrapping, Table component, Badge, toast from sonner)

### Tab 2: Tracking Script Generator

- Static generated script based on the Supabase project URL and anon key
- Script logic:
  - Generates/retrieves `session_id` UUID from localStorage
  - Parses UTM params from `window.location.search`
  - On page load: inserts into `page_views` via Supabase REST API (POST to `/rest/v1/page_views`)
  - Exposes `window.trackEvent(name, category, value, metadata)` → inserts into `conversions`
  - Checks `localStorage.contact_email` for contact identification
- Display in a `<pre>` code block with a "Copy" button
- Embed checklist: simple list with checkmarks

### Tab 3: Live Event Stream

- Supabase Realtime subscription on `page_views` and `conversions` tables (INSERT events)
- Maintain a state array of last 50 events, newest first
- Each row: timestamp, event type badge (page_view = gray, conversion = primary), page URL, truncated session_id (8 chars), contact email if available
- Auto-scroll container with `overflow-y-auto max-h-[500px]`
- Pause auto-scroll on hover via `onMouseEnter/onMouseLeave`
- Initial load: fetch last 50 from each table, merge by `created_at` desc

### Nav & Route

- AdminLayout: Add `{ to: "/admin/tracking", icon: Tag, label: "Tracking" }` in ANALYSE group
- routeTitles: Add `"/admin/tracking": "Tracking"`
- App.tsx: Add `<Route path="/admin/tracking" element={<AdminTrackingPage />} />`

