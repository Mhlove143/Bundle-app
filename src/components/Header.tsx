import React from 'react';
import { 
  Package, 
  Sparkles, 
  Store, 
  Plus, 
  BarChart3, 
  Layers,
  Github,
  Zap,
  CheckCircle2,
  ExternalLink,
  Sliders,
  ShieldCheck,
  Share2,
  Users,
  ArrowLeftRight
} from 'lucide-react';
import { ShopifyStore, AppViewMode } from '../types';

interface HeaderProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  stores: ShopifyStore[];
  currentStore: ShopifyStore;
  onSelectStore: (store: ShopifyStore) => void;
  onOpenStoreModal: () => void;
  onOpenVercelModal: () => void;
  onOpenCreateBundle: () => void;
  onOpenAiModal: () => void;
  onOpenDistributionGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  stores,
  currentStore,
  onSelectStore,
  onOpenStoreModal,
  onOpenVercelModal,
  onOpenCreateBundle,
  onOpenAiModal,
  onOpenDistributionGuide
}) => {
  return (
    <header className="bg-white border-b border-[#E1E3E5] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & App Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-[#008060] flex items-center justify-center text-white font-bold shadow-xs transition-transform hover:scale-105">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-base sm:text-lg text-[#202223] tracking-tight">
                  BundleCraft Pro
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#DEF8EE] text-[#008060] border border-[#008060]/20 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-pulse"></span>
                  Shopify Plus & OS 2.0
                </span>
              </div>
              <p className="text-xs text-[#6D7175] hidden sm:block">
                {viewMode === 'admin_saas' 
                  ? 'SaaS Super Admin Platform & Global Feature Governance' 
                  : `Embedded App Dashboard • ${currentStore.shopName}`}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher: SaaS Owner vs Merchant Embedded Store View */}
          <div className="hidden lg:flex items-center bg-[#F1F2F3] p-1 rounded-xl border border-[#E1E3E5]">
            <button
              id="mode-switch-admin"
              onClick={() => setViewMode('admin_saas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'admin_saas'
                  ? 'bg-[#1e293b] text-white shadow-xs'
                  : 'text-[#4A4D4F] hover:text-[#202223] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>SaaS Super Admin</span>
            </button>

            <button
              id="mode-switch-merchant"
              onClick={() => setViewMode('store_embedded')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'store_embedded'
                  ? 'bg-white text-[#008060] shadow-xs border border-[#E1E3E5]'
                  : 'text-[#4A4D4F] hover:text-[#202223] hover:bg-white/60'
              }`}
            >
              <Store className="h-3.5 w-3.5 text-[#008060]" />
              <span>Merchant Store Embedded View</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Distribution & App Store Guide */}
            <button
              id="btn-header-distribution"
              onClick={onOpenDistributionGuide}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#DEF8EE] text-[#008060] border border-[#008060]/30 hover:bg-[#cbf1e2] transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="View Universal Distribution Link & App Store publish instructions"
            >
              <Share2 className="h-3.5 w-3.5 text-[#008060]" />
              <span className="hidden sm:inline font-bold">Universal Install Link</span>
            </button>

            {/* Git & Vercel Deployment Blueprint */}
            <button
              id="btn-open-vercel-modal"
              onClick={onOpenVercelModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-[#202223] border border-[#BABFC3] hover:bg-[#F6F6F7] transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="View Git CI/CD instructions and Vercel serverless deployment guides"
            >
              <Github className="h-3.5 w-3.5 text-[#4A4D4F]" />
              <span className="hidden sm:inline">Git & Vercel</span>
            </button>

            {/* Store Context Dropdown */}
            {viewMode === 'store_embedded' && (
              <div className="relative">
                <select
                  value={currentStore.id}
                  onChange={e => {
                    const found = stores.find(s => s.id === e.target.value);
                    if (found) onSelectStore(found);
                  }}
                  className="bg-white border border-[#008060]/40 rounded-lg px-2.5 py-1.5 text-xs text-[#008060] font-bold focus:outline-none focus:ring-1 focus:ring-[#008060] font-mono cursor-pointer shadow-xs"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>
                      🏬 {s.shopDomain}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile View Switcher */}
            <button
              onClick={() => setViewMode(viewMode === 'admin_saas' ? 'store_embedded' : 'admin_saas')}
              className="lg:hidden p-1.5 rounded-lg bg-[#F6F6F7] border border-[#BABFC3] text-[#202223] text-xs font-bold flex items-center gap-1"
              title="Toggle View Mode"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>{viewMode === 'admin_saas' ? 'Store View' : 'Admin'}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
