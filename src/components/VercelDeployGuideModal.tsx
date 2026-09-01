import React, { useState } from 'react';
import { 
  Github, 
  Terminal, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  X, 
  Cloud, 
  Key, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface VercelDeployGuideModalProps {
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const vercelJsonContent = `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.ts" },
    { "src": "/(.*)", "dest": "/dist/$1" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}`;

  const shopifyTomlContent = `# Shopify CLI App Configuration (shopify.app.toml)
client_id = "b89ee20ad6819b88155ae7f364c6beed"
name = "BundleCraft Pro"
application_url = "https://bundle-app-one.vercel.app"
embedded = true

[access_scopes]
scopes = "read_products,write_products,read_orders,write_draft_orders,read_themes,write_themes"

[auth]
redirect_urls = [
  "https://bundle-app-one.vercel.app/api/auth/shopify/callback"
]

[webhooks]
api_version = "2024-04"

  [[webhooks.subscriptions]]
  topics = [ "app/uninstalled" ]
  uri = "/api/webhooks/app/uninstalled"
`;

  const gitCommands = `# 1. Initialize Local Git Repository
git init
git add .
git commit -m "feat: initial shopify bundle wizard app"

# 2. Add Remote and Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shopify-bundle-wizard.git
git push -u origin main

# 3. Deploy Serverlessly to Vercel (or import from vercel.com dashboard)
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#E1E3E5] rounded-xl max-w-3xl w-full my-auto shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-[#F6F6F7] text-[#202223] border border-[#E1E3E5] flex items-center justify-center shadow-xs">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202223] flex items-center space-x-2">
                <span>Git CI/CD & Vercel Serverless Deployment Hub</span>
                <span className="text-[10px] bg-[#DEF8EE] text-[#008060] px-2 py-0.5 rounded-full border border-[#008060]/30 font-bold">
                  Step-by-Step
                </span>
              </h2>
              <p className="text-xs text-[#6D7175]">
                Push your codebase to GitHub and auto-deploy to Vercel with serverless API and OAuth support
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

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-[#E1E3E5] bg-[#F6F6F7] px-6 space-x-2 overflow-x-auto text-xs font-semibold">
          {[
            { step: 1, label: '1. Git & GitHub Setup' },
            { step: 2, label: '2. Vercel Configuration (vercel.json)' },
            { step: 3, label: '3. Shopify Partner Dashboard URLs' },
            { step: 4, label: '4. Environment Variables Checklist' },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeStep === s.step
                  ? 'border-[#008060] text-[#008060] font-bold'
                  : 'border-transparent text-[#6D7175] hover:text-[#202223]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
          
          {/* STEP 1: Git Commands */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202223] flex items-center space-x-1.5">
                    <Terminal className="h-4 w-4 text-[#008060]" />
                    <span>Run these commands in your project root directory:</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="text-xs text-[#008060] hover:text-[#006e52] font-bold flex items-center space-x-1"
                  >
                    {copiedKey === 'git' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'git' ? 'Copied to Clipboard!' : 'Copy Terminal Commands'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-[#202223] rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-[#303030]">
                  {gitCommands}
                </pre>
              </div>

              <div className="p-4 bg-[#DEF8EE] border border-[#008060]/30 rounded-xl text-xs text-[#202223] space-y-1.5 shadow-xs">
                <div className="font-bold text-[#008060] flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Automated Continuous Deployment (CI/CD):</span>
                </div>
                <p className="text-[#4A4D4F] leading-relaxed">
                  Whenever you push changes to your GitHub repository <code className="bg-white px-1.5 py-0.5 rounded text-[#202223] font-mono border border-[#008060]/20">main</code> branch, Vercel will trigger a zero-downtime serverless build and update your live Shopify App automatically.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: vercel.json */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#202223]">vercel.json (Serverless Architecture Blueprint)</span>
                    <p className="text-[11px] text-[#6D7175]">Directs static bundle traffic to Vite and API endpoints to Express Serverless</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(vercelJsonContent, 'vercel')}
                    className="text-xs text-[#008060] hover:text-[#006e52] font-bold flex items-center space-x-1"
                  >
                    {copiedKey === 'vercel' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'vercel' ? 'Copied to Clipboard!' : 'Copy vercel.json'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-[#202223] rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-[#303030]">
                  {vercelJsonContent}
                </pre>
              </div>
            </div>
          )}

          {/* STEP 3: Shopify Partner Dashboard Config */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="bg-[#F6F6F7] p-4 rounded-xl border border-[#E1E3E5] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#202223]">shopify.app.toml (Shopify CLI Configuration)</span>
                    <p className="text-[11px] text-[#6D7175]">App bridge URLs, OAuth callback endpoints, and webhook subscriptions</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(shopifyTomlContent, 'toml')}
                    className="text-xs text-[#008060] hover:text-[#006e52] font-bold flex items-center space-x-1"
                  >
                    {copiedKey === 'toml' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'toml' ? 'Copied to Clipboard!' : 'Copy shopify.app.toml'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-[#202223] rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-[#303030]">
                  {shopifyTomlContent}
                </pre>
              </div>

              <div className="p-4 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] text-xs space-y-2">
                <div className="font-bold text-[#202223]">Shopify Partner Dashboard Setup Instructions:</div>
                <ul className="list-disc list-inside space-y-1 text-[#4A4D4F] text-[11px] leading-relaxed">
                  <li>Navigate to <strong>Shopify Partners</strong> &gt; <strong>Apps</strong> &gt; Select your App &gt; <strong>Configuration</strong></li>
                  <li>Set <strong>App URL</strong> to: <code className="bg-white px-1 py-0.5 rounded border border-[#E1E3E5] font-bold text-[#008060]">https://bundle-app-one.vercel.app</code></li>
                  <li>Set <strong>Allowed redirection URL(s)</strong> to: <code className="bg-white px-1 py-0.5 rounded border border-[#E1E3E5] font-bold text-[#008060]">https://bundle-app-one.vercel.app/api/auth/shopify/callback</code></li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 4: Environment Variables */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-[#6D7175]">
                In your Vercel Project Dashboard &gt; <strong>Settings</strong> &gt; <strong>Environment Variables</strong>, configure these variables:
              </p>
              <div className="space-y-2.5">
                {[
                  { name: 'SHOPIFY_API_KEY', val: 'Your Shopify App Client ID / API Key from Partners Dashboard' },
                  { name: 'SHOPIFY_API_SECRET', val: 'Your Shopify App Client Secret from Partners Dashboard' },
                  { name: 'APP_URL', val: 'https://your-bundlex-app.vercel.app' },
                  { name: 'SHOPIFY_SCOPES', val: 'read_products,write_products,read_orders,write_draft_orders,read_themes,write_themes' },
                  { name: 'GEMINI_API_KEY', val: 'Optional: Gemini API Key for AI Bundle Strategist' }
                ].map(env => (
                  <div key={env.name} className="p-3.5 bg-[#F6F6F7] rounded-xl border border-[#E1E3E5] flex items-center justify-between text-xs shadow-xs">
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-[#008060]">{env.name}</div>
                      <div className="text-[11px] text-[#6D7175]">{env.val}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(env.name, env.name)}
                      className="text-[#6D7175] hover:text-[#202223] p-1.5 rounded-md hover:bg-white transition-colors"
                      title="Copy variable name"
                    >
                      {copiedKey === env.name ? <CheckCircle2 className="h-4 w-4 text-[#008060]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E1E3E5] flex items-center justify-between bg-[#F6F6F7]">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-[#BABFC3] hover:bg-[#F1F2F3] text-[#202223] rounded-md disabled:opacity-40 shadow-xs transition-colors"
          >
            Previous
          </button>
          
          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-4 py-1.5 text-xs font-bold bg-[#008060] hover:bg-[#006e52] text-white rounded-md flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold bg-[#008060] hover:bg-[#006e52] text-white rounded-md shadow-xs transition-all cursor-pointer"
            >
              Finish Setup
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
