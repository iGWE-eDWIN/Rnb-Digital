export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  materials?: string[];
  popularFor: string;
  image: string;
  startingPrice?: string;
  category: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'all' | 'print' | 'apparel' | 'branding';
  categoryLabel: string;
  image: string;
  client: string;
  description: string;
  tags: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceFormatted: string;
  minOrder: string;
  image: string;
  badge?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatar: string;
  projectType: string;
}

export interface SlideshowSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  alt: string;
}
