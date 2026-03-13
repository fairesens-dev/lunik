
ALTER TABLE public.modals
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS body_text text,
  ADD COLUMN IF NOT EXISTS background_color text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS text_color text NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS width_size text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS form_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS form_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS redirect_url text,
  ADD COLUMN IF NOT EXISTS webhook_url text,
  ADD COLUMN IF NOT EXISTS campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
