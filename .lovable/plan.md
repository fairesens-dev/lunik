

## Plan: Settings & Integrations — Rewrite `/admin/parametres`

### Overview

Complete rewrite of `AdminSettingsPage.tsx` replacing the current 4 tabs (Mon compte, Notifications, Livraison & SAV, Sécurité) with 5 new tabs. All settings stored in `admin_settings` table using existing key-value JSONB pattern. No database migration needed.

The existing Account/Security functionality will be merged into the new tabs where appropriate (account info → General, password → kept in a section, notifications → enhanced Notifications tab).

### File changes

| File | Action |
|---|---|
| `src/pages/admin/AdminSettingsPage.tsx` | **Rewrite** — 5 new tabs |

No routing or nav changes needed — page already at `/admin/parametres`.

### Tab 1 — Général

Settings stored in `admin_settings` keys: `general`, `company`, `gdpr`

- **Site settings**: Site name (from content.global.brandName), site URL, default currency (EUR), timezone select
- **Admin profile**: First/last name, email (migrated from current AccountTab)
- **Company info**: SIRET, address, TVA, billing email (migrated from current AccountTab)
- **GDPR settings**: Consent text textarea, data retention period select (6mo/1yr/2yr/3yr)
- **Password change**: Kept from SecurityTab (new pwd + confirm)

### Tab 2 — Équipe

Settings stored in `admin_settings` key: `team`

- Table of team members (stored as JSONB array): name, email, role badge (admin/sales/marketing/viewer)
- "Inviter un membre" dialog: email input + role select → adds to list (no actual auth invite — stores intent)
- Round-robin toggle for lead assignment
- Delete member action

### Tab 3 — Intégrations

Settings stored in `admin_settings` key: `integrations`

- **Google Analytics 4**: GA4 Measurement ID input
- **Meta Pixel**: Pixel ID input
- **Google Ads**: Conversion ID input
- **Webhook global**: URL input for new leads POST
- **SMTP settings**: host, port, username, password (masked), from address
- **SMS / Twilio**: Account SID, Auth Token (masked), From number
- Each section as a collapsible Card with save button

### Tab 4 — API & Tracking

Settings stored in `admin_settings` key: `api_tracking`

- **Tracking script**: Generated `<script>` snippet in code block with copy button (uses site URL + Supabase project ID)
- **API keys**: Table of keys (name, key masked, created date, revoke button). Generate new key button (generates random UUID-based key, stores in JSONB array)
- **CORS origins**: Textarea for allowed origins (one per line)

### Tab 5 — Notifications

Settings stored in `admin_settings` key: `notifications` (extends existing)

- **Alert rules**: "When lead score > X, notify email" — configurable threshold + recipient email
- **Daily digest**: Toggle + recipient email
- **Existing notification toggles**: Migrated from current NotificationsTab (new order, new lead, etc.)
- **Slack webhook**: Optional URL input for new lead notifications
- **Notification email(s)**: Kept from current implementation

### Technical notes

- All data persisted via `supabase.from("admin_settings").upsert({ id: key, data: ... })` — same pattern as existing code
- Passwords for SMTP/Twilio stored masked in UI, full value in JSONB (admin-only table with RLS)
- No new dependencies
- French labels consistent with existing admin

