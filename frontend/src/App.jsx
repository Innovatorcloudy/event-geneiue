import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Calendar, MapPin, Users, IndianRupee, 
  Layers, CheckSquare, Building2, Palette, Printer, 
  MessageSquareText, ArrowLeft, RefreshCw, FileDown, CheckCircle2 
} from 'lucide-react';

import Navbar from './components/Navbar';
import EventCreationForm from './components/EventCreationForm';
import OverviewDashboard from './components/OverviewDashboard';
import BudgetPlanner from './components/BudgetPlanner';
import TimelineManager from './components/TimelineManager';
import VendorChecklist from './components/VendorChecklist';
import CreativeStudio from './components/CreativeStudio';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import SavedPlansModal from './components/SavedPlansModal';
import SettingsModal from './components/SettingsModal';

import { 
  fetchHealth, generatePlan, revisePlan, 
  listSavedPlans, getPlanById, toggleTask, 
  deletePlan, getExportUrl 
} from './api';

export default function App() {
  const [activeView, setActiveView] = useState('create'); // 'create' | 'plan'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'budget' | 'timeline' | 'vendors' | 'creative'
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [backendStatus, setBackendStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize and check backend
  const refreshHealthAndSaved = async () => {
    try {
      const health = await fetchHealth();
      setBackendStatus(health);
      const plans = await listSavedPlans();
      setSavedPlans(plans);

      // Auto-load latest plan if available and none selected
      if (!currentPlan && plans.length > 0) {
        const latest = await getPlanById(plans[0].id);
        setCurrentPlan(latest);
      }
    } catch (err) {
      console.warn('Backend connection notice:', err);
    }
  };

  useEffect(() => {
    refreshHealthAndSaved();
  }, []);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Create New Plan
  const handleCreatePlan = async (eventRequest) => {
    setIsLoading(true);
    try {
      const newPlan = await generatePlan(eventRequest);
      setCurrentPlan(newPlan);
      setActiveView('plan');
      setActiveTab('overview');
      showToast('Event Masterplan generated and saved successfully!');
      
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Refresh saved list
      const plans = await listSavedPlans();
      setSavedPlans(plans);
    } catch (err) {
      alert(`Plan creation error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Dynamic Replanning via Natural Language
  const handleSendInstruction = async (instruction, callback) => {
    if (!currentPlan) return;
    setIsRevising(true);
    try {
      const res = await revisePlan(currentPlan.id, instruction, currentPlan);
      setCurrentPlan(res.revised_plan);
      showToast('Plan dynamically updated with preserved milestones!');
      
      if (callback) {
        callback(res.trade_off_analysis);
      }

      // Refresh saved list
      const plans = await listSavedPlans();
      setSavedPlans(plans);
    } catch (err) {
      alert(`Revision error: ${err.message}`);
    } finally {
      setIsRevising(false);
    }
  };

  // 3. Toggle Task Completion
  const handleToggleTask = async (taskId, completed) => {
    if (!currentPlan) return;

    // Optimistic UI update
    const updatedTasks = currentPlan.timeline_tasks.map(t => 
      t.id === taskId ? { ...t, completed } : t
    );
    setCurrentPlan(prev => ({ ...prev, timeline_tasks: updatedTasks }));

    try {
      await toggleTask(currentPlan.id, taskId, completed);
      // Background update saved plans count
      listSavedPlans().then(setSavedPlans);
    } catch (err) {
      console.error('Failed to sync task toggle:', err);
    }
  };

  // 4. Open a Saved Plan
  const handleSelectPlan = async (planId) => {
    try {
      const plan = await getPlanById(planId);
      setCurrentPlan(plan);
      setActiveView('plan');
      setIsSavedModalOpen(false);
      showToast(`Loaded "${plan.event_request.title}"`);
    } catch (err) {
      alert(`Failed to load plan: ${err.message}`);
    }
  };

  // 5. Delete a Saved Plan
  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this saved plan?')) return;
    try {
      await deletePlan(planId);
      setSavedPlans(prev => prev.filter(p => p.id !== planId));
      if (currentPlan && currentPlan.id === planId) {
        setCurrentPlan(null);
        setActiveView('create');
      }
      showToast('Plan deleted.');
    } catch (err) {
      alert(`Failed to delete plan: ${err.message}`);
    }
  };

  // 6. Print / PDF Export
  const handlePrintDossier = () => {
    if (!currentPlan) return;
    const url = getExportUrl(currentPlan.id, 'html');
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/50 shadow-2xl text-xs sm:text-sm text-white font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        savedCount={savedPlans.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onToggleAiDrawer={() => setIsAiDrawerOpen(prev => !prev)}
        hasActivePlan={!!currentPlan}
        backendStatus={backendStatus}
        onPrintDossier={handlePrintDossier}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeView === 'create' ? (
          <EventCreationForm
            onSubmit={handleCreatePlan}
            isLoading={isLoading}
          />
        ) : (
          currentPlan && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
              {/* Event Plan Header Bar */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentPlan.event_request.event_type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentPlan.revision_count > 0 ? `Revision #${currentPlan.revision_count}` : 'Original Masterplan'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                    {currentPlan.event_request.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 mt-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {currentPlan.event_request.city_or_location}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {currentPlan.event_request.event_date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      {currentPlan.event_request.guest_count} Attendees
                    </span>
                  </div>
                </div>

                {/* Right Action Bar */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAiDrawerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span>Dynamic Assistant</span>
                  </button>

                  <button
                    onClick={handlePrintDossier}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print / PDF</span>
                  </button>

                  <a
                    href={getExportUrl(currentPlan.id, 'markdown')}
                    download
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                    title="Download Markdown Report"
                  >
                    <FileDown className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800/80 no-scrollbar">
                {[
                  { id: 'overview', label: 'Executive Dashboard', icon: Sparkles },
                  { id: 'budget', label: 'Smart Budget Planner', icon: Layers },
                  { id: 'timeline', label: 'Milestones & Tasks', icon: CheckSquare },
                  { id: 'vendors', label: 'Vendor Due Diligence', icon: Building2 },
                  { id: 'creative', label: 'Personalized Styling & Menu', icon: Palette },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab View */}
              {activeTab === 'overview' && (
                <OverviewDashboard
                  plan={currentPlan}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetPlanner
                  plan={currentPlan}
                  onTriggerReplanning={(instruction) => {
                    setIsAiDrawerOpen(true);
                    handleSendInstruction(instruction);
                  }}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineManager
                  plan={currentPlan}
                  onToggleTask={handleToggleTask}
                />
              )}

              {activeTab === 'vendors' && (
                <VendorChecklist
                  plan={currentPlan}
                />
              )}

              {activeTab === 'creative' && (
                <CreativeStudio
                  plan={currentPlan}
                />
              )}
            </div>
          )
        )}
      </main>

      {/* Interactive AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        plan={currentPlan}
        onSendInstruction={handleSendInstruction}
        isRevising={isRevising}
      />

      {/* Saved Plans Modal */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        plans={savedPlans}
        onSelectPlan={handleSelectPlan}
        onDeletePlan={handleDeletePlan}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        backendStatus={backendStatus}
        onRefreshHealth={refreshHealthAndSaved}
      />
    </div>
  );
}
