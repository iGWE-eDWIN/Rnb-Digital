import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import {
  SiteSettings,
  NavigationLink,
  HeroSlideItem,
  EstimatorCategory,
  EstimatorOption,
  AboutPillar,
  SiteStat,
  QuoteInquiry,
  MediaAsset,
} from '@/types/cms';
import { ServiceItem, PortfolioItem, ProductItem, TestimonialItem } from '@/types';
import { HERO_SLIDES } from '@/data/slideshow';
import { SERVICES_DATA } from '@/data/services';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { PRODUCTS_DATA } from '@/data/products';
import { TESTIMONIALS_DATA } from '@/data/testimonials';

// ==============================================================================
// DEFAULT FALLBACK DATA (Derived directly from current RnB Digitals website)
// ==============================================================================

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'global_settings',
  site_name: 'RnB Digitals',
  tagline: 'Premium Print & Branding',
  logo_url: '/logo.png',
  logo_icon: 'stars',
  announcement_badge: "Port Harcourt's #1 Print & Branding Agency",
  hero_title: 'Your Brand Deserves to Be Seen',
  hero_subtitle: 'Deserves to Be Seen',
  hero_description:
    'Premium wide-format printing, custom apparel embroidery, executive merchandise, and high-impact digital solutions for businesses that mean business.',
  hero_cta1_text: 'Get Instant Quote',
  hero_cta1_link: '#calculator',
  hero_cta2_text: 'View Portfolio',
  hero_cta2_link: '#portfolio',
  contact_address: '177 Ada George Road by Pepperoni Junction, Port Harcourt, Rivers State, Nigeria',
  contact_phone: '+234 816 417 1414',
  contact_whatsapp: '2348164171414',
  contact_email: 'rnbdigitals@gmail.com',
  operating_hours: 'Monday – Saturday: 8:00 AM – 6:00 PM (GMT+1)',
  footer_description:
    "Port Harcourt's leading design, industrial printing, custom apparel embroidery, and corporate branding agency. Elevating brand presence with uncompromised precision.",
  footer_copyright: '© RnB Digitals. All Rights Reserved. Premium Print & Digital Solutions.',
};

export const DEFAULT_NAVIGATION_LINKS: NavigationLink[] = [
  { id: 'nav-1', label: 'Home', href: '#hero', sort_order: 1, is_header: true, is_footer: true, is_active: true },
  { id: 'nav-2', label: 'Services', href: '#services', sort_order: 2, is_header: true, is_footer: true, is_active: true },
  { id: 'nav-3', label: 'Portfolio', href: '#portfolio', sort_order: 3, is_header: true, is_footer: true, is_active: true },
  { id: 'nav-4', label: 'Store', href: '#store', sort_order: 4, is_header: true, is_footer: true, is_active: true },
  { id: 'nav-5', label: 'Estimator', href: '#calculator', sort_order: 5, is_header: true, is_footer: true, is_active: true },
  { id: 'nav-6', label: 'About', href: '#about', sort_order: 6, is_header: true, is_footer: true, is_active: true },
  { id: 'nav-7', label: 'Contact', href: '#contact', sort_order: 7, is_header: true, is_footer: true, is_active: true },
];

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = HERO_SLIDES.map((slide, idx) => ({
  id: slide.id,
  title: slide.title,
  subtitle: slide.subtitle,
  tag: slide.tag,
  image_url: slide.image,
  alt: slide.alt,
  sort_order: idx + 1,
  is_active: true,
}));

