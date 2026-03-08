/**
 * Backend Base URL (e.g. http://localhost:8000). Set VITE_API_BASE_URL in .env.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/** API root for fetch calls: ${API_BASE_URL}/api */
export const API_BASE = `${API_BASE_URL.replace(/\/$/, '')}/api`;
