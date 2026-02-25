
-- =============================================
-- Migration: Create all application tables
-- =============================================

-- 1. site_content (key-value for site content sections)
CREATE TABLE public.site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert site_content" ON public.site_content FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update site_content" ON public.site_content FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete site_content" ON public.site_content FOR DELETE USING (auth.uid() IS NOT NULL);

-- 2. configurator_settings (key-value for configurator params)
CREATE TABLE public.configurator_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.configurator_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read configurator_settings" ON public.configurator_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert configurator_settings" ON public.configurator_settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update configurator_settings" ON public.configurator_settings FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete configurator_settings" ON public.configurator_settings FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text DEFAULT '',
  client_postal_code text DEFAULT '',
  width integer NOT NULL,
  projection integer NOT NULL,
  toile_color text DEFAULT '',
  armature_color text DEFAULT '',
  options text[] DEFAULT '{}',
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'Nouveau',
  message text DEFAULT '',
  status_history jsonb DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read orders" ON public.orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update orders" ON public.orders FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete orders" ON public.orders FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  width integer,
  projection integer,
  toile_color text DEFAULT '',
  armature_color text DEFAULT '',
  options text[] DEFAULT '{}',
  postal_code text DEFAULT '',
  message text DEFAULT '',
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read leads" ON public.leads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update leads" ON public.leads FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete leads" ON public.leads FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. contact_messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read contact_messages" ON public.contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete contact_messages" ON public.contact_messages FOR DELETE USING (auth.uid() IS NOT NULL);

-- 6. admin_settings (key-value for admin preferences)
CREATE TABLE public.admin_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin_settings" ON public.admin_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert admin_settings" ON public.admin_settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update admin_settings" ON public.admin_settings FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete admin_settings" ON public.admin_settings FOR DELETE USING (auth.uid() IS NOT NULL);

-- =============================================
-- Trigger for auto-updating updated_at
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configurator_settings_updated_at BEFORE UPDATE ON public.configurator_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Seed: site_content default data
-- =============================================

INSERT INTO public.site_content (id, data) VALUES
('global', '{"brandName":"Mon Store","tagline":"Protection solaire sur-mesure · Fabrication française","phone":"03 68 38 10 30","email":"contact@monstore.fr","address":"12 rue de l''Atelier, 67000 Strasbourg","siret":"XXX XXX XXX 00001","socialInstagram":"https://instagram.com/","socialFacebook":"https://facebook.com/","socialPinterest":"https://pinterest.com/","trustpilotUrl":"https://fr.trustpilot.com/"}'::jsonb),
('homepage', '{"heroTitle":"Vivez dehors,\nsans compromis.","heroSubtitle":"Nos stores bannes et coffres sont conçus sur-mesure, fabriqués en France, et livrés chez vous en 4 à 5 semaines.","heroOverline":"Protection solaire sur-mesure · Fabrication française","heroCTA1":"Configurer mon store","heroCTA2":"Voir le produit","marqueeText":"FABRIQUÉ EN FRANCE · SUR-MESURE · LIVRAISON 4-5 SEMAINES · GARANTIE 5 ANS · MOTORISATION SOMFY · TOILE DICKSON · MADE IN FRANCE · ","productSectionTitle":"Le Store Coffre\nrepensé de A à Z","productSectionSubtitle":"Un seul produit. Le meilleur de sa catégorie.","testimonials":[{"id":"t1","name":"David M.","city":"Lyon","text":"Livraison rapide, produit conforme, équipe réactive. Je recommande sans hésiter.","rating":5,"active":true},{"id":"t2","name":"Alain R.","city":"Bordeaux","text":"Très bien conseillé, rdv téléphonique tenu, équipe d''installation au top.","rating":5,"active":true},{"id":"t3","name":"Xavier P.","city":"Strasbourg","text":"Deuxième commande, troisième store. Toujours aussi satisfait.","rating":5,"active":true},{"id":"t4","name":"Marie L.","city":"Nantes","text":"Excellent rapport qualité/prix, belle finition, parfait pour notre terrasse.","rating":5,"active":true}],"faqItems":[{"id":"hf1","question":"Puis-je me faire livrer partout en France ?","answer":"Oui, nous livrons sur l''ensemble du territoire métropolitain.","active":true},{"id":"hf2","question":"Quelle est la taille maximum de mon store ?","answer":"Nos stores sont disponibles de 150 cm à 600 cm de largeur.","active":true},{"id":"hf3","question":"La motorisation Somfy est-elle incluse ?","answer":"La motorisation Somfy est disponible en option lors de la configuration.","active":true},{"id":"hf4","question":"Comment se passe l''installation ?","answer":"Vous pouvez installer votre store vous-même grâce à notre guide détaillé.","active":true},{"id":"hf5","question":"Quels délais de fabrication ?","answer":"Comptez 4 à 5 semaines entre votre commande et la livraison.","active":true},{"id":"hf6","question":"Y a-t-il une garantie ?","answer":"Tous nos stores sont garantis 5 ans pièces et main d''œuvre.","active":true}]}'::jsonb),
('productPage', '{"heroTitle":"Le store qui\nredéfinit l''extérieur.","heroOverline":"Store Coffre · Fabrication Française Sur-Mesure","heroSubtitle":"Aluminium premium, toile Dickson, motorisation Somfy.","configuratorTitle":"Créez votre store\nsur-mesure","configuratorSubtitle":"Renseignez vos dimensions, choisissez vos coloris et vos options.","stepLabels":["VOS DIMENSIONS","COULEUR DE TOILE","COULEUR DE L''ARMATURE","OPTIONS"],"orderConfirmationMessage":"Merci pour votre commande !","faqItems":[{"id":"pf1","question":"Quelles sont les dimensions maximales du store ?","answer":"La largeur maximale est de 600 cm.","active":true},{"id":"pf2","question":"La motorisation Somfy est-elle difficile à installer ?","answer":"Non. La motorisation Somfy io est plug & play.","active":true},{"id":"pf3","question":"Puis-je commander des échantillons de toile ?","answer":"Oui, nous envoyons des échantillons Dickson gratuitement sous 48h.","active":true},{"id":"pf4","question":"Quel est le délai de fabrication et de livraison ?","answer":"4 à 5 semaines après confirmation.","active":true},{"id":"pf5","question":"Puis-je l''installer moi-même ?","answer":"Oui. Chaque store est livré avec un guide d''installation détaillé.","active":true},{"id":"pf6","question":"Quelles garanties ai-je sur mon achat ?","answer":"Garantie légale de conformité, garantie commerciale 5 ans.","active":true}]}'::jsonb),
('sav', '{"heroTitle":"Un SAV qui vous ressemble","heroSubtitle":"Une équipe dédiée, basée en France, à votre écoute du lundi au vendredi.","hours":"Lundi – Vendredi : 9h – 18h","responseDelay":"sous 24h","faqItems":[{"id":"sf1","question":"Que couvre exactement la garantie ?","answer":"10 ans sur la structure aluminium, 5 ans sur la toile Dickson, et 5 ans sur la motorisation Somfy.","active":true},{"id":"sf2","question":"Comment demander une réparation ?","answer":"Remplissez le formulaire ci-dessus.","active":true},{"id":"sf3","question":"Comment commander des pièces détachées ?","answer":"Contactez-nous avec votre numéro de commande.","active":true},{"id":"sf4","question":"Puis-je remplacer la toile de mon store ?","answer":"Oui. Nous proposons un service de retoilage.","active":true},{"id":"sf5","question":"Intervenez-vous dans toute la France ?","answer":"Oui, notre réseau couvre la France métropolitaine.","active":true},{"id":"sf6","question":"Mon moteur ou ma télécommande ne fonctionne plus, que faire ?","answer":"Vérifiez l''alimentation électrique et remplacez les piles.","active":true}]}'::jsonb),
('promoBanner', '{"active":false,"text":"🎉 PROMO PRÉSAISON — 10% de remise ce mois !","bgColor":"#4A5E3A","textColor":"#FFFFFF","ctaText":"En profiter","ctaUrl":"/store-coffre"}'::jsonb);