export const DEFAULT_ESTIMATOR_CATEGORIES: EstimatorCategory[] = [
  {
    id: 'est-banner',
    name: 'Large Format Printing',
    slug: 'banner',
    unit_label: 'Square Feet / Units',
    base_rate: 350,
    min_qty: 24,
    sort_order: 1,
    is_active: true,
    options: [
      { id: 'opt-b1', category_id: 'est-banner', name: 'Standard Flex Banner (440gsm)', extra_price: 0, is_default: true, sort_order: 1, is_active: true },
      { id: 'opt-b2', category_id: 'est-banner', name: 'Heavy Duty Mesh / Backlit (510gsm)', extra_price: 150, is_default: false, sort_order: 2, is_active: true },
      { id: 'opt-b3', category_id: 'est-banner', name: 'With Eyelets & Reinforced Hemming', extra_price: 50, is_default: false, sort_order: 3, is_active: true },
      { id: 'opt-b4', category_id: 'est-banner', name: 'Includes Rollup Banner Stand Hardware', extra_price: 12000, is_default: false, sort_order: 4, is_active: true },
    ],
  },
  {
    id: 'est-apparel',
    name: 'Custom Apparel & Embroidery',
    slug: 'apparel',
    unit_label: 'Number of Shirts',
    base_rate: 6500,
    min_qty: 5,
    sort_order: 2,
    is_active: true,
    options: [
      { id: 'opt-a1', category_id: 'est-apparel', name: 'Single-Location Chest Embroidery', extra_price: 0, is_default: true, sort_order: 1, is_active: true },
      { id: 'opt-a2', category_id: 'est-apparel', name: 'Dual-Location (Chest + Sleeve / Back)', extra_price: 1500, is_default: false, sort_order: 2, is_active: true },
      { id: 'opt-a3', category_id: 'est-apparel', name: 'Heavyweight 220gsm Pique Cotton', extra_price: 1200, is_default: false, sort_order: 3, is_active: true },
      { id: 'opt-a4', category_id: 'est-apparel', name: 'Individual Custom Polybag Packaging', extra_price: 300, is_default: false, sort_order: 4, is_active: true },
    ],
  },
  {
    id: 'est-tissue',
    name: 'Branded Wrapping Tissue Paper',
    slug: 'tissue',
    unit_label: 'Packs (500 Sheets/Pack)',
    base_rate: 28000,
    min_qty: 1,
    sort_order: 3,
    is_active: true,
    options: [
      { id: 'opt-t1', category_id: 'est-tissue', name: 'Single Color Brand Pattern (17gsm)', extra_price: 0, is_default: true, sort_order: 1, is_active: true },
      { id: 'opt-t2', category_id: 'est-tissue', name: 'Dual Color Brand Pattern (22gsm)', extra_price: 5000, is_default: false, sort_order: 2, is_active: true },
      { id: 'opt-t3', category_id: 'est-tissue', name: 'Metallic Gold / Silver Ink Accent', extra_price: 8000, is_default: false, sort_order: 3, is_active: true },
    ],
  },
  {
    id: 'est-cards',
    name: 'Luxury Business Cards',
    slug: 'cards',
    unit_label: 'Packs (100 Cards/Pack)',
    base_rate: 9500,
    min_qty: 1,
    sort_order: 4,
    is_active: true,
    options: [
      { id: 'opt-c1', category_id: 'est-cards', name: 'Standard Matte Lamination (350gsm)', extra_price: 0, is_default: true, sort_order: 1, is_active: true },
      { id: 'opt-c2', category_id: 'est-cards', name: 'Velvet Soft-Touch Luxury Finish (600gsm)', extra_price: 4500, is_default: false, sort_order: 2, is_active: true },
      { id: 'opt-c3', category_id: 'est-cards', name: 'Dual-Sided Metallic Gold Foil Stamping', extra_price: 5000, is_default: false, sort_order: 3, is_active: true },
      { id: 'opt-c4', category_id: 'est-cards', name: 'Curved Corner Die-Cut Finishing', extra_price: 1500, is_default: false, sort_order: 4, is_active: true },
    ],
  },
  {
    id: 'est-merch',
    name: 'Branded Merchandise & Drinkware',
    slug: 'merch',
    unit_label: 'Units',
    base_rate: 4500,
    min_qty: 10,
    sort_order: 5,
    is_active: true,
    options: [
      { id: 'opt-m1', category_id: 'est-merch', name: 'Premium Ceramic Two-Tone Coffee Mug', extra_price: 0, is_default: true, sort_order: 1, is_active: true },
      { id: 'opt-m2', category_id: 'est-merch', name: 'Stainless Steel Smart LED Thermal Tumbler', extra_price: 3500, is_default: false, sort_order: 2, is_active: true },
      { id: 'opt-m3', category_id: 'est-merch', name: 'Laser Engraved Metallic Executive Pen', extra_price: 1500, is_default: false, sort_order: 3, is_active: true },
      { id: 'opt-m4', category_id: 'est-merch', name: 'Luxury Presentation Gift Box', extra_price: 2000, is_default: false, sort_order: 4, is_active: true },
    ],
  },
  {
    id: 'est-web',
    name: 'Web Development & Digital Presence',
    slug: 'web',
    unit_label: 'Project Package',
    base_rate: 150000,
    min_qty: 1,
    sort_order: 6,
    is_active: true,
    options: [
      { id: 'opt-w1', category_id: 'est-web', name: 'Starter Business Website (4-5 Pages + SEO)', extra_price: 0, is_default: true, sort_order: 1, is_active: true },
      { id: 'opt-w2', category_id: 'est-web', name: 'E-Commerce Store (Payment Gateway + Catalog)', extra_price: 120000, is_default: false, sort_order: 2, is_active: true },
      { id: 'opt-w3', category_id: 'est-web', name: 'Custom Web Application & Client Portal', extra_price: 250000, is_default: false, sort_order: 3, is_active: true },
      { id: 'opt-w4', category_id: 'est-web', name: '3-Month Digital Marketing & Ads Management', extra_price: 90000, is_default: false, sort_order: 4, is_active: true },
    ],
  },
];

