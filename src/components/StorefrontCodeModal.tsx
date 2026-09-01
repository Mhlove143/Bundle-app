import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  CheckCircle2, 
  Layers, 
  X, 
  Sparkles, 
  FileCode, 
  Eye,
  Terminal,
  Store
} from 'lucide-react';
import { Bundle } from '../types';

interface StorefrontCodeModalProps {
  bundle: Bundle;
  onClose: () => void;
}

export const StorefrontCodeModal: React.FC<StorefrontCodeModalProps> = ({
  bundle,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'liquid' | 'app_embed' | 'script_tag'>('liquid');
  const [copied, setCopied] = useState(false);

  const liquidSnippet = `<!-- Shopify Custom Bundle Wizard - Liquid Snippet -->
<!-- File location: snippets/bundle-wizard.liquid -->
<div 
  id="shopify-bundle-wizard-container"
  data-shopify-bundle-wizard
  data-bundle-id="${bundle.id}"
  data-bundle-handle="${bundle.handle}"
  data-shop-currency="{{ cart.currency.iso_code }}"
  class="bundle-wizard-wrapper"
>
  <div class="bundle-loading-skeleton" style="padding: 32px; text-align: center; background: ${bundle.widgetStyling.backgroundColor}; border-radius: ${bundle.widgetStyling.borderRadius}px; color: ${bundle.widgetStyling.textColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Loading ${bundle.title}...</p>
    <div style="width: 140px; height: 4px; background: rgba(255,255,255,0.2); margin: 0 auto; border-radius: 9999px; overflow: hidden;">
      <div style="width: 50%; height: 100%; background: ${bundle.widgetStyling.primaryColor}; border-radius: 9999px;"></div>
    </div>
  </div>
</div>

<!-- Load Bundle Engine JavaScript Asset -->
<script 
  src="{{ 'bundle-wizard.js' | asset_url }}" 
  defer="defer"
></script>
`;

  const appEmbedCode = `<!-- Theme App Extension Block (Online Store 2.0) -->
<!-- Render inside sections/main-product.liquid or via Theme Customizer Block -->
{% render 'bundle-wizard', bundle_id: '${bundle.id}' %}`;

  const scriptTagEmbed = `<!-- Direct Script Tag Integration for Headless / Custom Liquid -->
<div 
  data-shopify-bundle-wizard 
  data-bundle-id="${bundle.id}" 
  data-bundle-handle="${bundle.handle}"
></div>
<script src="https://your-bundle-app.vercel.app/api/widget/bundle-wizard.js" async></script>`;

  const currentCode = activeTab === 'liquid' ? liquidSnippet : activeTab === 'app_embed' ? appEmbedCode : scriptTagEmbed;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E1E3E5] rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-[#DEF8EE] text-[#008060] border border-[#008060]/20 flex items-center justify-center shadow-xs">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202223]">
                Shopify Theme Code Integration
              </h2>
              <p className="text-xs text-[#6D7175]">
                Inject <strong className="text-[#202223]">"{bundle.title}"</strong> into your Shopify Online Store 2.0 Theme
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

        {/* Tab Selector */}
        <div className="flex border-b border-[#E1E3E5] space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('liquid')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'liquid' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            1. Liquid Snippet (Recommended)
          </button>
          <button
            onClick={() => setActiveTab('app_embed')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'app_embed' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            2. Theme App Embed Block
          </button>
          <button
            onClick={() => setActiveTab('script_tag')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'script_tag' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            3. Direct JS CDN Tag
          </button>
        </div>

        {/* Code Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6D7175] font-medium">
              {activeTab === 'liquid'
                ? 'Create a new snippet in your Shopify Theme Code Editor (snippets/bundle-wizard.liquid):'
                : activeTab === 'app_embed'
                ? 'Paste this snippet in sections/main-product.liquid or via Theme Customizer:'
                : 'Paste directly into layout/theme.liquid before </head>:'}
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-[#008060] hover:text-[#006e52] flex items-center space-x-1"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code Snippet'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#202223] rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-64 border border-[#303030] shadow-xs leading-relaxed">
            {currentCode}
          </pre>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] text-xs text-[#4A4D4F] space-y-1.5 shadow-xs">
          <strong className="text-[#202223] flex items-center space-x-1.5">
            <Store className="h-4 w-4 text-[#008060]" />
            <span>How to embed inside Shopify Admin:</span>
          </strong>
          <ol className="list-decimal list-inside space-y-1 text-[11px] pt-1 leading-relaxed">
            <li>Go to your Shopify Admin &gt; <strong>Online Store</strong> &gt; <strong>Themes</strong>.</li>
            <li>Click <strong>Customize</strong> or <strong>Actions (...)</strong> &gt; <strong>Edit code</strong>.</li>
            <li>In the <code>Snippets/</code> directory, click <em>Add a new snippet</em> named <code>bundle-wizard.liquid</code>.</li>
            <li>Paste this snippet and save. The bundle wizard will automatically render with real-time stock sync.</li>
          </ol>
        </div>

        <div className="flex justify-end pt-2">
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
