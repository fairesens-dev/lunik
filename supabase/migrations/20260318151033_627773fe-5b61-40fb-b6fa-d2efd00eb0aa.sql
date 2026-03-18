CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  subject_override TEXT,
  intro_text_override TEXT,
  cta_text_override TEXT,
  footer_note_override TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO email_templates (id) VALUES
  ('order_received'),
  ('in_production'),
  ('ready_to_ship'),
  ('in_delivery'),
  ('delivered'),
  ('sav_requested')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth select email_templates" ON email_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert email_templates" ON email_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update email_templates" ON email_templates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete email_templates" ON email_templates FOR DELETE TO authenticated USING (true);
CREATE POLICY "Service select email_templates" ON email_templates FOR SELECT TO service_role USING (true);