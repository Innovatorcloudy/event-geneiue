import React from 'react';
import { Sparkles, Calendar, FolderArchive, Settings, PlusCircle, Printer, MessageSquareText } from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  savedCount,
  onOpenSaved,
  onOpenSettings,
  onToggleAiDrawer,
  hasActivePlan,
  backendStatus,
  onPrintDossier
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveView(hasActivePlan ? 'plan' : 'create')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white font-serif">EventGenie</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Celebration Architect</p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveView('create')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === 'create'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>New Plan</span>
          </button>

          {hasActivePlan && (
            <button
              onClick={() => setActiveView('plan')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'plan'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Current Plan</span>
            </button>
          )}

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all relative"
          >
            <FolderArchive className="w-4 h-4 text-emerald-400" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActivePlan && (
            <>
              <button
                onClick={onPrintDossier}
                title="Print or Export PDF Dossier"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Export Dossier</span>
              </button>

              <button
                onClick={onToggleAiDrawer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenSettings}
            title="Configure AI & API Keys"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition relative"
          >
            <Settings className="w-4 h-4" />
            <span
              className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                backendStatus?.gemini_api_key_configured
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/20'
                  : 'bg-amber-400 ring-2 ring-amber-400/20'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
