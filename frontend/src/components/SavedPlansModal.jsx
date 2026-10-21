import React from 'react';
import { 
  X, FolderArchive, Calendar, MapPin, Users, 
  Trash2, ArrowRight, Printer, FileDown, CheckCircle2 
} from 'lucide-react';
import { getExportUrl } from '../api';

export default function SavedPlansModal({ 
  isOpen, 
  onClose, 
  plans = [], 
  onSelectPlan, 
  onDeletePlan 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl glass-panel bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">Saved Event Plans</h3>
              <p className="text-xs text-slate-400">Persistent storage & retrieval from backend database</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Plans */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {plans.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <FolderArchive className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p>No saved plans found yet.</p>
              <p className="text-xs text-slate-500 mt-1">Generate a plan to see it automatically saved here.</p>
            </div>
          ) : (
            plans.map((p) => {
              const progress = p.total_tasks_count > 0 
                ? Math.round((p.completed_tasks_count / p.total_tasks_count) * 100) 
                : 0;

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white hover:text-amber-300 transition cursor-pointer" onClick={() => onSelectPlan(p.id)}>
                        {p.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {p.event_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {p.city_or_location}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {p.event_date}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        {p.guest_count} guests
                      </span>
                    </div>

                    {/* Task Progress */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">{progress}% Ready</span>
                      <span>({p.completed_tasks_count}/{p.total_tasks_count} tasks)</span>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right side: Budget & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-bold text-amber-300 font-serif">
                        {p.currency}{p.total_budget.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Updated {new Date(p.updated_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={getExportUrl(p.id, 'html')}
                        target="_blank"
                        rel="noreferrer"
                        title="Print / PDF Dossier"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => onDeletePlan(p.id)}
                        title="Delete Plan"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectPlan(p.id)}
                        className="px-3.5 py-2 rounded-lg font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
