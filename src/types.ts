export type BundleType = 'mix_match' | 'frequently_bought_together' | 'volume_discount' | 'fixed_kit';

export type AppViewMode = 'admin_saas' | 'store_embedded';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  available: boolean;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  variants: ProductVariant[];
  tags: string[];
}

export interface BundleStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  minSelection: number;
  maxSelection: number;
  allowedProductIds: string[]; // Product IDs
  isOptional: boolean;
  discountType?: 'none' | 'percentage' | 'fixed_amount';
  discountValue?: number;
}

export interface TierDiscount {
  quantity: number;
  discountPercentage: number;
  label: string; // e.g. "Buy 3, Save 20%"
}

export interface WidgetStyling {
  theme: 'modern' | 'minimal' | 'bold' | 'card' | 'glass';
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number; // in px
  layout: 'wizard_steps' | 'grid' | 'accordion' | 'sticky_bar';
  showProgressBar: boolean;
  ctaText: string;
  successMessage: string;
  showSaveBadge: boolean;
  enableConfetti: boolean;
}

export interface Bundle {
  id: string;
  storeDomain?: string;
  title: string;
  handle: string;
  description: string;
  type: BundleType;
  status: 'active' | 'draft' | 'archived';
  steps: BundleStep[];
  pricingType: 'tiered_percentage' | 'fixed_bundle_price' | 'percentage_off_total' | 'fixed_discount_total';
  fixedPrice?: number;
  discountValue?: number; // e.g. 15 for 15% off
  tieredDiscounts?: TierDiscount[];
  minItemsTotal: number;
  maxItemsTotal: number;
  widgetStyling: WidgetStyling;
  targetProductHandles?: string[]; // Product pages where widget auto-loads
  createdAt: string;
  updatedAt: string;
  stats: {
    views: number;
    bundlesSold: number;
    totalRevenue: number;
    avgOrderValue: number;
    conversionRate: number;
  };
}

export interface ShopifyStore {
  id: string;
  shopDomain: string; // e.g. "mystore.myshopify.com"
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'Starter' | 'Growth Pro' | 'Enterprise Plus';
  status: 'active' | 'trial' | 'suspended';
  isConnected: boolean;
  installedAt: string;
  lastSyncedAt?: string;
  accessToken?: string;
  currency: string;
  currencySymbol: string;
  themeName: string;
  themeEmbedActive: boolean;
  bundlesCount: number;
  totalGmv: number;
  monthlyOrders: number;
  checkoutEngine: 'cart_transform_api' | 'draft_orders';
}

export interface GlobalFeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  category: 'ai' | 'engine' | 'theme' | 'billing' | 'security';
  isEnabled: boolean;
  allowedPlans: ('Starter' | 'Growth Pro' | 'Enterprise Plus')[];
  badge?: string;
}

export interface CartBundleItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  stepId: string;
}

export type OfferType = 'volume' | 'bundle';

export type DiscountType = 'percentage' | 'fixed_amount' | 'fixed_price' | 'free';

export interface BundlexOfferProduct {
  id: string;
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  customTitle: string;
  image: string;
  price: number;
  compareAtPrice: number;
  discountType: DiscountType;
  discountValue: number;
  quantity: number;
  isDefaultProduct?: boolean;
}

export interface BundlexOffer {
  id: string;
  name: string;
  offerType: OfferType;
  title: string;
  discountLabel: string;
  subtitle: string;
  badge: string;
  products: BundlexOfferProduct[];
  isExpanded?: boolean;
}

export interface LanguageContextType {
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
  t: (key: string) => string;
}
