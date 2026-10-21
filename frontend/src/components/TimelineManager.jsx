import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Circle, Clock, Filter, AlertTriangle, 
  Sparkles, Calendar, Plus, CheckSquare 
} from 'lucide-react';

export default function TimelineManager({ plan, onToggleTask }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  const tasks = plan.timeline_tasks || [];

  // Extract unique timeframes
  const timeframes = ['ALL', ...Array.from(new Set(tasks.map(t => t.timeframe)))];
  const priorities = ['ALL', 'High', 'Medium', 'Low'];

  const filteredTasks = tasks.filter(t => {
    const matchesTimeframe = selectedTimeframe === 'ALL' || t.timeframe === selectedTimeframe;
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesTimeframe && matchesPriority;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCheckboxClick = (taskId, currentState) => {
    const newState = !currentState;
    onToggleTask(taskId, newState);

    if (newState) {
      // Fire subtle celebratory confetti
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#10B981', '#6366F1']
      });
    }
  };

  const priorityBadge = (prio) => {
    switch (prio) {
      case 'High': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Low': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Automated Preparation Timeline</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Milestones & Action Checklist
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target Event Date: <strong className="text-white">{plan.event_request.event_date}</strong>. 
            All tasks are mapped to calendar deadlines and preserved across revisions.
          </p>
        </div>

        {/* Progress Metric */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 min-w-[200px]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Overall Readiness</span>
            <span className="font-bold text-amber-300">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1">
            <div 
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            {completedCount} of {tasks.length} tasks completed
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Phase:
          </span>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedTimeframe === tf
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">Priority:</span>
          {priorities.map((prio) => (
            <button
              key={prio}
              onClick={() => setSelectedPriority(prio)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedPriority === prio
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {prio}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 text-sm">
            No tasks match the selected filters.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleCheckboxClick(task.id, task.completed)}
              className={`glass-panel rounded-xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                task.completed
                  ? 'bg-emerald-950/15 border-emerald-900/40 text-slate-400'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  className={`mt-0.5 flex-shrink-0 transition-colors ${
                    task.completed ? 'text-emerald-400' : 'text-slate-600 group-hover:text-amber-400'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className={`text-sm font-semibold transition-all ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'
                  }`}>
                    {task.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
                      {task.category}
                    </span>
                    <span>&bull;</span>
                    <span className="text-indigo-400 font-medium">{task.timeframe}</span>
                    {task.notes && (
                      <>
                        <span>&bull;</span>
                        <span className="text-slate-500 italic">{task.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Deadline & Priority Badge */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{task.estimated_deadline}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge(task.priority)}`}>
                  {task.priority} Priority
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Preservation Callout */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Completed task states are automatically saved to persistent storage and preserved during AI replanning.</span>
        </div>
      </div>
    </div>
  );
}
