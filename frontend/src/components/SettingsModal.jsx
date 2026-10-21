import React, { useState } from 'react';
import { 
  X, Settings, Key, ShieldCheck, CheckCircle2, 
  AlertCircle, ExternalLink, Cpu, Database 
} from 'lucide-react';
import { updateApiKey } from '../api';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  backendStatus, 
  onRefreshHealth 
}) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  if (!isOpen) return null;

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await updateApiKey(apiKeyInput.trim());
      setSaveMessage({ type: 'success', text: res.message || 'API key updated successfully!' });
      setApiKeyInput('');
      onRefreshHealth();
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to update key' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl glass-panel bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">Engine Configuration</h3>
              <p className="text-xs text-slate-400">Google Gemini & System Diagnostics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Runtime Diagnostics */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Active Architecture Status</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400">GenAI Service</span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${backendStatus?.gemini_api_key_configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{backendStatus?.gemini_api_key_configured ? 'Google Gemini Live' : 'Deterministic Engine (Active)'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400">Primary Model</span>
              <div className="font-bold text-amber-300 font-mono">
                {backendStatus?.primary_model || 'gemini-2.5-flash'}
              </div>
            </div>
          </div>
        </div>

        {/* Configure Gemini API Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure Google Gemini API Key</span>
            </h4>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <form onSubmit={handleSaveKey} className="space-y-3">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AIzaSy... or leave blank to use intelligent offline fallback"
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Key remains securely server-side in backend session memory.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Save API Key'}
              </button>
            </div>
          </form>

          {saveMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              saveMessage.type === 'success' 
                ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-800 text-rose-300'
            }`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{saveMessage.text}</span>
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Persistent Database: Local File JSON Store & Firestore Adapter</span>
          </div>
          <span className="text-emerald-400 font-semibold text-[11px]">Ready</span>
        </div>
      </div>
    </div>
  );
}
