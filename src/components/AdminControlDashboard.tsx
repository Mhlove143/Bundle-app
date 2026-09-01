import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  Store, 
  Users, 
  Sparkles, 
  Layers, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  ExternalLink, 
  ArrowRight, 
  Search, 
  Settings, 
  Share2, 
  Key, 
  RefreshCw,
  TrendingUp,
  Cpu,
  ShoppingBag,
  Zap,
  Lock,
  Edit2
} from 'lucide-react';
import { ShopifyStore, GlobalFeatureFlag } from '../types';

interface AdminControlDashboardProps {
  stores: ShopifyStore[];
  features: GlobalFeatureFlag[];
  onToggleFeature: (featureId: string) => void;
  onUpdateStorePlan: (storeId: string, plan: 'Starter' | 'Growth Pro' | 'Enterprise Plus') => void;
  onToggleStoreStatus: (storeId: string) => void;
  onSwitchToMerchantView: (store: ShopifyStore) => void;
  onOpenDistributionGuide: () => void;
  onAddNewStore: (newStore: ShopifyStore) => void;
}

export function AdminControlDashboard({
  stores,
  features,
  onToggleFeature,
  onUpdateStorePlan,
  onToggleStoreStatus,
  onSwitchToMerchantView,
  onOpenDistributionGuide,
  onAddNewStore
}: AdminControlDashboardProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'stores' | 'telemetry'>('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  // New store form state
  const [newShopDomain, setNewShopDomain] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Growth Pro' | 'Enterprise Plus'>('Growth Pro');

  // Platform Aggregate Metrics
  const totalGmv = stores.reduce((acc, s) => acc + s.totalGmv, 0);
  const totalOrders = stores.reduce((acc, s) => acc + s.monthlyOrders, 0);
  const totalBundles = stores.reduce((acc, s) => acc + s.bundlesCount, 0);
  const activeStoresCount = stores.filter(s => s.status === 'active').length;

  const filteredStores = stores.filter(s => 
    s.shopDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeatures = features.filter(f => 
    selectedCategory === 'all' || f.category === selectedCategory
  );

  const handleCreateStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopDomain) return;

    const formattedDomain = newShopDomain.includes('.myshopify.com') 
      ? newShopDomain.trim() 
      : `${newShopDomain.trim()}.myshopify.com`;

    const newStoreObj: ShopifyStore = {
      id: `store_${Date.now()}`,
      shopDomain: formattedDomain,
      shopName: formattedDomain.replace('.myshopify.com', '').replace(/-/g, ' ').toUpperCase(),
      ownerName: newOwnerName || 'Store Admin',
      ownerEmail: newOwnerEmail || `admin@${formattedDomain.replace('.myshopify.com', '')}.com`,
      plan: newPlan,
      status: 'active',
      isConnected: true,
      installedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      accessToken: `shpua_live_${Math.random().toString(36).substring(2, 12)}`,
      currency: 'USD',
      currencySymbol: '$',
      themeName: 'Dawn (OS 2.0 Live)',
      themeEmbedActive: true,
      bundlesCount: 2,
      totalGmv: 4500.00,
      monthlyOrders: 65,
      checkoutEngine: 'cart_transform_api'
    };

    onAddNewStore(newStoreObj);
    setIsAddStoreModalOpen(false);
    setNewShopDomain('');
    setNewOwnerName('');
    setNewOwnerEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Mode Banner */}
      <div className="bg-[#1e293b] text-white p-6 rounded-2xl border border-slate-700 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SaaS Super Admin Control Center
              </span>
              <span className="text-xs text-slate-400">Owner Level Access</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Global Platform Governance & Feature Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage global SaaS feature flags, monitor installed merchant stores and user subscriptions, or drill down directly into any store’s embedded dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              id="btn-open-distribution-guide"
              onClick={onOpenDistributionGuide}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Universal Install Link Guide</span>
            </button>
            <button
              id="btn-add-merchant-store"
              onClick={() => setIsAddStoreModalOpen(true)}
              className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl border border-slate-600 shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Register Merchant Store</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold">Installed Stores</span>
            <Store className="h-4 w-4 text-[#008060]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-[#202223]">{stores.length}</span>
            <span className="text-[11px] text-emerald-700 font-bold bg-[#DEF8EE] px-1.5 py-0.5 rounded">
              {activeStoresCount} Active
            </span>
          </div>
          <p className="text-[11px] text-[#6D7175]">Live connected Shopify stores</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold">Total Platform GMV</span>
            <DollarSign className="h-4 w-4 text-[#008060]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-[#202223]">${totalGmv.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-700 font-bold bg-[#DEF8EE] px-1.5 py-0.5 rounded">
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-[#6D7175]">Processed through bundle widgets</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold">Active Bundle Wizards</span>
            <Layers className="h-4 w-4 text-[#008060]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-[#202223]">{totalBundles}</span>
            <span className="text-[11px] text-slate-700 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
              {totalOrders.toLocaleString()} Orders
            </span>
          </div>
          <p className="text-[11px] text-[#6D7175]">Published across all merchant stores</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold">Global App Health</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">99.98%</span>
            <span className="text-[11px] text-emerald-700 font-bold bg-[#DEF8EE] px-1.5 py-0.5 rounded">
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-[#6D7175]">GraphQL API & Webhook uptime</p>
        </div>

      </div>

      {/* Main Admin Tabs */}
      <div className="flex border-b border-[#E1E3E5] space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('features')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'features'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Global Feature Flags ({features.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'stores'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Merchant Stores & User Accounts ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'telemetry'
              ? 'border-[#008060] text-[#008060]'
              : 'border-transparent text-[#6D7175] hover:text-[#202223]'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Serverless Telemetry & Webhooks</span>
        </button>
      </div>

      {/* TAB 1: GLOBAL FEATURE FLAGS MATRIX */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          
          {/* Category Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#202223]">Feature Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[#F6F6F7] border border-[#BABFC3] rounded-lg px-3 py-1 text-xs text-[#202223] font-medium focus:outline-none focus:border-[#008060]"
              >
                <option value="all">All SaaS Capabilities</option>
                <option value="ai">AI Co-Pilot & Strategist</option>
                <option value="engine">Bundling Engines & Functions</option>
                <option value="theme">Theme App Extensions</option>
                <option value="billing">Multi-Currency & Billing</option>
              </select>
            </div>

            <div className="text-xs text-[#6D7175]">
              Master switches instantly enable or disable features for connected merchants in real-time.
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeatures.map(feature => (
              <div 
                key={feature.id}
                className="bg-white rounded-xl border border-[#E1E3E5] p-5 shadow-xs hover:border-[#008060]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#202223]">{feature.name}</h3>
                        {feature.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DEF8EE] text-[#008060] border border-[#008060]/20">
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6D7175] mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Master Feature Toggle Switch */}
                    <button
                      onClick={() => onToggleFeature(feature.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        feature.isEnabled ? 'bg-[#008060]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          feature.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#E1E3E5] flex items-center justify-between text-xs">
                    <span className="text-[#6D7175]">Allowed Tier Access:</span>
                    <div className="flex items-center gap-1.5">
                      {feature.allowedPlans.map(plan => (
                        <span key={plan} className="px-2 py-0.5 bg-[#F6F6F7] text-[#202223] rounded font-semibold text-[10px] border border-[#E1E3E5]">
                          {plan}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: MERCHANT STORES & USER ACCOUNTS */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          
          {/* Search & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E1E3E5] shadow-xs">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C9196]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by store domain, owner, or email..."
                className="w-full bg-white border border-[#BABFC3] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#202223] placeholder-[#8C9196] focus:outline-none focus:border-[#008060]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddStoreModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Merchant Store</span>
              </button>
            </div>
          </div>

          {/* Stores Table */}
          <div className="bg-white rounded-xl border border-[#E1E3E5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6F6F7] text-[#4A4D4F] border-b border-[#E1E3E5] font-bold">
                  <tr>
                    <th className="py-3 px-4">Store Domain & Name</th>
                    <th className="py-3 px-4">Merchant Account</th>
                    <th className="py-3 px-4">Subscription Plan</th>
                    <th className="py-3 px-4">Active Bundles</th>
                    <th className="py-3 px-4">Store GMV</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E3E5]">
                  {filteredStores.map(store => (
                    <tr key={store.id} className="hover:bg-[#F6F6F7]/60 transition-colors">
                      
                      {/* Store Domain */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#202223] flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 text-[#008060]" />
                          <span>{store.shopName}</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#6D7175] mt-0.5">
                          {store.shopDomain}
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#202223]">{store.ownerName}</div>
                        <div className="text-[11px] text-[#6D7175]">{store.ownerEmail}</div>
                      </td>

                      {/* Plan Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={store.plan}
                          onChange={e => onUpdateStorePlan(store.id, e.target.value as any)}
                          className="bg-white border border-[#BABFC3] rounded-md px-2 py-1 text-[11px] font-bold text-[#202223] focus:outline-none focus:border-[#008060] cursor-pointer"
                        >
                          <option value="Starter">Starter ($19/mo)</option>
                          <option value="Growth Pro">Growth Pro ($49/mo)</option>
                          <option value="Enterprise Plus">Enterprise Plus ($99/mo)</option>
                        </select>
                      </td>

                      {/* Bundles */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#202223]">{store.bundlesCount}</span>
                        <span className="text-[11px] text-[#6D7175] ml-1">Wizards</span>
                      </td>

                      {/* GMV */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#008060]">${store.totalGmv.toLocaleString()}</div>
                        <div className="text-[10px] text-[#6D7175]">{store.monthlyOrders} orders</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          store.status === 'active' 
                            ? 'bg-[#DEF8EE] text-[#008060]' 
                            : store.status === 'trial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {store.status}
                        </span>
                      </td>

                      {/* Drill-Down Action: Launch Merchant Embedded App View */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`btn-open-store-${store.id}`}
                          onClick={() => onSwitchToMerchantView(store)}
                          className="px-3 py-1.5 bg-[#DEF8EE] hover:bg-[#008060] text-[#008060] hover:text-white font-bold text-xs rounded-lg transition-all border border-[#008060]/30 inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                          title="Open embedded merchant dashboard for this store"
                        >
                          <span>Open Store App</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SERVERLESS TELEMETRY & API HEALTH */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
              <div className="text-xs font-bold text-[#202223] flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-[#008060]" />
                <span>Shopify GraphQL Admin Latency</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#202223]">42ms avg</div>
              <p className="text-[11px] text-[#6D7175]">Under 100ms standard SLA</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
              <div className="text-xs font-bold text-[#202223] flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-600" />
                <span>Gemini 2.5 Flash Token Quota</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#202223]">1.2M / 10M</div>
              <p className="text-[11px] text-[#6D7175]">Automatic rate limit smoothing active</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs space-y-2">
              <div className="text-xs font-bold text-[#202223] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#008060]" />
                <span>Shopify Webhook Subscriptions</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#008060]">100% Synced</div>
              <p className="text-[11px] text-[#6D7175]">app/uninstalled, orders/create listening</p>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Add New Merchant Store */}
      {isAddStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E1E3E5] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-3">
              <h3 className="font-bold text-sm text-[#202223] flex items-center gap-2">
                <Store className="h-4 w-4 text-[#008060]" />
                <span>Register New Merchant Store</span>
              </h3>
              <button onClick={() => setIsAddStoreModalOpen(false)} className="text-[#6D7175] hover:text-[#202223]">✕</button>
            </div>

            <form onSubmit={handleCreateStoreSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#202223] mb-1">Shopify Store Domain (required):</label>
                <input
                  type="text"
                  required
                  value={newShopDomain}
                  onChange={e => setNewShopDomain(e.target.value)}
                  placeholder="brandname.myshopify.com"
                  className="w-full bg-white border border-[#BABFC3] rounded-lg px-3 py-2 text-xs font-mono text-[#202223] focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202223] mb-1">Merchant Owner Name:</label>
                <input
                  type="text"
                  value={newOwnerName}
                  onChange={e => setNewOwnerName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-white border border-[#BABFC3] rounded-lg px-3 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202223] mb-1">Merchant Contact Email:</label>
                <input
                  type="email"
                  value={newOwnerEmail}
                  onChange={e => setNewOwnerEmail(e.target.value)}
                  placeholder="e.g. alex@brandname.com"
                  className="w-full bg-white border border-[#BABFC3] rounded-lg px-3 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202223] mb-1">Subscription Plan:</label>
                <select
                  value={newPlan}
                  onChange={e => setNewPlan(e.target.value as any)}
                  className="w-full bg-white border border-[#BABFC3] rounded-lg px-3 py-2 text-xs font-bold text-[#202223] focus:outline-none focus:border-[#008060]"
                >
                  <option value="Starter">Starter Plan ($19/mo)</option>
                  <option value="Growth Pro">Growth Pro Plan ($49/mo)</option>
                  <option value="Enterprise Plus">Enterprise Plus ($99/mo)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E1E3E5] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddStoreModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-[#BABFC3] text-[#202223] font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#008060] hover:bg-[#006e52] text-white font-bold rounded-lg shadow-xs"
                >
                  Register Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
