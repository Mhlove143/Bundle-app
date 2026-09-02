import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  Check,
  Plus,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Info,
  Edit2,
  Eye,
  Smartphone,
  Monitor,
  ShoppingBag,
  Code,
  Copy,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Zap,
  Tag,
  Percent,
  CheckCircle,
  PackagePlus,
  AlertTriangle,
  FileEdit
} from 'lucide-react';
import { Product, ProductVariant, BundlexOffer, BundlexOfferProduct, DiscountType } from '../types';
import { BEAUTY_STORE_PRODUCTS } from '../data/beautyProducts';
import { ProductPickerModal } from './ProductPickerModal';
import { CreateBundleModal } from './CreateBundleModal';
import { NewProductModal } from './NewProductModal';
import { ConnectStoreModal } from './ConnectStoreModal';

export const BundlexEditor: React.FC = () => {
  // Available Store Products (Dynamic state, user can sync their own store or add products)
  const [storeProducts, setStoreProducts] = useState<Product[]>(BEAUTY_STORE_PRODUCTS);
  const [currentShop, setCurrentShop] = useState<string>('glow-beauty.myshopify.com');
  const [currency, setCurrency] = useState<{ symbol: string; code: string }>({ symbol: '€', code: 'EUR' });
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Modals state
  const [isConnectStoreModalOpen, setIsConnectStoreModalOpen] = useState(false);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isCreateBundleModalOpen, setIsCreateBundleModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  
  // Offer target for adding individual products
  const [targetOfferIdForProduct, setTargetOfferIdForProduct] = useState<string>('offer_complete_bundle');
  
  // Inline quick rename state
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [tempOfferTitle, setTempOfferTitle] = useState<string>('');
  
  // Confirmation state for deleting an offer
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  // UI Toast notifications
  const [codeCopied, setCodeCopied] = useState(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [cartSuccessAlert, setCartSuccessAlert] = useState<string | null>(null);

  // Initial Offers structured matching reference design
  const [offers, setOffers] = useState<BundlexOffer[]>([
    {
      id: 'offer_single',
      name: 'Just Lumé Glow Serum',
      offerType: 'volume',
      title: 'Just Lumé Glow Serum',
      discountLabel: '',
      subtitle: '',
      badge: '',
      isExpanded: false,
      products: [
        {
          id: 'bprod_single_1',
          productId: 'prod_lume_serum',
          variantId: 'var_lume_30ml',
          productTitle: 'Lumé Glow Serum',
          variantTitle: '30ml Standard',
          customTitle: '{{product_title}}',
          image: BEAUTY_STORE_PRODUCTS[0].image,
          price: 40.00,
          compareAtPrice: 50.00,
          discountType: 'percentage',
          discountValue: 0,
          quantity: 1,
          isDefaultProduct: true
        }
      ]
    },
    {
      id: 'offer_complete_bundle',
      name: 'Complete bundle',
      offerType: 'bundle',
      title: 'Complete bundle',
      discountLabel: 'Save {{saved_percentage}}',
      subtitle: 'e.g. Best value',
      badge: 'Bundle & Save',
      isExpanded: true,
      products: [
        {
          id: 'bprod_comp_1',
          productId: 'prod_lume_serum',
          variantId: 'var_lume_30ml',
          productTitle: 'Lumé Glow Serum',
          variantTitle: '30ml Standard',
          customTitle: '{{product_title}}',
          image: BEAUTY_STORE_PRODUCTS[0].image,
          price: 40.00,
          compareAtPrice: 50.00,
          discountType: 'percentage',
          discountValue: 20,
          quantity: 1,
          isDefaultProduct: true
        },
        {
          id: 'bprod_comp_2',
          productId: 'prod_eye_cream',
          variantId: 'var_eye_15ml',
          productTitle: 'Eye Cream',
          variantTitle: '1 variant selected',
          customTitle: '{{product_title}}',
          image: BEAUTY_STORE_PRODUCTS[1].image,
          price: 35.00,
          compareAtPrice: 42.00,
          discountType: 'percentage',
          discountValue: 20,
          quantity: 1,
          isDefaultProduct: false
        },
        {
          id: 'bprod_comp_3',
          productId: 'prod_night_cream',
          variantId: 'var_night_50ml',
          productTitle: 'Night Cream',
          variantTitle: '1 variant selected',
          customTitle: '{{product_title}}',
          image: BEAUTY_STORE_PRODUCTS[2].image,
          price: 50.00,
          compareAtPrice: 60.00,
          discountType: 'percentage',
          discountValue: 20,
          quantity: 1,
          isDefaultProduct: false
        }
      ]
    }
  ]);

  // Selected Offer in the Live Preview
  const [selectedPreviewOfferId, setSelectedPreviewOfferId] = useState<string>('offer_complete_bundle');

  // Helper to calculate discounted price of a product in offer
  const calculateItemPrice = (product: BundlexOfferProduct) => {
    let finalUnitPrice = product.price;
    if (product.discountType === 'percentage') {
      finalUnitPrice = product.price * (1 - product.discountValue / 100);
    } else if (product.discountType === 'fixed_amount') {
      finalUnitPrice = Math.max(0, product.price - product.discountValue);
    } else if (product.discountType === 'fixed_price') {
      finalUnitPrice = product.discountValue;
    } else if (product.discountType === 'free') {
      finalUnitPrice = 0;
    }
    return {
      unitDiscounted: finalUnitPrice,
      totalDiscounted: finalUnitPrice * product.quantity,
      originalTotal: product.price * product.quantity
    };
  };

  // Helper to calculate total pricing of an entire offer
  const calculateOfferTotals = (offer: BundlexOffer) => {
    let originalTotal = 0;
    let finalTotal = 0;

    offer.products.forEach(p => {
      const calc = calculateItemPrice(p);
      originalTotal += calc.originalTotal;
      finalTotal += calc.totalDiscounted;
    });

    const savedAmount = Math.max(0, originalTotal - finalTotal);
    const savedPercentage = originalTotal > 0 ? Math.round((savedAmount / originalTotal) * 100) : 0;

    return {
      originalTotal,
      finalTotal,
      savedAmount,
      savedPercentage
    };
  };

  // Update offer fields dynamically (name, title, subtitle, badge, discountLabel, offerType)
  const handleUpdateOfferField = (offerId: string, field: keyof BundlexOffer, value: any) => {
    setOffers(prev => prev.map(o => {
      if (o.id !== offerId) return o;
      // If updating title, also update name to keep them in sync if name was default
      if (field === 'title') {
        return { ...o, title: value, name: value || 'Untitled Bundle' };
      }
      return { ...o, [field]: value };
    }));
  };

  // Start inline editing of offer name
  const handleStartRename = (offer: BundlexOffer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOfferId(offer.id);
    setTempOfferTitle(offer.title || offer.name);
  };

  // Save inline rename
  const handleSaveRename = (offerId: string) => {
    if (tempOfferTitle.trim()) {
      handleUpdateOfferField(offerId, 'title', tempOfferTitle.trim());
    }
    setEditingOfferId(null);
  };

  // Delete an entire offer tier
  const handleDeleteOffer = (offerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (offers.length <= 1) {
      alert('At least one offer tier must remain in the bundle widget.');
      return;
    }
    setOffers(prev => {
      const filtered = prev.filter(o => o.id !== offerId);
      // Auto-expand next remaining offer if deleted one was expanded
      if (filtered.length > 0 && !filtered.some(o => o.isExpanded)) {
        filtered[0].isExpanded = true;
      }
      return filtered;
    });

    if (selectedPreviewOfferId === offerId) {
      const remaining = offers.filter(o => o.id !== offerId);
      if (remaining.length > 0) {
        setSelectedPreviewOfferId(remaining[0].id);
      }
    }
    setOfferToDelete(null);
    setSaveNotification('Bundle offer tier was deleted.');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Update product fields inside offer
  const handleUpdateProductField = (
    offerId: string,
    productId: string,
    field: keyof BundlexOfferProduct,
    value: any
  ) => {
    setOffers(prev => prev.map(o => {
      if (o.id !== offerId) return o;
      return {
        ...o,
        products: o.products.map(p => p.id === productId ? { ...p, [field]: value } : p)
      };
    }));
  };

  // Remove product from bundle
  const handleRemoveProductFromOffer = (offerId: string, productItemId: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id !== offerId) return o;
      return {
        ...o,
        products: o.products.filter(p => p.id !== productItemId)
      };
    }));
  };

  // Add Product from Modal to Offer
  const handleAddProductToOffer = (product: Product, variant: ProductVariant) => {
    const newOfferProduct: BundlexOfferProduct = {
      id: `bprod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      productId: product.id,
      variantId: variant.id,
      productTitle: product.title,
      variantTitle: variant.title,
      customTitle: '{{product_title}}',
      image: product.image,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice || variant.price,
      discountType: 'percentage',
      discountValue: 20,
      quantity: 1,
      isDefaultProduct: false
    };

    setOffers(prev => prev.map(o => {
      if (o.id !== targetOfferIdForProduct) return o;
      return {
        ...o,
        products: [...o.products, newOfferProduct]
      };
    }));

    setSaveNotification(`Added "${product.title}" to bundle!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Create brand new Dynamic Bundle from Modal
  const handleCreateDynamicBundle = (
    bundleName: string,
    selectedItems: { product: Product; variant: ProductVariant }[],
    discountPercentage: number
  ) => {
    const newOfferId = `offer_${Date.now()}`;
    const bundledProducts: BundlexOfferProduct[] = selectedItems.map((item, index) => ({
      id: `bprod_${Date.now()}_${index}`,
      productId: item.product.id,
      variantId: item.variant.id,
      productTitle: item.product.title,
      variantTitle: item.variant.title,
      customTitle: '{{product_title}}',
      image: item.product.image,
      price: item.variant.price,
      compareAtPrice: item.variant.compareAtPrice || item.variant.price * 1.2,
      discountType: 'percentage',
      discountValue: discountPercentage,
      quantity: 1,
      isDefaultProduct: index === 0
    }));

    const newOffer: BundlexOffer = {
      id: newOfferId,
      name: bundleName,
      offerType: 'bundle',
      title: bundleName,
      discountLabel: `Save ${discountPercentage}%`,
      subtitle: `${selectedItems.length} Products Curated Bundle`,
      badge: 'Best Value',
      isExpanded: true,
      products: bundledProducts
    };

    setOffers(prev => [...prev.map(o => ({ ...o, isExpanded: false })), newOffer]);
    setSelectedPreviewOfferId(newOfferId);
    setSaveNotification(`Bundle "${bundleName}" successfully created!`);
    setTimeout(() => setSaveNotification(null), 4000);
  };

  // Add new Custom Product into Store Catalogue dynamically
  const handleAddNewStoreProduct = (newProd: Product) => {
    setStoreProducts(prev => [newProd, ...prev]);
    setSaveNotification(`Product "${newProd.title}" added to store inventory!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Connect real Shopify store & auto-populate bundles
  const handleStoreConnected = (shopDomain: string, syncedProducts: Product[]) => {
    setCurrentShop(shopDomain);
    setStoreProducts(syncedProducts);

    if (syncedProducts.length > 0) {
      const hero = syncedProducts[0];
      const heroVar: ProductVariant = hero.variants[0] || {
        id: 'var_default',
        title: 'Standard',
        price: hero.price,
        compareAtPrice: hero.compareAtPrice,
        sku: 'DEFAULT',
        available: true
      };

      const singleOffer: BundlexOffer = {
        id: `offer_single_${Date.now()}`,
        name: `Just ${hero.title}`,
        offerType: 'volume',
        title: `Just ${hero.title}`,
        discountLabel: '',
        subtitle: 'Single pack',
        badge: '',
        isExpanded: false,
        products: [
          {
            id: `bprod_${Date.now()}_single`,
            productId: hero.id,
            variantId: heroVar.id,
            productTitle: hero.title,
            variantTitle: heroVar.title,
            customTitle: '{{product_title}}',
            image: hero.image,
            price: heroVar.price,
            compareAtPrice: heroVar.compareAtPrice || heroVar.price * 1.2,
            discountType: 'percentage',
            discountValue: 0,
            quantity: 1,
            isDefaultProduct: true,
          }
        ]
      };

      const bundleItems = syncedProducts.slice(0, Math.min(syncedProducts.length, 3)).map((p, idx) => {
        const v: ProductVariant = p.variants[0] || {
          id: `var_${idx}`,
          title: 'Standard',
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          sku: `SKU-${idx}`,
          available: true
        };
        return {
          id: `bprod_${Date.now()}_${idx}`,
          productId: p.id,
          variantId: v.id,
          productTitle: p.title,
          variantTitle: v.title,
          customTitle: '{{product_title}}',
          image: p.image,
          price: v.price,
          compareAtPrice: v.compareAtPrice || v.price * 1.25,
          discountType: 'percentage' as const,
          discountValue: 20,
          quantity: 1,
          isDefaultProduct: idx === 0,
        };
      });

      const bundleOffer: BundlexOffer = {
        id: `offer_bundle_${Date.now()}`,
        name: `${hero.title} Curated Bundle Set`,
        offerType: 'bundle',
        title: `${hero.title} Curated Bundle Set`,
        discountLabel: 'Save 20%',
        subtitle: `${bundleItems.length} Products Curated Bundle`,
        badge: 'Bundle & Save',
        isExpanded: true,
        products: bundleItems
      };

      setOffers([singleOffer, bundleOffer]);
      setSelectedPreviewOfferId(bundleOffer.id);
    }

    setSaveNotification(`🎉 Connected to ${shopDomain}! Successfully synced ${syncedProducts.length} store products.`);
    setTimeout(() => setSaveNotification(null), 5000);
  };

  // Toggle expand offer accordion
  const handleToggleOfferExpand = (offerId: string) => {
    setOffers(prev => prev.map(o => ({
      ...o,
      isExpanded: o.id === offerId ? !o.isExpanded : false
    })));
  };

  // Dynamic Liquid Code generation
  const liquidSnippet = `<!-- Bundlex Dynamic Bundle Widget -->
<div 
  id="bundlex-smart-bundle" 
  data-store="${currentShop}"
  data-offer-count="${offers.length}"
  data-currency="${currency.code}"
  class="bundlex-widget-container"
>
  {% render 'bundlex-offer-block', offers: ${JSON.stringify(offers.map(o => o.title || o.name))} %}
</div>
<script src="https://bundle-app-one.vercel.app/widget.js" async></script>`;

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#202223] flex flex-col font-sans selection:bg-[#008060] selection:text-white">
      {/* 1. TOP MAC WINDOW & APP HEADER */}
      <header className="bg-white border-b border-[#E1E3E5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Mac window dots + App Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block shadow-2xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block shadow-2xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block shadow-2xs"></span>
            </div>
            
            <div className="h-4 w-px bg-[#E1E3E5]"></div>
            
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-[#008060] to-[#00A87E] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-[#202223]">Bundlex</span>
              <span className="text-[11px] bg-[#DEF8EE] text-[#008060] font-semibold px-2 py-0.5 rounded-full">
                Shopify Live
              </span>
            </div>
          </div>

          {/* Store & Currency Controls */}
          <div className="flex items-center space-x-3">
            {/* Store Connection Badge / Trigger */}
            <button
              onClick={() => setIsConnectStoreModalOpen(true)}
              className="flex items-center space-x-2 text-xs bg-[#F6F6F7] hover:bg-[#E4E5E7] border border-[#E1E3E5] px-3 py-1.5 rounded-xl text-[#202223] font-semibold transition-all group shadow-2xs"
              title="Click to connect your real Shopify store and sync its live products"
            >
              <span className="w-2 h-2 rounded-full bg-[#008060] animate-pulse"></span>
              <span className="group-hover:text-[#008060] max-w-[180px] truncate">{currentShop}</span>
              <RefreshCw className="w-3 h-3 text-[#8C9196] group-hover:text-[#008060] group-hover:rotate-180 transition-all duration-300" />
            </button>

            {/* Currency Selector */}
            <div className="flex items-center space-x-1 bg-[#F6F6F7] border border-[#E1E3E5] rounded-xl p-0.5 text-xs">
              {[
                { symbol: '€', code: 'EUR' },
                { symbol: '$', code: 'USD' },
                { symbol: '£', code: 'GBP' },
                { symbol: '৳', code: 'BDT' }
              ].map(c => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    currency.code === c.code
                      ? 'bg-white text-[#202223] shadow-xs font-bold'
                      : 'text-[#6D7175] hover:text-[#202223]'
                  }`}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>

            {/* Connect Store Action */}
            <button
              onClick={() => setIsConnectStoreModalOpen(true)}
              className="flex px-3 py-1.5 bg-[#DEF8EE] hover:bg-[#008060]/20 text-[#008060] rounded-xl text-xs font-bold items-center space-x-1.5 border border-[#008060]/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Store</span>
            </button>

            {/* 1-Click No-CLI Live Auto-Install */}
            <button
              onClick={() => setIsConnectStoreModalOpen(true)}
              className="hidden sm:flex px-3 py-1.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
              title="1-Click Auto-inject script tag without Shopify CLI"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ Auto-Activate (No CLI)</span>
            </button>

            {/* Add Custom Store Product Button */}
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="hidden sm:flex px-3 py-1.5 bg-[#F6F6F7] hover:bg-[#E4E5E7] text-[#202223] rounded-xl text-xs font-semibold items-center space-x-1.5 border border-[#D2D5D8] transition-all cursor-pointer"
              title="Add a new product to store catalogue"
            >
              <PackagePlus className="w-3.5 h-3.5 text-[#008060]" />
              <span>+ Product</span>
            </button>

            {/* Liquid Code Button */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="px-3 py-1.5 bg-[#F6F6F7] hover:bg-[#E4E5E7] text-[#202223] rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-[#D2D5D8] transition-all cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-[#6D7175]" />
              <span>Theme Liquid</span>
            </button>

            {/* Save & Publish */}
            <button
              onClick={() => {
                setSaveNotification('Bundle configuration successfully synchronized with Shopify Theme!');
                setTimeout(() => setSaveNotification(null), 4000);
              }}
              className="px-4 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveNotification && (
        <div className="bg-[#DEF8EE] border-b border-[#008060]/30 py-2.5 px-4 text-center text-xs font-semibold text-[#008060] flex items-center justify-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: OFFERS & BUNDLE CONFIGURATION EDITOR (lg:col-span-6) */}
        <section className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E1E3E5] shadow-xs overflow-hidden">
            
            {/* OFFERS HEADER WITH DYNAMIC CREATE BUNDLE BUTTON */}
            <div className="p-4 border-b border-[#E1E3E5] flex items-center justify-between bg-white">
              <div>
                <h2 className="text-base font-bold text-[#202223] flex items-center space-x-2">
                  <span>Offers & Bundle Tiers</span>
                  <span className="text-xs font-semibold text-[#008060] bg-[#DEF8EE] px-2 py-0.5 rounded-full">
                    {offers.length} active
                  </span>
                </h2>
                <p className="text-xs text-[#6D7175] mt-0.5">Click any tier to edit details, add products, or rename</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCreateBundleModalOpen(true)}
                  className="px-3 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Create Bundle</span>
                </button>
              </div>
            </div>

            {/* OFFERS LIST (ACCORDION WITH EDIT & DELETE) */}
            <div className="divide-y divide-[#F1F2F3]">
              {offers.map((offer) => {
                const isExpanded = offer.isExpanded;
                const isRenaming = editingOfferId === offer.id;
                const totals = calculateOfferTotals(offer);

                return (
                  <div key={offer.id} className="transition-all">
                    {/* Offer Item Row */}
                    <div
                      className={`p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#FBFBFC] transition-colors ${
                        isExpanded ? 'bg-[#FAFBFB] font-medium' : ''
                      }`}
                      onClick={() => handleToggleOfferExpand(offer.id)}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-lg bg-[#F1F2F3] flex items-center justify-center text-[#6D7175] flex-shrink-0">
                          {offer.offerType === 'bundle' ? (
                            <Layers className="w-3.5 h-3.5 text-[#008060]" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-[#008060]" />
                          )}
                        </div>

                        {/* Inline Name Editing / Display */}
                        {isRenaming ? (
                          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={tempOfferTitle}
                              onChange={(e) => setTempOfferTitle(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(offer.id);
                                if (e.key === 'Escape') setEditingOfferId(null);
                              }}
                              className="text-sm font-bold bg-white border border-[#008060] rounded-lg px-2 py-1 outline-hidden text-[#202223] w-48 shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(offer.id)}
                              className="p-1 text-white bg-[#008060] hover:bg-[#006e52] rounded-md text-xs font-bold"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-sm font-bold text-[#202223] truncate">
                              {offer.title || offer.name}
                            </span>
                            <span className="text-[10px] text-[#6D7175] bg-[#F1F2F3] px-1.5 py-0.5 rounded capitalize flex-shrink-0">
                              {offer.offerType} ({offer.products.length} items)
                            </span>
                            {offer.badge && (
                              <span className="text-[10px] bg-[#202223] text-white px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                {offer.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons on the row: Edit Title, Delete Tier, Expand */}
                      <div className="flex items-center space-x-1 text-[#6D7175] flex-shrink-0 ml-2">
                        {/* Quick Rename Button */}
                        <button
                          title="Quick rename bundle name"
                          onClick={(e) => handleStartRename(offer, e)}
                          className="p-1.5 hover:text-[#008060] hover:bg-[#E4E5E7] rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Offer Tier Button */}
                        <button
                          title="Delete bundle tier"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOfferToDelete(offer.id);
                          }}
                          className="p-1.5 hover:text-[#D82C0D] hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Expand / Collapse Icon */}
                        <button
                          title={isExpanded ? 'Collapse' : 'Expand'}
                          className="p-1.5 hover:text-[#202223] hover:bg-[#E4E5E7] rounded-md transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED OFFER CONFIGURATION FORM */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-white border-t border-[#F1F2F3] space-y-5 animate-fadeIn">
                        
                        {/* 1. OFFER TYPE TOGGLE */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#4A4D4F] flex items-center space-x-1">
                            <span>Offer type</span>
                            <Info className="w-3 h-3 text-[#8C9196]" />
                          </label>
                          <div className="grid grid-cols-2 gap-2 bg-[#F1F2F3] p-1 rounded-xl border border-[#E1E3E5]">
                            <button
                              type="button"
                              onClick={() => handleUpdateOfferField(offer.id, 'offerType', 'volume')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                offer.offerType === 'volume'
                                  ? 'bg-white text-[#202223] shadow-xs'
                                  : 'text-[#6D7175] hover:text-[#202223]'
                              }`}
                            >
                              Volume
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateOfferField(offer.id, 'offerType', 'bundle')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                offer.offerType === 'bundle'
                                  ? 'bg-[#C9CCCF] text-[#202223] shadow-xs font-extrabold'
                                  : 'text-[#6D7175] hover:text-[#202223]'
                              }`}
                            >
                              Bundle
                            </button>
                          </div>
                        </div>

                        {/* 2. DYNAMIC TITLE & DISCOUNT LABEL INPUTS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#4A4D4F]">
                              <label className="flex items-center space-x-1">
                                <span>Bundle Name / Title</span>
                                <span className="text-[10px] text-[#008060] font-normal">(Dynamic)</span>
                              </label>
                              <div className="flex items-center space-x-1 text-[#8C9196]">
                                <span className="text-[10px] cursor-pointer hover:text-[#202223]">&lt;+&gt;</span>
                                <Sliders className="w-3 h-3" />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={offer.title}
                              onChange={(e) => handleUpdateOfferField(offer.id, 'title', e.target.value)}
                              placeholder="e.g. Complete bundle, Glow Duo"
                              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden transition-all text-[#202223] font-medium"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#4A4D4F]">
                              <label>Discount label</label>
                              <div className="flex items-center space-x-1 text-[#8C9196]">
                                <span className="text-[10px] cursor-pointer hover:text-[#202223]">&lt;+&gt;</span>
                                <Sliders className="w-3 h-3" />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={offer.discountLabel}
                              onChange={(e) => handleUpdateOfferField(offer.id, 'discountLabel', e.target.value)}
                              placeholder="Save {{saved_percentage}}"
                              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden transition-all text-[#202223]"
                            />
                          </div>
                        </div>

                        {/* 3. SUBTITLE & BADGE INPUTS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#4A4D4F]">
                              <label>Subtitle</label>
                              <div className="flex items-center space-x-1 text-[#8C9196]">
                                <span className="text-[10px] cursor-pointer hover:text-[#202223]">&lt;+&gt;</span>
                                <Sliders className="w-3 h-3" />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={offer.subtitle}
                              onChange={(e) => handleUpdateOfferField(offer.id, 'subtitle', e.target.value)}
                              placeholder="e.g. Best value"
                              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden transition-all text-[#202223]"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#4A4D4F]">
                              <label>Badge</label>
                              <div className="flex items-center space-x-1 text-[#8C9196]">
                                <span className="text-[10px] cursor-pointer hover:text-[#202223]">&lt;+&gt;</span>
                                <Sliders className="w-3 h-3" />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={offer.badge}
                              onChange={(e) => handleUpdateOfferField(offer.id, 'badge', e.target.value)}
                              placeholder="Bundle & Save"
                              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden transition-all text-[#202223]"
                            />
                          </div>
                        </div>

                        {/* 4. DYNAMIC BUNDLE PRODUCTS CONFIGURATION */}
                        <div className="pt-3 border-t border-[#E1E3E5] space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-bold text-[#202223]">Bundle products ({offer.products.length})</h3>
                              <span className="text-xs text-[#6D7175]">Dynamic selection</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetOfferIdForProduct(offer.id);
                                  setIsProductPickerOpen(true);
                                }}
                                className="px-2.5 py-1 bg-[#DEF8EE] hover:bg-[#c2f2df] text-[#008060] rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add Product</span>
                              </button>
                            </div>
                          </div>

                          {/* PRODUCT LIST INSIDE BUNDLE */}
                          <div className="space-y-3">
                            {offer.products.map((bProduct, index) => (
                              <div
                                key={bProduct.id}
                                className="bg-[#FAFBFB] rounded-xl border border-[#E1E3E5] p-3.5 space-y-3 shadow-2xs hover:border-[#C9CCCF] transition-all"
                              >
                                {/* Top Product Identity */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={bProduct.image}
                                      alt={bProduct.productTitle}
                                      className="w-11 h-11 rounded-lg object-cover border border-[#E1E3E5] bg-white flex-shrink-0"
                                    />
                                    <div>
                                      <h4 className="text-xs font-bold text-[#202223]">{bProduct.productTitle}</h4>
                                      <div className="flex items-center space-x-1.5 text-[11px] text-[#6D7175]">
                                        <span>{bProduct.isDefaultProduct ? 'Default product' : bProduct.variantTitle}</span>
                                        {bProduct.isDefaultProduct && <Info className="w-3 h-3 text-[#8C9196]" />}
                                        <span>•</span>
                                        <span className="font-semibold text-[#202223]">{currency.symbol}{bProduct.price.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1">
                                    {/* Delete Product from Bundle Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveProductFromOffer(offer.id, bProduct.id)}
                                      className="p-1.5 text-[#8C9196] hover:text-[#D82C0D] hover:bg-red-50 rounded-md transition-colors"
                                      title="Remove this product from bundle"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Discount & Quantity Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                                  {/* Discount Type */}
                                  <div className="sm:col-span-6 space-y-1">
                                    <label className="text-[11px] font-semibold text-[#4A4D4F]">Discount type</label>
                                    <select
                                      value={bProduct.discountType}
                                      onChange={(e) => handleUpdateProductField(offer.id, bProduct.id, 'discountType', e.target.value as DiscountType)}
                                      className="w-full text-xs bg-white border border-[#D2D5D8] rounded-lg px-2.5 py-1.5 font-medium text-[#202223] outline-hidden focus:border-[#008060]"
                                    >
                                      <option value="percentage">Percentage (e.g. 10% off)</option>
                                      <option value="fixed_amount">Fixed Amount Discount</option>
                                      <option value="fixed_price">Fixed Override Price</option>
                                      <option value="free">Free Gift (100% off)</option>
                                    </select>
                                  </div>

                                  {/* Discount Value */}
                                  <div className="sm:col-span-3 space-y-1">
                                    <label className="text-[11px] font-semibold text-[#4A4D4F]">Discount</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={bProduct.discountValue}
                                        onChange={(e) => handleUpdateProductField(offer.id, bProduct.id, 'discountValue', Number(e.target.value))}
                                        className="w-full text-xs bg-white border border-[#D2D5D8] rounded-lg pl-2.5 pr-6 py-1.5 font-medium text-[#202223] outline-hidden focus:border-[#008060]"
                                      />
                                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8C9196] font-bold">
                                        {bProduct.discountType === 'percentage' ? '%' : currency.symbol}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Quantity */}
                                  <div className="sm:col-span-3 space-y-1">
                                    <label className="text-[11px] font-semibold text-[#4A4D4F]">Quantity</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={bProduct.quantity}
                                      onChange={(e) => handleUpdateProductField(offer.id, bProduct.id, 'quantity', Math.max(1, Number(e.target.value)))}
                                      className="w-full text-xs bg-white border border-[#D2D5D8] rounded-lg px-2.5 py-1.5 font-medium text-[#202223] outline-hidden focus:border-[#008060]"
                                    />
                                  </div>
                                </div>

                                {/* Custom Title Override */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A4D4F]">
                                    <label>Title Override</label>
                                    <span className="text-[10px] text-[#8C9196] cursor-pointer hover:text-[#202223]">&lt;+&gt;</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={bProduct.customTitle}
                                    onChange={(e) => handleUpdateProductField(offer.id, bProduct.id, 'customTitle', e.target.value)}
                                    placeholder="{{product_title}}"
                                    className="w-full text-xs bg-white border border-[#D2D5D8] rounded-lg px-2.5 py-1.5 text-[#202223] outline-hidden focus:border-[#008060]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Actions for this offer */}
                        <div className="pt-3 border-t border-[#E1E3E5] flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setOfferToDelete(offer.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete this Bundle Tier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedPreviewOfferId(offer.id)}
                            className="text-xs text-[#008060] font-bold flex items-center space-x-1 hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview this tier</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* RIGHT COLUMN: LIVE REAL-TIME STOREFRONT PREVIEW (lg:col-span-6) */}
        <section className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E1E3E5] shadow-xs overflow-hidden sticky top-20">
            
            {/* PREVIEW TOP BAR */}
            <div className="p-3.5 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
              <div className="flex items-center space-x-3">
                <img
                  src={storeProducts[0]?.image || BEAUTY_STORE_PRODUCTS[0].image}
                  alt="Preview product"
                  className="w-9 h-9 rounded-lg object-cover border border-[#E1E3E5] bg-white flex-shrink-0"
                />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6D7175] font-semibold">Storefront Target</div>
                  <div className="text-xs font-bold text-[#202223]">{storeProducts[0]?.title || 'Lumé Skincare'}</div>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-1.5 text-[#6D7175]">
                <button
                  onClick={() => setPreviewDevice(previewDevice === 'desktop' ? 'mobile' : 'desktop')}
                  className={`p-1.5 rounded-lg border transition-all ${
                    previewDevice === 'mobile' ? 'bg-[#202223] text-white border-[#202223]' : 'bg-white border-[#D2D5D8] hover:bg-[#F6F6F7]'
                  }`}
                  title="Toggle Mobile View"
                >
                  {previewDevice === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsProductPickerOpen(true)}
                  className="p-1.5 bg-white border border-[#D2D5D8] rounded-lg hover:bg-[#F6F6F7] hover:text-[#202223] transition-all"
                  title="Browse Store Catalogue"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsCreateBundleModalOpen(true)}
                  className="p-1.5 bg-[#008060] text-white rounded-lg hover:bg-[#006e52] transition-all font-bold"
                  title="Create New Dynamic Bundle"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* LIVE WIDGET CONTAINER */}
            <div className="p-5 sm:p-7 bg-[#FAFBFB]">
              <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-xs' : 'max-w-xl'}`}>
                
                {/* WIDGET CARD HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#202223]">
                    Build your bundle & save
                  </h3>
                  <span className="text-[11px] text-[#6D7175] font-medium bg-[#F1F2F3] px-2 py-0.5 rounded-md">
                    Live Preview
                  </span>
                </div>

                {/* OFFERS CONTAINER */}
                <div className="space-y-3.5">
                  {offers.map((offer) => {
                    const isSelected = selectedPreviewOfferId === offer.id;
                    const totals = calculateOfferTotals(offer);

                    if (offer.offerType === 'volume' || offer.products.length <= 1) {
                      // VOLUME / INDIVIDUAL OPTION (Matches Reference Image)
                      return (
                        <div
                          key={offer.id}
                          onClick={() => setSelectedPreviewOfferId(offer.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-white border-[#202223] ring-1 ring-[#202223] shadow-xs'
                              : 'bg-white border-[#D2D5D8] hover:border-[#8C9196]'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'border-[#202223]' : 'border-[#C9CCCF]'
                              }`}
                            >
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#202223]"></div>}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-[#202223]">
                                {offer.title || offer.name}
                              </span>
                              {offer.subtitle && (
                                <p className="text-[11px] text-[#6D7175]">{offer.subtitle}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-bold text-[#202223]">
                              {currency.symbol}{totals.finalTotal.toFixed(2)}
                            </div>
                            {totals.savedAmount > 0 && (
                              <div className="text-xs text-[#8C9196] line-through">
                                {currency.symbol}{totals.originalTotal.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // COMPLETE DYNAMIC BUNDLE OPTION (Matches Reference Image with Chain + Badge)
                    return (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedPreviewOfferId(offer.id)}
                        className={`relative rounded-xl border cursor-pointer transition-all bg-white overflow-hidden ${
                          isSelected
                            ? 'border-[#202223] ring-1 ring-[#202223] shadow-sm'
                            : 'border-[#D2D5D8] hover:border-[#8C9196]'
                        }`}
                      >
                        {/* Top-Right Badge Pill */}
                        {offer.badge && (
                          <div className="absolute top-0 right-0 bg-[#202223] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-tight uppercase shadow-2xs">
                            {offer.badge}
                          </div>
                        )}

                        <div className="p-4 sm:p-5 space-y-4">
                          {/* Option Title + Radio + Savings Pill */}
                          <div className="flex items-center justify-between pr-24">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected ? 'border-[#202223]' : 'border-[#C9CCCF]'
                                }`}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#202223]"></div>}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-[#202223]">
                                  {offer.title || offer.name}
                                </span>
                                {totals.savedPercentage > 0 && (
                                  <span className="text-[11px] bg-[#E4E5E7] text-[#202223] font-bold px-2 py-0.5 rounded-md">
                                    Save {totals.savedPercentage}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Top Total Price Display */}
                          <div className="flex items-center justify-end space-x-2 text-right -mt-2">
                            <span className="text-base font-extrabold text-[#202223]">
                              {currency.symbol}{totals.finalTotal.toFixed(2)}
                            </span>
                            {totals.savedAmount > 0 && (
                              <span className="text-xs font-semibold text-[#8C9196] line-through">
                                {currency.symbol}{totals.originalTotal.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* PRODUCT CHAIN CONNECTOR (Matches Reference Image) */}
                          <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1 no-scrollbar">
                            {offer.products.map((item, idx) => {
                              const calc = calculateItemPrice(item);
                              return (
                                <React.Fragment key={item.id}>
                                  {/* Product Item Card */}
                                  <div className="border border-dashed border-[#C9CCCF] rounded-xl p-2.5 flex items-center space-x-2.5 bg-[#FAFBFB] min-w-[135px] flex-1">
                                    <img
                                      src={item.image}
                                      alt={item.productTitle}
                                      className="w-10 h-10 rounded-lg object-cover border border-[#E1E3E5] bg-white flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-[#202223] truncate">
                                        {item.productTitle}
                                      </div>
                                      <div className="flex items-center space-x-1 mt-0.5">
                                        <span className="text-xs font-extrabold text-[#202223]">
                                          {currency.symbol}{calc.totalDiscounted.toFixed(2)}
                                        </span>
                                        {calc.originalTotal > calc.totalDiscounted && (
                                          <span className="text-[10px] text-[#8C9196] line-through">
                                            {currency.symbol}{calc.originalTotal.toFixed(2)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Plus Sign between chained items */}
                                  {idx < offer.products.length - 1 && (
                                    <span className="text-sm font-bold text-[#8C9196] flex-shrink-0">
                                      +
                                    </span>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ADD TO CART ACTION BUTTON */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => {
                      const sel = offers.find(o => o.id === selectedPreviewOfferId);
                      const selTotals = sel ? calculateOfferTotals(sel) : null;
                      setCartSuccessAlert(`Added "${sel?.title || 'Selected Bundle'}" to Cart (${currency.symbol}${selTotals?.finalTotal.toFixed(2)})!`);
                      setTimeout(() => setCartSuccessAlert(null), 3500);
                    }}
                    className="w-full py-3.5 bg-[#202223] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  {cartSuccessAlert && (
                    <div className="p-3 bg-[#DEF8EE] border border-[#008060]/30 rounded-xl text-xs text-[#008060] font-bold text-center flex items-center justify-center space-x-2 animate-fadeIn">
                      <CheckCircle className="w-4 h-4" />
                      <span>{cartSuccessAlert}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-4 text-[11px] text-[#6D7175] pt-1 font-medium">
                    <span>⚡ Instant Checkout</span>
                    <span>•</span>
                    <span>🔒 100% Safe Payment</span>
                    <span>•</span>
                    <span>↺ 30-Day Guarantee</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 3. MODALS */}
      {/* Dynamic Store Connect & Products Sync Modal */}
      <ConnectStoreModal
        isOpen={isConnectStoreModalOpen}
        onClose={() => setIsConnectStoreModalOpen(false)}
        currentShop={currentShop}
        onStoreConnected={handleStoreConnected}
      />

      {/* Dynamic Product Picker Modal */}
      <ProductPickerModal
        isOpen={isProductPickerOpen}
        onClose={() => setIsProductPickerOpen(false)}
        onSelectProduct={handleAddProductToOffer}
        onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
        onOpenConnectStore={() => setIsConnectStoreModalOpen(true)}
        currentShopName={currentShop}
        availableProducts={storeProducts}
        currencySymbol={currency.symbol}
      />

      {/* Dynamic Bundle Creator Modal */}
      <CreateBundleModal
        isOpen={isCreateBundleModalOpen}
        onClose={() => setIsCreateBundleModalOpen(false)}
        onCreateBundle={handleCreateDynamicBundle}
        onOpenConnectStore={() => setIsConnectStoreModalOpen(true)}
        onOpenNewProduct={() => setIsNewProductModalOpen(true)}
        currentShopName={currentShop}
        availableProducts={storeProducts}
        currencySymbol={currency.symbol}
      />

      {/* Dynamic Store Product Creator Modal */}
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onAddStoreProduct={handleAddNewStoreProduct}
        currencySymbol={currency.symbol}
      />

      {/* Liquid Code Export Modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E1E3E5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
              <div className="flex items-center space-x-2.5">
                <Code className="w-5 h-5 text-[#008060]" />
                <h3 className="text-base font-bold text-[#202223]">Shopify Theme Liquid Code</h3>
              </div>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="text-[#6D7175] hover:text-[#202223]"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-[#6D7175]">
                Paste this dynamic liquid block inside your Shopify theme's <code className="text-[#202223] font-bold bg-[#F1F2F3] px-1.5 py-0.5 rounded">main-product.liquid</code> or product template section:
              </p>
              <div className="relative">
                <pre className="p-4 bg-[#202223] text-[#A6E22E] rounded-xl text-xs font-mono overflow-x-auto">
                  {liquidSnippet}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(liquidSnippet);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2500);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
                >
                  {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {offerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-[#E1E3E5] p-5 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#202223]">Delete Bundle Tier?</h4>
                <p className="text-xs text-[#6D7175]">This will remove this offer tier from the widget.</p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#E1E3E5]">
              <button
                type="button"
                onClick={() => setOfferToDelete(null)}
                className="px-3.5 py-1.5 bg-white border border-[#D2D5D8] rounded-xl text-xs font-semibold text-[#202223] hover:bg-[#F6F6F7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOffer(offerToDelete)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
