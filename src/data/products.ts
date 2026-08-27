import { ProductItem } from '@/types';

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Executive Thermal Smart Tumbler (500ml)',
    category: 'Merchandise',
    description: 'Double-wall vacuum insulated stainless steel with LED temperature readout & custom laser-etched branding.',
    priceFormatted: '₦7,500',
    minOrder: '10 pcs',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller'
  },
  {
    id: 'prod-2',
    name: 'Custom Branded Wrapping Tissue Paper (500 sheets)',
    category: 'Packaging',
    description: 'Eco-friendly translucent wrapping tissue custom printed with repeating brand patterns for apparel and gifts.',
    priceFormatted: '₦28,000',
    minOrder: '1 pack',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular'
  },
  {
    id: 'prod-3',
    name: 'Heavyweight Embroidered Corporate Polo',
    category: 'Apparel',
    description: '220gsm pique combed cotton shirt with high-density embroidered logo on chest and sleeve.',
    priceFormatted: '₦8,500',
    minOrder: '15 pcs',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    badge: 'Premium'
  },
  {
    id: 'prod-4',
    name: 'Luxury Velvet-Touch Gold Foil Business Cards (200 pcs)',
    category: 'Stationery',
    description: '600gsm thick cardstock with soft-touch matte lamination and dual-sided metallic gold foil accent.',
    priceFormatted: '₦18,500',
    minOrder: '200 pcs',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
    badge: 'Executive'
  }
];
