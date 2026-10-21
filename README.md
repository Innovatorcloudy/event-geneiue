# EventGenie AI — GenAI Event Planning & Smart Budget Architect

> **EventGenie AI** is an intelligent, full-stack event planning assistant tailored for Indian and global celebrations—including royal weddings, milestone birthdays, college fests, and community celebrations. It pairs **Google Gemini** generative intelligence with **deterministic programmatic financial calculations** to guarantee 100% mathematical integrity with zero arithmetic hallucinations.

---

## Live Development Server URLs

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Endpoint:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🌟 Core Features & Highlights

1. **AI Event Planner & Masterplan Synthesis**
   - Inputs: Event Type, City/Location, Target Date, Guest Count, Budget, Theme, and Custom Notes.
   - Built-in one-click demo templates:
     - *Royal Indian Wedding* (300 guests, ₹5,00,000)
     - *Milestone 30th Birthday* (80 guests, ₹1,50,000)
     - *Inter-College Tech Fest* (1,200 attendees, ₹8,00,000)
     - *Diwali Community Mahotsav* (450 attendees, ₹3,00,000)

2. **Smart Budget Planner (Zero Hallucinated Math)**
   - All financial category allocations and totals are calculated **programmatically** in Python application code.
   - Preserves an uncommitted **5% Contingency Safety Reserve**.
   - Computes per-guest cost ratios and detailed sub-item estimates.
   - Itemized actionable cost-saving strategies for each category.

3. **Dynamic Natural-Language Replanner & Trade-Off Engine**
   - Users can update plans through natural language requests in the **Interactive AI Assistant drawer** (e.g., *"Reduce my budget to ₹4,50,000"*, *"Add 50 guests"*, or *"Change theme to Royal Rajputana Heritage"*).
   - Smart trade-off distribution protects critical categories (Catering & Venue) while trimming flexible domains (Decor, Entertainment, Gifting).
   - **Crucial Feature:** Preserves already completed timeline tasks and confirmed milestone states across revisions!

4. **Automated Preparation Timeline & Interactive Checklist**
   - Generates tasks mapped to actual calendar deadlines relative to event date (*6 Months Out*, *3 Months Out*, *1 Month Out*, *2 Weeks Out*, *Event Day*, *Post-Event*).
   - Real-time interactive completion toggle synced to backend persistent storage with celebratory visual feedback.

5. **Vendor Due-Diligence & Vetting Guide**
   - Objective comparison criteria, non-negotiable requirements, and essential negotiation questions.
   - Cautionary advice and red flags.
   - Prevailing regional market benchmarks without inventing false businesses or fake availability.

6. **Personalized Creative Studio**
   - Curated Theme Concept with narrative description.
   - Color palette swatches with HEX codes and one-click copy.
   - Stage & ambience decor guidelines.
   - Multi-course curated banquet menu with live food stations.
   - Cultural activities & ceremonies with timing recommendations.
   - 3 Invitation Wording styles (*Formal & Traditional*, *Playful & Contemporary*, *Digital WhatsApp Short*) with copy-to-clipboard.
   - Purposeful return gifts & wedding favors suggestions.

7. **Persistent Storage & Export Dossier**
   - Local JSON file database storing plans in `backend/data/plans/`.
   - Saved Plans manager to load past plans, inspect progress, and delete.
   - Export options:
     - Print-Ready HTML Event Dossier (styled for browser printing / PDF export).
     - Formatted Markdown Dossier download.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Generative AI** | Google Gemini (`gemini-2.5-flash`, `gemini-1.5-flash`) via `google-genai` SDK |
| **Arithmetic Engine** | Deterministic Python budget calculator with category elasticity weights |
| **Storage** | Persistent File-based JSON Database (with Firestore adapter readiness) |
| **Deployment Target** | Google Cloud Run (containerized) / Vercel (frontend) |

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js (v18+) and npm
- Python (3.11+)

### 1. Backend Setup
```bash
cd "backend"
python -m pip install -r requirements.txt
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Optional:* Set your Google Gemini API key in `backend/.env` or configure it directly in the app's Settings modal:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 2. Frontend Setup
```bash
cd "frontend"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Hackathon Submission Form Answers

### Question 1: Describe the changes/updates made in the deployed version
> Built and deployed EventGenie AI, a full-stack GenAI event planning system featuring:
> 1) AI Event Planner supporting weddings, birthdays, college fests, and community celebrations with 1-click presets.
> 2) Smart Budget Planner using deterministic programmatic arithmetic (eliminating LLM math hallucinations), computing allocations, contingency reserves, and cost-saving tips.
> 3) Interactive AI Assistant for dynamic replanning via natural language (e.g., budget cuts from ₹5,00,000 to ₹4,50,000) with trade-off analysis while strictly preserving completed task statuses.
> 4) Automated Timeline with calendar-mapped milestones and interactive persistent checkboxes.
> 5) Vendor Due-Diligence checklists with criteria, questions, and benchmark rates.
> 6) Creative Studio with color palettes, multi-course menus, cultural activities, and 3-style invitation wordings.
> 7) Persistent backend storage with saved plan retrieval and print/PDF/Markdown export dossiers.



### Question 2: Mention the Gen AI services utilized in the submission, and where did you utilize it?
> 1) Google Gemini 2.5 Flash / 1.5 Flash via official `google-genai` SDK: Utilized for structured schema-enforced generation of personalized event themes, contextual culinary courses (appetizers, live counters, royal mains), cultural ceremonial activities (Phoolon ki Holi, Sangeet dance battles), and bespoke invitation wordings (Formal, Playful, WhatsApp Short).
> 2) Hybrid Agentic Architecture: Combines Gemini generative creative synthesis with a deterministic Python Financial Engine for budget calculations, ensuring mathematical balance, and a Dynamic Replanner that extracts intent parameters to rebalance budgets without modifying completed milestones.
> 3) Fallback Engine: If no API key is set, the system seamlessly transitions to the EventGenie Deterministic Intelligence Engine to ensure continuous availability.

---

## 🔒 Security & Data Integrity
- API keys remain strictly server-side in backend environment/runtime memory; never exposed in frontend bundles.
- All numbers and sums are computed in Python code, avoiding LLM hallucinations.
- Real-world benchmark prices are transparently identified as estimates.
