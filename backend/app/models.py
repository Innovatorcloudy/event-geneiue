from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class BudgetSubItem(BaseModel):
    name: str
    estimated_cost: float
    tip: Optional[str] = None

class BudgetCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str
    allocated_amount: float
    percentage: float
    per_guest_cost: float
    suggested_subitems: List[BudgetSubItem] = []
    cost_saving_tip: str
    priority: str = "Important"  # Critical, Important, Flexible

class TimelineTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str
    category: str
    timeframe: str  # e.g., "6 Months Out", "3 Months Out", "1 Month Out", "2 Weeks Out", "Event Day"
    deadline_offset_days: int  # Days relative to event (negative is before)
    estimated_deadline: str
    priority: str = "Medium"  # High, Medium, Low
    completed: bool = False
    notes: Optional[str] = ""

class VendorItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    category: str
    requirements: List[str]
    questions_to_ask: List[str]
    comparison_criteria: List[str]
    typical_cost_range: str
    cautionary_advice: str

class ColorPaletteItem(BaseModel):
    name: str
    hex: str
    role: str  # e.g., Primary, Accent, Neutral, Highlight

class CulturalActivity(BaseModel):
    name: str
    description: str
    timing: str

class PersonalizedIdeas(BaseModel):
    theme_title: str
    theme_description: str
    color_palette: List[ColorPaletteItem] = []
    decor_concepts: List[str] = []
    curated_menu: Dict[str, List[str]] = {}  # e.g. "Appetizers": [...], "Main Course": [...]
    cultural_activities: List[CulturalActivity] = []
    invitation_wordings: Dict[str, str] = {}  # "Formal", "Playful", "Digital / WhatsApp"
    favors_and_gifts: List[str] = []

class EventRequest(BaseModel):
    title: str = "My Grand Celebration"
    event_type: str = "Wedding"  # Wedding, Birthday, College Fest, Community Celebration, Corporate
    city_or_location: str = "Mumbai, India"
    event_date: str = "2026-12-15"
    guest_count: int = 300
    total_budget: float = 500000.0
    currency: str = "₹"
    theme_preference: Optional[str] = "Royal Heritage & Marigold"
    special_notes: Optional[str] = "Include sangeet choreography, pure veg live counters, floral entry"

class EventPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_request: EventRequest
    total_budget: float
    total_allocated: float
    remaining_budget: float
    contingency_fund: float
    cost_per_guest: float
    budget_categories: List[BudgetCategory]
    timeline_tasks: List[TimelineTask]
    vendor_checklist: List[VendorItem]
    personalized_ideas: PersonalizedIdeas
    assumptions_and_disclosures: List[str]
    ai_generation_meta: Dict[str, Any] = {}
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    revision_count: int = 0
    trade_off_log: List[Dict[str, Any]] = []

class PlanRevisionRequest(BaseModel):
    plan_id: str
    instruction: str  # e.g. "Reduce my budget to ₹4,50,000", "Add 50 guests"
    current_plan: Optional[EventPlan] = None

class TradeOffAnalysis(BaseModel):
    summary: str
    budget_delta: float
    affected_categories: List[Dict[str, Any]] = []
    trade_offs: List[str] = []
    preservation_notes: str

class ToggleTaskRequest(BaseModel):
    task_id: str
    completed: bool

class PlanSummary(BaseModel):
    id: str
    title: str
    event_type: str
    city_or_location: str
    event_date: str
    guest_count: int
    total_budget: float
    currency: str
    created_at: str
    updated_at: str
    completed_tasks_count: int
    total_tasks_count: int