-- =============================================
-- Seed: configurator_settings default data
-- =============================================

INSERT INTO public.configurator_settings (id, data) VALUES
('pricing', '{"baseRate":580,"minPrice":1890,"installmentDivisor":3}'::jsonb),
('dimensions', '{"width":{"min":150,"max":600,"step":1,"unit":"cm"},"projection":{"min":100,"max":400,"step":1,"unit":"cm"}}'::jsonb),
('toileColors', '[{"id":"blanc-ecru","hex":"#F5F0E8","label":"Blanc Écru","active":true},{"id":"sable","hex":"#E8DCC8","label":"Sable","active":true},{"id":"chanvre","hex":"#C8B89A","label":"Chanvre","active":true},{"id":"havane","hex":"#8B7355","label":"Havane","active":true},{"id":"moka","hex":"#5C4A32","label":"Moka","active":true},{"id":"sauge","hex":"#4A5E3A","label":"Sauge","active":true},{"id":"eucalyptus","hex":"#6B8C6B","label":"Eucalyptus","active":true},{"id":"bleu-ardoise","hex":"#4A6B8A","label":"Bleu Ardoise","active":true},{"id":"terracotta","hex":"#8A4A4A","label":"Terracotta","active":true},{"id":"gris-clair","hex":"#C8C8C8","label":"Gris Clair","active":true},{"id":"gris-anthracite","hex":"#5A5A5A","label":"Gris Anthracite","active":true},{"id":"noir","hex":"#1A1A1A","label":"Noir","active":true}]'::jsonb),
('armatureColors', '[{"id":"blanc","hex":"#F0EDE8","label":"Blanc RAL 9016","active":true},{"id":"anthracite","hex":"#5A5A5A","label":"Gris Anthracite RAL 7016","active":true},{"id":"noir","hex":"#1A1A1A","label":"Noir RAL 9005","active":true},{"id":"sable","hex":"#C8B48A","label":"Sable RAL 1015","active":true}]'::jsonb),
('options', '[{"id":"motorisation","icon":"⚡","label":"Motorisation Somfy io","description":"Télécommande + app smartphone TaHoma incluses.","price":390,"active":true,"highlight":false},{"id":"led","icon":"💡","label":"Éclairage LED sous store","description":"Bandeau LED intégré, lumière 3000K, télécommandé.","price":290,"active":true,"highlight":false},{"id":"pack-connect","icon":"📱","label":"Pack Connect","description":"Motorisation + LED + TaHoma. Tout dans un pack.","price":590,"active":true,"highlight":true,"savingsLabel":"ÉCONOMISEZ 90 €","includesIds":["motorisation","led"]}]'::jsonb);

-- =============================================
-- Seed: admin_settings defaults
-- =============================================

INSERT INTO public.admin_settings (id, data) VALUES
('notifications', '{"newOrder":true,"newLead":true,"leadReminder":true,"orderStatusUpdate":true,"weeklyReport":false,"monthlyReport":false,"emails":""}'::jsonb),
('delivery', '{"delay":"4 à 5 semaines","customMessage":"","showCustomMessage":false}'::jsonb);

-- =============================================
-- Sequence for order references
-- =============================================

CREATE SEQUENCE public.order_ref_seq START 1;
