import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Sparkles, 
  Store, 
  Code2, 
  Eye, 
  Copy, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowUpRight,
  Filter,
  BarChart3,
  Sliders,
  Palette,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { Bundle, ShopifyStore, Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { LiveWidgetPreview } from './LiveWidgetPreview';

interface EmbeddedStoreDashboardProps {
  currentStore: ShopifyStore;
  bundles: Bundle[];
  onOpenCreateBundle: () => void;
  onEditBundle: (bundle: Bundle) => void;
  onDeleteBundle: (bundleId: string) => void;
  onDuplicateBundle: (bundle: Bundle) => void;
  onOpenEmbedModal: (bundle: Bundle) => void;
  onOpenAiModal: () => void;
  onSwitchToAdminView: () => void;
}

export function EmbeddedStoreDashboard({
  currentStore,
  bundles,
  onOpenCreateBundle,
  onEditBundle,
  onDeleteBundle,
  onDuplicateBundle,
  onOpenEmbedModal,
  onOpenAiModal,
  onSwitchToAdminView
}: EmbeddedStoreDashboardProps) {
  const [storeTab, setStoreTab] = useState<'wizards' | 'products' | 'theme_settings' | 'preview' | 'analytics'>('wizards');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Selected simulation bundle
  const [activePreviewBundleId, setActivePreviewBundleId] = useState<string>(bundles[0]?.id || '');

  // Filtered bundles for this store
  const filteredBundles = bundles.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || b.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const currentPreviewBundle = bundles.find(b => b.id === activePreviewBundleId) || bundles[0];

  return (
    <div className="space-y-6">
      
      {/* Native Shopify App Bridge Top Bar */}
      <div className="bg-white border border-[#E1E3E5] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onSwitchToAdminView}
            className="p-1.5 rounded-lg text-[#6D7175] hover:text-[#202223] hover:bg-[#F1F2F3] transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Return to SaaS Super Admin Control Panel"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to SaaS Admin</span>
          </button>

          <div className="h-4 w-px bg-[#E1E3E5]"></div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[#202223] flex items-center gap-1.5">
                <Store className="h-4 w-4 text-[#008060]" />
                <span>{currentStore.shopName}</span>
              </span>
              <span className="font-mono text-[11px] text-[#6D7175] bg-[#F6F6F7] px-2 py-0.5 rounded border border-[#E1E3E5]">
                {currentStore.shopDomain}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#DEF8EE] text-[#008060] rounded-full border border-[#008060]/30">
                {currentStore.plan} Plan
              </span>
            </div>
            <p className="text-[11px] text-[#6D7175] mt-0.5">
              Active Theme: <strong className="text-[#202223]">{currentStore.themeName}</strong> • Theme App Embed:{' '}
              <span className="text-[#008060] font-bold">Enabled (OS 2.0)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAiModal}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F6F6F7] text-[#202223] border border-[#BABFC3] hover:bg-white hover:border-[#008060] transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#008060]" />
            <span>AI Bundle Strategist</span>
          </button>

          <button
            id="btn-create-wizard-embedded"
            onClick={onOpenCreateBundle}
            className="px-3.5 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Bundle Wizard</span>
          </button>
        </div>
      </div>

      {/* Embedded Merchant Navigation Tabs */}
      <div className="flex border-b border-[#E1E3E5] space-x-4 text-xs font-bold overflow-x-auto pb-px">
        <button
          onClick={() => setStoreTab('wizards')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            storeTab === 'wizards'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Bundle Wizards ({bundles.length})</span>
        </button>

        <button
          onClick={() => setStoreTab('products')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            storeTab === 'products'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Store Products & Catalog ({MOCK_PRODUCTS.length})</span>
        </button>

        <button
          onClick={() => setStoreTab('theme_settings')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            storeTab === 'theme_settings'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Theme App Embed Settings</span>
        </button>

        <button
          onClick={() => setStoreTab('preview')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            storeTab === 'preview'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Storefront Simulator</span>
        </button>

        <button
          onClick={() => setStoreTab('analytics')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            storeTab === 'analytics'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Store Sales & AOV Lift</span>
        </button>
      </div>

      {/* TAB 1: BUNDLE WIZARDS LIST */}
      {storeTab === 'wizards' && (
        <div className="space-y-6">
          
          {/* Action Bar & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C9196]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bundle wizards by title or URL handle..."
                className="w-full bg-white border border-[#BABFC3] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#202223] placeholder-[#8C9196] focus:outline-none focus:border-[#008060]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="bg-white border border-[#BABFC3] rounded-lg px-3 py-1.5 text-xs text-[#202223] focus:outline-none focus:border-[#008060] font-medium cursor-pointer"
              >
                <option value="all">All Bundle Types</option>
                <option value="mix_match">Mix & Match Custom Box</option>
                <option value="volume_discount">Volume Tier Discount</option>
                <option value="frequently_bought_together">Frequently Bought Together</option>
                <option value="fixed_kit">Curated Kit</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-white border border-[#BABFC3] rounded-lg px-3 py-1.5 text-xs text-[#202223] focus:outline-none focus:border-[#008060] font-medium cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBundles.map(bundle => (
              <div
                key={bundle.id}
                className="bg-white rounded-xl border border-[#E1E3E5] hover:border-[#008060] transition-all shadow-xs hover:shadow-sm flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      bundle.status === 'active'
                        ? 'bg-[#DEF8EE] text-[#008060] border-[#008060]/20'
                        : bundle.status === 'draft'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {bundle.status}
                    </span>

                    <span className="text-[11px] font-semibold text-[#6D7175] capitalize">
                      {bundle.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#202223] group-hover:text-[#008060] transition-colors line-clamp-1">
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-[#6D7175] mt-1 line-clamp-2 leading-relaxed">
                      {bundle.description}
                    </p>
                  </div>

                  <div className="bg-[#F6F6F7] p-3 rounded-lg border border-[#E1E3E5] space-y-1.5 text-xs text-[#4A4D4F]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6D7175]">Steps in Flow:</span>
                      <span className="font-bold text-[#202223]">{bundle.steps.length} Steps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6D7175]">Box Limits:</span>
                      <span className="font-bold text-[#202223]">{bundle.minItemsTotal} to {bundle.maxItemsTotal} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6D7175]">Pricing Engine:</span>
                      <span className="font-bold text-[#008060] capitalize">
                        {bundle.pricingType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E1E3E5] text-center">
                    <div className="p-1.5 bg-white rounded border border-[#E1E3E5]">
                      <div className="text-[10px] text-[#6D7175]">Views</div>
                      <div className="text-xs font-mono font-bold text-[#202223]">{bundle.stats.views.toLocaleString()}</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-[#E1E3E5]">
                      <div className="text-[10px] text-[#6D7175]">Orders</div>
                      <div className="text-xs font-mono font-bold text-[#008060]">{bundle.stats.bundlesSold}</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-[#E1E3E5]">
                      <div className="text-[10px] text-[#6D7175]">Revenue</div>
                      <div className="text-xs font-mono font-bold text-[#202223]">${bundle.stats.totalRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-[#F6F6F7] border-t border-[#E1E3E5] flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setActivePreviewBundleId(bundle.id);
                      setStoreTab('preview');
                    }}
                    className="font-bold text-[#008060] hover:text-[#006e52] flex items-center space-x-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Preview</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onOpenEmbedModal(bundle)}
                      className="p-1.5 rounded-md text-[#4A4D4F] hover:text-[#202223] hover:bg-white border border-transparent hover:border-[#BABFC3] transition-all cursor-pointer"
                      title="Get Liquid Theme Code"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateBundle(bundle)}
                      className="p-1.5 rounded-md text-[#4A4D4F] hover:text-[#202223] hover:bg-white border border-transparent hover:border-[#BABFC3] transition-all cursor-pointer"
                      title="Duplicate Wizard"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEditBundle(bundle)}
                      className="p-1.5 rounded-md text-[#4A4D4F] hover:text-[#008060] hover:bg-white border border-transparent hover:border-[#BABFC3] transition-all cursor-pointer"
                      title="Edit Rules & Steps"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteBundle(bundle.id)}
                      className="p-1.5 rounded-md text-[#4A4D4F] hover:text-red-600 hover:bg-white border border-transparent hover:border-[#BABFC3] transition-all cursor-pointer"
                      title="Delete Bundle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: STORE PRODUCTS & CATALOG */}
      {storeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C9196]" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search synced store products by name, tag, or SKU..."
                className="w-full bg-white border border-[#BABFC3] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#202223] focus:outline-none focus:border-[#008060]"
              />
            </div>
            <div className="text-xs text-[#6D7175] flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5 text-[#008060]" />
              <span>Real-time Shopify Catalog Sync Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-[#E1E3E5] p-4 shadow-xs flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-[#E1E3E5] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#202223] truncate">{product.title}</div>
                  <div className="text-[11px] text-[#6D7175] capitalize">{product.category} • {product.variants.length} Variants</div>
                  <div className="text-xs font-mono font-bold text-[#008060] mt-1">${product.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: THEME APP EMBED SETTINGS */}
      {storeTab === 'theme_settings' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-[#E1E3E5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202223] flex items-center gap-2">
                  <Palette className="h-4 w-4 text-[#008060]" />
                  <span>Shopify Online Store 2.0 Theme App Extension</span>
                </h3>
                <p className="text-xs text-[#6D7175] mt-0.5">
                  Manage how bundle widgets seamlessly integrate into your storefront without editing code
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-[#DEF8EE] text-[#008060] rounded-full border border-[#008060]/30">
                Extension Live in Dawn Theme
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] space-y-2">
                <div className="font-bold text-[#202223]">1. App Embed Block Status:</div>
                <p className="text-[#6D7175] text-[11px] leading-relaxed">
                  The BundleCraft App Embed is active in your Shopify theme customizer. You can add it as an app block on any product page template.
                </p>
                <button
                  onClick={() => alert('Opening Shopify Theme Editor in modal... (Simulated)')}
                  className="px-3 py-1.5 bg-white border border-[#BABFC3] text-[#202223] font-bold rounded-md hover:bg-[#F6F6F7] text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Shopify Theme Customizer</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="p-4 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] space-y-2">
                <div className="font-bold text-[#202223]">2. Native Liquid Snippet Integration:</div>
                <p className="text-[#6D7175] text-[11px] leading-relaxed">
                  For vintage themes or custom headless storefronts, paste the Liquid snippet inside your template:
                </p>
                <div className="p-2 bg-white rounded border border-[#E1E3E5] font-mono text-[10px] text-[#008060]">
                  {`{% render 'bundle-wizard', bundle_id: 'bundle_1' %}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STOREFRONT SIMULATOR */}
      {storeTab === 'preview' && currentPreviewBundle && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#202223]">Active Simulation Wizard:</span>
              <select
                value={activePreviewBundleId}
                onChange={e => setActivePreviewBundleId(e.target.value)}
                className="bg-[#F6F6F7] border border-[#BABFC3] rounded-md px-3 py-1 text-xs text-[#202223] font-bold focus:outline-none focus:border-[#008060]"
              >
                {bundles.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.type})</option>
                ))}
              </select>
            </div>
            <div className="text-xs text-[#6D7175] flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#008060]"></span>
              <span>Interactive Customer View Simulation</span>
            </div>
          </div>

          <LiveWidgetPreview
            bundle={currentPreviewBundle}
            onEditBundle={b => onEditBundle(b)}
            onOpenEmbedModal={b => onOpenEmbedModal(b)}
          />
        </div>
      )}

      {/* TAB 5: STORE SALES ANALYTICS */}
      {storeTab === 'analytics' && (
        <AnalyticsDashboard bundles={bundles} />
      )}

    </div>
  );
}
