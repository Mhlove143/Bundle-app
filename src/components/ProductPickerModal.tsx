import React, { useState } from 'react';
import { Search, Check, X, Plus, Package, Store, RefreshCw } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product, variant: ProductVariant) => void;
  onOpenNewProductModal?: () => void;
  onOpenConnectStore?: () => void;
  currentShopName?: string;
  availableProducts: Product[];
  currencySymbol: string;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onOpenNewProductModal,
  onOpenConnectStore,
  currentShopName,
  availableProducts,
  currencySymbol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVariantMap, setActiveVariantMap] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(availableProducts.map(p => p.category)))];

  const filteredProducts = availableProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSelectedVariant = (product: Product): ProductVariant => {
    const variantId = activeVariantMap[product.id];
    if (variantId) {
      const found = product.variants.find(v => v.id === variantId);
      if (found) return found;
    }
    return product.variants[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#E1E3E5] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#008060]/10 flex items-center justify-center text-[#008060]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202223]">Select Product for Bundle</h3>
              <p className="text-xs text-[#6D7175]">Search and pick products from your connected store catalogue</p>
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
            <span>Store: <strong className="text-[#202223]">{currentShopName || 'Connected Store'}</strong> ({availableProducts.length} items)</span>
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

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-[#E1E3E5] space-y-3 bg-white">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9196]" />
              <input
                type="text"
                placeholder="Search by title, SKU, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#F6F6F7] border border-[#D2D5D8] rounded-xl focus:bg-white focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden transition-all"
              />
            </div>
            {onOpenNewProductModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewProductModal();
                }}
                className="px-3 py-2 bg-[#F6F6F7] hover:bg-[#E4E5E7] text-[#202223] rounded-xl text-xs font-bold border border-[#D2D5D8] flex items-center space-x-1.5 flex-shrink-0 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-[#008060]" />
                <span>+ Custom Product</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#202223] text-white shadow-xs'
                    : 'bg-[#F1F2F3] text-[#4A4D4F] hover:bg-[#E4E5E7]'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#F1F2F3]">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-[#8C9196]">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No products found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const selectedVar = getSelectedVariant(product);
              return (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 group">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-13 h-13 rounded-xl object-cover border border-[#E1E3E5] bg-[#FAFBFB] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#202223] truncate">{product.title}</h4>
                      <p className="text-xs text-[#6D7175] capitalize">{product.vendor} • {product.category}</p>
                      
                      {/* Variant selector if multiple */}
                      {product.variants.length > 1 ? (
                        <div className="mt-1 flex items-center space-x-1.5">
                          <span className="text-[11px] text-[#6D7175]">Variant:</span>
                          <select
                            value={selectedVar.id}
                            onChange={(e) => setActiveVariantMap(prev => ({ ...prev, [product.id]: e.target.value }))}
                            className="text-xs bg-[#F6F6F7] border border-[#D2D5D8] rounded-md px-2 py-0.5 font-medium text-[#202223] outline-hidden"
                          >
                            {product.variants.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.title} ({currencySymbol}{v.price.toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="inline-block mt-0.5 text-[11px] text-[#6D7175] bg-[#F1F2F3] px-2 py-0.5 rounded-md">
                          Default Variant
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#202223]">
                        {currencySymbol}{selectedVar.price.toFixed(2)}
                      </div>
                      {selectedVar.compareAtPrice && (
                        <div className="text-xs text-[#8C9196] line-through">
                          {currencySymbol}{selectedVar.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        onSelectProduct(product, selectedVar);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white rounded-xl font-semibold text-xs flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Bundle</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E1E3E5] bg-[#FAFBFB] flex items-center justify-between text-xs text-[#6D7175]">
          <span>Showing {filteredProducts.length} items from store inventory</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#D2D5D8] rounded-xl font-medium text-[#202223] hover:bg-[#F6F6F7] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
