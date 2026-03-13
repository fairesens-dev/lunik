
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.contact_status AS ENUM ('visitor','lead','mql','sql','customer','churned');
CREATE TYPE public.contact_source AS ENUM ('organic','paid','email','social','referral','direct');
CREATE TYPE public.activity_type AS ENUM ('email_sent','email_opened','email_clicked','sms_sent','page_view','form_submit','purchase','note','call');
CREATE TYPE public.campaign_type AS ENUM ('newsletter','automation','transactional');
CREATE TYPE public.campaign_status AS ENUM ('draft','scheduled','sent');
CREATE TYPE public.modal_type AS ENUM ('popup','slide_in','banner','exit_intent');
CREATE TYPE public.modal_trigger AS ENUM ('time_delay','scroll_percent','exit_intent','page_load');
CREATE TYPE public.modal_show_to AS ENUM ('all','new','returning');
CREATE TYPE public.modal_status AS ENUM ('active','paused','draft');
CREATE TYPE public.modal_frequency AS ENUM ('always','once','once_per_session');
CREATE TYPE public.tag_impl_status AS ENUM ('planned','implemented','verified');
CREATE TYPE public.tag_destination AS ENUM ('internal','ga4','meta','google_ads');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text,
  company text,
  job_title text,
  status public.contact_status NOT NULL DEFAULT 'visitor',
  source public.contact_source NOT NULL DEFAULT 'direct',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  lifecycle_stage text,
  lead_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz
);

CREATE TABLE public.contact_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  property_key text NOT NULL,
  property_value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  type public.activity_type NOT NULL,
  subject text,
  body text,
  metadata jsonb DEFAULT '{}'::jsonb,
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  session_id text,
  page_url text NOT NULL,
  page_title text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  ip_address text,
  user_agent text,
  country text,
  city text,
  device_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  session_id text,
  event_name text NOT NULL,
  event_category text,
  event_value numeric,
  currency text DEFAULT 'EUR',
  page_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type public.campaign_type NOT NULL DEFAULT 'newsletter',
  subject text,
  preview_text text,
  html_content text,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  sender_name text,
  sender_email text,
  recipients_count integer NOT NULL DEFAULT 0,
  opens_count integer NOT NULL DEFAULT 0,
  clicks_count integer NOT NULL DEFAULT 0,
  unsubscribes_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.campaign_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  unsubscribed_at timestamptz
);

CREATE TABLE public.modals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type public.modal_type NOT NULL DEFAULT 'popup',
  trigger_type public.modal_trigger NOT NULL DEFAULT 'time_delay',
  trigger_value text,
  target_pages text[] DEFAULT '{}'::text[],
  show_to public.modal_show_to NOT NULL DEFAULT 'all',
  html_content text,
  button_text text,
  button_url text,
  image_url text,
  status public.modal_status NOT NULL DEFAULT 'draft',
  display_frequency public.modal_frequency NOT NULL DEFAULT 'once',
  conversions_count integer NOT NULL DEFAULT 0,
  impressions_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tag_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_category text,
  description text,
  implementation_status public.tag_impl_status NOT NULL DEFAULT 'planned',
  trigger_description text,
  expected_value text,
  destination public.tag_destination NOT NULL DEFAULT 'internal',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE TRIGGER set_contacts_updated_at BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_contact_properties_updated_at BEFORE UPDATE ON public.contact_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_contact_properties_contact_id ON public.contact_properties(contact_id);
CREATE INDEX idx_activities_contact_id ON public.activities(contact_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);
CREATE INDEX idx_page_views_contact_id ON public.page_views(contact_id);
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX idx_conversions_contact_id ON public.conversions(contact_id);
CREATE INDEX idx_conversions_session_id ON public.conversions(session_id);
CREATE INDEX idx_conversions_created_at ON public.conversions(created_at);
CREATE INDEX idx_campaigns_created_at ON public.campaigns(created_at);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaign_contacts_campaign_id ON public.campaign_contacts(campaign_id);
CREATE INDEX idx_campaign_contacts_contact_id ON public.campaign_contacts(contact_id);
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at);
CREATE INDEX idx_contacts_status ON public.contacts(status);
CREATE INDEX idx_modals_status ON public.modals(status);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_plan ENABLE ROW LEVEL SECURITY;

-- Authenticated CRUD for all 9 tables
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['contacts','contact_properties','activities','page_views','conversions','campaigns','campaign_contacts','modals','tag_plan']
  LOOP
    EXECUTE format('CREATE POLICY "Auth select %1$s" ON public.%1$I FOR SELECT TO authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "Auth insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (true)', t);
    EXECUTE format('CREATE POLICY "Auth update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "Auth delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (true)', t);
  END LOOP;
END $$;

-- Public insert for page_views and conversions (frontend tracking)
CREATE POLICY "Public insert page_views" ON public.page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public insert conversions" ON public.conversions FOR INSERT TO anon WITH CHECK (true);
