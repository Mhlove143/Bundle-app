import React, { useState } from 'react';
import { Sparkles, Plus, X, Package, Check, Tag, Store, RefreshCw } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface CreateBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBundle: (bundleName: string, selectedProducts: { product: Product; variant: ProductVariant }[], discountPercentage: number) => void;
  availableProducts: Product[];
  currencySymbol: string;
  onOpenConnectStore?: () => void;
  onOpenNewProduct?: () => void;
  currentShopName?: string;
}

export const CreateBundleModal: React.FC<CreateBundleModalProps> = ({
  isOpen,
  onClose,
  onCreateBundle,
  availableProducts,
  currencySymbol,
  onOpenConnectStore,
  onOpenNewProduct,
  currentShopName
}) => {
  const [bundleName, setBundleName] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleName.trim()) {
      setError('Please provide a bundle name');
      return;
    }
    if (selectedProductIds.length === 0) {
      setError('Please select at least one product for this bundle');
      return;
    }

    const itemsToBundle = selectedProductIds.map(id => {
      const prod = availableProducts.find(p => p.id === id)!;
      return {
        product: prod,
        variant: prod.variants[0]
      };
    });

    onCreateBundle(bundleName.trim(), itemsToBundle, discountPercent);
    setBundleName('');
    setSelectedProductIds([]);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E1E3E5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#008060]/10 flex items-center justify-center text-[#008060]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202223]">Create New Bundle Tier</h3>
              <p className="text-xs text-[#6D7175]">Define custom name, bundled products, and tiered discount</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6D7175] hover:text-[#202223] hover:bg-[#E4E5E7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store banner reminder */}
        <div className="bg-[#FAFBFB] px-6 py-2.5 border-b border-[#E1E3E5] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#4A4D4F]">
            <Store className="w-3.5 h-3.5 text-[#008060]" />
            <span>Store Products: <strong className="text-[#202223]">{currentShopName || 'Connected Store'}</strong></span>
          </div>
          {onOpenConnectStore && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenConnectStore();
              }}
              className="text-xs text-[#008060] font-bold hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Connect / Sync My Store</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Bundle Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202223]">
              Bundle Name / Offer Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={bundleName}
              onChange={(e) => {
                setBundleName(e.target.value);
                setError(null);
              }}
              placeholder="e.g. VIP Glow Set, Summer Duo Pack, Anti-Aging Trio"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
            />
          </div>

          {/* Discount Percentage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202223]">
              Default Tier Discount Rate (%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-28 px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
              />
              <span className="text-xs text-[#6D7175] font-medium">% off all selected bundle items</span>
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-2 pt-2 border-t border-[#F1F2F3]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#202223]">
                Select Products to Include ({selectedProductIds.length} chosen)
              </label>
              <div className="flex items-center space-x-2">
                {onOpenNewProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenNewProduct();
                    }}
                    className="text-[11px] text-[#008060] font-bold hover:underline"
                  >
                    + Custom Product
                  </button>
                )}
                <span className="text-[11px] text-[#6D7175]">Click to select/deselect</span>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {availableProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#DEF8EE]/40 border-[#008060] ring-1 ring-[#008060]'
                        : 'bg-white border-[#E1E3E5] hover:border-[#C9CCCF]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-[#008060] border-[#008060] text-white' : 'border-[#C9CCCF] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E1E3E5] bg-white flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#202223] truncate">{product.title}</h4>
                        <p className="text-[11px] text-[#6D7175]">{product.category} • {currencySymbol}{product.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-[#202223]">
                      {currencySymbol}{product.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-[#E1E3E5] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#D2D5D8] rounded-xl text-xs font-semibold text-[#202223] hover:bg-[#F6F6F7] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Bundle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
