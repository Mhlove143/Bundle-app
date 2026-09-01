import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Minimalist Heavyweight Cotton Tee',
    handle: 'minimalist-cotton-tee',
    vendor: 'Aura Studio',
    category: 'Apparel',
    price: 34.00,
    compareAtPrice: 42.00,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    description: '100% organic ring-spun cotton with an oversized, relaxed aesthetic.',
    tags: ['apparel', 'best-seller', 'basics'],
    variants: [
      { id: 'var_1_1', title: 'Black / M', price: 34.00, sku: 'TEE-BLK-M', available: true },
      { id: 'var_1_2', title: 'Black / L', price: 34.00, sku: 'TEE-BLK-L', available: true },
      { id: 'var_1_3', title: 'Off-White / M', price: 34.00, sku: 'TEE-WHT-M', available: true },
      { id: 'var_1_4', title: 'Olive / L', price: 34.00, sku: 'TEE-OLV-L', available: true },
    ]
  },
  {
    id: 'prod_2',
    title: 'French Terry Relaxed Hoodie',
    handle: 'french-terry-hoodie',
    vendor: 'Aura Studio',
    category: 'Apparel',
    price: 68.00,
    compareAtPrice: 85.00,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    description: 'Heavy 450 GSM French terry fleece tailored for everyday comfort.',
    tags: ['apparel', 'hoodie', 'winter'],
    variants: [
      { id: 'var_2_1', title: 'Oatmeal / M', price: 68.00, sku: 'HOD-OAT-M', available: true },
      { id: 'var_2_2', title: 'Oatmeal / L', price: 68.00, sku: 'HOD-OAT-L', available: true },
      { id: 'var_2_3', title: 'Charcoal / M', price: 68.00, sku: 'HOD-CHR-M', available: true },
    ]
  },
  {
    id: 'prod_3',
    title: 'Structured Everyday Tote Bag',
    handle: 'structured-tote-bag',
    vendor: 'Aura Studio',
    category: 'Accessories',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    description: 'Waxed canvas tote with internal 15-inch laptop sleeve and water bottle slot.',
    tags: ['accessories', 'bags'],
    variants: [
      { id: 'var_3_1', title: 'Tan Canvas', price: 45.00, sku: 'TOT-TAN-01', available: true },
      { id: 'var_3_2', title: 'Midnight Blue', price: 45.00, sku: 'TOT-BLU-01', available: true },
    ]
  },
  {
    id: 'prod_4',
    title: 'Hydrating Botanical Facial Serum',
    handle: 'hydrating-facial-serum',
    vendor: 'Glow Botanics',
    category: 'Beauty & Skincare',
    price: 42.00,
    compareAtPrice: 50.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    description: 'Hyaluronic acid + Vitamin C glow booster formulated for intense 24h hydration.',
    tags: ['beauty', 'skincare', 'serum'],
    variants: [
      { id: 'var_4_1', title: '30ml Dropper', price: 42.00, sku: 'SRM-30ML', available: true },
      { id: 'var_4_2', title: '50ml Value Size', price: 58.00, sku: 'SRM-50ML', available: true },
    ]
  },
  {
    id: 'prod_5',
    title: 'Deep Cleansing Clay Mask',
    handle: 'cleansing-clay-mask',
    vendor: 'Glow Botanics',
    category: 'Beauty & Skincare',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1567928815104-b7980ee5032e?w=800&auto=format&fit=crop&q=80',
    description: 'French pink clay with rosehip oil to gently purify pores without over-drying.',
    tags: ['beauty', 'skincare', 'mask'],
    variants: [
      { id: 'var_5_1', title: '100ml Jar', price: 36.00, sku: 'MSK-100G', available: true }
    ]
  },
  {
    id: 'prod_6',
    title: 'Restorative Night Cream',
    handle: 'restorative-night-cream',
    vendor: 'Glow Botanics',
    category: 'Beauty & Skincare',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    description: 'Ceramide-rich overnight repair treatment designed for smooth barrier restoration.',
    tags: ['beauty', 'skincare', 'cream'],
    variants: [
      { id: 'var_6_1', title: '50ml Jar', price: 48.00, sku: 'CRM-50G', available: true }
    ]
  },
  {
    id: 'prod_7',
    title: 'Jade Facial Roller & Gua Sha Kit',
    handle: 'jade-roller-gua-sha',
    vendor: 'Glow Botanics',
    category: 'Beauty & Skincare',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1608248597359-57e0b57e75cf?w=800&auto=format&fit=crop&q=80',
    description: '100% natural Xiuyan jade stone set for lymphatic drainage and facial contouring.',
    tags: ['beauty', 'accessories', 'tools'],
    variants: [
      { id: 'var_7_1', title: 'Emerald Jade Set', price: 24.00, sku: 'JAD-SET-01', available: true }
    ]
  },
  {
    id: 'prod_8',
    title: 'Single Origin Ethiopian Yirgacheffe Beans',
    handle: 'ethiopian-yirgacheffe-coffee',
    vendor: 'Roast & Brew Co.',
    category: 'Food & Beverage',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
    description: 'Floral jasmine notes with bright bergamot and honey finish. Light roast.',
    tags: ['coffee', 'beverage', 'specialty'],
    variants: [
      { id: 'var_8_1', title: 'Whole Bean / 250g', price: 22.00, sku: 'COF-ETH-250W', available: true },
      { id: 'var_8_2', title: 'Espresso Grind / 250g', price: 22.00, sku: 'COF-ETH-250E', available: true },
    ]
  },
  {
    id: 'prod_9',
    title: 'Ceramic Pour-Over Dripper + Glass Server',
    handle: 'ceramic-pour-over-kit',
    vendor: 'Roast & Brew Co.',
    category: 'Home & Kitchen',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    description: 'Minimalist matte ceramic V60 style dripper with heat-resistant 600ml glass carafe.',
    tags: ['coffee', 'gear', 'kitchen'],
    variants: [
      { id: 'var_9_1', title: 'Matte Charcoal', price: 38.00, sku: 'KIT-DRIP-BLK', available: true },
      { id: 'var_9_2', title: 'Matte Cream', price: 38.00, sku: 'KIT-DRIP-CRM', available: true },
    ]
  },
  {
    id: 'prod_10',
    title: 'Insulated Travel Tumbler (16oz)',
    handle: 'insulated-travel-tumbler',
    vendor: 'Roast & Brew Co.',
    category: 'Home & Kitchen',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80',
    description: 'Double-walled vacuum insulated stainless steel tumbler keeps drinks hot 12h, cold 24h.',
    tags: ['accessories', 'drinkware'],
    variants: [
      { id: 'var_10_1', title: 'Sage Green', price: 28.00, sku: 'TUM-SGE-16', available: true },
      { id: 'var_10_2', title: 'Obsidian Black', price: 28.00, sku: 'TUM-BLK-16', available: true },
    ]
  }
];
