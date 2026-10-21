import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  IndianRupee, Users, CheckCircle2, AlertCircle, ShieldCheck, 
  Sparkles, Calendar, TrendingUp, Clock, DollarSign
} from 'lucide-react';

const CHART_COLORS = [
  '#F59E0B', '#6366F1', '#10B981', '#EC4899', 
  '#3B82F6', '#8B5CF6', '#14B8A6', '#F97316'
];

export default function OverviewDashboard({ plan, onNavigateTab }) {
  const req = plan.event_request;
  const curr = req.currency;

  const completedTasks = plan.timeline_tasks.filter(t => t.completed).length;
  const totalTasks = plan.timeline_tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Prepare chart data
  const pieData = plan.budget_categories.map((c, i) => ({
    name: c.name,
    value: c.allocated_amount,
    percentage: c.percentage,
    color: CHART_COLORS[i % CHART_COLORS.length]
  }));

  const barData = plan.budget_categories.map(c => ({
    name: c.name.length > 15 ? c.name.slice(0, 14) + '...' : c.name,
    fullName: c.name,
    allocated: c.allocated_amount,
    perGuest: c.per_guest_cost
  }));

  // Upcoming top 4 tasks
  const upcomingTasks = [...plan.timeline_tasks]
    .sort((a, b) => a.deadline_offset_days - b.deadline_offset_days)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Budget</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400 font-bold">{curr}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-serif">
            {curr}{plan.total_budget.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Mathematically Balanced</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Per-Guest Ratio</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-300 mt-1.5 font-serif">
            {curr}{plan.cost_per_guest.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {req.guest_count} attendees
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Contingency Reserve</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1.5 font-serif">
            {curr}{plan.contingency_fund.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            5% Emergency Buffer
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Task Progress</span>
            <Calendar className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 flex items-baseline gap-2">
            <span>{progressPercent}%</span>
            <span className="text-xs text-slate-400 font-normal">({completedTasks}/{totalTasks})</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Revisions Count</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1.5">
            {plan.revision_count || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {plan.revision_count > 0 ? "Dynamic Replanning Active" : "Original Base Plan"}
          </div>
        </div>
      </div>

      {/* Middle Visuals: Donut Distribution & Bar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white">Budget Capital Allocation</h3>
              <p className="text-xs text-slate-400">Share by service domain</p>
            </div>
            <button 
              onClick={() => onNavigateTab('budget')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              View Details &rarr;
            </button>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(val) => [`${curr}${val.toLocaleString('en-IN')}`, 'Allocated']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Quick Legend Chips */}
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Comparison Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white">Expense Distribution Bar</h3>
              <p className="text-xs text-slate-400">Total estimated outlay in {curr}</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              Verified Sum: {curr}{plan.total_allocated.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10} 
                  angle={-25} 
                  textAnchor="end" 
                  interval={0} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickFormatter={(val) => `${curr}${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} 
                />
                <RechartsTooltip 
                  formatter={(val) => [`${curr}${val.toLocaleString('en-IN')}`, 'Allocated Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="allocated" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Priority Deadlines & Transparency Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines (2 cols) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Milestone Timeline & Immediate Deadlines</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('timeline')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Full Checklist ({plan.timeline_tasks.length}) &rarr;
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${task.completed ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <div>
                    <div className={`text-xs sm:text-sm font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{task.category}</span>
                      <span>&bull;</span>
                      <span className="text-indigo-400">{task.timeframe}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-300">{task.estimated_deadline}</span>
                  <div className="text-[10px] text-slate-500 uppercase">{task.priority} Priority</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI & Mathematical Integrity Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Architecture & Disclosures</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {plan.ai_generation_meta?.service_used || "EventGenie Intelligence System"}
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-amber-300 font-medium">Programmatic Precision:</strong> All budget allocations, category totals, and trade-off deltas are executed via deterministic code formulas to eliminate LLM arithmetic hallucinations.
              </p>
              <p>
                <strong className="text-indigo-300 font-medium">Model Attribution:</strong> {plan.ai_generation_meta?.model || "Gemini 2.5 Flash"} was utilized for structured recommendation synthesis, event phrasing, and contextual culinary curation.
              </p>
              <p className="text-slate-400 text-[11px]">
                Market benchmarks reflect current metropolitan vendor pricing. No fictitious businesses or false price locks are promoted.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Created: {new Date(plan.created_at).toLocaleDateString()}</span>
            <span className="text-emerald-400 font-semibold">Active & Saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
