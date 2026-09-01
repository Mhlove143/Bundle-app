import React, { useState } from 'react';
import { ShoppingBag, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, X, Store, Key, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ConnectStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShop: string;
  onStoreConnected: (shopDomain: string, products: Product[], currencyCode?: string) => void;
}

export const ConnectStoreModal: React.FC<ConnectStoreModalProps> = ({
  isOpen,
  onClose,
  currentShop,
  onStoreConnected
}) => {
  const [shopDomain, setShopDomain] = useState(currentShop || '');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!shopDomain.trim()) {
      setError('Please enter your Shopify store domain (e.g., my-store.myshopify.com)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessCount(null);

    const cleanDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const res = await fetch('/api/shopify/sync-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop: cleanDomain,
          accessToken: accessToken.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to sync store products. Please check the domain.');
      }

      if (!data.products || data.products.length === 0) {
        throw new Error(`Connected to ${cleanDomain}, but no products were found in the store catalog.`);
      }

      setSuccessCount(data.products.length);
      setTimeout(() => {
        onStoreConnected(cleanDomain, data.products);
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error fetching store products');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset real public test stores
  const quickDemoStores = [
    { name: 'Gymshark Demo', domain: 'gymshark.com' },
    { name: 'Allbirds Demo', domain: 'allbirds.com' },
    { name: 'Kylie Cosmetics', domain: 'kyliecosmetics.com' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#E1E3E5] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#008060]/10 flex items-center justify-center text-[#008060]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202223]">Connect Your Shopify Store</h3>
              <p className="text-xs text-[#6D7175]">Sync and use your actual live store products in Bundlex</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6D7175] hover:text-[#202223] hover:bg-[#E4E5E7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSync} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successCount !== null && (
            <div className="p-3 bg-[#DEF8EE] border border-[#008060]/30 rounded-xl text-xs text-[#008060] font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully synced {successCount} products from your store!</span>
            </div>
          )}

          {/* Store Domain Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#202223] flex items-center justify-between">
              <span>Your Shopify Store Domain <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-[#6D7175] font-normal">e.g. yourbrand.myshopify.com or custom domain</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={shopDomain}
                onChange={(e) => {
                  setShopDomain(e.target.value);
                  setError(null);
                }}
                placeholder="mystore.myshopify.com"
                className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
              />
              <ShoppingBag className="w-4 h-4 text-[#8C9196] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Optional Admin / Storefront Access Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#202223]">
                Shopify Access Token <span className="text-[11px] font-normal text-[#6D7175]">(Optional for private/draft products)</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxxx or leave blank for live public products"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden text-[#202223]"
              />
              <Key className="w-4 h-4 text-[#8C9196] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Quick presets for testing live syncing */}
          <div className="pt-2 border-t border-[#F1F2F3] space-y-2">
            <span className="text-[11px] font-bold text-[#6D7175] uppercase tracking-wider">
              Or test with popular live Shopify stores:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickDemoStores.map((demo) => (
                <button
                  key={demo.domain}
                  type="button"
                  onClick={() => {
                    setShopDomain(demo.domain);
                    setError(null);
                  }}
                  className="px-2.5 py-1 text-xs bg-[#F6F6F7] hover:bg-[#E4E5E7] text-[#202223] rounded-lg border border-[#D2D5D8] transition-all font-medium"
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
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
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#008060] hover:bg-[#006e52] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-2 active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing Products...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Store Products</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
