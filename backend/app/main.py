from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

from .models import (
    EventRequest,
    EventPlan,
    PlanRevisionRequest,
    TradeOffAnalysis,
    PlanSummary,
    ToggleTaskRequest
)
from .planner_engine import planner_engine
from .storage import plan_storage
from .export_service import generate_markdown_dossier, generate_html_print_dossier
from .config import GEMINI_MODEL_PRIMARY, GEMINI_API_KEY, PORT

app = FastAPI(
    title="EventGenie AI API",
    description="Intelligent GenAI-Powered Event Planning & Dynamic Budget Architecture Engine",
    version="1.0.0"
)

# Enable CORS for frontend Vite/Next.js dev server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ApiKeyUpdate(BaseModel):
    api_key: str

@app.get("/api/health")
def health_check():
    has_key = bool(planner_engine.api_key)
    has_client = planner_engine.client is not None
    return {
        "status": "healthy",
        "service": "EventGenie AI Backend",
        "gemini_api_key_configured": has_key,
        "gemini_client_ready": has_client,
        "primary_model": GEMINI_MODEL_PRIMARY,
        "storage_location": str(plan_storage.storage_dir)
    }

@app.post("/api/settings/api-key")
def update_api_key(payload: ApiKeyUpdate):
    planner_engine.set_api_key(payload.api_key)
    return {
        "success": True,
        "gemini_client_ready": planner_engine.client is not None,
        "message": "Gemini API key updated successfully."
    }

@app.post("/api/plans/generate", response_model=EventPlan)
def generate_event_plan(req: EventRequest):
    try:
        plan = planner_engine.create_plan(req)
        plan_storage.save_plan(plan)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {str(e)}")

@app.post("/api/plans/revise")
def revise_event_plan(rev_req: PlanRevisionRequest):
    # Retrieve current plan either from request payload or persistent storage
    current_plan = rev_req.current_plan
    if not current_plan and rev_req.plan_id:
        current_plan = plan_storage.get_plan(rev_req.plan_id)

    if not current_plan:
        raise HTTPException(status_code=404, detail="Target plan not found.")

    try:
        revised_plan, trade_off_analysis = planner_engine.revise_plan(rev_req, current_plan)
        plan_storage.save_plan(revised_plan)
        return {
            "revised_plan": revised_plan,
            "trade_off_analysis": trade_off_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plan revision failed: {str(e)}")

@app.get("/api/plans", response_model=List[PlanSummary])
def list_saved_plans():
    return plan_storage.list_plans()

@app.get("/api/plans/{plan_id}", response_model=EventPlan)
def get_plan(plan_id: str):
    plan = plan_storage.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    return plan

@app.post("/api/plans/{plan_id}/tasks/toggle")
def toggle_task_status(plan_id: str, payload: ToggleTaskRequest):
    plan = plan_storage.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")

    found = False
    for task in plan.timeline_tasks:
        if task.id == payload.task_id:
            task.completed = payload.completed
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail="Task ID not found in plan.")

    plan_storage.save_plan(plan)
    return {"success": True, "task_id": payload.task_id, "completed": payload.completed}

@app.delete("/api/plans/{plan_id}")
def delete_plan(plan_id: str):
    deleted = plan_storage.delete_plan(plan_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Plan not found.")
    return {"success": True, "message": "Plan deleted."}

@app.get("/api/plans/{plan_id}/export/markdown")
def export_markdown(plan_id: str):
    plan = plan_storage.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    md_content = generate_markdown_dossier(plan)
    return Response(
        content=md_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename=EventGenie_{plan_id[:8]}.md"}
    )

@app.get("/api/plans/{plan_id}/export/html")
def export_html(plan_id: str):
    plan = plan_storage.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    html_content = generate_html_print_dossier(plan)
    return Response(content=html_content, media_type="text/html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=PORT, reload=True)
