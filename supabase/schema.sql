-- ==============================================================================
-- RnB Digitals - Supabase Schema Migration & Initial Seed Script
-- ==============================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Storage Bucket Creation for Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rnb-media',
  'rnb-media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

-- Storage RLS Policies
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'rnb-media');

CREATE POLICY "Admin All Access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'rnb-media')
WITH CHECK (bucket_id = 'rnb-media');

-- 3. Media Assets Registry Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Site Settings (Single-row or Key-Value)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  site_name TEXT NOT NULL DEFAULT 'RnB Digitals',
  tagline TEXT NOT NULL DEFAULT 'Premium Print & Branding',
  logo_url TEXT DEFAULT '/logo.png',
  logo_icon TEXT DEFAULT 'stars',
  announcement_badge TEXT DEFAULT 'Port Harcourt''s #1 Print & Branding Agency',
  hero_title TEXT NOT NULL DEFAULT 'Your Brand Deserves to Be Seen',
  hero_subtitle TEXT DEFAULT 'Deserves to Be Seen',
  hero_description TEXT NOT NULL DEFAULT 'Premium wide-format printing, custom apparel embroidery, executive merchandise, and high-impact branding for businesses that mean business.',
  hero_cta1_text TEXT DEFAULT 'Get Instant Quote',
  hero_cta1_link TEXT DEFAULT '#calculator',
  hero_cta2_text TEXT DEFAULT 'View Portfolio',
  hero_cta2_link TEXT DEFAULT '#portfolio',
  contact_address TEXT NOT NULL DEFAULT '177 Ada George Road by Pepperoni Junction, Port Harcourt, Rivers State, Nigeria',
  contact_phone TEXT NOT NULL DEFAULT '+234 816 417 1414',
  contact_whatsapp TEXT NOT NULL DEFAULT '2348164171414',
  contact_email TEXT NOT NULL DEFAULT 'rnbdigitals@gmail.com',
  operating_hours TEXT NOT NULL DEFAULT 'Monday – Saturday: 8:00 AM – 6:00 PM (GMT+1)',
  footer_description TEXT DEFAULT 'Port Harcourt''s leading design, industrial printing, custom apparel embroidery, and corporate branding agency. Elevating brand presence with uncompromised precision.',
  footer_copyright TEXT DEFAULT '© RnB Digitals. All Rights Reserved. Premium Print & Branding Solutions.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Navigation Links
CREATE TABLE IF NOT EXISTS public.navigation_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_header BOOLEAN NOT NULL DEFAULT true,
  is_footer BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Hero Slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  tag TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Services
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  popular_for TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  materials TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  starting_price TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Estimator Categories
CREATE TABLE IF NOT EXISTS public.estimator_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  unit_label TEXT NOT NULL,
  base_rate NUMERIC NOT NULL DEFAULT 0,
  min_qty INT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Estimator Options
CREATE TABLE IF NOT EXISTS public.estimator_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.estimator_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  extra_price NUMERIC NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Portfolio Items
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Store Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price_formatted TEXT NOT NULL,
  min_order TEXT NOT NULL,
  image_url TEXT NOT NULL,
  badge TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Why Choose Us Pillars & Site Stats
CREATE TABLE IF NOT EXISTS public.about_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  avatar_url TEXT NOT NULL,
  project_type TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Quote / Contact Inquiries (Lead Capture)
CREATE TABLE IF NOT EXISTS public.quote_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  service TEXT,
  quantity TEXT,
  estimated_total TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'contacted', 'completed', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimator_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimator_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Nav" ON public.navigation_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Hero" ON public.hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Estimator Cats" ON public.estimator_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Estimator Opts" ON public.estimator_options FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Portfolio" ON public.portfolio_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Pillars" ON public.about_pillars FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Stats" ON public.site_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (is_active = true);

-- 2. Public Can Submit Quote Inquiries
CREATE POLICY "Public Insert Inquiries" ON public.quote_inquiries FOR INSERT WITH CHECK (true);

