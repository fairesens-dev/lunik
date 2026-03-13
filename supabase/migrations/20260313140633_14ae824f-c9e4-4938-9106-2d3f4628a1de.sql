
ALTER TYPE public.activity_type ADD VALUE IF NOT EXISTS 'chatbot_conversation';
ALTER TYPE public.activity_type ADD VALUE IF NOT EXISTS 'sav_request';
ALTER TYPE public.activity_type ADD VALUE IF NOT EXISTS 'callback_request';
ALTER TYPE public.contact_source ADD VALUE IF NOT EXISTS 'sav_widget';
ALTER TYPE public.contact_source ADD VALUE IF NOT EXISTS 'callback_widget';
