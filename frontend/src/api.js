const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function updateApiKey(apiKey) {
  const res = await fetch(`${API_BASE}/settings/api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) throw new Error('Failed to update API key');
  return res.json();
}

export async function generatePlan(eventRequest) {
  const res = await fetch(`${API_BASE}/plans/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventRequest),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Plan generation failed');
  }
  return res.json();
}

export async function revisePlan(planId, instruction, currentPlan = null) {
  const res = await fetch(`${API_BASE}/plans/revise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: planId,
      instruction,
      current_plan: currentPlan,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Plan revision failed');
  }
  return res.json();
}

export async function listSavedPlans() {
  const res = await fetch(`${API_BASE}/plans`);
  if (!res.ok) throw new Error('Failed to fetch saved plans');
  return res.json();
}

export async function getPlanById(planId) {
  const res = await fetch(`${API_BASE}/plans/${planId}`);
  if (!res.ok) throw new Error('Failed to fetch plan');
  return res.json();
}

export async function toggleTask(planId, taskId, completed) {
  const res = await fetch(`${API_BASE}/plans/${planId}/tasks/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId, completed }),
  });
  if (!res.ok) throw new Error('Failed to toggle task');
  return res.json();
}

export async function deletePlan(planId) {
  const res = await fetch(`${API_BASE}/plans/${planId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete plan');
  return res.json();
}

export function getExportUrl(planId, format = 'html') {
  return `${API_BASE}/plans/${planId}/export/${format}`;
}
