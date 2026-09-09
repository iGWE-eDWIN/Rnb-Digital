import { ServiceItem, PortfolioItem, ProductItem, TestimonialItem, SlideshowSlide } from './index';

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url: string | null;
  logo_icon: string;
  announcement_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta1_text: string;
  hero_cta1_link: string;
  hero_cta2_text: string;
  hero_cta2_link: string;
  contact_address: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  operating_hours: string;
  footer_description: string;
  footer_copyright: string;
  updated_at?: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_header: boolean;
  is_footer: boolean;
  is_active: boolean;
}

export interface HeroSlideItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image_url: string;
  alt: string;
  sort_order: number;
  is_active: boolean;
}

export interface EstimatorOption {
  id: string;
  category_id: string;
  name: string;
  extra_price: number;
  is_default: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface EstimatorCategory {
  id: string;
  name: string;
  slug: string;
  unit_label: string;
  base_rate: number;
  min_qty: number;
  sort_order: number;
  is_active: boolean;
  options?: EstimatorOption[];
}

export interface AboutPillar {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface SiteStat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export interface MediaAsset {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  file_size: number;
  mime_type: string;
  created_at?: string;
}

export interface QuoteInquiry {
  id: string;
  name: string;
  email?: string;
  phone: string;
  service?: string;
  quantity?: string;
  estimated_total?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'archived';
  created_at: string;
}

export type { ServiceItem, PortfolioItem, ProductItem, TestimonialItem, SlideshowSlide };
