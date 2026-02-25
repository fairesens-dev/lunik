-- Add checkout/payment columns to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS client_address text DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_address2 text DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_city text DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_country text DEFAULT 'France',
  ADD COLUMN IF NOT EXISTS civility text DEFAULT '',
  ADD COLUMN IF NOT EXISTS delivery_option text DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'card',
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS newsletter_optin boolean DEFAULT false;

-- Create RPC function for public order tracking (by ref + email)
CREATE OR REPLACE FUNCTION public.lookup_order(p_ref text, p_email text)
RETURNS TABLE (
  ref text,
  client_name text,
  client_email text,
  width integer,
  projection integer,
  toile_color text,
  armature_color text,
  options text[],
  amount integer,
  status text,
  status_history jsonb,
  delivery_option text,
  payment_status text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.ref, o.client_name, o.client_email,
    o.width, o.projection, o.toile_color, o.armature_color,
    o.options, o.amount, o.status, o.status_history,
    o.delivery_option, o.payment_status, o.created_at
  FROM public.orders o
  WHERE o.ref = p_ref AND lower(o.client_email) = lower(p_email)
  LIMIT 1;
$$;