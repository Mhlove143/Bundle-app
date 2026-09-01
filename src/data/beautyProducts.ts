import { Product } from '../types';

export const BEAUTY_STORE_PRODUCTS: Product[] = [
  {
    id: 'prod_lume_serum',
    title: 'Lumé Glow Serum',
    handle: 'lume-glow-serum',
    vendor: 'Lumé Skincare',
    category: 'Serums & Treatments',
    price: 40.00,
    compareAtPrice: 50.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    description: 'High-potency Vitamin C + Niacinamide brightening elixir for radiant 24h skin barrier glow.',
    tags: ['serum', 'glow', 'best-seller', 'vitamin-c'],
    variants: [
      { id: 'var_lume_30ml', title: '30ml Standard', price: 40.00, compareAtPrice: 50.00, sku: 'LUM-SER-30', available: true },
      { id: 'var_lume_50ml', title: '50ml Jumbo Value', price: 58.00, compareAtPrice: 70.00, sku: 'LUM-SER-50', available: true }
    ]
  },
  {
    id: 'prod_eye_cream',
    title: 'Eye Cream',
    handle: 'peptide-restorative-eye-cream',
    vendor: 'Lumé Skincare',
    category: 'Eye Treatments',
    price: 35.00,
    compareAtPrice: 42.00,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    description: 'Targeted multi-peptide formulation reducing puffiness, dark circles, and fine expression lines.',
    tags: ['eye-cream', 'peptide', 'anti-aging'],
    variants: [
      { id: 'var_eye_15ml', title: '15ml Tube', price: 35.00, compareAtPrice: 42.00, sku: 'LUM-EYE-15', available: true },
      { id: 'var_eye_30ml', title: '30ml Double Tube', price: 55.00, compareAtPrice: 68.00, sku: 'LUM-EYE-30', available: true }
    ]
  },
  {
    id: 'prod_night_cream',
    title: 'Night Cream',
    handle: 'ceramide-barrier-night-cream',
    vendor: 'Lumé Skincare',
    category: 'Moisturizers',
    price: 50.00,
    compareAtPrice: 60.00,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    description: 'Ceramide-3 enriched intensive overnight moisture lock for deep cellular regeneration.',
    tags: ['night-cream', 'moisturizer', 'ceramide'],
    variants: [
      { id: 'var_night_50ml', title: '50ml Glass Jar', price: 50.00, compareAtPrice: 60.00, sku: 'LUM-NGT-50', available: true }
    ]
  },
  {
    id: 'prod_pink_clay',
    title: 'Purifying Pink Clay Cleanser',
    handle: 'purifying-pink-clay-cleanser',
    vendor: 'Lumé Skincare',
    category: 'Cleansers',
    price: 28.00,
    compareAtPrice: 34.00,
    image: 'https://images.unsplash.com/photo-1567928815104-b7980ee5032e?w=600&auto=format&fit=crop&q=80',
    description: 'Gently cleanses impurities and balances sebum without stripping natural protective oils.',
    tags: ['cleanser', 'clay', 'purifying'],
    variants: [
      { id: 'var_clay_120ml', title: '120ml Pump Bottle', price: 28.00, compareAtPrice: 34.00, sku: 'LUM-CLY-120', available: true }
    ]
  },
  {
    id: 'prod_rose_mist',
    title: 'Hydrating Botanical Rose Mist',
    handle: 'hydrating-rose-mist',
    vendor: 'Lumé Skincare',
    category: 'Toners & Mists',
    price: 24.00,
    compareAtPrice: 30.00,
    image: 'https://images.unsplash.com/photo-1608248597359-57e0b57e75cf?w=600&auto=format&fit=crop&q=80',
    description: 'Pure organic Damask rose floral water infused with aloe and witch hazel.',
    tags: ['toner', 'mist', 'refreshing'],
    variants: [
      { id: 'var_mist_100ml', title: '100ml Spray Bottle', price: 24.00, compareAtPrice: 30.00, sku: 'LUM-MST-100', available: true }
    ]
  }
];
