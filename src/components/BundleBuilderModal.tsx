import React, { useState } from 'react';
import { 
  Bundle, 
  BundleStep, 
  TierDiscount, 
  BundleType, 
  WidgetStyling 
} from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { 
  X, 
  Plus, 
  Trash2, 
  Layers, 
  DollarSign, 
  Palette, 
  Package, 
  Check, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Percent,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface BundleBuilderModalProps {
  initialBundle?: Bundle | null;
  onSave: (bundle: Bundle) => void;
  onClose: () => void;
}

export const BundleBuilderModal: React.FC<BundleBuilderModalProps> = ({
  initialBundle,
  onSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'steps' | 'pricing' | 'styling'>('info');

  // Form State
  const [id] = useState(initialBundle?.id || `bundle_${Date.now()}`);
  const [title, setTitle] = useState(initialBundle?.title || 'Custom Skincare Routine Box');
  const [handle, setHandle] = useState(initialBundle?.handle || 'custom-skincare-routine-box');
  const [description, setDescription] = useState(
    initialBundle?.description || 'Build your personalized box of 3 to 5 items and save up to 25% off automatically!'
  );
  const [type, setType] = useState<BundleType>(initialBundle?.type || 'mix_match');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(initialBundle?.status || 'active');

  const [pricingType, setPricingType] = useState(initialBundle?.pricingType || 'tiered_percentage');
  const [discountValue, setDiscountValue] = useState(initialBundle?.discountValue || 20);
  const [fixedPrice, setFixedPrice] = useState(initialBundle?.fixedPrice || 49.00);
  const [minItemsTotal, setMinItemsTotal] = useState(initialBundle?.minItemsTotal || 3);
  const [maxItemsTotal, setMaxItemsTotal] = useState(initialBundle?.maxItemsTotal || 5);

  const [tieredDiscounts, setTieredDiscounts] = useState<TierDiscount[]>(
    initialBundle?.tieredDiscounts || [
      { quantity: 2, discountPercentage: 10, label: 'Buy 2, Save 10%' },
      { quantity: 3, discountPercentage: 20, label: 'Buy 3, Save 20% (Best Value)' },
      { quantity: 4, discountPercentage: 25, label: 'Buy 4+, Save 25% + Free Gift' },
    ]
  );

  const [steps, setSteps] = useState<BundleStep[]>(
    initialBundle?.steps || [
      {
        id: 'step_1',
        stepNumber: 1,
        title: 'Step 1: Choose Your Purifier',
        subtitle: 'Select 1 pore-refining base cleanser or clay mask',
        minSelection: 1,
        maxSelection: 1,
        allowedProductIds: ['prod_5'],
        isOptional: false,
      },
      {
        id: 'step_2',
        stepNumber: 2,
        title: 'Step 2: Choose Active Treatments',
        subtitle: 'Select 1 or 2 targeted glow booster serums',
        minSelection: 1,
        maxSelection: 2,
        allowedProductIds: ['prod_4'],
        isOptional: false,
      },
      {
        id: 'step_3',
        stepNumber: 3,
        title: 'Step 3: Choose Night Barrier Cream',
        subtitle: 'Lock in deep restorative overnight hydration',
        minSelection: 1,
        maxSelection: 1,
        allowedProductIds: ['prod_6'],
        isOptional: false,
      }
    ]
  );

  const [widgetStyling, setWidgetStyling] = useState<WidgetStyling>(
    initialBundle?.widgetStyling || {
      theme: 'modern',
      primaryColor: '#008060',
      accentColor: '#10b981',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      borderRadius: 12,
      layout: 'wizard_steps',
      showProgressBar: true,
      ctaText: 'Add Custom Box to Cart',
      successMessage: 'Bundle discount applied to your cart!',
      showSaveBadge: true,
      enableConfetti: true,
    }
  );

  // Helper Functions
  const handleAddStep = () => {
    const nextNum = steps.length + 1;
    const newStep: BundleStep = {
      id: `step_${Date.now()}`,
      stepNumber: nextNum,
      title: `Step ${nextNum}: Choose Item`,
      subtitle: `Select products for step ${nextNum}`,
      minSelection: 1,
      maxSelection: 2,
      allowedProductIds: [MOCK_PRODUCTS[0].id],
      isOptional: false,
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleToggleProductInStep = (stepId: string, productId: string) => {
    setSteps(
      steps.map(step => {
        if (step.id !== stepId) return step;
        const exists = step.allowedProductIds.includes(productId);
        const updated = exists
          ? step.allowedProductIds.filter(id => id !== productId)
          : [...step.allowedProductIds, productId];
        return { ...step, allowedProductIds: updated };
      })
    );
  };

  const handleAddTier = () => {
    const lastQty = tieredDiscounts[tieredDiscounts.length - 1]?.quantity || 2;
    const newTier: TierDiscount = {
      quantity: lastQty + 1,
      discountPercentage: 30,
      label: `Buy ${lastQty + 1}+ items, Save 30%`,
    };
    setTieredDiscounts([...tieredDiscounts, newTier]);
  };

  const handleRemoveTier = (idx: number) => {
    setTieredDiscounts(tieredDiscounts.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBundle: Bundle = {
      id,
      title,
      handle,
      description,
      type,
      status,
      steps,
      pricingType,
      discountValue,
      fixedPrice,
      tieredDiscounts,
      minItemsTotal,
      maxItemsTotal,
      widgetStyling,
      targetProductHandles: initialBundle?.targetProductHandles || ['hydrating-facial-serum'],
      createdAt: initialBundle?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: initialBundle?.stats || {
        views: 0,
        bundlesSold: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        conversionRate: 0,
      }
    };
    onSave(finalBundle);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#E1E3E5] rounded-xl max-w-4xl w-full my-auto shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-[#DEF8EE] text-[#008060] border border-[#008060]/20 flex items-center justify-center shadow-xs">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202223]">
                {initialBundle ? 'Edit Bundle Wizard Configuration' : 'Create Custom Bundle Wizard'}
              </h2>
              <p className="text-xs text-[#6D7175]">
                Configure multi-step box architecture, catalog selection, discount tiers, and storefront styling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6D7175] hover:text-[#202223] hover:bg-[#F1F2F3] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E1E3E5] bg-[#F6F6F7] px-6 space-x-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'info'
                ? 'border-[#008060] text-[#008060] bg-white'
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>1. General Info</span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'steps'
                ? 'border-[#008060] text-[#008060] bg-white'
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>2. Steps & Catalog ({steps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'pricing'
                ? 'border-[#008060] text-[#008060] bg-white'
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>3. Pricing & Discounts</span>
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'styling'
                ? 'border-[#008060] text-[#008060] bg-white'
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>4. Theme & Layout</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          
          {/* TAB 1: General Info */}
          {activeTab === 'info' && (
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#202223]">
                  Bundle Title (Display name on storefront):
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  required
                  placeholder="e.g. Build Your Custom Skincare Ritual"
                  className="w-full bg-white border border-[#BABFC3] rounded-md px-3.5 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#202223]">
                  Shopify URL Handle:
                </label>
                <div className="flex items-center">
                  <span className="bg-[#F6F6F7] border border-r-0 border-[#BABFC3] rounded-l-md px-3 py-2 text-xs text-[#6D7175] font-mono">
                    /products/
                  </span>
                  <input
                    type="text"
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    required
                    className="w-full bg-white border border-[#BABFC3] rounded-r-md px-3.5 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] font-mono shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#202223]">
                  Marketing Description & Selling Hooks:
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain the bundle savings and benefits to shoppers..."
                  className="w-full bg-white border border-[#BABFC3] rounded-md px-3.5 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#202223]">
                    Bundle Architecture Type:
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as BundleType)}
                    className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] shadow-xs"
                  >
                    <option value="mix_match">Mix & Match Custom Box (Multi-Step)</option>
                    <option value="volume_discount">Volume Tiered Discount Multi-Pack</option>
                    <option value="frequently_bought_together">Frequently Bought Together (FBT)</option>
                    <option value="fixed_kit">Curated Fixed Kit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#202223]">
                    Publishing Status:
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] shadow-xs"
                  >
                    <option value="active">Active (Visible on Storefront)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Steps & Products */}
          {activeTab === 'steps' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#202223]">Wizard Step Hierarchy</h3>
                  <p className="text-[11px] text-[#6D7175]">Define each progressive step in the customer's box building journey</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3 py-1.5 bg-[#DEF8EE] text-[#008060] hover:bg-[#d4f6e8] border border-[#008060]/30 rounded-md text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Next Step</span>
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={step.id} className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#008060] flex items-center space-x-1.5">
                        <span className="h-5 w-5 rounded-full bg-[#008060] text-white flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>Step #{idx + 1} Configuration</span>
                      </span>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(step.id)}
                          className="text-[#8C9196] hover:text-red-600 p-1 rounded transition-colors"
                          title="Remove Step"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#202223] mb-1">Step Heading:</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={e => {
                            const val = e.target.value;
                            setSteps(steps.map(s => s.id === step.id ? { ...s, title: val } : s));
                          }}
                          className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs text-[#202223] shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#202223] mb-1">Instruction Subtitle:</label>
                        <input
                          type="text"
                          value={step.subtitle}
                          onChange={e => {
                            const val = e.target.value;
                            setSteps(steps.map(s => s.id === step.id ? { ...s, subtitle: val } : s));
                          }}
                          className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs text-[#202223] shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#6D7175]">Min Items:</span>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          value={step.minSelection}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setSteps(steps.map(s => s.id === step.id ? { ...s, minSelection: val } : s));
                          }}
                          className="w-14 bg-white border border-[#BABFC3] rounded-md px-2 py-1 text-center font-mono"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#6D7175]">Max Items:</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={step.maxSelection}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setSteps(steps.map(s => s.id === step.id ? { ...s, maxSelection: val } : s));
                          }}
                          className="w-14 bg-white border border-[#BABFC3] rounded-md px-2 py-1 text-center font-mono"
                        />
                      </div>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={step.isOptional}
                          onChange={e => {
                            const val = e.target.checked;
                            setSteps(steps.map(s => s.id === step.id ? { ...s, isOptional: val } : s));
                          }}
                          className="rounded text-[#008060] focus:ring-[#008060]"
                        />
                        <span className="text-[#4A4D4F]">Optional Step (Bonus gift or add-on)</span>
                      </label>
                    </div>

                    {/* Product Selection for this Step */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E1E3E5]">
                      <span className="text-[11px] font-bold text-[#202223]">Eligible Catalog Products in Step #{idx + 1}:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {MOCK_PRODUCTS.map(p => {
                          const isChecked = step.allowedProductIds.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleToggleProductInStep(step.id, p.id)}
                              className={`p-2 rounded-lg border text-left flex items-center space-x-2 transition-all ${
                                isChecked
                                  ? 'bg-white border-[#008060] shadow-xs text-[#008060]'
                                  : 'bg-white/60 border-[#E1E3E5] text-[#6D7175] hover:border-[#BABFC3]'
                              }`}
                            >
                              <img src={p.image} alt={p.title} className="h-8 w-8 rounded object-cover flex-shrink-0" />
                              <div className="truncate flex-1">
                                <div className="text-xs font-bold truncate text-[#202223]">{p.title}</div>
                                <div className="text-[10px] text-[#6D7175]">${p.price.toFixed(2)}</div>
                              </div>
                              {isChecked && <CheckCircle2 className="h-4 w-4 text-[#008060] flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Pricing & Tier Discounts */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 max-w-2xl">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#202223]">Discount Calculation Model:</label>
                <select
                  value={pricingType}
                  onChange={e => setPricingType(e.target.value as any)}
                  className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] shadow-xs"
                >
                  <option value="tiered_percentage">Progressive Volume Tiers (e.g. Buy 2 save 10%, Buy 3 save 20%)</option>
                  <option value="percentage_off_total">Flat Percentage Off Bundle Total (e.g. 20% OFF)</option>
                  <option value="fixed_discount_total">Flat Dollar Amount Off (e.g. $15 OFF)</option>
                  <option value="fixed_bundle_price">Fixed Box Price (e.g. Entire Box for $49.00)</option>
                </select>
              </div>

              {/* Tier Discounts Configurator */}
              {pricingType === 'tiered_percentage' && (
                <div className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#202223] flex items-center space-x-1.5">
                      <Percent className="h-4 w-4 text-[#008060]" />
                      <span>Volume Discount Milestones</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTier}
                      className="px-2.5 py-1 bg-white hover:bg-[#DEF8EE] text-[#008060] border border-[#008060]/30 rounded text-xs font-bold shadow-xs"
                    >
                      + Add Tier
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tieredDiscounts.map((tier, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-[#E1E3E5] shadow-xs text-xs">
                        <span className="text-[#6D7175] text-[11px] font-semibold">Min Qty:</span>
                        <input
                          type="number"
                          min={1}
                          value={tier.quantity}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setTieredDiscounts(tieredDiscounts.map((t, i) => i === idx ? { ...t, quantity: val } : t));
                          }}
                          className="w-14 bg-white border border-[#BABFC3] rounded px-2 py-1 text-center font-mono font-bold"
                        />
                        <span className="text-[#6D7175] text-[11px] font-semibold">Discount %:</span>
                        <input
                          type="number"
                          min={1}
                          max={90}
                          value={tier.discountPercentage}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setTieredDiscounts(tieredDiscounts.map((t, i) => i === idx ? { ...t, discountPercentage: val } : t));
                          }}
                          className="w-16 bg-white border border-[#BABFC3] rounded px-2 py-1 text-center font-mono font-bold text-[#008060]"
                        />
                        <input
                          type="text"
                          value={tier.label}
                          onChange={e => {
                            const val = e.target.value;
                            setTieredDiscounts(tieredDiscounts.map((t, i) => i === idx ? { ...t, label: val } : t));
                          }}
                          placeholder="Display label (e.g. Save 20%)"
                          className="flex-1 bg-white border border-[#BABFC3] rounded px-2.5 py-1 text-xs"
                        />
                        {tieredDiscounts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(idx)}
                            className="p-1 text-[#8C9196] hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pricingType === 'percentage_off_total' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#202223]">Discount Percentage (%):</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-32 bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs text-[#202223] font-mono font-bold"
                  />
                </div>
              )}

              {pricingType === 'fixed_bundle_price' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#202223]">Fixed Box Price ($):</label>
                  <input
                    type="number"
                    min={1}
                    value={fixedPrice}
                    onChange={e => setFixedPrice(Number(e.target.value))}
                    className="w-32 bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs text-[#202223] font-mono font-bold"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E1E3E5]">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#202223]">Total Minimum Box Items:</label>
                  <input
                    type="number"
                    min={1}
                    value={minItemsTotal}
                    onChange={e => setMinItemsTotal(Number(e.target.value))}
                    className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#202223]">Total Maximum Box Items:</label>
                  <input
                    type="number"
                    min={1}
                    value={maxItemsTotal}
                    onChange={e => setMaxItemsTotal(Number(e.target.value))}
                    className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Theme & Styling */}
          {activeTab === 'styling' && (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#202223]">Primary Accent Color:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={widgetStyling.primaryColor}
                      onChange={e => setWidgetStyling({ ...widgetStyling, primaryColor: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer border border-[#BABFC3]"
                    />
                    <input
                      type="text"
                      value={widgetStyling.primaryColor}
                      onChange={e => setWidgetStyling({ ...widgetStyling, primaryColor: e.target.value })}
                      className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-1 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#202223]">Default Layout Presentation:</label>
                  <select
                    value={widgetStyling.layout}
                    onChange={e => setWidgetStyling({ ...widgetStyling, layout: e.target.value as any })}
                    className="w-full bg-white border border-[#BABFC3] rounded-md px-3 py-1.5 text-xs text-[#202223]"
                  >
                    <option value="wizard_steps">Interactive Multi-Step Wizard</option>
                    <option value="grid">Expanded Product Grid</option>
                    <option value="sticky_bar">Sticky Bottom Bar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#202223]">Add to Cart Call-to-Action Text:</label>
                <input
                  type="text"
                  value={widgetStyling.ctaText}
                  onChange={e => setWidgetStyling({ ...widgetStyling, ctaText: e.target.value })}
                  className="w-full bg-white border border-[#BABFC3] rounded-md px-3.5 py-1.5 text-xs text-[#202223]"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E1E3E5] text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetStyling.showProgressBar}
                    onChange={e => setWidgetStyling({ ...widgetStyling, showProgressBar: e.target.checked })}
                    className="rounded text-[#008060] focus:ring-[#008060]"
                  />
                  <span>Show Dynamic Discount Milestone Progress Bar</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetStyling.enableConfetti}
                    onChange={e => setWidgetStyling({ ...widgetStyling, enableConfetti: e.target.checked })}
                    className="rounded text-[#008060] focus:ring-[#008060]"
                  />
                  <span>Trigger Confetti Celebration when max discount unlocked</span>
                </label>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-[#E1E3E5] flex items-center justify-between bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#F6F6F7] text-[#202223] border border-[#BABFC3] text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold rounded-md shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Save & Publish Wizard</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