export const DEFAULT_ABOUT_PILLARS: AboutPillar[] = [
  {
    id: 'pillar-1',
    icon: 'precision_manufacturing',
    title: 'State-of-the-Art Technology',
    description:
      'Industrial multi-needle embroidery stations, high-resolution UV wide-format presses, and precision die-cutting equipment.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'pillar-2',
    icon: 'verified',
    title: 'Uncompromising Quality',
    description:
      'We use only premium 440-510gsm flex, heavy 220gsm combed cotton, acid-free tissue, and UV-resistant outdoor pigments.',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'pillar-3',
    icon: 'local_shipping',
    title: 'Swift Nationwide Delivery',
    description:
      'Headquartered at Ada George, Port Harcourt with reliable courier dispatch delivering on time to Lagos, Abuja, and all 36 states.',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'pillar-4',
    icon: 'support_agent',
    title: 'Dedicated Account Support',
    description:
      'Direct consultation with expert graphic designers and print technicians to perfect your artwork before production.',
    sort_order: 4,
    is_active: true,
  },
];

export const DEFAULT_SITE_STATS: SiteStat[] = [
  { id: 'stat-1', value: '500+', label: 'Completed Projects', sort_order: 1, is_active: true },
  { id: 'stat-2', value: '99.8%', label: 'Client Satisfaction', sort_order: 2, is_active: true },
  { id: 'stat-3', value: '24-48h', label: 'Fast Turnaround', sort_order: 3, is_active: true },
  { id: 'stat-4', value: '36', label: 'States Delivered', sort_order: 4, is_active: true },
];

// Local storage helper for fallback when offline/pre-setup
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`rnb_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`rnb_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`LocalStorage write error for ${key}:`, e);
  }
}

// ==============================================================================
// CMS DATA ACCESS METHODS
// ==============================================================================

// 1. Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global_settings')
        .single();
      if (!error && data) return data as SiteSettings;
    } catch (e) {
      console.warn('Supabase getSiteSettings error, falling back:', e);
    }
  }
  return getLocalItem<SiteSettings>('site_settings', DEFAULT_SITE_SETTINGS);
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(updated)
        .select()
        .single();
      if (!error && data) return data as SiteSettings;
    } catch (e) {
      console.warn('Supabase updateSiteSettings error:', e);
    }
  }

  setLocalItem('site_settings', updated);
  return updated;
}

// 2. Navigation Links
export async function getNavigationLinks(): Promise<NavigationLink[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('navigation_links')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as NavigationLink[];
    } catch (e) {
      console.warn('Supabase getNavigationLinks error:', e);
    }
  }
  return getLocalItem<NavigationLink[]>('navigation_links', DEFAULT_NAVIGATION_LINKS);
}

