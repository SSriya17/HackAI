/**
 * API client for RA Match backend.
 * Uses VITE_API_BASE_URL (default http://localhost:8000) from .env.
 */
import { API_BASE } from '../config';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === 'string' ? err.detail : err.detail?.[0]?.msg ?? err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ---- Students ----
export async function createStudentSurvey(data) {
  return request('/students/surveys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Professors ----
export async function searchProfessors(query, limit = 20) {
  return request(`/professors/nebula/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

export async function getProfessorFromNebula(professorId) {
  return request(`/professors/nebula/${professorId}`);
}

export async function createProfessorSurvey(data) {
  return request('/professors/surveys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Matches ----
export async function getNebulaMatches(questionnaire) {
  return request('/matches/nebula', {
    method: 'POST',
    body: JSON.stringify(questionnaire),
  });
}

export async function getStudentMatches(studentId, limit = 20) {
  return request(`/matches/students/${studentId}/professors?limit=${limit}`);
}

export async function getProfessorMatches(professorId, limit = 20) {
  return request(`/matches/professors/${professorId}/students?limit=${limit}`);
}

// ---- Cold Email ----
export async function getInterviewProfessors(limit = 10) {
  return request(`/interview/professors?limit=${limit}`);
}

export async function generateColdEmail(data) {
  return request('/email/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
