-- ═══════════════════════════════════════════════════════
-- ABANDONED CARTS TABLE
-- ═══════════════════════════════════════════════════════

CREATE TABLE public.abandoned_carts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  email text,
  cart_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  abandonment_stage text NOT NULL DEFAULT 'configurateur',
  touch_count integer NOT NULL DEFAULT 0,
  last_email_sent_at timestamptz,
  converted boolean NOT NULL DEFAULT false,
  converted_order_id uuid REFERENCES public.orders(id),
  promo_code_used text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_abandoned_carts_processing
  ON public.abandoned_carts (converted, touch_count, email)
  WHERE converted = false AND email IS NOT NULL AND touch_count < 3;

CREATE INDEX idx_abandoned_carts_session ON public.abandoned_carts (session_id);

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert abandoned_carts"
  ON public.abandoned_carts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update own abandoned_carts"
  ON public.abandoned_carts FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated can read abandoned_carts"
  ON public.abandoned_carts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete abandoned_carts"
  ON public.abandoned_carts FOR DELETE
  USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_abandoned_carts_updated_at
  BEFORE UPDATE ON public.abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════════════════════════════════════════════
-- PROMO CODES TABLE
-- ═══════════════════════════════════════════════════════

CREATE TABLE public.promo_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'percent',
  value numeric NOT NULL DEFAULT 0,
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  first_purchase_only boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active promo_codes"
  ON public.promo_codes FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated can insert promo_codes"
  ON public.promo_codes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update promo_codes"
  ON public.promo_codes FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete promo_codes"
  ON public.promo_codes FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════════════════
-- ADD PROMO COLUMNS TO ORDERS
-- ═══════════════════════════════════════════════════════

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_code text DEFAULT '',
  ADD COLUMN IF NOT EXISTS promo_discount integer DEFAULT 0;