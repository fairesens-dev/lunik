

## Plan: HubSpot-like Marketing Admin Panel — Database Schema

### Tables to create (9 tables)

1. **contacts** — CRM leads with lifecycle tracking, lead scoring, and source attribution
2. **contact_properties** — Custom key-value fields per contact
3. **activities** — CRM timeline (emails, page views, calls, notes)
4. **page_views** — Analytics tracking with UTM params and device info
5. **conversions** — Conversion events with value tracking
6. **campaigns** — Email campaigns (newsletter, automation, transactional)
7. **campaign_contacts** — Campaign recipient tracking (sent, opened, clicked)
8. **modals** — Popup/slide-in configurator with targeting rules
9. **tag_plan** — Tag plan for event tracking documentation

### Enums to create

- `contact_status`: visitor, lead, mql, sql, customer, churned
- `contact_source`: organic, paid, email, social, referral, direct
- `activity_type`: email_sent, email_opened, email_clicked, sms_sent, page_view, form_submit, purchase, note, call
- `campaign_type`: newsletter, automation, transactional
- `campaign_status`: draft, scheduled, sent
- `modal_type`: popup, slide_in, banner, exit_intent
- `modal_trigger`: time_delay, scroll_percent, exit_intent, page_load
- `modal_show_to`: all, new, returning
- `modal_status`: active, paused, draft
- `modal_frequency`: always, once, once_per_session
- `tag_impl_status`: planned, implemented, verified
- `tag_destination`: internal, ga4, meta, google_ads

### RLS Policies

All tables: authenticated users can CRUD. No public access (admin panel only).

### Indexes

- `contact_id` on: contact_properties, activities, page_views, conversions, campaign_contacts
- `session_id` on: page_views, conversions
- `created_at` on: contacts, activities, page_views, conversions, campaigns
- `status` on: contacts, campaigns, modals
- `email` on: contacts (unique)

### Implementation

Single SQL migration with all enums, tables, indexes, and RLS policies. No code changes needed — schema only.

