import React, { useState } from 'react';
import { 
  IndianRupee, TrendingDown, Lightbulb, ShieldAlert, Check, 
  ChevronDown, ChevronUp, Layers, HelpCircle, History, Sparkles 
} from 'lucide-react';

export default function BudgetPlanner({ plan, onTriggerReplanning }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [quickCutAmount, setQuickCutAmount] = useState('');
  const req = plan.event_request;
  const curr = req.currency;

  const toggleExpand = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const priorityColor = (prio) => {
    switch (prio) {
      case 'Critical': return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Important': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Flexible': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default: return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Deterministic Smart Budget Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Budget Distribution & Optimization
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Calculated programmatically based on {req.event_type} benchmarks. 
            All math is verified in Python backend with zero rounding drift.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Programmatic Sum</span>
            <div className="text-2xl font-extrabold text-amber-300 font-serif">
              {curr}{plan.total_allocated.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-800 hidden sm:block" />
          <div className="text-right">
            <span className="text-xs text-slate-400">Reserve Fund</span>
            <div className="text-xl font-bold text-emerald-400 font-serif">
              {curr}{plan.contingency_fund.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Trade-Off History Callout (If replanning occurred) */}
      {plan.trade_off_log && plan.trade_off_log.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-indigo-950/20">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-4 h-4" />
            <span>Dynamic Replanning & Trade-Off Log ({plan.trade_off_log.length} Revisions)</span>
          </div>
          <div className="space-y-3">
            {plan.trade_off_log.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Prompt: "{log.instruction}"</span>
                  <span className="text-[11px] text-slate-400">
                    Delta: {log.budget_delta < 0 ? '-' : '+'}{curr}{Math.abs(log.budget_delta).toLocaleString('en-IN')}
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                  {log.trade_offs?.map((to, i) => (
                    <li key={i}>{to}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.budget_categories.map((cat) => {
          const isExpanded = expandedCategories[cat.id];
          return (
            <div 
              key={cat.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{cat.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor(cat.priority)}`}>
                      {cat.priority}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {curr}{cat.per_guest_cost.toLocaleString('en-IN')} per guest ({cat.percentage}% of total)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-amber-300 font-serif">
                    {curr}{cat.allocated_amount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Progress Bar of Budget Share */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, cat.percentage * 2.5)}%` }}
                />
              </div>

              {/* Cost Saving Tip Callout */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-3 flex items-start gap-2.5 text-xs text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200">Cost-Saving Tip:</strong> {cat.cost_saving_tip}
                </div>
              </div>

              {/* Expandable Sub-items Toggle */}
              {cat.suggested_subitems && cat.suggested_subitems.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white pt-2 border-t border-slate-800/60 cursor-pointer"
                  >
                    <span>View Itemized Breakdown ({cat.suggested_subitems.length} items)</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      {cat.suggested_subitems.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/50">
                          <div>
                            <div className="font-semibold text-slate-200">{sub.name}</div>
                            {sub.tip && <div className="text-[10px] text-slate-400">{sub.tip}</div>}
                          </div>
                          <span className="font-mono text-amber-300/90 font-medium">
                            {curr}{sub.estimated_cost.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Quick Re-Budget Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-amber-500/20 bg-amber-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Need to adjust budget or guest count?</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            EventGenie recalculates allocations, protects critical food/venue standards, and preserves your tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onTriggerReplanning(`Reduce my budget to ${curr}${(plan.total_budget * 0.9).toLocaleString('en-IN')}`)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition cursor-pointer"
          >
            Cut Budget by 10%
          </button>
          <button
            onClick={() => onTriggerReplanning(`Increase guests to ${Math.round(req.guest_count * 1.2)}`)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition cursor-pointer"
          >
            Add 20% More Guests
          </button>
        </div>
      </div>
    </div>
  );
}
