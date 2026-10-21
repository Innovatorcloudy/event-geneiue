import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Users, IndianRupee, Palette, FileText, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    name: "Royal Indian Wedding",
    title: "Aarav & Meera's Grand Royal Wedding",
    event_type: "Wedding",
    city_or_location: "Udaipur, Rajasthan",
    event_date: "2026-12-15",
    guest_count: 300,
    total_budget: 500000,
    currency: "₹",
    theme_preference: "Royal Rajputana & Marigold Splendor",
    special_notes: "Sangeet choreography, pure veg live counters, floral varmala entry, outdoor mandap"
  },
  {
    name: "Milestone 30th Birthday",
    title: "Kabir's 30th Rooftop Gala",
    event_type: "Birthday",
    city_or_location: "Mumbai, Maharashtra",
    event_date: "2026-11-20",
    guest_count: 80,
    total_budget: 150000,
    currency: "₹",
    theme_preference: "Enchanted Celestial Galaxy & Neon",
    special_notes: "Live acoustic duo, custom mixology mocktail bar, gravity-defying designer cake"
  },
  {
    name: "Inter-College Tech Fest",
    title: "InnovateX: National Tech & Cultural Conclave",
    event_type: "College Fest",
    city_or_location: "Bengaluru, Karnataka",
    event_date: "2027-02-10",
    guest_count: 1200,
    total_budget: 800000,
    currency: "₹",
    theme_preference: "Neon Pulse: Cybernetic Nexus",
    special_notes: "Line-array sound, giant LED visual wall, 24-hr hackathon, indie rock band showcase"
  },
  {
    name: "Diwali Community Mahotsav",
    title: "Navrang Society Diwali & Annakut Utsav",
    event_type: "Community Celebration",
    city_or_location: "Ahmedabad, Gujarat",
    event_date: "2026-11-01",
    guest_count: 450,
    total_budget: 300000,
    currency: "₹",
    theme_preference: "Festive Harmony & Traditional Diya Glow",
    special_notes: "Community Annakut feast, traditional folk raas-garba, brass diya illumination, eco-friendly prasad"
  }
];

export default function EventCreationForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState(PRESET_TEMPLATES[0]);
  const [loadingStep, setLoadingStep] = useState(0);

  const applyTemplate = (tpl) => {
    setFormData({ ...tpl });
  };

  const perGuestEst = formData.guest_count > 0 
    ? Math.round(formData.total_budget / formData.guest_count) 
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GenAI Event Planning & Budget Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Craft Your Perfect <span className="gold-gradient-text">Celebration</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          From grand Indian weddings to college festivals and milestone birthdays. 
          Generate deterministic budgets, verified timelines, vendor due-diligence, and bespoke styling with Google Gemini.
        </p>
      </div>

      {/* Preset Quick Select Chips */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Instant One-Click Presets:</span>
          <span className="text-amber-400/80 text-[11px]">Click to auto-populate form</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className={`p-3 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                formData.name === tpl.name
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="font-bold truncate">{tpl.name}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {tpl.guest_count} guests &bull; {tpl.currency}{tpl.total_budget.toLocaleString('en-IN')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Row 1: Title & Event Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Celebration Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Rohan & Priya's Grand Wedding"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Category
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition cursor-pointer"
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="College Fest">College Fest</option>
                <option value="Community Celebration">Community Celebration</option>
                <option value="Corporate Gala">Corporate Gala</option>
                <option value="Anniversary">Anniversary</option>
              </select>
            </div>
          </div>

          {/* Row 2: Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>City & Location</span>
              </label>
              <input
                type="text"
                required
                value={formData.city_or_location}
                onChange={(e) => setFormData({ ...formData, city_or_location: e.target.value })}
                placeholder="e.g., Mumbai, Maharashtra"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Event Date</span>
              </label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
          </div>

          {/* Row 3: Guests, Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Guest Count</span>
                </span>
                <span className="text-amber-400 font-bold text-xs">{formData.guest_count} Attendees</span>
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                required
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: Math.max(1, parseInt(e.target.value) || 0) })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total Budget</span>
                </span>
                <span className="text-xs text-slate-400">
                  {formData.currency} {formData.total_budget.toLocaleString('en-IN')}
                </span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-2.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="AED">AED</option>
                </select>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  required
                  value={formData.total_budget}
                  onChange={(e) => setFormData({ ...formData, total_budget: Math.max(1000, parseFloat(e.target.value) || 0) })}
                  className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            {/* Instant Real-Time Per-Guest Metric */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Deterministic Est. / Guest</span>
              <div className="text-xl font-bold text-amber-300 mt-0.5">
                {formData.currency} {perGuestEst.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Auto-calculated in application code
              </span>
            </div>
          </div>

          {/* Row 4: Theme Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Theme & Aesthetic Preference</span>
            </label>
            <input
              type="text"
              value={formData.theme_preference || ''}
              onChange={(e) => setFormData({ ...formData, theme_preference: e.target.value })}
              placeholder="e.g., Royal Rajputana Heritage with Marigolds and Brass Urli Accents"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>

          {/* Row 5: Special Notes & Dietary Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Special Notes, Dietary Needs, Cultural Customs</span>
            </label>
            <textarea
              rows="2"
              value={formData.special_notes || ''}
              onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
              placeholder="e.g., Include Sangeet dance face-off, pure vegetarian live chaat, drone coverage"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
            />
          </div>

          {/* Transparency Disclosures Pill */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300 font-medium">Deterministic Financial Integrity:</strong> Category allocations and trade-offs are strictly computed programmatically via verified domain algorithms. Prices represent benchmark market averages. No hallucinated businesses or availability.
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Masterplan with Google GenAI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>Generate Complete Event Masterplan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
