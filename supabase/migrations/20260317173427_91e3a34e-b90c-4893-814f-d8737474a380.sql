CREATE TABLE public.generated_visuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  toile_color_hex text NOT NULL,
  armature_color_hex text NOT NULL,
  led boolean NOT NULL DEFAULT false,
  toile_photo_url text,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_visuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read generated_visuals"
  ON public.generated_visuals FOR SELECT TO public
  USING (true);

CREATE POLICY "Service role can insert generated_visuals"
  ON public.generated_visuals FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete generated_visuals"
  ON public.generated_visuals FOR DELETE TO service_role
  USING (true);