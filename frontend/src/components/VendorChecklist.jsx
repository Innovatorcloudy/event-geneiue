import React, { useState } from 'react';
import { 
  Building2, CheckSquare, HelpCircle, AlertOctagon, 
  DollarSign, ShieldAlert, Sparkles, ChevronRight 
} from 'lucide-react';

export default function VendorChecklist({ plan }) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const vendors = plan.vendor_checklist || [];
  const curr = plan.event_request.currency;

  const currentVendor = vendors[selectedCategory] || vendors[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Vendor Due Diligence & Vetting Studio</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Vendor Criteria & Comparison Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Objective vetting guidelines, technical requirements, and contract safeguards. 
            Prevents vendor disputes and guarantees service transparency.
          </p>
        </div>

        {/* Ethical Disclosure Pill */}
        <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300/90 flex items-start gap-2 max-w-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <strong>Factual Transparency:</strong> Vendor categories and rates reflect regional benchmarks. We do not invent fake businesses or false price guarantees.
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Categories list on Left, Detailed Criteria on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Category Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
            Vendor Domains ({vendors.length})
          </span>
          {vendors.map((v, idx) => (
            <button
              key={v.id || idx}
              onClick={() => setSelectedCategory(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                selectedCategory === idx
                  ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="font-bold text-sm">{v.category}</div>
                <div className="text-xs text-amber-400/80 mt-1 font-mono">
                  {v.typical_cost_range}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                selectedCategory === idx ? 'text-amber-400 translate-x-1' : 'text-slate-600'
              }`} />
            </button>
          ))}
        </div>

        {/* Right Side: Detailed Vendor Specification */}
        {currentVendor && (
          <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            {/* Title & Estimated Range */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">{currentVendor.category}</h3>
                <span className="text-xs text-slate-400">Essential specifications & negotiation criteria</span>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-amber-300 font-bold self-start sm:self-auto">
                Est. Benchmark: {currentVendor.typical_cost_range}
              </div>
            </div>

            {/* Core Requirements */}
            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Non-Negotiable Requirements</span>
              </h4>
              <ul className="space-y-2">
                {currentVendor.requirements?.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions to Ask */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Critical Questions to Ask Before Signing</span>
              </h4>
              <div className="space-y-2">
                {currentVendor.questions_to_ask?.map((q, i) => (
                  <div key={i} className="text-xs text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold text-xs">{i + 1}.</span>
                    <span className="italic">"{q}"</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Criteria */}
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Comparison Evaluation Metrics</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentVendor.comparison_criteria?.map((crit, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-300">
                    &bull; {crit}
                  </div>
                ))}
              </div>
            </div>

            {/* Cautionary Advice Alert Box */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-0.5">
                  Critical Safeguard & Red Flags
                </h5>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {currentVendor.cautionary_advice}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