export async function saveNavigationLink(link: Partial<NavigationLink> & { label: string; href: string }): Promise<NavigationLink> {
  const supabase = getSupabaseClient();
  const currentList = await getNavigationLinks();

  if (link.id) {
    // Update
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('navigation_links').update(link).eq('id', link.id).select().single();
      if (data) return data as NavigationLink;
    }
    const updated = currentList.map((i) => (i.id === link.id ? { ...i, ...link } : i));
    setLocalItem('navigation_links', updated);
    return updated.find((i) => i.id === link.id)! as NavigationLink;
  } else {
    // Create
    const newId = `nav-${Date.now()}`;
    const newItem: NavigationLink = {
      id: newId,
      label: link.label,
      href: link.href,
      sort_order: link.sort_order ?? currentList.length + 1,
      is_header: link.is_header ?? true,
      is_footer: link.is_footer ?? true,
      is_active: link.is_active ?? true,
    };
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('navigation_links').insert([newItem]).select().single();
      if (data) return data as NavigationLink;
    }
    const updated = [...currentList, newItem];
    setLocalItem('navigation_links', updated);
    return newItem;
  }
}

export async function deleteNavigationLink(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('navigation_links').delete().eq('id', id);
  }
  const current = await getNavigationLinks();
  setLocalItem('navigation_links', current.filter((i) => i.id !== id));
  return true;
}

// 3. Hero Slides
export async function getHeroSlides(): Promise<HeroSlideItem[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as HeroSlideItem[];
    } catch (e) {
      console.warn('Supabase getHeroSlides error:', e);
    }
  }
  return getLocalItem<HeroSlideItem[]>('hero_slides', DEFAULT_HERO_SLIDES);
}

export async function saveHeroSlide(slide: Partial<HeroSlideItem> & { title: string; image_url: string }): Promise<HeroSlideItem> {
  const supabase = getSupabaseClient();
  const currentList = await getHeroSlides();

  if (slide.id) {
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('hero_slides').update(slide).eq('id', slide.id).select().single();
      if (data) return data as HeroSlideItem;
    }
    const updated = currentList.map((s) => (s.id === slide.id ? { ...s, ...slide } : s));
    setLocalItem('hero_slides', updated);
    return updated.find((s) => s.id === slide.id)! as HeroSlideItem;
  } else {
    const newItem: HeroSlideItem = {
      id: `slide-${Date.now()}`,
      title: slide.title,
      subtitle: slide.subtitle || '',
      tag: slide.tag || 'RnB Digitals',
      image_url: slide.image_url,
      alt: slide.alt || slide.title,
      sort_order: slide.sort_order ?? currentList.length + 1,
      is_active: slide.is_active ?? true,
    };
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('hero_slides').insert([newItem]).select().single();
      if (data) return data as HeroSlideItem;
    }
    const updated = [...currentList, newItem];
    setLocalItem('hero_slides', updated);
    return newItem;
  }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('hero_slides').delete().eq('id', id);
  }
  const current = await getHeroSlides();
  setLocalItem('hero_slides', current.filter((s) => s.id !== id));
  return true;
}

// 4. Services
export async function getServices(): Promise<ServiceItem[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          iconName: d.icon_name,
          popularFor: d.popular_for,
          shortDesc: d.short_desc,
          fullDesc: d.full_desc,
          features: d.features || [],
          materials: d.materials || [],
          image: d.image_url,
          startingPrice: d.starting_price,
        })) as ServiceItem[];
      }
    } catch (e) {
      console.warn('Supabase getServices error:', e);
    }
  }
  return getLocalItem<ServiceItem[]>('services', SERVICES_DATA);
}

export async function saveService(service: ServiceItem): Promise<ServiceItem> {
  const supabase = getSupabaseClient();
  const currentList = await getServices();

  const dbPayload = {
    id: service.id,
    title: service.title,
    category: service.category,
    icon_name: service.iconName,
    popular_for: service.popularFor,
    short_desc: service.shortDesc,
    full_desc: service.fullDesc,
    features: service.features,
    materials: service.materials || [],
    image_url: service.image,
    starting_price: service.startingPrice || '',
  };

  if (supabase && isSupabaseConfigured()) {
    await supabase.from('services').upsert(dbPayload);
  }

  const existingIdx = currentList.findIndex((s) => s.id === service.id);
  let updated: ServiceItem[];
  if (existingIdx >= 0) {
    updated = [...currentList];
    updated[existingIdx] = service;
  } else {
    updated = [...currentList, service];
  }
  setLocalItem('services', updated);
  return service;
}

