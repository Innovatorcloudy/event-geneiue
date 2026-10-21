import React, { useState } from 'react';
import { 
  X, MessageSquareText, Send, Sparkles, History, 
  CheckCircle2, ArrowDownRight, ArrowUpRight, ShieldCheck 
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Reduce my budget to ₹4,50,000",
  "Increase guests to 350",
  "Cut budget by ₹50,000",
  "Change theme to Royal Rajputana Heritage",
  "Add 50 more guests",
  "Optimize for a budget of ₹4,00,000"
];

export default function AiAssistantDrawer({ 
  isOpen, 
  onClose, 
  plan, 
  onSendInstruction, 
  isRevising,
  lastTradeOffAnalysis 
}) {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am your EventGenie Planning Assistant. I can dynamically modify your plan through natural language—such as reducing your budget, updating guest counts, or changing your theme—while preserving all your completed tasks and calculating trade-offs programmatically."
    }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isRevising) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInputVal('');

    // Trigger replanning callback
    onSendInstruction(trimmed, (resTradeOff) => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: resTradeOff?.summary || "Plan updated successfully.",
          tradeOff: resTradeOff
        }
      ]);
    });
  };

  const handleQuickPrompt = (promptText) => {
    setInputVal(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Interactive AI Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Dynamic Replanner
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Modifies allocations with deterministic trade-offs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat / Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* If assistant returned trade-off card */}
                {msg.tradeOff && (
                  <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-2 text-xs">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Trade-Off Analysis & Allocations Delta</span>
                    </div>

                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                      Delta:{' '}
                      <span className={msg.tradeOff.budget_delta < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {msg.tradeOff.budget_delta < 0 ? '-' : '+'}
                        {plan.event_request.currency}
                        {Math.abs(msg.tradeOff.budget_delta).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                      {msg.tradeOff.trade_offs?.map((to, tIdx) => (
                        <li key={tIdx}>{to}</li>
                      ))}
                    </ul>

                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-[11px] text-emerald-300 font-medium">
                      ✓ {msg.tradeOff.preservation_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isRevising && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs text-amber-300">
              <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Recalculating allocations, preserving tasks & evaluating trade-offs...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
            Quick Prompts:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. Reduce my budget to ₹4,50,000 or add 50 guests..."
            disabled={isRevising}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isRevising}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
