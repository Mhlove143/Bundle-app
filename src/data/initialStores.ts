import { ShopifyStore, GlobalFeatureFlag } from '../types';

export const INITIAL_STORES: ShopifyStore[] = [
  {
    id: 'store_1',
    shopDomain: 'lumina-atelier.myshopify.com',
    shopName: 'Lumina Atelier Paris',
    ownerName: 'Chloe Laurent',
    ownerEmail: 'chloe@lumina-atelier.com',
    plan: 'Enterprise Plus',
    status: 'active',
    isConnected: true,
    installedAt: '2024-03-15T09:30:00Z',
    lastSyncedAt: new Date().toISOString(),
    accessToken: 'shpua_live_9838a7c6f0114e9e',
    currency: 'USD',
    currencySymbol: '$',
    themeName: 'Dawn (OS 2.0 Live)',
    themeEmbedActive: true,
    bundlesCount: 4,
    totalGmv: 42850.00,
    monthlyOrders: 512,
    checkoutEngine: 'cart_transform_api'
  },
  {
    id: 'store_2',
    shopDomain: 'nordic-glow-organics.myshopify.com',
    shopName: 'Nordic Glow Organics',
    ownerName: 'Elias Lindqvist',
    ownerEmail: 'elias@nordicglow.se',
    plan: 'Growth Pro',
    status: 'active',
    isConnected: true,
    installedAt: '2024-04-02T14:15:00Z',
    lastSyncedAt: new Date().toISOString(),
    accessToken: 'shpua_live_7719a82bb901',
    currency: 'USD',
    currencySymbol: '$',
    themeName: 'Impulse v7.4',
    themeEmbedActive: true,
    bundlesCount: 2,
    totalGmv: 18420.00,
    monthlyOrders: 238,
    checkoutEngine: 'cart_transform_api'
  },
  {
    id: 'store_3',
    shopDomain: 'urban-athletics-gear.myshopify.com',
    shopName: 'Urban Athletics Apparel',
    ownerName: 'Marcus Vance',
    ownerEmail: 'marcus@urbanathletics.co',
    plan: 'Starter',
    status: 'trial',
    isConnected: true,
    installedAt: '2024-05-10T11:00:00Z',
    lastSyncedAt: new Date().toISOString(),
    accessToken: 'shpua_trial_4421b8c199',
    currency: 'USD',
    currencySymbol: '$',
    themeName: 'Sense Theme',
    themeEmbedActive: false,
    bundlesCount: 1,
    totalGmv: 3950.00,
    monthlyOrders: 49,
    checkoutEngine: 'draft_orders'
  },
  {
    id: 'store_4',
    shopDomain: 'apex-roasters-coffee.myshopify.com',
    shopName: 'Apex Artisan Roasters',
    ownerName: 'Sarah Jenkins',
    ownerEmail: 'sarah@apexroasters.com',
    plan: 'Growth Pro',
    status: 'active',
    isConnected: true,
    installedAt: '2024-02-18T08:45:00Z',
    lastSyncedAt: new Date().toISOString(),
    accessToken: 'shpua_live_3319cb8182',
    currency: 'USD',
    currencySymbol: '$',
    themeName: 'Prestige Theme',
    themeEmbedActive: true,
    bundlesCount: 3,
    totalGmv: 29140.00,
    monthlyOrders: 380,
    checkoutEngine: 'cart_transform_api'
  }
];

export const INITIAL_GLOBAL_FEATURES: GlobalFeatureFlag[] = [
  {
    id: 'feat_ai',
    key: 'ai_bundle_strategist',
    name: 'Gemini AI Bundle Strategist & CRO Co-Pilot',
    description: 'Enables merchant AI generation of optimal bundle tiers, discount milestones, and copywriting using Gemini 2.5 Flash.',
    category: 'ai',
    isEnabled: true,
    allowedPlans: ['Growth Pro', 'Enterprise Plus'],
    badge: 'AI Powered'
  },
  {
    id: 'feat_mix_match',
    key: 'mix_match_wizard',
    name: 'Interactive Multi-Step Box Builder (Mix & Match)',
    description: 'Allows merchants to build sequential step-by-step box configurators with required/optional product selection steps.',
    category: 'engine',
    isEnabled: true,
    allowedPlans: ['Starter', 'Growth Pro', 'Enterprise Plus']
  },
  {
    id: 'feat_volume_tiers',
    key: 'volume_tier_engine',
    name: 'Dynamic Volume Tier Milestone Engine',
    description: 'Live progress bars awarding 10%, 20%, 30% discounts as customer cart quantities increase.',
    category: 'engine',
    isEnabled: true,
    allowedPlans: ['Starter', 'Growth Pro', 'Enterprise Plus']
  },
  {
    id: 'feat_fbt',
    key: 'frequently_bought_together',
    name: '1-Click Frequently Bought Together (FBT) Embeds',
    description: 'Amazon-style product bundling widgets with 1-click bundle add on product pages.',
    category: 'engine',
    isEnabled: true,
    allowedPlans: ['Growth Pro', 'Enterprise Plus']
  },
  {
    id: 'feat_cart_transform',
    key: 'cart_transform_api',
    name: 'Shopify Native Cart Transform & Functions API',
    description: 'Processes bundle items as a single native Shopify line item with automatic discounts without draft orders.',
    category: 'engine',
    isEnabled: true,
    allowedPlans: ['Growth Pro', 'Enterprise Plus'],
    badge: 'Shopify Plus / OS 2.0'
  },
  {
    id: 'feat_custom_css',
    key: 'unlimited_custom_styling',
    name: 'Full Custom CSS & Font Injector',
    description: 'Allows merchants to inject custom CSS stylesheets and brand typography directly into the theme widget.',
    category: 'theme',
    isEnabled: true,
    allowedPlans: ['Enterprise Plus'],
    badge: 'Enterprise'
  },
  {
    id: 'feat_multi_currency',
    key: 'multi_market_currency',
    name: 'Shopify Markets & Multi-Currency FX Engine',
    description: 'Auto-converts bundle discounts and tiered price rules to 130+ local currencies.',
    category: 'billing',
    isEnabled: true,
    allowedPlans: ['Growth Pro', 'Enterprise Plus']
  }
];