export async function deleteService(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('services').delete().eq('id', id);
  }
  const current = await getServices();
  setLocalItem('services', current.filter((s) => s.id !== id));
  return true;
}

// 5. Website Estimator
export async function getEstimatorCategories(): Promise<EstimatorCategory[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data: cats, error: catError } = await supabase
        .from('estimator_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!catError && cats && cats.length > 0) {
        const { data: opts } = await supabase
          .from('estimator_options')
          .select('*')
          .order('sort_order', { ascending: true });

        const mapped: EstimatorCategory[] = cats.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          unit_label: cat.unit_label,
          base_rate: Number(cat.base_rate),
          min_qty: Number(cat.min_qty),
          sort_order: cat.sort_order,
          is_active: cat.is_active,
          options: (opts || [])
            .filter((o) => o.category_id === cat.id)
            .map((o) => ({
              id: o.id,
              category_id: o.category_id,
              name: o.name,
              extra_price: Number(o.extra_price),
              is_default: o.is_default,
              sort_order: o.sort_order,
              is_active: o.is_active,
            })),
        }));
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase getEstimatorCategories error:', e);
    }
  }
  return getLocalItem<EstimatorCategory[]>('estimator_categories', DEFAULT_ESTIMATOR_CATEGORIES);
}

export async function saveEstimatorCategory(cat: Partial<EstimatorCategory> & { name: string; unit_label: string; base_rate: number }): Promise<EstimatorCategory> {
  const supabase = getSupabaseClient();
  const current = await getEstimatorCategories();

  if (cat.id) {
    if (supabase && isSupabaseConfigured()) {
      await supabase.from('estimator_categories').update({
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        unit_label: cat.unit_label,
        base_rate: cat.base_rate,
        min_qty: cat.min_qty ?? 1,
        sort_order: cat.sort_order,
        is_active: cat.is_active ?? true,
      }).eq('id', cat.id);
    }
    const updated = current.map((c) => (c.id === cat.id ? { ...c, ...cat } : c));
    setLocalItem('estimator_categories', updated);
    return updated.find((c) => c.id === cat.id)! as EstimatorCategory;
  } else {
    const newId = `cat-${Date.now()}`;
    const newCat: EstimatorCategory = {
      id: newId,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      unit_label: cat.unit_label,
      base_rate: cat.base_rate,
      min_qty: cat.min_qty ?? 1,
      sort_order: cat.sort_order ?? current.length + 1,
      is_active: cat.is_active ?? true,
      options: [],
    };
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('estimator_categories').insert([{
        name: newCat.name,
        slug: newCat.slug,
        unit_label: newCat.unit_label,
        base_rate: newCat.base_rate,
        min_qty: newCat.min_qty,
        sort_order: newCat.sort_order,
      }]).select().single();
      if (data) newCat.id = data.id;
    }
    const updated = [...current, newCat];
    setLocalItem('estimator_categories', updated);
    return newCat;
  }
}

export async function deleteEstimatorCategory(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('estimator_categories').delete().eq('id', id);
  }
  const current = await getEstimatorCategories();
  setLocalItem('estimator_categories', current.filter((c) => c.id !== id));
  return true;
}

export async function saveEstimatorOption(opt: Partial<EstimatorOption> & { category_id: string; name: string; extra_price: number }): Promise<EstimatorOption> {
  const supabase = getSupabaseClient();
  const cats = await getEstimatorCategories();
  const category = cats.find((c) => c.id === opt.category_id);
  if (!category) throw new Error('Category not found');

  if (opt.id) {
    if (supabase && isSupabaseConfigured()) {
      await supabase.from('estimator_options').update({
        name: opt.name,
        extra_price: opt.extra_price,
        is_default: opt.is_default ?? false,
        sort_order: opt.sort_order,
        is_active: opt.is_active ?? true,
      }).eq('id', opt.id);
    }
    category.options = (category.options || []).map((o) => (o.id === opt.id ? { ...o, ...opt } : o));
    setLocalItem('estimator_categories', cats);
    return category.options.find((o) => o.id === opt.id)!;
  } else {
    const newOpt: EstimatorOption = {
      id: `opt-${Date.now()}`,
      category_id: opt.category_id,
      name: opt.name,
      extra_price: opt.extra_price,
      is_default: opt.is_default ?? false,
      sort_order: opt.sort_order ?? (category.options?.length || 0) + 1,
      is_active: opt.is_active ?? true,
    };
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('estimator_options').insert([{
        category_id: newOpt.category_id,
        name: newOpt.name,
        extra_price: newOpt.extra_price,
        is_default: newOpt.is_default,
        sort_order: newOpt.sort_order,
      }]).select().single();
      if (data) newOpt.id = data.id;
    }
    category.options = [...(category.options || []), newOpt];
    setLocalItem('estimator_categories', cats);
    return newOpt;
  }
}

