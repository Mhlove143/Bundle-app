import React, { useState } from 'react';
import { Bundle } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Sparkles,
  BarChart2,
  Calendar,
  Download,
  Filter,
  Layers,
  CheckCircle2,
  PieChart,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsDashboardProps {
  bundles: Bundle[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  bundles,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');

  // Aggregated Performance Metrics
  const totalRevenue = bundles.reduce((sum, b) => sum + b.stats.totalRevenue, 0);
  const totalSold = bundles.reduce((sum, b) => sum + b.stats.bundlesSold, 0);
  const totalViews = bundles.reduce((sum, b) => sum + b.stats.views, 0);
  const avgAov = totalSold > 0 ? totalRevenue / totalSold : 0;
  const avgConversion = totalViews > 0 ? (totalSold / totalViews) * 100 : 0;

  // Multiplier estimation based on selected time window
  const multiplier = timeRange === '7d' ? 0.28 : timeRange === '30d' ? 1 : timeRange === '90d' ? 2.7 : 4.5;
  const displayRevenue = Math.round(totalRevenue * multiplier);
  const displaySold = Math.round(totalSold * multiplier);
  const displayViews = Math.round(totalViews * multiplier);

  const handleExportCSV = () => {
    const headers = ['Bundle Title', 'Bundle Type', 'Status', 'Views', 'Orders Sold', 'Conversion Rate (%)', 'Total Revenue ($)'];
    const rows = bundles.map(b => [
      `"${b.title}"`,
      b.type,
      b.status,
      b.stats.views,
      b.stats.bundlesSold,
      b.stats.conversionRate,
      b.stats.totalRevenue
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopify_bundle_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E1E3E5] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#202223] flex items-center space-x-2">
            <span>Bundle Revenue & Conversion Performance</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DEF8EE] text-[#008060] border border-[#008060]/20">
              Live Shopify Sync
            </span>
          </h2>
          <p className="text-xs text-[#6D7175]">
            Real-time attribution data for custom box builders, volume tiered discounts, and bundle widgets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-[#F1F2F3] p-1 rounded-lg border border-[#E1E3E5] text-xs font-semibold">
            {(['7d', '30d', '90d', 'ytd'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md transition-all uppercase ${
                  timeRange === range
                    ? 'bg-white text-[#008060] font-bold shadow-xs border border-[#E1E3E5]'
                    : 'text-[#6D7175] hover:text-[#202223]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            id="btn-export-analytics-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-white hover:bg-[#F6F6F7] text-[#202223] border border-[#BABFC3] text-xs font-semibold rounded-md flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-[#008060]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-[#E1E3E5] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Bundle Revenue</span>
            <div className="p-2 rounded-lg bg-[#DEF8EE] text-[#008060] border border-[#008060]/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#202223] font-mono tracking-tight">
            ${displayRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#008060] font-semibold flex items-center space-x-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+38.4% vs unbundled sales</span>
          </div>
        </div>

        {/* Metric 2: Bundles Sold */}
        <div className="bg-white p-5 rounded-xl border border-[#E1E3E5] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Bundles Sold</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#202223] font-mono tracking-tight">
            {displaySold.toLocaleString()}
          </div>
          <div className="text-xs text-[#6D7175] flex items-center space-x-1">
            <Users className="h-3.5 w-3.5 text-[#008060]" />
            <span>From {displayViews.toLocaleString()} storefront views</span>
          </div>
        </div>

        {/* Metric 3: AOV Uplift */}
        <div className="bg-white p-5 rounded-xl border border-[#E1E3E5] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Average Order Value (AOV)</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#202223] font-mono tracking-tight">
            ${avgAov.toFixed(2)}
          </div>
          <div className="text-xs text-[#008060] font-semibold flex items-center space-x-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+$31.20 higher than catalog AOV</span>
          </div>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div className="bg-white p-5 rounded-xl border border-[#E1E3E5] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7175]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Average Conversion Rate</span>
            <div className="p-2 rounded-lg bg-[#DEF8EE] text-[#008060] border border-[#008060]/20">
              <BarChart2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#202223] font-mono tracking-tight">
            {avgConversion.toFixed(1)}%
          </div>
          <div className="text-xs text-[#6D7175]">
            Benchmark: 3.2% global e-commerce avg
          </div>
        </div>
      </div>

      {/* Revenue Breakdown & Trend Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Revenue Trend Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E1E3E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">Revenue Distribution & Performance Over Time</h3>
              <p className="text-xs text-[#6D7175]">Comparative weekly volume by bundle architecture</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#008060] bg-[#DEF8EE] px-2.5 py-1 rounded-md border border-[#008060]/20">
              +42.6% Monthly Growth
            </span>
          </div>

          {/* Graphical Bars Simulation */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'Week 1', mixMatch: 65, volumeTier: 45, fbt: 30, amount: '$18,400' },
              { label: 'Week 2', mixMatch: 78, volumeTier: 52, fbt: 38, amount: '$22,650' },
              { label: 'Week 3', mixMatch: 92, volumeTier: 64, fbt: 48, amount: '$28,900' },
              { label: 'Week 4 (Current)', mixMatch: 100, volumeTier: 76, fbt: 55, amount: '$34,120' },
            ].map((week, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#202223]">{week.label}</span>
                  <span className="font-mono font-bold text-[#008060]">{week.amount}</span>
                </div>
                <div className="h-3 w-full bg-[#F1F2F3] rounded-full overflow-hidden flex gap-0.5">
                  <div 
                    style={{ width: `${(week.mixMatch / 200) * 100}%` }} 
                    className="bg-[#008060] h-full rounded-l-full"
                    title="Mix & Match Boxes"
                  />
                  <div 
                    style={{ width: `${(week.volumeTier / 200) * 100}%` }} 
                    className="bg-indigo-600 h-full"
                    title="Volume Tier Discounts"
                  />
                  <div 
                    style={{ width: `${(week.fbt / 200) * 100}%` }} 
                    className="bg-amber-500 h-full rounded-r-full"
                    title="Frequently Bought Together"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#E1E3E5] text-xs text-[#6D7175]">
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-[#008060]"></span>
              <span>Mix & Match Box (62%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-indigo-600"></span>
              <span>Volume Discounts (25%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
              <span>Frequently Bought Together (13%)</span>
            </div>
          </div>
        </div>

        {/* Right: Key Optimization Insights */}
        <div className="bg-white p-6 rounded-xl border border-[#E1E3E5] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#202223] flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#008060]" />
              <span>Conversion Rate Optimizations</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#DEF8EE] rounded-lg border border-[#008060]/20 space-y-1">
                <div className="font-bold text-[#008060]">Top Performing Tier</div>
                <p className="text-[#202223]">
                  <strong>"Save 20% on 3 items"</strong> converts 4.2x higher than flat discounts.
                </p>
              </div>

              <div className="p-3 bg-[#F6F6F7] rounded-lg border border-[#E1E3E5] space-y-1">
                <div className="font-bold text-[#202223]">Free Gift Threshold</div>
                <p className="text-[#6D7175]">
                  Adding a free beauty tool or accessory at Step 4 increased average box item count from 3.1 to 4.4 items.
                </p>
              </div>

              <div className="p-3 bg-[#F6F6F7] rounded-lg border border-[#E1E3E5] space-y-1">
                <div className="font-bold text-[#202223]">Cart Abandonment Recovery</div>
                <p className="text-[#6D7175]">
                  Shopify Draft Order line item properties reduced checkout drop-off by 18.5%.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E1E3E5] text-[11px] text-[#6D7175] flex items-center justify-between">
            <span>Powered by Shopify Analytics API</span>
            <span className="text-[#008060] font-bold">100% Attributed</span>
          </div>
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-[#E1E3E5] overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-[#202223]">Active Bundle Wizard Performance Leaderboard</h3>
            <p className="text-xs text-[#6D7175]">Individual conversion and revenue generation breakdown</p>
          </div>
          <span className="text-xs font-semibold text-[#008060] bg-[#DEF8EE] px-2.5 py-1 rounded-md border border-[#008060]/20">
            {bundles.length} Active Configurations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F6F7] text-[#6D7175] uppercase font-bold text-[10px] tracking-wider border-b border-[#E1E3E5]">
              <tr>
                <th className="px-6 py-3.5">Bundle Wizard</th>
                <th className="px-4 py-3.5">Architecture</th>
                <th className="px-4 py-3.5">Storefront Views</th>
                <th className="px-4 py-3.5">Orders Sold</th>
                <th className="px-4 py-3.5">Conversion</th>
                <th className="px-4 py-3.5">Avg. Order Value</th>
                <th className="px-6 py-3.5 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E3E5]">
              {bundles.map(b => (
                <tr key={b.id} className="hover:bg-[#F9FAFA] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#202223] flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-[#008060]"></span>
                    <span>{b.title}</span>
                  </td>
                  <td className="px-4 py-4 text-[#6D7175] capitalize font-medium">
                    {b.type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-4 text-[#4A4D4F] font-mono">
                    {b.stats.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-[#008060] font-mono font-bold">
                    {b.stats.bundlesSold}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#DEF8EE] text-[#008060] font-mono font-bold border border-[#008060]/20">
                      {b.stats.conversionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#202223] font-mono font-semibold">
                    ${b.stats.avgOrderValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-[#202223] font-mono text-sm">
                    ${b.stats.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
