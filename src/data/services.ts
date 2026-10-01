import { ServiceItem } from '@/types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'large-format-printing',
    title: 'Large Format Printing',
    category: 'print',
    iconName: 'printer',
    popularFor: 'Banners, Signage & Vehicle Wraps',
    shortDesc: 'Ultra-high-definition banners, flex signs, rollups, and vehicle branding that demand instant attention.',
    fullDesc: 'We utilize industrial UV and solvent wide-format presses to produce vibrant, weather-resistant outdoor and indoor visuals. From towering event backdrops to architectural signage and precision vehicle graphics, our prints deliver unmatched color fidelity and durability.',
    features: [
      'Industrial UV & eco-solvent fade-resistant inks',
      'Roll-up banners, backdrop stands, and pop-up displays',
      'Reflective and vinyl vehicle wraps & fleet branding',
      '3D acrylic lettering, lightboxes, and directional signage',
      'Quick turnaround with direct delivery across Nigeria'
    ],
    materials: ['Heavy Flex Vinyl (440-510gsm)', 'Savit Vinyl Sticker', 'Backlit Film', 'Mesh Vinyl', 'Corrugated Plastic / Foam Board'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₦12,000'
  },
  {
    id: 'custom-apparel',
    title: 'Custom Apparel & Embroidery',
    category: 'apparel',
    iconName: 'shirt',
    popularFor: 'Corporate Uniforms, Hoodies & Event Tees',
    shortDesc: 'Premium embroidery, screen printing, and direct-to-garment (DTG) customization for executive and casual apparel.',
    fullDesc: 'Outfit your team and delight clients with custom-tailored apparel that exudes professionalism. Our advanced multi-head embroidery machines and durable screen printing techniques ensure your brand look stays pristine through countless washes.',
    features: [
      'High-density 3D & flat thread embroidery',
      'Screen printing, DTF, and heat-transfer vinyl',
      'Corporate polo shirts, dry-fit activewear & executive caps',
      'Hoodies, jackets, aprons & safety workwear',
      'Premium combed cotton fabric in custom brand Pantone colors'
    ],
    materials: ['100% Pique Cotton', 'Combed Heavy Cotton (220gsm)', 'Breathable Polyester', 'Canvas Twill'],
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₦6,500 / unit'
  },
  {
    id: 'branded-merchandise',
    title: 'Branded Corporate Merchandise',
    category: 'merchandise',
    iconName: 'gift',
    popularFor: 'Executive Gift Sets, Drinkware & Tech Accessories',
    shortDesc: 'Curated corporate gifts, ceramic & thermal mugs, pens, luxury notebooks, and tech essentials imprinted with your logo.',
    fullDesc: 'Leave an indelible impression at conferences, client meetings, and milestone celebrations. We craft bespoke branded merchandise that people love using every day, keeping your brand top-of-mind.',
    features: [
      'Thermal stainless steel tumblers & ceramic coffee mugs',
      'Laser-engraved executive pens & metallic keyholders',
      'Hardcover leatherette journals with ribbon markers',
      'Custom USB flash drives, wireless power banks & lanyards',
      'Complete VIP onboarding and holiday gift boxes'
    ],
    materials: ['Double-wall Stainless Steel', 'Premium Glazed Ceramic', 'PU Leather', 'Anodized Aluminum'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₦3,500 / unit'
  },
  {
    id: 'packaging-wrapping',
    title: 'Creative Packaging & Paper Bags',
    category: 'packaging',
    iconName: 'package',
    popularFor: 'Branded Wrapping Tissue, Gift Bags & Custom Boxes',
    shortDesc: 'Unbox elegance with custom-printed tissue paper, matte/gloss shopping bags, and premium rigid product boxes.',
    fullDesc: 'Transform everyday unboxing into a luxurious brand ritual. We specialize in custom-printed translucent wrapping tissues, reinforced shopping bags with ribbon handles, and rigid mailer packaging that elevate perceived product value.',
    features: [
      'Custom watermark & all-over patterned wrapping tissue',
      'Luxury craft and laminated paper shopping bags with rope handles',
      'Rigid magnetic closure boxes and corrugated mailers',
      'Foil stamping (Gold/Silver), spot UV, and embossing',
      'Eco-friendly biodegradable and recyclable stock'
    ],
    materials: ['17-28gsm Acid-Free Tissue', '300gsm Art Paper', 'Kraft Paper', 'Rigid Greyboard'],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₦15,000 / pack'
  },
  {
    id: 'brand-identity-stationery',
    title: 'Design, Branding & Stationery',
    category: 'branding',
    iconName: 'palette',
    popularFor: 'Logos, Business Cards, Flyers & Company Profiles',
    shortDesc: 'Comprehensive visual identity design, luxury embossed business cards, corporate brochures, and event tickets.',
    fullDesc: 'Your visual identity is the cornerstone of your business authority. Our creative team develops cohesive brand systems—from memorable logos and typography guides to tactile stationery that commands respect in every boardroom.',
    features: [
      'Distinctive logo suites & comprehensive brand style guides',
      'Velvet-touch business cards with metallic foil & gilded edges',
      'Multi-page corporate profiles, annual reports & magazines',
      'High-impact event flyers, security-coded tickets & invitations',
      'Print-ready brand assets for consistent marketing materials'
    ],
    materials: ['600gsm Triplex Card', 'Velvet Soft-Touch Lamination', 'Metallic Foil', 'Textured Linen Paper'],
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    startingPrice: '₦25,000'
  }
];