export async function deleteEstimatorOption(categoryId: string, optionId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('estimator_options').delete().eq('id', optionId);
  }
  const cats = await getEstimatorCategories();
  const category = cats.find((c) => c.id === categoryId);
  if (category && category.options) {
    category.options = category.options.filter((o) => o.id !== optionId);
    setLocalItem('estimator_categories', cats);
  }
  return true;
}

// 6. Portfolio Items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          categoryLabel: d.category_label,
          client: d.client,
          description: d.description,
          image: d.image_url,
          tags: d.tags || [],
        })) as PortfolioItem[];
      }
    } catch (e) {
      console.warn('Supabase getPortfolioItems error:', e);
    }
  }
  return getLocalItem<PortfolioItem[]>('portfolio_items', PORTFOLIO_DATA);
}

export async function savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem> {
  const supabase = getSupabaseClient();
  const currentList = await getPortfolioItems();

  const payload = {
    id: item.id || `port-${Date.now()}`,
    title: item.title,
    category: item.category,
    category_label: item.categoryLabel,
    client: item.client,
    description: item.description,
    image_url: item.image,
    tags: item.tags,
  };

  if (supabase && isSupabaseConfigured()) {
    await supabase.from('portfolio_items').upsert(payload);
  }

  const existingIdx = currentList.findIndex((p) => p.id === item.id);
  let updated: PortfolioItem[];
  if (existingIdx >= 0) {
    updated = [...currentList];
    updated[existingIdx] = item;
  } else {
    updated = [...currentList, item];
  }
  setLocalItem('portfolio_items', updated);
  return item;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('portfolio_items').delete().eq('id', id);
  }
  const current = await getPortfolioItems();
  setLocalItem('portfolio_items', current.filter((p) => p.id !== id));
  return true;
}

// 7. Store Products
export async function getProducts(): Promise<ProductItem[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          description: d.description,
          priceFormatted: d.price_formatted,
          minOrder: d.min_order,
          image: d.image_url,
          badge: d.badge,
        })) as ProductItem[];
      }
    } catch (e) {
      console.warn('Supabase getProducts error:', e);
    }
  }
  return getLocalItem<ProductItem[]>('products', PRODUCTS_DATA);
}

export async function saveProduct(product: ProductItem): Promise<ProductItem> {
  const supabase = getSupabaseClient();
  const currentList = await getProducts();

  const payload = {
    id: product.id || `prod-${Date.now()}`,
    name: product.name,
    category: product.category,
    description: product.description,
    price_formatted: product.priceFormatted,
    min_order: product.minOrder,
    image_url: product.image,
    badge: product.badge || null,
  };

  if (supabase && isSupabaseConfigured()) {
    await supabase.from('products').upsert(payload);
  }

  const existingIdx = currentList.findIndex((p) => p.id === product.id);
  let updated: ProductItem[];
  if (existingIdx >= 0) {
    updated = [...currentList];
    updated[existingIdx] = product;
  } else {
    updated = [...currentList, product];
  }
  setLocalItem('products', updated);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('products').delete().eq('id', id);
  }
  const current = await getProducts();
  setLocalItem('products', current.filter((p) => p.id !== id));
  return true;
}

// 8. Why Choose Us (Pillars & Stats)
export async function getAboutPillars(): Promise<AboutPillar[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('about_pillars')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as AboutPillar[];
    } catch (e) {
      console.warn('Supabase getAboutPillars error:', e);
    }
  }
  return getLocalItem<AboutPillar[]>('about_pillars', DEFAULT_ABOUT_PILLARS);
}