-- 3. Authenticated Admin Full CRUD Policies
CREATE POLICY "Admin All Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Nav" ON public.navigation_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Hero" ON public.hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Estimator Cats" ON public.estimator_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Estimator Opts" ON public.estimator_options FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Portfolio" ON public.portfolio_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Pillars" ON public.about_pillars FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Stats" ON public.site_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Inquiries" ON public.quote_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Media" ON public.media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Exact match to existing RnB Digitals website)
-- ==============================================================================

-- Seed Site Settings
INSERT INTO public.site_settings (id, site_name, tagline, announcement_badge, hero_title, hero_subtitle, hero_description, contact_address, contact_phone, contact_whatsapp, contact_email, operating_hours)
VALUES (
  'global_settings',
  'RnB Digitals',
  'Premium Print & Branding',
  'Port Harcourt''s #1 Print & Branding Agency',
  'Your Brand Deserves to Be Seen',
  'Deserves to Be Seen',
  'Premium wide-format printing, custom apparel embroidery, executive merchandise, and high-impact branding for businesses that mean business.',
  '177 Ada George Road by Pepperoni Junction, Port Harcourt, Rivers State, Nigeria',
  '+234 816 417 1414',
  '2348164171414',
  'rnbdigitals@gmail.com',
  'Monday – Saturday: 8:00 AM – 6:00 PM (GMT+1)'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Navigation Links
INSERT INTO public.navigation_links (label, href, sort_order, is_header, is_footer)
VALUES
  ('Home', '#hero', 1, true, true),
  ('Services', '#services', 2, true, true),
  ('Portfolio', '#portfolio', 3, true, true),
  ('Store', '#store', 4, true, true),
  ('Estimator', '#calculator', 5, true, true),
  ('About', '#about', 6, true, true),
  ('Contact', '#contact', 7, true, true)
ON CONFLICT DO NOTHING;

-- Seed Hero Slides
INSERT INTO public.hero_slides (title, subtitle, tag, image_url, alt, sort_order)
VALUES
  (
    'Custom Precision Embroidery & Apparel',
    'Industrial multi-needle embroidery for executive uniforms & branded merchandise.',
    'Custom Apparel',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB0RwY0XEtgUyikFzxuDu0bOpCDCR_78b0JtUK_EBJW4aC7lhX7ouPq3VKx-3txxqk4ujgJPssXAwdeEoGqQLBAW6VsY0cYQfO2tnW38nzvai-kViDl-OQ7kIGfaw2vKFx4jPmkFDvS7WqIqaTcVP7eNTrV5Lrd3y4P2ZsyGZ7KcNIhMi1Cv8Jw5mcQwJVgAh9QlB8T2jiBBEn8JxG2LLwDENvdHP3zwNzt3Bqf2-8bQRcWqJhfJ0h3Zg',
    'Modern embroidery studio featuring high precision multi-needle embroidery machine on apparel',
    1
  ),
  (
    'Wide Format & Industrial Printing Press',
    'Vibrant outdoor banners, event backdrops, architectural signage & vehicle branding.',
    'Large Format',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5P5uPG_72pec-cab2iqt4lkIplOXelCTC97BE4RC9LhUP5dh7KGg8FNHXhVk1GKLh5SUsLcvxToHt5sTPC98HKgkw2P6o0A_xDRrfASR0ss3rY9kUJiH2hPvAtOv7YBJA11C5dGbZlOg99nRMnEUzwIizqiPUTQIfGP9RT5uTHUboVQCApKKWHWOiier2luEV6W5EmuyFnP6lU6Mz3-Cu4ebYLe1aPfPW2lHuRm9m5-jCMvdrTwRPA',
    'Industrial wide format printing press machine producing high resolution banners',
    2
  ),
  (
    'Executive Branded Corporate Merchandise',
    'Custom branded mugs, corporate gear, luxury gift sets, and promotional items.',
    'Brand Merchandise',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA8uJoRhxw8vOKwVtKKnM4nUs4CQBf67abRyGmrBwTt6PCPHREdWu0Mb39aWyRAiCngpTJU5mPPUYy83vCWDLM9aMnHT6biMjdqAMmQx7xPR1jbuzvWhje7LJBDuOCFXyN2X1ZyIL1Ax7N9taDzXsL27WY7LUW18sGI9BQ0BEVTtwiUorn3Z3vl-5k8MZ3_J-erckw8Mp9LNnsiG582g2OgddGkFBi2V5qza5spg-WCsFAAKLIFTC08Xw',
    'Professionals holding custom branded RnB Digitals merchandise and corporate apparel',
    3
  )
ON CONFLICT DO NOTHING;

-- Seed Services
INSERT INTO public.services (id, title, category, icon_name, popular_for, short_desc, full_desc, features, materials, image_url, starting_price, sort_order)
VALUES
  (
    'large-format-printing',
    'Large Format Printing',
    'print',
    'printer',
    'Banners, Signage & Vehicle Wraps',
    'Ultra-high-definition banners, flex signs, rollups, and vehicle branding that demand instant attention.',
    'We utilize industrial UV and solvent wide-format presses to produce vibrant, weather-resistant outdoor and indoor visuals. From towering event backdrops to architectural signage and precision vehicle graphics, our prints deliver unmatched color fidelity and durability.',
    ARRAY['Industrial UV & eco-solvent fade-resistant inks', 'Roll-up banners, backdrop stands, and pop-up displays', 'Reflective and vinyl vehicle wraps & fleet branding', '3D acrylic lettering, lightboxes, and directional signage', 'Quick turnaround with direct delivery across Nigeria'],
    ARRAY['Heavy Flex Vinyl (440-510gsm)', 'Savit Vinyl Sticker', 'Backlit Film', 'Mesh Vinyl', 'Corrugated Plastic / Foam Board'],
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    '₦12,000',
    1
  ),
  (
    'custom-apparel',
    'Custom Apparel & Embroidery',
    'apparel',
    'shirt',
    'Corporate Uniforms, Hoodies & Event Tees',
    'Premium embroidery, screen printing, and direct-to-garment (DTG) customization for executive and casual apparel.',
    'Outfit your team and delight clients with custom-tailored apparel that exudes professionalism. Our advanced multi-head embroidery machines and durable screen printing techniques ensure your brand look stays pristine through countless washes.',
    ARRAY['High-density 3D & flat thread embroidery', 'Screen printing, DTF, and heat-transfer vinyl', 'Corporate polo shirts, dry-fit activewear & executive caps', 'Hoodies, jackets, aprons & safety workwear', 'Premium combed cotton fabric in custom brand Pantone colors'],
    ARRAY['100% Pique Cotton', 'Combed Heavy Cotton (220gsm)', 'Breathable Polyester', 'Canvas Twill'],
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    '₦6,500 / unit',
    2
  ),
  (
    'branded-merchandise',
    'Branded Corporate Merchandise',
    'merchandise',
    'gift',
    'Executive Gift Sets, Drinkware & Tech Accessories',
    'Curated corporate gifts, ceramic & thermal mugs, pens, luxury notebooks, and tech essentials imprinted with your logo.',
    'Leave an indelible impression at conferences, client meetings, and milestone celebrations. We craft bespoke branded merchandise that people love using every day, keeping your brand top-of-mind.',
    ARRAY['Thermal stainless steel tumblers & ceramic coffee mugs', 'Laser-engraved executive pens & metallic keyholders', 'Hardcover leatherette journals with ribbon markers', 'Custom USB flash drives, wireless power banks & lanyards', 'Complete VIP onboarding and holiday gift boxes'],
    ARRAY['Double-wall Stainless Steel', 'Premium Glazed Ceramic', 'PU Leather', 'Anodized Aluminum'],
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    '₦3,500 / unit',
    3
  ),
  (
    'packaging-tissue',
    'Branded Wrapping Tissue Paper',
    'packaging',
    'package',
    'Luxury Retail, Boutique & Gift Packaging',
    'Custom printed translucent tissue wrapping paper designed to create an unforgettable unboxing experience for your products.',
    'Elevate your brand perception with custom printed tissue wrapping paper. Perfect for fashion boutiques, e-commerce stores, luxury gift sets, and corporate gift hampers. Watermarked with your logo in single or multi-color premium inks.',
    ARRAY['Custom repeating logo patterns or all-over artwork prints', '17gsm translucent or 22gsm heavyweight acid-free paper', 'Single color, dual color, or metallic gold/silver ink accents', 'Standard 500 x 750mm sheets or custom-cut sheet dimensions', 'Low minimum order quantities suitable for growing brands'],
    ARRAY['17gsm Translucent Tissue', '22gsm Heavyweight Tissue', 'Metallic Foil Inks', 'Recycled Biodegradable Paper'],
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    '₦28,000 / pack',
    4
  ),
  (
    'brand-identity-stationery',
    'Brand Identity & Stationery',
    'branding',
    'palette',
    'Logos, Business Cards & Corporate Collateral',
    'Distinctive corporate identity packages, luxury foil-stamped business cards, letterheads, and presentation collateral.',
    'Your visual identity is the bedrock of customer trust. We design comprehensive brand systems and print them on tactile, high-grade cardstocks that communicate prestige from the very first handshake.',
    ARRAY['Custom logo design and comprehensive style guide documentation', 'Luxury 600gsm business cards with gold/silver hot foil stamping', 'Matte, velvet soft-touch, and spot UV high-gloss laminations', 'Executive letterheads, presentation folders & branded envelopes', 'Print-ready vector assets for consistent brand materials'],
    ARRAY['600gsm Cotton Cardstock', '350gsm Velvet Art Board', 'Linen Texture Paper', 'Metallic Gold/Silver Foil'],
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    '₦9,500',
    5
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Estimator Categories and Options
DO $$
DECLARE
  cat_banner UUID;
  cat_apparel UUID;
  cat_tissue UUID;
  cat_cards UUID;
  cat_merch UUID;
BEGIN
  -- Large Format Printing
  INSERT INTO public.estimator_categories (name, slug, unit_label, base_rate, min_qty, sort_order)
  VALUES ('Large Format Printing', 'banner', 'Square Feet / Units', 350, 24, 1)
  RETURNING id INTO cat_banner;

  INSERT INTO public.estimator_options (category_id, name, extra_price, is_default, sort_order)
  VALUES
    (cat_banner, 'Standard Flex Banner (440gsm)', 0, true, 1),
    (cat_banner, 'Heavy Duty Mesh / Backlit (510gsm)', 150, false, 2),
    (cat_banner, 'With Eyelets & Reinforced Hemming', 50, false, 3),
    (cat_banner, 'Includes Rollup Banner Stand Hardware', 12000, false, 4);

  -- Custom Apparel & Embroidery
  INSERT INTO public.estimator_categories (name, slug, unit_label, base_rate, min_qty, sort_order)
  VALUES ('Custom Apparel & Embroidery', 'apparel', 'Number of Shirts', 6500, 5, 2)
  RETURNING id INTO cat_apparel;

  INSERT INTO public.estimator_options (category_id, name, extra_price, is_default, sort_order)
  VALUES
    (cat_apparel, 'Single-Location Chest Embroidery', 0, true, 1),
    (cat_apparel, 'Dual-Location (Chest + Sleeve / Back)', 1500, false, 2),
    (cat_apparel, 'Heavyweight 220gsm Pique Cotton', 1200, false, 3),
    (cat_apparel, 'Individual Custom Polybag Packaging', 300, false, 4);

  -- Branded Wrapping Tissue Paper
  INSERT INTO public.estimator_categories (name, slug, unit_label, base_rate, min_qty, sort_order)
  VALUES ('Branded Wrapping Tissue Paper', 'tissue', 'Packs (500 Sheets/Pack)', 28000, 1, 3)
  RETURNING id INTO cat_tissue;

  INSERT INTO public.estimator_options (category_id, name, extra_price, is_default, sort_order)
  VALUES
    (cat_tissue, 'Single Color Brand Pattern (17gsm)', 0, true, 1),
    (cat_tissue, 'Dual Color Brand Pattern (22gsm)', 5000, false, 2),
    (cat_tissue, 'Metallic Gold / Silver Ink Accent', 8000, false, 3);

  -- Luxury Business Cards
  INSERT INTO public.estimator_categories (name, slug, unit_label, base_rate, min_qty, sort_order)
  VALUES ('Luxury Business Cards', 'cards', 'Packs (100 Cards/Pack)', 9500, 1, 4)
  RETURNING id INTO cat_cards;

  INSERT INTO public.estimator_options (category_id, name, extra_price, is_default, sort_order)
  VALUES
    (cat_cards, 'Standard Matte Lamination (350gsm)', 0, true, 1),
    (cat_cards, 'Velvet Soft-Touch Luxury Finish (600gsm)', 4500, false, 2),
    (cat_cards, 'Dual-Sided Metallic Gold Foil Stamping', 5000, false, 3),
    (cat_cards, 'Curved Corner Die-Cut Finishing', 1500, false, 4);

  -- Branded Merchandise & Drinkware
  INSERT INTO public.estimator_categories (name, slug, unit_label, base_rate, min_qty, sort_order)
  VALUES ('Branded Merchandise & Drinkware', 'merch', 'Units', 4500, 10, 5)
  RETURNING id INTO cat_merch;

  INSERT INTO public.estimator_options (category_id, name, extra_price, is_default, sort_order)
  VALUES
    (cat_merch, 'Premium Ceramic Two-Tone Coffee Mug', 0, true, 1),
    (cat_merch, 'Stainless Steel Smart LED Thermal Tumbler', 3500, false, 2),
    (cat_merch, 'Laser Engraved Metallic Executive Pen', 1500, false, 3),
    (cat_merch, 'Luxury Presentation Gift Box', 2000, false, 4);

END $$;

-- Seed Portfolio Items
INSERT INTO public.portfolio_items (title, category, category_label, client, description, image_url, tags, sort_order)
VALUES
  (
    'Executive Brand Identity & Stationery Suite',
    'branding',
    'Brand Identity',
    'Apex Capital Partners',
    'Complete corporate redesign featuring embossed 600gsm gold-foil business cards, custom letterheads, and presentation folders.',
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    ARRAY['Logo Design', 'Stationery', 'Gold Foil', 'Corporate Identity'],
    1
  ),
  (
    'Full Vehicle Fleet Wrap & Reflective Signage',
    'print',
    'Large Format',
    'Prime Logistics Nigeria',
    'Precision cast vinyl wrapping on commercial delivery vans with micro-perforated window graphics and UV protective gloss over-laminate.',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    ARRAY['Fleet Branding', 'Cast Vinyl', 'UV Shield', 'Commercial Wrap'],
    2
  ),
  (
    'Custom Staff Apparel & 3D Thread Embroidery',
    'apparel',
    'Custom Apparel',
    'Horizon Energy Group',
    'Heavyweight pique cotton polos and high-visibility field jackets with precision 12-thread embroidered crests.',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ARRAY['Embroidery', 'Uniforms', 'Pique Cotton', 'Corporate Polo'],
    3
  ),
  (
    'Luxury Branded Wrapping Tissue & Shopping Bags',
    'branding',
    'Packaging',
    'Aura Luxury Boutiques',
    'Translucent 22gsm watermark patterned wrapping tissue and matte black hot-stamped gold foil shopping bags with satin ribbon handles.',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    ARRAY['Wrapping Tissue', 'Foil Stamping', 'Paper Bags', 'Unboxing'],
    4
  ),
  (
    'Summit Event Stage Backdrop & Rollup Exhibits',
    'print',
    'Large Format',
    'Port Harcourt Tech Expo',
    'Seamless 20ft tension-fabric media wall backdrop, high-contrast teardrop banners, and executive wide-base rollup stands.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    ARRAY['Stage Backdrop', 'Tension Fabric', 'Rollup Banners', 'Exhibition'],
    5
  )
ON CONFLICT DO NOTHING;

-- Seed Products
INSERT INTO public.products (name, category, description, price_formatted, min_order, image_url, badge, sort_order)
VALUES
  (
    'Executive Thermal Smart Tumbler (500ml)',
    'Merchandise',
    'Double-wall vacuum insulated stainless steel with LED temperature readout & custom laser-etched branding.',
    '₦7,500',
    '10 pcs',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    'Best Seller',
    1
  ),
  (
    'Custom Branded Wrapping Tissue Paper (500 sheets)',
    'Packaging',
    'Eco-friendly translucent wrapping tissue custom printed with repeating brand patterns for apparel and gifts.',
    '₦28,000',
    '1 pack',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    'Popular',
    2
  ),
  (
    'Heavyweight Embroidered Corporate Polo',
    'Apparel',
    '220gsm pique combed cotton shirt with high-density embroidered logo on chest and sleeve.',
    '₦8,500',
    '15 pcs',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    'Premium',
    3
  ),
  (
    'Luxury Velvet-Touch Gold Foil Business Cards (200 pcs)',
    'Stationery',
    '600gsm thick cardstock with soft-touch matte lamination and dual-sided metallic gold foil accent.',
    '₦18,500',
    '200 pcs',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
    'Executive',
    4
  )
ON CONFLICT DO NOTHING;

-- Seed About Pillars & Stats
INSERT INTO public.about_pillars (icon, title, description, sort_order)
VALUES
  (
    'precision_manufacturing',
    'State-of-the-Art Technology',
    'Industrial multi-needle embroidery stations, high-resolution UV wide-format presses, and precision die-cutting equipment.',
    1
  ),
  (
    'verified',
    'Uncompromising Quality',
    'We use only premium 440-510gsm flex, heavy 220gsm combed cotton, acid-free tissue, and UV-resistant outdoor pigments.',
    2
  ),
  (
    'local_shipping',
    'Swift Nationwide Delivery',
    'Headquartered at Ada George, Port Harcourt with reliable courier dispatch delivering on time to Lagos, Abuja, and all 36 states.',
    3
  ),
  (
    'support_agent',
    'Dedicated Account Support',
    'Direct consultation with expert graphic designers and print technicians to perfect your artwork before production.',
    4
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.site_stats (value, label, sort_order)
VALUES
  ('500+', 'Completed Projects', 1),
  ('99.8%', 'Client Satisfaction', 2),
  ('24-48h', 'Fast Turnaround', 3),
  ('36', 'States Delivered', 4)
ON CONFLICT DO NOTHING;

-- Seed Testimonials
INSERT INTO public.testimonials (name, role, company, comment, rating, avatar_url, project_type, sort_order)
VALUES
  (
    'Dr. Chidi Okafor',
    'Managing Director',
    'St. Jude Healthcare Network',
    'RnB Digitals handled our entire facility hospital signage, staff embroidered lab wear, and corporate brochures. Their turnaround time in Port Harcourt was exceptional, and the print sharpness exceeded all expectations.',
    5,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'Signage & Staff Uniforms',
    1
  ),
  (
    'Blessing Alabi',
    'Founder & Creative Director',
    'Karis Fashion & Retail',
    'The branded wrapping tissue and custom luxury paper bags elevated our customer unboxing experience completely. Our clients constantly compliment our packaging. RnB Digitals is truly the best in the business!',
    5,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'Packaging & Tissue Paper',
    2
  ),
  (
    'Engr. Kenneth Briggs',
    'Head of Brand & Communications',
    'Atlantic Energy Services',
    'From heavy-duty vehicle wraps to executive VIP gift sets for our annual partners summit, RnB Digitals delivers world-class standards. Reliable, professional, and uncompromising on quality.',
    5,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'Fleet Branding & Corporate Gifts',
    3
  )
ON CONFLICT DO NOTHING;
