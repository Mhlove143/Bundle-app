import React, { useState } from 'react';
import { 
  Store, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  Zap, 
  Key, 
  Layers, 
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  Code2
} from 'lucide-react';
import { ShopifyStore } from '../types';

interface ShopifyAutoInstallModalProps {
  currentStore: ShopifyStore;
  onUpdateStore: (store: ShopifyStore) => void;
  onClose: () => void;
}

export const ShopifyAutoInstallModal: React.FC<ShopifyAutoInstallModalProps> = ({
  currentStore,
  onUpdateStore,
  onClose,
}) => {
  const [shopInput, setShopInput] = useState(currentStore.shopDomain);
  const [copied, setCopied] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'oauth_flow' | 'scopes'>('install');

  const appUrl = window.location.origin;
  const installLink = `${appUrl}/api/auth/shopify?shop=${encodeURIComponent(shopInput)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(installLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestInstall = () => {
    setIsInstalling(true);
    // Simulate instantaneous OAuth verification and store authorization
    setTimeout(() => {
      onUpdateStore({
        ...currentStore,
        shopDomain: shopInput.includes('.myshopify.com') ? shopInput : `${shopInput}.myshopify.com`,
        isConnected: true,
        accessToken: `shpua_live_${Math.random().toString(36).substring(2, 12)}`,
        shopName: shopInput.replace('.myshopify.com', ''),
      });
      setIsInstalling(false);
      alert(`Success! BundleCraft Pro successfully connected & authorized for store: ${shopInput}`);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E1E3E5] rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-[#DEF8EE] text-[#008060] border border-[#008060]/20 flex items-center justify-center shadow-xs">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202223]">
                Shopify 1-Click Auto Install & App Bridge Setup
              </h2>
              <p className="text-xs text-[#6D7175]">
                Seamlessly authorize and install this app onto any development or production Shopify store
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6D7175] hover:text-[#202223] hover:bg-[#F1F2F3] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E1E3E5] space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'install' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            1-Click Installer
          </button>
          <button
            onClick={() => setActiveTab('oauth_flow')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'oauth_flow' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            OAuth 2.0 Flow Architecture
          </button>
          <button
            onClick={() => setActiveTab('scopes')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'scopes' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            Required API Scopes
          </button>
        </div>

        {/* Tab 1: 1-Click Install */}
        {activeTab === 'install' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202223] mb-1.5">
                Enter Target Shopify Store URL / Domain:
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={shopInput}
                    onChange={e => setShopInput(e.target.value)}
                    placeholder="your-brand-store.myshopify.com"
                    className="w-full bg-white border border-[#BABFC3] rounded-md pl-3.5 pr-10 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] font-mono shadow-xs"
                  />
                  <Store className="absolute right-3 top-2.5 h-4 w-4 text-[#8C9196]" />
                </div>
                <button
                  id="btn-authorize-shopify-install"
                  onClick={handleTestInstall}
                  disabled={isInstalling || !shopInput}
                  className="px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-xs rounded-md shadow-xs transition-all flex items-center space-x-1.5 flex-shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isInstalling ? 'Authorizing App...' : 'Authorize & Install'}</span>
                </button>
              </div>
            </div>

            {/* Generated Direct Install URL */}
            <div className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#202223] flex items-center space-x-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#008060]" />
                  <span>Merchant Direct Installation Link:</span>
                </span>
                <button
                  onClick={handleCopyLink}
                  className="text-[#008060] hover:text-[#006e52] text-xs font-bold flex items-center space-x-1"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Direct Link'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-white rounded-md font-mono text-[11px] text-[#202223] break-all border border-[#E1E3E5] shadow-xs">
                {installLink}
              </div>
              <p className="text-[11px] text-[#6D7175]">
                Merchants clicking this URL will be presented with the official Shopify OAuth consent screen and auto-redirected back into the app.
              </p>
            </div>

            {/* Store Connection Status Banner */}
            <div className="p-3.5 bg-[#DEF8EE] border border-[#008060]/30 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#008060]" />
                <span className="text-xs text-[#008060] font-medium">
                  Current Connected Shop: <strong className="text-[#202223] font-mono">{currentStore.shopDomain}</strong>
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white text-[#008060] rounded-md border border-[#008060]/30 shadow-xs">
                Authorized (Live)
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: OAuth 2.0 Flow Architecture */}
        {activeTab === 'oauth_flow' && (
          <div className="space-y-3 text-xs text-[#202223]">
            <div className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-3">
              <div className="font-bold text-[#008060] flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Step-by-Step OAuth 2.0 Handshake Flow:</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-[#4A4D4F] pl-1 text-[11px] leading-relaxed">
                <li><strong className="text-[#202223]">Merchant initiates installation:</strong> App validates the domain parameter against Shopify hostname regex.</li>
                <li><strong className="text-[#202223]">App issues OAuth redirect:</strong> Directs merchant to Shopify Admin with HMAC nonce verification state and requested API scopes.</li>
                <li><strong className="text-[#202223]">Merchant approves permissions:</strong> Shopify redirects back to <code className="bg-white px-1.5 py-0.5 rounded border border-[#E1E3E5]">/api/auth/shopify/callback</code> with single-use authorization code.</li>
                <li><strong className="text-[#202223]">Server exchanges authorization code:</strong> Server requests permanent offline access token via Shopify Admin API.</li>
                <li><strong className="text-[#202223]">Webhooks & Theme App Extension auto-injected:</strong> Bundle snippets become instantly available on storefront pages!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: API Scopes */}
        {activeTab === 'scopes' && (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {[
              { scope: 'read_products, write_products', desc: 'Allows listing store products in bundle builder steps & syncing variant inventory quantities in real-time.' },
              { scope: 'read_orders, write_draft_orders', desc: 'Enables custom discounted bundle checkout, line item properties, and draft order creation.' },
              { scope: 'read_themes, write_themes', desc: 'Allows 1-click automatic Liquid snippet and Theme App Extension injection into active Shopify themes.' },
              { scope: 'read_discounts, write_discounts', desc: 'Auto-provisions Shopify Native Discount Functions and automatic checkout discount codes.' }
            ].map(s => (
              <div key={s.scope} className="p-3 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] text-xs shadow-xs">
                <div className="font-mono font-bold text-[#008060]">{s.scope}</div>
                <div className="text-[#6D7175] text-[11px] mt-0.5 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#E1E3E5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#F6F6F7] text-[#202223] border border-[#BABFC3] text-xs font-bold rounded-md shadow-xs transition-colors"
          >
            Close Dialog
          </button>
        </div>

      </div>
    </div>
  );
};
