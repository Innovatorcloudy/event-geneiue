import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from .models import EventPlan, PlanSummary
from .config import DATA_DIR

PLANS_DIR = DATA_DIR / "plans"
PLANS_DIR.mkdir(parents=True, exist_ok=True)

class PlanStorage:
    def __init__(self, storage_dir: Path = PLANS_DIR):
        self.storage_dir = storage_dir
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def _file_path(self, plan_id: str) -> Path:
        # Sanitize plan_id
        safe_id = "".join(c for c in plan_id if c.isalnum() or c in ("-", "_"))
        return self.storage_dir / f"{safe_id}.json"

    def save_plan(self, plan: EventPlan) -> EventPlan:
        fpath = self._file_path(plan.id)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(plan.model_dump_json(indent=2))
        return plan

    def get_plan(self, plan_id: str) -> Optional[EventPlan]:
        fpath = self._file_path(plan_id)
        if not fpath.exists():
            return None
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            return EventPlan.model_validate(data)
        except Exception as e:
            print(f"Error loading plan {plan_id}: {e}")
            return None

    def list_plans(self) -> List[PlanSummary]:
        summaries: List[PlanSummary] = []
        for file in self.storage_dir.glob("*.json"):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                plan = EventPlan.model_validate(data)
                completed_count = sum(1 for t in plan.timeline_tasks if t.completed)
                summaries.append(PlanSummary(
                    id=plan.id,
                    title=plan.event_request.title,
                    event_type=plan.event_request.event_type,
                    city_or_location=plan.event_request.city_or_location,
                    event_date=plan.event_request.event_date,
                    guest_count=plan.event_request.guest_count,
                    total_budget=plan.total_budget,
                    currency=plan.event_request.currency,
                    created_at=plan.created_at,
                    updated_at=plan.updated_at,
                    completed_tasks_count=completed_count,
                    total_tasks_count=len(plan.timeline_tasks)
                ))
            except Exception as e:
                print(f"Error reading summary for {file.name}: {e}")
                continue
        # Sort by updated_at descending
        summaries.sort(key=lambda s: s.updated_at, reverse=True)
        return summaries

    def delete_plan(self, plan_id: str) -> bool:
        fpath = self._file_path(plan_id)
        if fpath.exists():
            fpath.unlink()
            return True
        return False

# Global instance
plan_storage = PlanStorage()