export async function saveAboutPillar(pillar: Partial<AboutPillar> & { title: string; description: string; icon: string }): Promise<AboutPillar> {
  const supabase = getSupabaseClient();
  const current = await getAboutPillars();

  if (pillar.id) {
    if (supabase && isSupabaseConfigured()) {
      await supabase.from('about_pillars').update(pillar).eq('id', pillar.id);
    }
    const updated = current.map((p) => (p.id === pillar.id ? { ...p, ...pillar } : p));
    setLocalItem('about_pillars', updated);
    return updated.find((p) => p.id === pillar.id)!;
  } else {
    const newItem: AboutPillar = {
      id: `pillar-${Date.now()}`,
      icon: pillar.icon,
      title: pillar.title,
      description: pillar.description,
      sort_order: pillar.sort_order ?? current.length + 1,
      is_active: pillar.is_active ?? true,
    };
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('about_pillars').insert([newItem]).select().single();
      if (data) newItem.id = data.id;
    }
    const updated = [...current, newItem];
    setLocalItem('about_pillars', updated);
    return newItem;
  }
}

export async function deleteAboutPillar(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('about_pillars').delete().eq('id', id);
  }
  const current = await getAboutPillars();
  setLocalItem('about_pillars', current.filter((p) => p.id !== id));
  return true;
}

export async function getSiteStats(): Promise<SiteStat[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as SiteStat[];
    } catch (e) {
      console.warn('Supabase getSiteStats error:', e);
    }
  }
  return getLocalItem<SiteStat[]>('site_stats', DEFAULT_SITE_STATS);
}

export async function saveSiteStat(stat: Partial<SiteStat> & { value: string; label: string }): Promise<SiteStat> {
  const supabase = getSupabaseClient();
  const current = await getSiteStats();

  if (stat.id) {
    if (supabase && isSupabaseConfigured()) {
      await supabase.from('site_stats').update(stat).eq('id', stat.id);
    }
    const updated = current.map((s) => (s.id === stat.id ? { ...s, ...stat } : s));
    setLocalItem('site_stats', updated);
    return updated.find((s) => s.id === stat.id)!;
  } else {
    const newItem: SiteStat = {
      id: `stat-${Date.now()}`,
      value: stat.value,
      label: stat.label,
      sort_order: stat.sort_order ?? current.length + 1,
      is_active: stat.is_active ?? true,
    };
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase.from('site_stats').insert([newItem]).select().single();
      if (data) newItem.id = data.id;
    }
    const updated = [...current, newItem];
    setLocalItem('site_stats', updated);
    return newItem;
  }
}

// 9. Testimonials
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          company: d.company,
          comment: d.comment,
          rating: Number(d.rating),
          avatar: d.avatar_url,
          projectType: d.project_type,
        })) as TestimonialItem[];
      }
    } catch (e) {
      console.warn('Supabase getTestimonials error:', e);
    }
  }
  return getLocalItem<TestimonialItem[]>('testimonials', TESTIMONIALS_DATA);
}

export async function saveTestimonial(item: TestimonialItem): Promise<TestimonialItem> {
  const supabase = getSupabaseClient();
  const currentList = await getTestimonials();

  const payload = {
    id: item.id || `test-${Date.now()}`,
    name: item.name,
    role: item.role,
    company: item.company,
    comment: item.comment,
    rating: item.rating,
    avatar_url: item.avatar,
    project_type: item.projectType,
  };

  if (supabase && isSupabaseConfigured()) {
    await supabase.from('testimonials').upsert(payload);
  }

  const existingIdx = currentList.findIndex((t) => t.id === item.id);
  let updated: TestimonialItem[];
  if (existingIdx >= 0) {
    updated = [...currentList];
    updated[existingIdx] = item;
  } else {
    updated = [...currentList, item];
  }
  setLocalItem('testimonials', updated);
  return item;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('testimonials').delete().eq('id', id);
  }
  const current = await getTestimonials();
  setLocalItem('testimonials', current.filter((t) => t.id !== id));
  return true;
}

