import React, { useState, useMemo } from 'react';
import { Bundle, Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  Percent, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Code2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Sliders
} from 'lucide-react';

interface LiveWidgetPreviewProps {
  bundle: Bundle;
  onEditBundle?: (bundle: Bundle) => void;
  onOpenEmbedModal?: (bundle: Bundle) => void;
}

export const LiveWidgetPreview: React.FC<LiveWidgetPreviewProps> = ({
  bundle,
  onEditBundle,
  onOpenEmbedModal,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeLayout, setActiveLayout] = useState<'wizard_steps' | 'grid' | 'sticky_bar'>(
    bundle.widgetStyling.layout || 'wizard_steps'
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Selected Items State
  const [selectedItems, setSelectedItems] = useState<{
    product: Product;
    quantity: number;
    stepId?: string;
  }[]>([]);

  const [addedToCart, setAddedToCart] = useState(false);
  const [showCartPayload, setShowCartPayload] = useState(false);

  // Product Map for fast lookup
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    MOCK_PRODUCTS.forEach(p => map.set(p.id, p));
    return map;
  }, []);

  const currentStep = bundle.steps[currentStepIndex] || bundle.steps[0];
  const totalItemCount = selectedItems.reduce((sum, it) => sum + it.quantity, 0);

  // Calculate Raw Subtotal
  const rawSubtotal = selectedItems.reduce(
    (sum, it) => sum + it.product.price * it.quantity, 
    0
  );

  // Calculate Discounts & Savings
  const discountCalculation = useMemo(() => {
    let discountPercent = 0;
    let activeTierLabel = '';
    let nextTierNeeded = 0;
    let nextTierDiscount = 0;

    if (bundle.pricingType === 'tiered_percentage' && bundle.tieredDiscounts?.length) {
      const sortedTiers = [...bundle.tieredDiscounts].sort((a, b) => a.quantity - b.quantity);
      for (const tier of sortedTiers) {
        if (totalItemCount >= tier.quantity) {
          discountPercent = tier.discountPercentage;
          activeTierLabel = tier.label;
        } else if (nextTierNeeded === 0) {
          nextTierNeeded = tier.quantity - totalItemCount;
          nextTierDiscount = tier.discountPercentage;
        }
      }
    } else if (bundle.pricingType === 'percentage_off_total') {
      discountPercent = bundle.discountValue || 15;
      activeTierLabel = `${discountPercent}% Bundle Discount`;
    }

    const totalSavings = (rawSubtotal * discountPercent) / 100;
    const finalTotal = Math.max(0, rawSubtotal - totalSavings);

    return {
      discountPercent,
      totalSavings,
      finalTotal,
      activeTierLabel,
      nextTierNeeded,
      nextTierDiscount
    };
  }, [bundle, totalItemCount, rawSubtotal]);

  // Handlers for modifying items
  const handleAddItem = (product: Product, stepId?: string) => {
    if (totalItemCount >= (bundle.maxItemsTotal || 10)) return;

    setSelectedItems(prev => {
      const existing = prev.find(it => it.product.id === product.id && it.stepId === stepId);
      if (existing) {
        return prev.map(it =>
          it.product.id === product.id && it.stepId === stepId
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [...prev, { product, quantity: 1, stepId }];
    });
  };

  const handleRemoveItem = (productId: string, stepId?: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(it => it.product.id === productId && it.stepId === stepId);
      if (existing && existing.quantity > 1) {
        return prev.map(it =>
          it.product.id === productId && it.stepId === stepId
            ? { ...it, quantity: it.quantity - 1 }
            : it
        );
      }
      return prev.filter(it => !(it.product.id === productId && it.stepId === stepId));
    });
  };

  const handleSimulateAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3500);
  };

  // Simulated Shopify Cart Transform / AJAX Cart Add Payload
  const simulatedCartPayload = {
    items: selectedItems.map(it => ({
      id: it.product.id,
      quantity: it.quantity,
      title: it.product.title,
      price: Math.round(it.product.price * (1 - discountCalculation.discountPercent / 100) * 100),
      properties: {
        _bundle_id: bundle.id,
        _bundle_title: bundle.title,
        _bundle_type: bundle.type,
        _bundle_discount_applied: `${discountCalculation.discountPercent}%`,
        _step_id: it.stepId || 'default'
      }
    }))
  };

  return (
    <div className="space-y-4">
      
      {/* Viewport & Layout Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
        <div className="flex items-center space-x-3">
          
          {/* Responsive Device Switcher */}
          <div className="flex items-center bg-[#F1F2F3] p-1 rounded-lg border border-[#E1E3E5]">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                deviceView === 'desktop' ? 'bg-white text-[#008060] shadow-xs font-bold' : 'text-[#6D7175] hover:text-[#202223]'
              }`}
              title="Desktop View (1024px)"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                deviceView === 'tablet' ? 'bg-white text-[#008060] shadow-xs font-bold' : 'text-[#6D7175] hover:text-[#202223]'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                deviceView === 'mobile' ? 'bg-white text-[#008060] shadow-xs font-bold' : 'text-[#6D7175] hover:text-[#202223]'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <span className="text-xs text-[#E1E3E5] hidden sm:inline">|</span>

          {/* Layout Presentation Switcher */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#6D7175] hidden sm:inline font-semibold">Layout:</span>
            {(['wizard_steps', 'grid', 'sticky_bar'] as const).map(l => (
              <button
                key={l}
                onClick={() => setActiveLayout(l)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-all border ${
                  activeLayout === l
                    ? 'bg-[#DEF8EE] text-[#008060] border-[#008060]/30 font-bold'
                    : 'bg-white text-[#6D7175] border-[#BABFC3] hover:text-[#202223]'
                }`}
              >
                {l === 'wizard_steps' ? 'Multi-Step Wizard' : l === 'grid' ? 'Product Grid' : 'Sticky Bar'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {onOpenEmbedModal && (
            <button
              onClick={() => onOpenEmbedModal(bundle)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-[#202223] hover:bg-[#F6F6F7] border border-[#BABFC3] transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Code2 className="h-3.5 w-3.5 text-[#008060]" />
              <span>Theme Liquid Snippet</span>
            </button>
          )}
          {onEditBundle && (
            <button
              onClick={() => onEditBundle(bundle)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-md bg-[#008060] text-white hover:bg-[#006e52] transition-all shadow-xs"
            >
              Edit Rules & Pricing
            </button>
          )}
        </div>
      </div>

      {/* Simulated Browser Viewport */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 w-full rounded-xl border border-[#E1E3E5] shadow-md bg-white overflow-hidden ${
            deviceView === 'mobile'
              ? 'max-w-[420px]'
              : deviceView === 'tablet'
              ? 'max-w-[768px]'
              : 'max-w-5xl'
          }`}
        >
          {/* Simulated Browser URL Bar */}
          <div className="bg-[#F6F6F7] px-4 py-2.5 border-b border-[#E1E3E5] flex items-center justify-between text-xs text-[#6D7175]">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]"></span>
              <span className="ml-2 font-mono text-[11px] text-[#4A4D4F] truncate max-w-[200px] sm:max-w-xs">
                https://your-store.myshopify.com/products/{bundle.handle}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-[#008060] bg-[#DEF8EE] px-2 py-0.5 rounded border border-[#008060]/20 font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Shopify App Bridge 3.0 Active</span>
            </div>
          </div>

          {/* Storefront Page Content */}
          <div className="p-4 sm:p-6 md:p-8 bg-white min-h-[500px]">
            
            {/* Header / Intro */}
            <div className="mb-6 pb-6 border-b border-[#E1E3E5]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEF8EE] text-[#008060] border border-[#008060]/20 mb-2">
                    <Sparkles className="h-3 w-3" />
                    <span>
                      {bundle.type === 'mix_match'
                        ? 'Custom Mix & Match Bundle Box'
                        : bundle.type === 'volume_discount'
                        ? 'Volume Tier Discount'
                        : 'Frequently Bought Together'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#202223] tracking-tight">
                    {bundle.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6D7175] mt-1 max-w-2xl">
                    {bundle.description}
                  </p>
                </div>

                {/* Live Bundle Price Tag */}
                <div className="bg-[#F6F6F7] p-3.5 rounded-xl border border-[#E1E3E5] text-right min-w-[160px] shadow-xs">
                  <div className="text-xs text-[#6D7175] font-semibold">Bundle Subtotal</div>
                  <div className="flex items-baseline justify-end space-x-2">
                    {discountCalculation.totalSavings > 0 && (
                      <span className="text-sm text-[#8C9196] line-through font-mono">
                        ${rawSubtotal.toFixed(2)}
                      </span>
                    )}
                    <span className="text-2xl font-black text-[#008060] font-mono">
                      ${discountCalculation.finalTotal.toFixed(2)}
                    </span>
                  </div>
                  {discountCalculation.totalSavings > 0 && (
                    <div className="text-[11px] font-bold text-[#008060] mt-0.5">
                      Save ${discountCalculation.totalSavings.toFixed(2)} ({discountCalculation.activeTierLabel})
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Milestone Unlock Bar */}
              {bundle.widgetStyling.showProgressBar && (
                <div className="mt-4 bg-[#F6F6F7] p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#202223] flex items-center space-x-1.5">
                      <Percent className="h-3.5 w-3.5 text-[#008060]" />
                      <span>
                        {totalItemCount === 0
                          ? `Select at least ${bundle.minItemsTotal} items to start savings`
                          : discountCalculation.nextTierNeeded > 0
                          ? `Add ${discountCalculation.nextTierNeeded} more item to unlock ${discountCalculation.nextTierDiscount}% OFF!`
                          : discountCalculation.activeTierLabel || 'Maximum Bundle Discount Unlocked!'}
                      </span>
                    </span>
                    <span className="text-[#6D7175] font-mono text-[11px] font-bold">
                      {totalItemCount} / {bundle.maxItemsTotal} items in box
                    </span>
                  </div>
                  <div className="w-full bg-[#E1E3E5] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#008060] transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (totalItemCount / (bundle.maxItemsTotal || 4)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Layout 1: Multi-Step Wizard View */}
            {activeLayout === 'wizard_steps' && (
              <div className="space-y-6">
                {/* Step Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  {bundle.steps.map((st, idx) => {
                    const stepItems = selectedItems.filter(it => it.stepId === st.id);
                    const stepCount = stepItems.reduce((sum, it) => sum + it.quantity, 0);
                    const isDone = stepCount >= st.minSelection;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <button
                        key={st.id}
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border flex items-center space-x-2 ${
                          isCurrent
                            ? 'bg-[#008060] text-white border-[#008060] shadow-xs'
                            : isDone
                            ? 'bg-[#DEF8EE] text-[#008060] border-[#008060]/30 hover:bg-[#d4f6e8]'
                            : 'bg-white text-[#6D7175] border-[#BABFC3] hover:text-[#202223] hover:bg-[#F6F6F7]'
                        }`}
                      >
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent ? 'bg-white text-[#008060]' : isDone ? 'bg-[#008060] text-white' : 'bg-[#E1E3E5] text-[#6D7175]'
                        }`}>
                          {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                        </span>
                        <span>{st.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Current Step Products Display */}
                {currentStep && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-[#202223] flex items-center space-x-2">
                          <span>{currentStep.title}</span>
                          {currentStep.isOptional && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#F1F2F3] text-[#6D7175] rounded-full border border-[#E1E3E5]">
                              Optional
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-[#6D7175]">{currentStep.subtitle}</p>
                      </div>
                      <span className="text-xs text-[#6D7175]">
                        Required: <strong className="text-[#202223]">{currentStep.minSelection} - {currentStep.maxSelection} items</strong>
                      </span>
                    </div>

                    {/* Step Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentStep.allowedProductIds.map(productId => {
                        const product = productMap.get(productId);
                        if (!product) return null;

                        const itemInCart = selectedItems.find(
                          it => it.product.id === product.id && it.stepId === currentStep.id
                        );
                        const isSelected = !!itemInCart;

                        return (
                          <div
                            key={product.id}
                            className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-white border-[#008060] shadow-sm ring-1 ring-[#008060]'
                                : 'bg-white border-[#E1E3E5] hover:border-[#BABFC3] shadow-xs'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-[#F6F6F7] border border-[#E1E3E5]">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {isSelected && (
                                  <div className="absolute top-2 right-2 bg-[#008060] text-white p-1 rounded-full shadow-sm">
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="text-xs font-bold text-[#202223] line-clamp-1">{product.title}</div>
                                <div className="text-xs text-[#008060] font-mono font-bold mt-0.5">
                                  ${product.price.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* Quantity / Selection Controls */}
                            <div className="mt-3 pt-3 border-t border-[#E1E3E5]">
                              {isSelected ? (
                                <div className="flex items-center justify-between bg-[#F6F6F7] rounded-lg p-1 border border-[#E1E3E5]">
                                  <button
                                    onClick={() => handleRemoveItem(product.id, currentStep.id)}
                                    className="p-1 rounded bg-white hover:bg-red-50 hover:text-red-600 text-[#4A4D4F] transition-colors"
                                  >
                                    {itemInCart.quantity === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                  </button>
                                  <span className="text-xs font-bold text-[#202223] font-mono">{itemInCart.quantity} in Box</span>
                                  <button
                                    onClick={() => handleAddItem(product, currentStep.id)}
                                    className="p-1 rounded bg-white hover:bg-[#DEF8EE] hover:text-[#008060] text-[#4A4D4F] transition-colors"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddItem(product, currentStep.id)}
                                  className="w-full py-1.5 px-3 bg-white hover:bg-[#008060] hover:text-white text-[#202223] border border-[#BABFC3] hover:border-[#008060] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>Select for Step</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Layout 2: Product Grid View */}
            {activeLayout === 'grid' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_PRODUCTS.map(product => {
                    const itemInCart = selectedItems.find(it => it.product.id === product.id);
                    const isSelected = !!itemInCart;

                    return (
                      <div
                        key={product.id}
                        className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-[#008060] shadow-sm ring-1 ring-[#008060]'
                            : 'bg-white border-[#E1E3E5] hover:border-[#BABFC3] shadow-xs'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-[#F6F6F7] border border-[#E1E3E5]">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-[#008060] text-white p-1 rounded-full shadow-sm">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#202223] line-clamp-1">{product.title}</div>
                            <div className="text-xs text-[#008060] font-mono font-bold mt-0.5">${product.price.toFixed(2)}</div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#E1E3E5]">
                          {isSelected ? (
                            <div className="flex items-center justify-between bg-[#F6F6F7] rounded-lg p-1 border border-[#E1E3E5]">
                              <button
                                onClick={() => handleRemoveItem(product.id)}
                                className="p-1 rounded bg-white hover:bg-red-50 hover:text-red-600 text-[#4A4D4F] transition-colors"
                              >
                                {itemInCart.quantity === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                              </button>
                              <span className="text-xs font-bold text-[#202223] font-mono">{itemInCart.quantity} in Box</span>
                              <button
                                onClick={() => handleAddItem(product)}
                                className="p-1 rounded bg-white hover:bg-[#DEF8EE] hover:text-[#008060] text-[#4A4D4F] transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddItem(product)}
                              className="w-full py-1.5 px-3 bg-white hover:bg-[#008060] hover:text-white text-[#202223] border border-[#BABFC3] hover:border-[#008060] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add to Box</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Layout 3: Sticky Bottom Drawer Simulation */}
            <div className="mt-8 pt-6 border-t border-[#E1E3E5] bg-[#F6F6F7] p-5 rounded-xl border space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#202223]">
                    Selected Box Summary ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                  </div>
                  <div className="text-xs text-[#6D7175]">
                    {discountCalculation.totalSavings > 0
                      ? `${discountCalculation.activeTierLabel} automatically applied`
                      : 'Add eligible items to activate bulk savings'}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-[#6D7175]">Subtotal:</div>
                    <div className="text-lg font-black text-[#008060] font-mono">
                      ${discountCalculation.finalTotal.toFixed(2)}
                    </div>
                  </div>

                  <button
                    id="btn-simulate-add-to-cart"
                    onClick={handleSimulateAddToCart}
                    disabled={totalItemCount < (bundle.minItemsTotal || 1)}
                    className="px-6 py-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-2 disabled:opacity-40 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{bundle.widgetStyling.ctaText || 'Add Custom Box to Cart'}</span>
                  </button>
                </div>
              </div>

              {/* Added to Cart Feedback Toast */}
              {addedToCart && (
                <div className="p-3 bg-[#DEF8EE] border border-[#008060]/30 rounded-lg text-xs font-bold text-[#008060] flex items-center justify-between animate-fade-in shadow-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{bundle.widgetStyling.successMessage || 'Bundle successfully added to your Shopify Cart!'}</span>
                  </div>
                  <button
                    onClick={() => setShowCartPayload(!showCartPayload)}
                    className="underline text-[11px] hover:text-[#006e52]"
                  >
                    {showCartPayload ? 'Hide API Payload' : 'Inspect /cart/add.js Payload'}
                  </button>
                </div>
              )}

              {/* AJAX Cart /cart/add.js Payload Viewer */}
              {showCartPayload && (
                <div className="p-3 bg-[#202223] rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto space-y-1">
                  <div className="text-[#8C9196]">// POST /cart/add.js (Shopify AJAX API)</div>
                  <pre>{JSON.stringify(simulatedCartPayload, null, 2)}</pre>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
