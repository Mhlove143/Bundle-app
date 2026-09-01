import React, { useState } from 'react';
import { Plus, X, Package, Image as ImageIcon, DollarSign } from 'lucide-react';
import { Product } from '../types';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStoreProduct: (newProduct: Product) => void;
  currencySymbol: string;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddStoreProduct,
  currencySymbol
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Skincare');
  const [price, setPrice] = useState('45.00');
  const [comparePrice, setComparePrice] = useState('55.00');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80');
  const [variantTitle, setVariantTitle] = useState('Standard Size');
  const [vendor, setVendor] = useState('Lumé Skincare');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const numPrice = parseFloat(price) || 20;
    const numCompare = parseFloat(comparePrice) || numPrice * 1.2;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      title: title.trim(),
      handle: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      vendor: vendor.trim() || 'Custom Store',
      category: category.trim() || 'Skincare',
      price: numPrice,
      compareAtPrice: numCompare,
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      description: 'Dynamic custom product created for store inventory & bundle offers.',
      tags: ['custom', 'storefront', 'new-product'],
      variants: [
        {
          id: `var_${Date.now()}`,
          title: variantTitle.trim() || 'Default Variant',
          price: numPrice,
          compareAtPrice: numCompare,
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          available: true
        }
      ]
    };

    onAddStoreProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#E1E3E5] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#008060]/10 flex items-center justify-center text-[#008060]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202223]">Add New Product to Store</h3>
              <p className="text-xs text-[#6D7175]">Create a custom product to use dynamically in any bundle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6D7175] hover:text-[#202223] hover:bg-[#E4E5E7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202223]">Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hydro-Gel Sunscreen SPF 50"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202223]">Price ({currencySymbol}) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202223]">Compare Price ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202223]">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Skincare / Cleansers"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202223]">Variant Name</label>
              <input
                type="text"
                value={variantTitle}
                onChange={(e) => setVariantTitle(e.target.value)}
                placeholder="e.g. 50ml Tube"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202223]">Image URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden text-[#202223]"
              />
              <img src={imageUrl} alt="Preview" className="w-9 h-9 rounded-lg object-cover border border-[#E1E3E5] flex-shrink-0" />
            </div>
          </div>

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
              <span>Add to Catalogue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
