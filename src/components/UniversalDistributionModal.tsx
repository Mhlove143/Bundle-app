import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Store, 
  Key, 
  Link, 
  HelpCircle, 
  X, 
  Sparkles,
  Layers,
  ChevronRight,
  Terminal,
  Globe
} from 'lucide-react';

interface UniversalDistributionModalProps {
  onClose: () => void;
}

export const UniversalDistributionModal: React.FC<UniversalDistributionModalProps> = ({ onClose }) => {
  const [targetShop, setTargetShop] = useState('demo-brand.myshopify.com');
  const [partnerClientId, setPartnerClientId] = useState('your_shopify_client_id');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'why_it_fails' | 'distribution_steps' | 'generate_link'>('why_it_fails');

  const appHost = window.location.origin;
  const directInstallLink = `${appHost}/api/auth/shopify?shop=${encodeURIComponent(targetShop.trim())}`;
  const customDistributionPartnerUrl = `https://admin.shopify.com/oauth/install?client_id=${partnerClientId}&shopify_client_id=${partnerClientId}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E1E3E5] rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-[#DEF8EE] text-[#008060] border border-[#008060]/20 flex items-center justify-center shadow-xs">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202223] flex items-center gap-2">
                Universal Shopify Store Installation & App Store Distribution Guide
              </h2>
              <p className="text-xs text-[#6D7175]">
                Why external stores fail to install & how to create a 1-click universal distribution link for any merchant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6D7175] hover:text-[#202223] hover:bg-[#F1F2F3] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E1E3E5] space-x-3 text-xs font-semibold flex-shrink-0">
          <button
            onClick={() => setActiveTab('why_it_fails')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'why_it_fails' 
                ? 'border-red-600 text-red-600 font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>১. কেন অন্য স্টোরে সরাসরি ইন্সটল হয় না?</span>
          </button>
          <button
            onClick={() => setActiveTab('distribution_steps')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'distribution_steps' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>২. Universal Link তৈরির সম্পূর্ণ গাইড</span>
          </button>
          <button
            onClick={() => setActiveTab('generate_link')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'generate_link' 
                ? 'border-[#008060] text-[#008060] font-bold' 
                : 'border-transparent text-[#6D7175] hover:text-[#202223]'
            }`}
          >
            <Link className="h-4 w-4" />
            <span>৩. Live 1-Click Link Generator</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-[#202223]">
          
          {/* TAB 1: WHY INSTALL FAILS ON OTHER STORES */}
          {activeTab === 'why_it_fails' && (
            <div className="space-y-4">
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-red-800 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span>Shopify OAuth Security Rules: অন্য যেকোনো স্টোরে ইন্সটল করার ৩টি শর্ত</span>
                </div>
                <p className="text-[11px] text-red-700 leading-relaxed">
                  Shopify কোনো আনঅথরাইজড সার্ভারকে সরাসরি যেকোনো স্টোরে ডিরেক্ট ইন্সটল করতে দেয় না যদি না আপনি Shopify Partner একাউন্টে অ্যাপটি রেজিস্টার করে <strong>Allowed Redirect URL</strong> সেট করেন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] space-y-1.5">
                  <div className="text-xs font-bold text-[#202223] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px]">1</span>
                    <span>Client ID & Secret নেই</span>
                  </div>
                  <p className="text-[11px] text-[#6D7175] leading-relaxed">
                    Shopify Partner একাউন্ট ছাড়া তৈরি করা ডেমো Client ID দিয়ে অন্য কোনো স্টোরে OAuth হ্যান্ডশেক হয় না।
                  </p>
                </div>

                <div className="p-3.5 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] space-y-1.5">
                  <div className="text-xs font-bold text-[#202223] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px]">2</span>
                    <span>Redirect URL Whitelist নেই</span>
                  </div>
                  <p className="text-[11px] text-[#6D7175] leading-relaxed">
                    Shopify Partner Dashboard-এ আপনার বর্তমান App Host URL Whitelist না থাকলে Shopify OAuth ব্লক করে।
                  </p>
                </div>

                <div className="p-3.5 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] space-y-1.5">
                  <div className="text-xs font-bold text-[#202223] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px]">3</span>
                    <span>Distribution Link তৈরি হয়নি</span>
                  </div>
                  <p className="text-[11px] text-[#6D7175] leading-relaxed">
                    Shopify Partner-এ &quot;Custom App Distribution&quot; সিলেক্ট করে একটি শেয়ারযোগ্য লিঙ্ক তৈরি করতে হয়।
                  </p>
                </div>
              </div>

              <div className="bg-[#DEF8EE] border border-[#008060]/30 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#008060] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>সমাধান: আপনি মাত্র ৫ মিনিটে এই সমস্যা সমাধান করে যেকোনো মার্চেন্টকে ইন্সটল লিঙ্ক দিতে পারেন!</span>
                </div>
                <p className="text-[11px] text-[#202223] leading-relaxed">
                  নিচের <strong>&quot;Universal Link তৈরির সম্পূর্ণ গাইড&quot;</strong> ট্যাবে ক্লিক করে স্টেপগুলো অনুসরণ করুন।
                </p>
                <button
                  onClick={() => setActiveTab('distribution_steps')}
                  className="px-3.5 py-1.5 bg-[#008060] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#006e52] transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>গাইড দেখুন</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: STEP BY STEP DISTRIBUTION GUIDE */}
          {activeTab === 'distribution_steps' && (
            <div className="space-y-4">
              
              <div className="border border-[#E1E3E5] rounded-xl overflow-hidden">
                <div className="bg-[#F1F2F3] px-4 py-2.5 font-bold text-xs text-[#202223] flex items-center justify-between">
                  <span>ধাপ ১: Shopify Partner Dashboard-এ App তৈরি করুন</span>
                  <a 
                    href="https://partners.shopify.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#008060] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>partners.shopify.com</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="p-4 space-y-2 text-[11px] text-[#4A4D4F] bg-white">
                  <p>১. <strong className="text-[#202223]">Shopify Partner Account</strong>-এ লগইন করে <strong>Apps &gt; Create App &gt; Create app manually</strong> সিলেক্ট করুন।</p>
                  <p>২. অ্যাপের নাম দিন: <strong className="text-[#202223]">BundleCraft Pro</strong> (বা আপনার পছন্দের নাম)।</p>
                </div>
              </div>

              <div className="border border-[#E1E3E5] rounded-xl overflow-hidden">
                <div className="bg-[#F1F2F3] px-4 py-2.5 font-bold text-xs text-[#202223]">
                  ধাপ ২: App URL ও Allowed Redirection URL কনফিগার করুন
                </div>
                <div className="p-4 space-y-3 text-[11px] text-[#4A4D4F] bg-white">
                  <div>
                    <label className="font-bold text-[#202223] block mb-1">App URL (বসাবেন):</label>
                    <div className="p-2 bg-[#F6F6F7] rounded border border-[#E1E3E5] font-mono text-[11px] text-[#202223] flex items-center justify-between">
                      <span>{appHost}</span>
                      <button 
                        onClick={() => handleCopy(appHost)} 
                        className="text-[#008060] hover:underline font-sans font-bold text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#202223] block mb-1">Allowed redirection URL(s) (বসাবেন):</label>
                    <div className="p-2 bg-[#F6F6F7] rounded border border-[#E1E3E5] font-mono text-[11px] text-[#202223] flex items-center justify-between">
                      <span>{appHost}/api/auth/shopify/callback</span>
                      <button 
                        onClick={() => handleCopy(`${appHost}/api/auth/shopify/callback`)} 
                        className="text-[#008060] hover:underline font-sans font-bold text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-[#E1E3E5] rounded-xl overflow-hidden">
                <div className="bg-[#F1F2F3] px-4 py-2.5 font-bold text-xs text-[#202223]">
                  ধাপ ৩: Distribution সেটিংসে 1-Click Link তৈরি করুন
                </div>
                <div className="p-4 space-y-2 text-[11px] text-[#4A4D4F] bg-white leading-relaxed">
                  <p>১. Partner Dashboard-এর বাম পাশের মেনু থেকে <strong className="text-[#202223]">Distribution</strong> অপশনে যান।</p>
                  <p>২. <strong className="text-[#008060]">Custom distribution</strong> সিলেক্ট করুন। (এটি দিয়ে যেকোনো মার্চেন্ট স্টোরে রিভিউ ছাড়াই লিঙ্ক দিয়ে ইন্সটল করা যায়)।</p>
                  <p>৩. এরপর <strong className="text-[#202223]">&quot;Generate distribution link&quot;</strong> এ ক্লিক করুন।</p>
                  <p>৪. তৈরি হওয়া লিঙ্কটি কপি করে আপনার যেকোনো ক্লায়েন্ট বা মার্চেন্টকে দিন — তারা ১-ক্লিকেই তাদের স্টোরে অ্যাপটি ইন্সটল করতে পারবে!</p>
                </div>
              </div>

              <div className="border border-[#E1E3E5] rounded-xl overflow-hidden">
                <div className="bg-[#F1F2F3] px-4 py-2.5 font-bold text-xs text-[#202223]">
                  ধাপ ৪: Shopify App Store-এ পাবলিক রিলিজ করার নিয়ম
                </div>
                <div className="p-4 space-y-2 text-[11px] text-[#4A4D4F] bg-white leading-relaxed">
                  <p>যদি চান পুরো পৃথিবীর যে কেউ Shopify App Store থেকে সার্চ করে ইন্সটল করবে:</p>
                  <p>১. <strong className="text-[#202223]">Distribution</strong> থেকে <strong className="text-[#008060]">Public distribution (Shopify App Store)</strong> সিলেক্ট করুন।</p>
                  <p>২. অ্যাপ লিস্টিং (আইকন, স্ক্রিনশট, ডেসক্রিপশন, প্রাইসিং) পূরণ করে <strong className="text-[#202223]">Submit for review</strong> করুন।</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: GENERATE LIVE LINK */}
          {activeTab === 'generate_link' && (
            <div className="space-y-4">
              
              <div className="bg-white p-4 rounded-xl border border-[#E1E3E5] space-y-3">
                <label className="block font-bold text-xs text-[#202223]">
                  টার্গেট মার্চেন্ট স্টোরের ডোমেইন দিন:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={targetShop}
                      onChange={e => setTargetShop(e.target.value)}
                      placeholder="client-brand.myshopify.com"
                      className="w-full bg-white border border-[#BABFC3] rounded-lg pl-3.5 pr-10 py-2 text-xs text-[#202223] focus:outline-none focus:border-[#008060] font-mono shadow-xs"
                    />
                    <Store className="absolute right-3 top-2.5 h-4 w-4 text-[#8C9196]" />
                  </div>
                </div>

                {/* Direct Link Output */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#202223]">আপনার সার্ভারের ডিরেক্ট OAuth হ্যান্ডশেক লিঙ্ক:</span>
                    <button
                      onClick={() => handleCopy(directInstallLink)}
                      className="text-[#008060] hover:text-[#006e52] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedLink ? 'কপি হয়েছে!' : 'লিঙ্ক কপি করুন'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-[#F6F6F7] rounded-lg font-mono text-[11px] text-[#202223] break-all border border-[#E1E3E5]">
                    {directInstallLink}
                  </div>
                  <p className="text-[10px] text-[#6D7175]">
                    মার্চেন্ট এই লিঙ্কে ব্রাউজার দিয়ে প্রবেশ করলেই তার Shopify Admin-এ অ্যাপ ইন্সটল স্ক্রিন ওপেন হবে।
                  </p>
                </div>
              </div>

              {/* Scopes Overview */}
              <div className="p-4 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] space-y-2 text-[11px]">
                <div className="font-bold text-[#202223] flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-[#008060]" />
                  <span>অটোমেটিক পারমিশন স্কোপস (OAuth Scopes):</span>
                </div>
                <div className="font-mono text-[10px] bg-white p-2.5 rounded border border-[#E1E3E5] text-[#008060]">
                  read_products, write_products, read_orders, write_draft_orders, read_themes, write_themes
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E1E3E5] flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-[#6D7175]">
            Need help? Shopify CLI 3.x deployment blueprint is fully integrated.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
