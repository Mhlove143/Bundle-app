import React, { useState } from 'react';
import { 
  ShoppingBag, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Store, 
  Zap, 
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'sync_products' | 'auto_activate'>('sync_products');
  const [shopDomain, setShopDomain] = useState(currentShop || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Auto-activation states
  const [isActivating, setIsActivating] = useState(false);
  const [activateSuccess, setActivateSuccess] = useState<string | null>(null);
  const [activateError, setActivateError] = useState<string | null>(null);
  const [oauthInstallUrl, setOauthInstallUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Sync Products (Exclusively from the target shop - No manual token needed)
  const handleSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!shopDomain.trim()) {
      setError('Please enter your Shopify store domain (e.g., your-store.myshopify.com)');
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
          shop: cleanDomain
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to sync store products. Please check the domain.');
      }

      if (!data.products || data.products.length === 0) {
        throw new Error(`Connected to ${cleanDomain}, but no products were found. Please make sure products are published in your Shopify store.`);
      }

      setSuccessCount(data.products.length);
      setTimeout(() => {
        onStoreConnected(cleanDomain, data.products);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Error fetching store products');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 1-Click No-CLI Auto Activation (ScriptTag API using Vercel Server secrets)
  const handleAutoActivate = async () => {
    if (!shopDomain.trim()) {
      setActivateError('Please enter your Shopify store domain first.');
      return;
    }

    setIsActivating(true);
    setActivateError(null);
    setActivateSuccess(null);
    setOauthInstallUrl(null);

    const cleanDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const res = await fetch('/api/shopify/auto-activate-scripttag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop: cleanDomain
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if (data.requiresAuth && data.authUrl) {
          setOauthInstallUrl(data.authUrl);
          throw new Error(data.error || 'App needs 1-click authorization on this store.');
        }
        throw new Error(data.error || 'Auto-activation failed');
      }

      setActivateSuccess(data.message || `🎉 Successfully auto-activated Bundlex on ${cleanDomain}!`);
    } catch (err: any) {
      setActivateError(err.message || 'Auto-activation failed');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E1E3E5] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#FAFBFB]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#008060]/10 flex items-center justify-center text-[#008060]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202223]">Shopify Store Integration</h3>
              <p className="text-xs text-[#6D7175]">Sync store products & 1-click No-CLI auto-activation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6D7175] hover:text-[#202223] hover:bg-[#E4E5E7] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E1E3E5] bg-[#F6F6F7] px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('sync_products')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'sync_products'
                ? 'border-[#008060] text-[#008060]'
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Store Products (Isolated)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('auto_activate')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'auto_activate'
                ? 'border-[#008060] text-[#008060]'
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ No-CLI Auto-Activation</span>
          </button>
        </div>

        {/* Tab 1: Sync Real Products */}
        {activeTab === 'sync_products' && (
          <form onSubmit={handleSync} className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Sync Notice:</strong> {error}
                </div>
              </div>
            )}

            {successCount !== null && (
              <div className="p-3.5 bg-[#DEF8EE] border border-[#008060]/30 rounded-xl text-xs text-[#008060] font-bold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully synced {successCount} products exclusively from your store!</span>
              </div>
            )}

            <div className="bg-[#FAFBFB] p-3.5 rounded-xl border border-[#E1E3E5] text-xs text-[#4A4D4F] space-y-1">
              <p className="font-bold text-[#202223] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#008060]" />
                Zero-Config Product Import:
              </p>
              <p>আপনার Vercel ব্যাকএন্ডের মাধ্যমে সরাসরি আপনার শপিফাই স্টোরের সব লাইভ প্রোডাক্ট স্বয়ংক্রিয়ভাবে ইমপোর্ট হয়ে যাবে। কোনো ডেমো প্রোডাক্ট আর থাকবে না।</p>
            </div>

            {/* Store Domain Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202223] flex items-center justify-between">
                <span>Shopify Store Domain <span className="text-red-500">*</span></span>
                <span className="text-[11px] text-[#6D7175] font-normal">e.g. glow-beauty.myshopify.com</span>
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
                  placeholder="glow-beauty.myshopify.com"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 outline-hidden font-medium text-[#202223]"
                />
                <ShoppingBag className="w-4 h-4 text-[#8C9196] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-[#6D7175] bg-[#F6F6F7] p-2.5 rounded-lg border border-[#E1E3E5]">
              <ShieldCheck className="w-4 h-4 text-[#008060] flex-shrink-0" />
              <span>Vercel সার্ভার এনভায়রনমেন্ট কনফিগারেশন থেকে সিকিউর সংযোগ পরিচালিত হচ্ছে।</span>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E1E3E5] flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#D2D5D8] rounded-xl text-xs font-semibold text-[#202223] hover:bg-[#F6F6F7] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-[#008060] hover:bg-[#006e52] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing Products...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Import My Store Products</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: 1-Click No-CLI Auto-Activation */}
        {activeTab === 'auto_activate' && (
          <div className="p-6 space-y-4">
            <div className="bg-[#DEF8EE]/60 border border-[#008060]/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Shopify REST ScriptTag Auto-Injector (Zero CLI)</span>
              </div>
              <p className="text-xs text-[#202223] leading-relaxed">
                কোনো ম্যানুয়াল টোকেন টাইপ বা Shopify CLI কমান্ড ছাড়াই সরাসরি আপনার Vercel সার্ভারের মাধ্যমে প্রোডাক্ট পেজে বান্ডেল উইজেটটি ১-ক্লিকে সক্রিয় করুন।
              </p>
            </div>

            {activateError && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2.5">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>{activateError}</div>
                </div>
                {oauthInstallUrl && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <a
                      href={oauthInstallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>১-ক্লিকে Shopify-তে Install & Authorize করুন</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {activateSuccess && (
              <div className="p-3.5 bg-[#DEF8EE] border border-[#008060]/30 rounded-xl text-xs text-[#008060] font-bold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>{activateSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#202223]">Target Shopify Store Domain</label>
              <input
                type="text"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                placeholder="glow-beauty.myshopify.com"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D2D5D8] rounded-xl focus:border-[#008060] outline-hidden text-[#202223]"
              />
            </div>

            <div className="bg-[#FAFBFB] p-3 rounded-xl border border-[#E1E3E5] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[#202223] font-semibold">Vercel Backend Server Ready</span>
              </div>
              <span className="text-[#6D7175] text-[11px]">Automatic REST Auth</span>
            </div>

            <div className="pt-3 border-t border-[#E1E3E5] flex items-center justify-between">
              <span className="text-[11px] text-[#6D7175]">100% Free & No CLI Required</span>
              <button
                type="button"
                onClick={handleAutoActivate}
                disabled={isActivating}
                className="px-5 py-2.5 bg-[#008060] hover:bg-[#006e52] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                {isActivating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auto-Injecting to Store...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>⚡ 1-Click Auto-Activate on Live Store</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
