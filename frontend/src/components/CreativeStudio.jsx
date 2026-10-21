import React, { useState } from 'react';
import { 
  Palette, UtensilsCrossed, Sparkles, Mail, Gift, 
  Copy, Check, Music, Flower2, HeartHandshake 
} from 'lucide-react';

export default function CreativeStudio({ plan }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const ideas = plan.personalized_ideas;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!ideas) return null;

  return (
    <div className="space-y-8">
      {/* Theme Hero Section */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>Curated Theme & Visual Identity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            {ideas.theme_title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {ideas.theme_description}
          </p>

          {/* Color Palette Swatches */}
          {ideas.color_palette && ideas.color_palette.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Harmonious Color Palette
              </h4>
              <div className="flex flex-wrap gap-3">
                {ideas.color_palette.map((color, i) => (
                  <div
                    key={i}
                    onClick={() => copyToClipboard(color.hex, `color-${i}`)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
                    title="Click to copy HEX code"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg shadow-inner border border-white/20 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{color.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <span>{color.hex}</span>
                        {copiedKey === `color-${i}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Decor Concepts & Curated Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decor Concepts */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-serif">Stage & Ambience Decor</h3>
          </div>
          <div className="space-y-2.5">
            {ideas.decor_concepts?.map((concept, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Menu */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-serif">Curated Multi-Course Feast</h3>
          </div>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {ideas.curated_menu && Object.entries(ideas.curated_menu).map(([course, dishes], idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  {course}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dishes.map((dish, dIdx) => (
                    <span 
                      key={dIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 text-xs border border-slate-700/80"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cultural Ceremonies & Interactive Activities */}
      {ideas.cultural_activities && ideas.cultural_activities.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-bold text-white font-serif">Celebratory Activities & Ceremonies</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ideas.cultural_activities.map((act, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 mb-2">
                    {act.timing}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{act.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bespoke Invitation Wording Studio */}
      {ideas.invitation_wordings && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-serif">Bespoke Invitation Wordings</h3>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">Ready to paste into WhatsApp or print</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(ideas.invitation_wordings).map(([style, text], idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between relative group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">{style}</span>
                    <button
                      onClick={() => copyToClipboard(text, `invite-${idx}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                      title="Copy wording"
                    >
                      {copiedKey === `invite-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line italic">
                    "{text}"
                  </p>
                </div>
                {copiedKey === `invite-${idx}` && (
                  <div className="mt-2 text-[11px] text-emerald-400 font-medium">Copied to clipboard!</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favors & Return Gifts */}
      {ideas.favors_and_gifts && ideas.favors_and_gifts.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-serif">Curated Favors & Return Gifts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ideas.favors_and_gifts.map((gift, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{gift}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