// 10. Quote / Contact Inquiries (Lead Capture)
export async function getInquiries(): Promise<QuoteInquiry[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as QuoteInquiry[];
    } catch (e) {
      console.warn('Supabase getInquiries error:', e);
    }
  }
  return getLocalItem<QuoteInquiry[]>('inquiries', [
    {
      id: 'inq-sample-1',
      name: 'Engr. Daniel Amadi',
      email: 'damadi@petroservices.ng',
      phone: '+234 803 123 4567',
      service: 'Large Format Printing',
      quantity: '50 Square Feet / Units',
      estimated_total: '₦28,500',
      message: 'Need 4 heavy-duty backlit rollup banners for our technical conference next week.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'inq-sample-2',
      name: 'Nkechi Williams',
      email: 'nkechi@aurafashion.com',
      phone: '+234 812 987 6543',
      service: 'Branded Wrapping Tissue Paper',
      quantity: '2 Packs (500 Sheets/Pack)',
      estimated_total: '₦66,000',
      message: 'Looking for 22gsm tissue paper with custom repeating gold foil logos for luxury unboxing.',
      status: 'contacted',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ]);
}

export async function submitInquiry(inquiry: Omit<QuoteInquiry, 'id' | 'created_at' | 'status'>): Promise<QuoteInquiry> {
  const newItem: QuoteInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .insert([{
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          service: inquiry.service,
          quantity: inquiry.quantity,
          estimated_total: inquiry.estimated_total,
          message: inquiry.message,
        }])
        .select()
        .single();
      if (!error && data) return data as QuoteInquiry;
    } catch (e) {
      console.warn('Supabase submitInquiry error:', e);
    }
  }

  const current = await getInquiries();
  const updated = [newItem, ...current];
  setLocalItem('inquiries', updated);
  return newItem;
}

export async function updateInquiryStatus(id: string, status: QuoteInquiry['status']): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('quote_inquiries').update({ status }).eq('id', id);
  }
  const current = await getInquiries();
  setLocalItem('inquiries', current.map((i) => (i.id === id ? { ...i, status } : i)));
  return true;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    await supabase.from('quote_inquiries').delete().eq('id', id);
  }
  const current = await getInquiries();
  setLocalItem('inquiries', current.filter((i) => i.id !== id));
  return true;
}

// 11. Media Library
export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as MediaAsset[];
    } catch (e) {
      console.warn('Supabase getMediaAssets error:', e);
    }
  }
  return getLocalItem<MediaAsset[]>('local_media', [
    {
      id: 'med-1',
      filename: 'embroidery-showcase.jpg',
      storage_path: 'hero/embroidery-showcase.jpg',
      public_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0RwY0XEtgUyikFzxuDu0bOpCDCR_78b0JtUK_EBJW4aC7lhX7ouPq3VKx-3txxqk4ujgJPssXAwdeEoGqQLBAW6VsY0cYQfO2tnW38nzvai-kViDl-OQ7kIGfaw2vKFx4jPmkFDvS7WqIqaTcVP7eNTrV5Lrd3y4P2ZsyGZ7KcNIhMi1Cv8Jw5mcQwJVgAh9QlB8T2jiBBEn8JxG2LLwDENvdHP3zwNzt3Bqf2-8bQRcWqJhfJ0h3Zg',
      file_size: 420000,
      mime_type: 'image/jpeg',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-2',
      filename: 'large-format-press.jpg',
      storage_path: 'hero/large-format-press.jpg',
      public_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5P5uPG_72pec-cab2iqt4lkIplOXelCTC97BE4RC9LhUP5dh7KGg8FNHXhVk1GKLh5SUsLcvxToHt5sTPC98HKgkw2P6o0A_xDRrfASR0ss3rY9kUJiH2hPvAtOv7YBJA11C5dGbZlOg99nRMnEUzwIizqiPUTQIfGP9RT5uTHUboVQCApKKWHWOiier2luEV6W5EmuyFnP6lU6Mz3-Cu4ebYLe1aPfPW2lHuRm9m5-jCMvdrTwRPA',
      file_size: 385000,
      mime_type: 'image/jpeg',
      created_at: new Date().toISOString(),
    },
  ]);
}
