

## Plan: Lead Scoring & Attribution Module — `/admin/scoring`

### Database

New table needed: `scoring_rules` to persist the rules editor.

```sql
CREATE TABLE public.scoring_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,        -- e.g. 'page_view', 'form_submit', 'job_title_contains'
  condition text,              -- e.g. '/pricing', 'CEO,Director,Manager'
  points integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.scoring_rules ENABLE ROW LEVEL SECURITY;
-- Auth-only CRUD
CREATE POLICY "Auth select scoring_rules" ON public.scoring_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert scoring_rules" ON public.scoring_rules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update scoring_rules" ON public.scoring_rules FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete scoring_rules" ON public.scoring_rules FOR DELETE TO authenticated USING (true);
```

Also add a `pipeline_stage` column to `contacts` for the Kanban:
```sql
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS pipeline_stage text NOT NULL DEFAULT 'new_lead';
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS estimated_revenue numeric DEFAULT 0;
```

### Files to create/modify

| File | Action |
|---|---|
| `src/pages/admin/AdminScoringPage.tsx` | **Create** — Single page with 4 tabs |
| `src/App.tsx` | Add route `/admin/scoring` |
| `src/components/admin/AdminLayout.tsx` | Add "Scoring" nav entry with `Target` icon in ANALYSE group |

### Page: AdminScoringPage — 4 Tabs

**Tab 1 — Scoring Rules:**
- Table of rules from `scoring_rules`: Action, Condition, Points (+/-), Active toggle
- Pre-seed default rules on first load if table empty (page_view +1, form_submit +10, email_opened +5, email_clicked +10, purchase +50, pricing_page +15, job_title_match +20, unsubscribed -30)
- Add rule: dialog with action select, condition input, points input
- Edit/delete inline
- Save updates via upsert

**Tab 2 — Recalculation:**
- "Recalculate All Scores" button
- Logic: for each contact, count activities by type, check conditions, sum points, update `contacts.lead_score`
- Progress bar showing current/total contacts
- Last recalculation timestamp stored in `admin_settings` (key: `last_score_recalc`)

**Tab 3 — Attribution Report:**
- Toggle: First-touch / Last-touch
- Query `page_views` joined with `contacts` + `orders` to build source → leads → customers → revenue table
- Bar chart (recharts) showing top sources by lead count and revenue

**Tab 4 — Sales Pipeline (Kanban):**
- Columns: `new_lead`, `contacted`, `qualified`, `proposal`, `won`, `lost`
- Query `contacts` grouped by `pipeline_stage`
- Cards: name, company, lead_score badge, last activity date
- Drag-and-drop via native HTML drag events (no extra dependency)
- Drop updates `contacts.pipeline_stage` in Supabase
- Column header shows count + sum of `estimated_revenue`

### Routes & Nav
- AdminLayout: Add `{ to: "/admin/scoring", icon: Target, label: "Scoring" }` in ANALYSE group
- routeTitles: `"/admin/scoring": "Scoring"`
- App.tsx: `<Route path="/admin/scoring" element={<AdminScoringPage />} />`

