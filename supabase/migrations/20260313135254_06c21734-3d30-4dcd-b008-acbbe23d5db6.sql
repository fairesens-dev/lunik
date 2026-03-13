-- Create scoring_rules table
CREATE TABLE public.scoring_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  condition text,
  points integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.scoring_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth select scoring_rules" ON public.scoring_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert scoring_rules" ON public.scoring_rules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update scoring_rules" ON public.scoring_rules FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete scoring_rules" ON public.scoring_rules FOR DELETE TO authenticated USING (true);

-- Add pipeline columns to contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS pipeline_stage text NOT NULL DEFAULT 'new_lead';
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS estimated_revenue numeric DEFAULT 0;